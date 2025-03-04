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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid gap-6">
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

      case 'exams':
        return (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Upcoming Exams</h2>
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
            </div>
          </div>
        );

      case 'submit':
        return (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Submit Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Exam
                </label>
                <select
                  name="examId"
                  value={submissionForm.examId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select an exam</option>
                  <option value="exam1">CS101 Midterm</option>
                  <option value="exam2">Math102 Quiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Answer Sheet
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
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-300">
                      {submissionForm.answerFile
                        ? `Selected: ${submissionForm.answerFile.name}`
                        : 'Drag and drop your file here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Supports PDF, Images, and Text files (max 5MB)
                    </p>
                  </label>
                  {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              </div>
            </form>
          </div>
        );

      case 'results':
        return (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Exam Results</h2>
            <div className="space-y-4">
              {[
                { title: 'CS101 Midterm', score: '88/100', date: '2023-11-01' },
                { title: 'Math102 Quiz', score: '92/100', date: '2023-10-25' },
              ].map((result, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="text-white font-semibold">{result.title}</p>
                    <p className="text-gray-400 text-sm">{result.date}</p>
                  </div>
                  <p className="text-white font-bold">{result.score}</p>
                </div>
              ))}
            </div>
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
              { id: 'exams', label: 'Exams', icon: FileText },
              { id: 'submit', label: 'Submit Assignment', icon: Upload },
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
          <div className="max-w-7xl mx-auto">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
}