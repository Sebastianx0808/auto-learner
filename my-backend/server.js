const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Backend server is running');
});

// Route for registering the users based on their role.
//This route makes sure that, only correct users get into their corresponding tables
app.post('/api/register', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'No data provided' });
    }

    try {
        const data = req.body;
        const role = data.emp_id ? 'teacher' : 'student';
        const unique_id = uuidv4();
        const hashed_password = crypto.createHash('sha256').update(data.password).digest('hex');

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // This query inserts data into User table
            const userQuery = `
                INSERT INTO Users
                (username, password, email, unique_id, role)
                VALUES (?, ?, ?, ?, ?)
            `;
            const userValues = [data.username, hashed_password, data.email, unique_id, role];
            await connection.execute(userQuery, userValues);

            if (role === 'teacher') {
                const teacherQuery = `
                    INSERT INTO Teacher
                    (emp_id, name, designation, institution, department, phone, username)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                const teacherValues = [
                    data.emp_id,
                    data.name,
                    data.designation,
                    data.institution,
                    data.department,
                    data.phone,
                    data.username
                ];
                await connection.execute(teacherQuery, teacherValues);
            } else {
                const studentQuery = `
                    INSERT INTO Student
                    (roll_number, name, class, institution, department, semester, batch, username)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const studentValues = [
                    data.roll_number,
                    data.name,
                    data.class,
                    data.institytuin,
                    data.department,
                    data.semester,
                    data.batch,
                    data.username
                ];
                await connection.execute(studentQuery, studentValues);
            }

            await connection.commit();
            res.status(201).json({
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
                unique_id
            });
        } catch (dbError) {
            await connection.rollback();
            res.status(400).json({
                error: 'Database registration failed',
                details: dbError.message
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Full error details:', error);
        res.status(500).json({
            error: 'Registration failed',
            details: error.message
        });
    }
});

//This route is for login. 
//this function redirects the user based on their role to respective webpages
app.post('/api/login', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'No data provided' });
    }

    try {
        const { username, password, rememberMe = false } = req.body;

        // Validate inputs
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        console.log('Extracted values:', { username, password, rememberMe });

        // Hash the password to compare with stored hash
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Get connection from the pool
        const connection = await db.getConnection();

        try {
            // Query to check if user exists with given username and password
            const query = `
                SELECT unique_id, username, role 
                FROM Users 
                WHERE username = ? AND password = ?
            `;

            const [rows] = await connection.execute(query, [username, hashedPassword]);

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const user = rows[0];

            // Generate token (consider JWT in production)
            const token = uuidv4();

            res.status(200).json({
                message: 'Login successful',
                user: {
                    username: user.username,
                    role: user.role,
                    emp_id: user.unique_id
                },
                token,
                role: user.role,
            });
        } catch (dbError) {
            console.error('Database error:', dbError);
            res.status(500).json({
                error: 'Login failed',
                details: dbError.message,
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Login failed',
            details: error.message,
        });
    }
});

app.get('/api/exams', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM exam_2');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching exams:', error);
      res.status(500).json({ error: 'Failed to fetch exams' });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});