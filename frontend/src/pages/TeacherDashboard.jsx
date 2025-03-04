import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  CheckCircle, 
  Trophy,
  LogOut,
  Menu,
  User,
  PlusCircle,
  Upload,
  ChevronRight,
  Clock,
  FileText
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';


import ValidateResults from './ValidateResults';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [ formData, setFormData] = useState({
    title: '',
    description: '',
    exam_date: '',
    subject_code: '',
    class: '',
    total_marks: '',
    duration: '',
    submission_deadline: '',
    question_paper: null
  });

  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');



  // Mock data for visualizations
  const examData = [
    { month: 'Jan', exams: 4 },
    { month: 'Feb', exams: 6 },
    { month: 'Mar', exams: 5 },
    { month: 'Apr', exams: 8 },
    { month: 'May', exams: 7 },
  ];

  const pieData = [
    { name: 'Submitted', value: 85 },
    { name: 'Pending', value: 15 },
  ];

  const COLORS = ['#6366f1', '#e11d48', '#2dd4bf', '#f59e0b'];

  const stats = [
    { title: 'Total Exams', value: '24', icon: FileSpreadsheet },
    { title: 'Total Students', value: '156', icon: User },
    { title: 'Submissions', value: '142', icon: Upload },
    { title: 'Pass Rate', value: '92%', icon: Trophy },
  ];

  //function to handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setFileError('Please upload a PDF, image, or text file');
      return;
    }

    if (file.size > maxSize) {
      setFileError('File size must be less than 5MB');
      return;
    }

    setFileError('');
    setFormData(prev => ({
      ...prev,
      question_paper: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const examData = new FormData();
    examData.append('title', formData.title);
    examData.append('description', formData.description);
    examData.append('exam_date', formData.exam_date);
    examData.append('subject_code', formData.subject_code);
    examData.append('class', formData.class);
    examData.append('total_marks', formData.total_marks);
    examData.append('duration', formData.duration);
    examData.append('submission_deadline', formData.submission_deadline);
    examData.append('question_paper', formData.question_paper);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.post('/api/exams/create', examData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Exam created:', response.data);
      setFormData({
        title: '',
        description: '',
        exam_date: '',
        subject_code: '',
        class: '',
        total_marks: '',
        duration: '',
        submission_deadline: '',
        question_paper: null,
      });
      setFileError('');
      alert('Exam created successfully!');
    } catch (error) {
      console.error('Error creating exam:', error.response?.data || error);
      setFileError(error.response?.data?.error || 'Failed to create exam');
    }
    
  };



  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Exam Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={examData}>
                    <XAxis dataKey="month" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip />
                    <Line type="monotone" dataKey="exams" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Submission Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'create-exam':
        return (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-4">Create Exam</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="col-span-2">
                  <InputField
                    label="Exam Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter exam title"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-z">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-6 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition-colors"
                    placeholder="Enter exam description"
                    required
                  />
                </div>

                <InputField
                  label="Subject Code"
                  name="subject_code"
                  value={formData.subject_code}
                  onChange={handleInputChange}
                  placeholder="e.g., CS101"
                  required
                />

                <InputField
                  label="Class"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  placeholder="e.g., BTech 2nd Year"
                  required
                />

                {/* Total Marks and Duration */}
                <InputField
                  label="Total Marks"
                  name="total_marks"
                  type="number"
                  value={formData.total_marks}
                  onChange={handleInputChange}
                  placeholder="Enter total marks"
                  required
                />

                <InputField
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Enter duration in minutes"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Exam Date & Time
                  </label>
                  <div className="relative">
                    
                    <input
                      type="datetime-local"
                      name="exam_date"
                      value={formData.exam_date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Submission Deadline
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="datetime-local"
                      name="submission_deadline"
                      value={formData.submission_deadline}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

        {/* File Upload Section */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Question Paper
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-300">
                      {formData.question_paper 
                        ? `Selected: ${formData.question_paper.name}`
                        : 'Drag and drop your file here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Supports PDF, Images, and Text files (max 5MB)
                    </p>
                  </label>
                  {fileError && (
                    <p className="text-red-500 text-sm mt-2">{fileError}</p>
                  )}
                </div>
              </div>

        {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                          transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                          flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Create Exam</span>
                </button>

              </div>

            </form>
          </div>
        );


      case 'validate':
        return <ValidateResults />;
      default:
        return <div>Content for {activeTab}</div>;
    }

    
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="ml-4 text-xl font-bold">Teacher Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span>John Doe</span>
              </div>
              <button className="flex items-center space-x-1 bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } bg-gray-800 min-h-screen transition-all duration-300 ease-in-out`}
        >
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'create-exam', label: 'Create Exam', icon: PlusCircle },
              { id: 'submissions', label: 'Submissions', icon: Upload },
              { id: 'validate', label: 'Validate Results', icon: CheckCircle },
              { id: 'results', label: 'Results', icon: Trophy },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
);