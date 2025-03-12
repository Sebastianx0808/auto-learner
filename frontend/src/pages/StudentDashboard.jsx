import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Trophy,
  LogOut,
  Menu,
  User,
  Clock,
  ChevronRight,
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
  YAxis,
} from 'recharts';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [submissionForm, setSubmissionForm] = useState({
    examId: '',
    assignmentId: '',
    answerFile: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');

  // Mock data for visualizations
  const progressData = [
    { month: 'Jan', score: 75 },
    { month: 'Feb', score: 82 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 88 },
    { month: 'May', score: 90 },
  ];

  const submissionStatus = [
    { name: 'Submitted', value: 70 },
    { name: 'Pending', value: 30 },
  ];

  const COLORS = ['#6366f1', '#e11d48'];

  const stats = [
    { title: 'Upcoming Exams', value: '5', icon: FileText },
    { title: 'Submissions', value: '12', icon: Upload },
    { title: 'Average Score', value: '85%', icon: Trophy },
  ];

  // Handlers for file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
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
    setSubmissionForm((prev) => ({ ...prev, answerFile: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', submissionForm);
    // Add API call here to submit the file
    alert('Submission successful!');
    setSubmissionForm({ examId: '', answerFile: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubmissionForm((prev) => ({ ...prev, [name]: value }));
  };

  const assignmentDetails = {
    assign1: {
      title: 'CS101 Research Paper',
      description: 'Write a 10-page research paper on Artificial Intelligence advancements.',
      deadline: '2023-11-25',
    },
    assign2: {
      title: 'Math102 Problem Set',
      description: 'Solve and submit the given 20 calculus problems.',
      deadline: '2023-11-30',
    },
  };

  const [selectedExam, setSelectedExam] = useState('');
        
          const examResults = {
            exam1: {
              title: 'CS101',
              date: '2024-11-22',
              passingMarks: 40,
              totalMarks: 100,
              yourMarks: 80,
              percentage: 88,
              correctAnswers: 20,
              wrongAnswers: 5,
            },
            exam2: {
              title: 'Math102',
              date: '2024-11-25',
              passingMarks: 40,
              totalMarks: 100,
              yourMarks: 52,
              percentage: 52,
              correctAnswers: 52,
              wrongAnswers: 48,
            },
            exam3: {
              title: 'PSD115',
              date: '2024-11-30',
              passingMarks: '40',
              totalMarks: 100,
              yourMarks: 72,
              percentage: 72,
              correctAnswers: 36,
              wrongAnswers: 14,
            }
          };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid gap-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105"
                >
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
  
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Progress Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <XAxis dataKey="month" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
  
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Submission Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={submissionStatus}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {submissionStatus.map((entry, index) => (
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
  
      case 'tasks':
        return (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">UPCOMING EXAMS</h2>
            <div className="space-y-4">
              {[
                { title: 'CS101 Midterm', date: '2023-11-15', time: '10:00 AM' },
                { title: 'Math102 Quiz', date: '2023-11-20', time: '2:00 PM' },
              ].map((exam, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="text-white font-semibold">{exam.title}</p>
                    <p className="text-gray-400 text-sm">
                      {exam.date} at {exam.time}
                    </p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-400">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
  
              {/* Upcoming Assignments */}
              <h2 className="text-xl font-bold text-white mt-6 mb-4">UPCOMING ASSIGNMENTS</h2>
              {[
                { title: 'CS101 Research Paper', upload: '2025-03-05', deadline: '2025-03-12' },
                { title: 'Math102 Problem Set', upload: '2025-02-25', deadline: '2025-03-05' },
              ].map((assignment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="text-white font-semibold">{assignment.title}</p>
                    <p className="text-gray-400 text-sm">Upload: {assignment.upload}</p>
                    <p className="text-gray-400 text-sm">Deadline: {assignment.deadline}</p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-400">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
  
        case 'submit_assignment':
        return (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Submit Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Assignment
                </label>
                <select
                  name="assignmentId"
                  value={submissionForm.assignmentId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                >
                  <option value="">Select an assignment</option>
                  <option value="assign1">CS101 Research Paper</option>
                  <option value="assign2">Math102 Problem Set</option>
                </select>
              </div>
  
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Assignment File
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload-assignment"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload-assignment" className="cursor-pointer">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-300">
                      {submissionForm.answerFile
                        ? `Selected: ${submissionForm.answerFile.name}`
                        : 'Drag and drop your file here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Supports PDF, Images, and Text files (max 5MB)</p>
                  </label>
                  {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                </div>
              </div>
  
              {/* Submit Button */}
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Submit
                </button>
              </div>
            </form>
          </div>
        );
  
      case 'submit_exam':
        return (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Submit Exam Answer Script</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Exam */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Exam
                </label>
                <select
                  name="examId"
                  value={submissionForm.examId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                >
                  <option value="">Select an exam</option>
                  <option value="exam1">CS101 Midterm</option>
                  <option value="exam2">Math102 Quiz</option>
                </select>
              </div>
  
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Exam Answer Sheet
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload-exam"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload-exam" className="cursor-pointer">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-300">
                      {submissionForm.answerFile
                        ? `Selected: ${submissionForm.answerFile.name}`
                        : 'Drag and drop your file here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Supports PDF, Images, and Text files (max 5MB)</p>
                  </label>
                  {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                </div>
              </div>
  
              {/* Submit Button */}
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Submit
                </button>
              </div>
            </form>
          </div>
        );

      case 'results':
            const result = selectedExam ? examResults[selectedExam] : null;
    
            return (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Exam Results</h2>
    
                {/* Select Exam Dropdown */}
                <div className="mb-6">
                  <label className="text-white block text-sm font-medium mb-2">
                    Select Exam
                  </label>
                  <select
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                  >
                    <option value="">Select an exam</option>
                    {Object.keys(examResults).map((examKey) => (
                      <option key={examKey} value={examKey}>
                        {examResults[examKey].title}
                      </option>
                    ))}
                  </select>
                </div>
    
                {/* Display Result Details if an exam is selected */}
                {result ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-700 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-white">{result.title}</h3>
                      <p className="text-gray-400">Exam Date: {result.date}</p>
                    </div>
    
                    {/* Score Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Your Score', value: `${result.yourMarks}/${result.totalMarks}`, color: 'bg-blue-500' },
                        { label: 'Passing Marks', value: result.passingMarks, color: 'bg-yellow-500' },
                        { label: 'Percentage', value: `${result.percentage}%`, color: 'bg-green-500' },
                        { label: 'Correct Answers', value: result.correctAnswers, color: 'bg-green-600' },
                        { label: 'Wrong Answers', value: result.wrongAnswers, color: 'bg-red-600' },
                      ].map((stat, index) => (
                        <div key={index} className={`p-4 rounded-lg text-center ${stat.color} text-white font-bold shadow-lg`}>
                          <p className="text-lg">{stat.label}</p>
                          <p className="text-2xl">{stat.value}</p>
                        </div>
                      ))}
                    </div>
    
                    {/* Score Progress Bar */}
                    <div>
                      <p className="text-white font-semibold mb-2">Your Score Progress</p>
                      <div className="relative h-4 w-full bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(result.yourMarks / result.totalMarks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">Please select an exam to view results.</p>
                )}
              </div>
            );
    
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
              <h1 className="ml-4 text-xl font-bold">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span>Jane Doe</span>
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
  className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 min-h-screen transition-all duration-300 ease-in-out`}
>
  <nav className="p-4 space-y-2">
    {[
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'tasks', label: 'Tasks/Assignments', icon: FileText },
      { id: 'submit_assignment', label: 'Submit Assignment', icon: Upload },
      { id: 'submit_exam', label: 'Submit Exam', icon: Upload },
      { id: 'results', label: 'Results', icon: Trophy },
    ].map((item) => (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
          activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
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
          <div className="max-w-7xl mx-auto">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
}