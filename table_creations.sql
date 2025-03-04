CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,  -- Storing hashed password
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique_id VARCHAR(50) UNIQUE NOT NULL,
    role ENUM('teacher', 'student') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);


CREATE TABLE Teacher (
    emp_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    institution VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    phone VARCHAR(20),
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES Users(username)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Student (
    roll_number VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    class VARCHAR(50) NOT NULL,
    institution VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    semester VARCHAR(20),
    batch VARCHAR(20),
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES Users(username)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE Exam (
    exam_id VARCHAR(36) PRIMARY KEY,  -- Changed from UUID to VARCHAR(36)
    title VARCHAR(200) NOT NULL,
    description TEXT,
    exam_date TIMESTAMP NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    class VARCHAR(50) NOT NULL,
    total_marks INT NOT NULL,
    duration INT NOT NULL,  -- in minutes
    submission_deadline TIMESTAMP NOT NULL,
    emp_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (emp_id) REFERENCES Teacher(emp_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE Rubrics (
    rubric_id VARCHAR(36) PRIMARY KEY,  
    exam_id VARCHAR(36) NOT NULL,       
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (exam_id) REFERENCES Exam(exam_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE Answer_Scripts (
    script_id VARCHAR(36) PRIMARY KEY,  
    exam_id VARCHAR(36) NOT NULL,       
    roll_number VARCHAR(50) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_evaluated BOOLEAN DEFAULT FALSE,
    teacher_comments TEXT,
    FOREIGN KEY (exam_id) REFERENCES Exam(exam_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (roll_number) REFERENCES Student(roll_number)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE Results (
    result_id VARCHAR(36) PRIMARY KEY,  
    exam_id VARCHAR(36) NOT NULL,       
    roll_number VARCHAR(50) NOT NULL,
    marks_obtained FLOAT NOT NULL,
    feedback TEXT,
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    evaluated_by VARCHAR(50) NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (exam_id) REFERENCES Exam(exam_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (roll_number) REFERENCES Student(roll_number)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (evaluated_by) REFERENCES Teacher(emp_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);


CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_exam_date ON Exam(exam_date);
CREATE INDEX idx_submission_deadline ON Exam(submission_deadline);
CREATE INDEX idx_answer_scripts_submitted ON Answer_Scripts(submitted_at);
CREATE INDEX idx_results_evaluation ON Results(evaluation_date);