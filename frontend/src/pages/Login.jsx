import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => setErrors({});
  }, []);

  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
    };

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: '',
      submit: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    setIsSubmitting(true);

    try {
        const response = await axios.post('/api/login', {
            username: formData.username,
            password: formData.password,
            rememberMe,
        });

        console.log('Login response:', response.data); // Add for debugging

        const { token, user } = response.data; // Expect token and user object from backend

        // Store token and user data
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', token);
        storage.setItem('user', JSON.stringify(user));

        switch (user.role.toLowerCase()) {
          case 'teacher':
            navigate('/teacher-dashboard');
            break;
          case 'student':
            navigate('/student-dashboard');
            break;
          default:
            window.alert('User not found');
        }
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
        console.error('Login error:', error.response?.data); // Add for debugging
        setErrors(prev => ({
            ...prev,
            submit: errorMsg,
        }));
    } finally {
        setIsSubmitting(false);
    }
};
  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2">
          <Link 
            to="/"
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hover:scale-110 transition-transform block"
          >
            AGS
          </Link>
        </div>

        {/* Login Card */}
        <div className="card bg-white/8 backdrop-blur-lg border border-white/10 p-10 rounded-2xl shadow-2xl animate-fade-in-up mt-24">
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-8">Please enter your details to sign in</p>

          {/* Global Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="group">
              <label className="block text-gray-300 mb-2 font-medium">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className={`input-field pl-10 bg-white/5 border-white/10 text-white w-full rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.username ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your username"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-gray-300 mb-2 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`input-field pl-10 pr-10 bg-white/5 border-white/10 text-white w-full rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-400 text-primary focus:ring-primary"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-gray-300 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors relative overflow-hidden group disabled:opacity-70"
            >
              <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>

            {/* Social Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                <img src="/api/placeholder/20/20" alt="Google" className="w-5 h-5" />
                <span className="text-white">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                <img src="/api/placeholder/20/20" alt="GitHub" className="w-5 h-5" />
                <span className="text-white">GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}