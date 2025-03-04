import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, School, Book, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Register() {
  const [userType, setUserType] = useState('teacher');
  const [formData, setFormData] = useState({
    emp_id: '',
    name: '',
    designation: '',
    institution: '',
    department: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    roll_number: '',
    class: '',
    institytuin: '',
    semester: '',
    batch: ''
  });

  const [errors,setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format';
      case 'phone':
        return /^\d{10}$/.test(value) ? '' : 'Invalid phone number';
      case 'username':
        return value.length >= 4? '' : 'Username must be atleast 4 characters';
      case 'password':
        return value.length >= 8 ? '' : 'Password must be atleast 8 characters';
      case 'name':
        return value.trim() ? '' : 'Name is required';
      default:
        return '';  
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = userType === 'teacher'
    ? ['emp_id', 'name', 'designation', 'institution', 'email', 'username', 'password', 'confirmPassword']
    : ['roll_number', 'name', 'class', 'institution', 'username', 'password', 'confirmPassword'];

    requiredFields.forEach(field => {
      const errorMessage = validateField(field, formData[field]);
      if (errorMessage) {
        newErrors[field] = errorMessage;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitting(true);
  
    try {
      // Create a clean data object based on user type
      const submitData = {
        username: formData.username,
        password: formData.password,
        email: formData.email || "student@getMaxListeners.com" // Allows null email for students
      };
  
      if (userType === 'teacher') {
        // Add teacher specific fields
        Object.assign(submitData, {
          emp_id: formData.emp_id,
          name: formData.name,
          designation: formData.designation,
          institution: formData.institution,
          department: formData.department,
          phone: formData.phone
        });
      } else {
        // Add student specific fields - fix the institution field name
        Object.assign(submitData, {
          roll_number: formData.roll_number,
          name: formData.name,
          class: formData.class,
          institytuin: formData.institytuin, // This matches the field name in the form
          department: formData.department,
          semester: formData.semester,
          batch: formData.batch
        });
      }
  
      const response = await axios.post('/api/register', submitData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      alert(`Registration successful for ${userType}`);
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.details || error.response?.data?.error || 'Registration failed';
      setErrors(prev => ({
        ...prev,
        submit: errorMsg
      }));
      console.error('Registration error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        
        <div className="p-8">
          <div className="flex flex-col items-center mb-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12 transition-transform hover:rotate-0">
              {userType === 'teacher' ? 
                <School className="w-8 h-8 text-white" /> : 
                <Book className="w-8 h-8 text-white" />
              }
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Register as {userType}
            </h2>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-gray-700/50 p-1 rounded-xl backdrop-blur-sm">
              {['teacher', 'student'].map((type) => (
                <button
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`
                    px-6 py-2 rounded-lg font-medium transition-all duration-200
                    ${userType === type 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform -translate-y-0.5' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userType === 'teacher' ? (
                <>
                  <InputField
                    label="Employee ID"
                    name="emp_id"
                    value={formData.emp_id}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <>
                  <InputField
                    label="Roll Number"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Class"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Institution"
                    name="institytuin"
                    value={formData.institytuin}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <InputField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                icon={<User className="w-4 h-4 text-gray-400" />}
              />
              <InputField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 flex items-center">
                <AlertCircle className="mr-2" />
                {errors.submit}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className={`
                w-full py-3 px-4 
                ${submitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02]'}
                text-white rounded-xl font-medium 
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-purple-500
              `}
            >

              {submitting ? 'Registering...' : `Register as ${userType}`}
            </button>

            <p className="text-center text-gray-400 mt-6">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, icon, error, ...props }) => (
  <div className="group relative transform transition-all duration-200 focus-within:scale-[1.02]">
    <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`
          w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg
          text-white placeholder-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
          hover:bg-gray-700/70
          ${icon ? 'pl-10' : ''}
        `}
        required
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  </div>
);