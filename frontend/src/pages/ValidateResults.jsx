import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Eye,
  Filter,
  Upload,
  Book,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAuPNe21f37ElukmyaveAVuyyGN5ONa-1E");

export default function ValidateResults() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [rubric, setRubric] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [plagiarismResult, setPlagiarismResult] = useState(null);

  const [pendingValidations, setPendingValidations] = useState([
    // ... (your original mock data)
  ]);

  // File upload handler with preview
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setEvaluationResult(null);
      setPlagiarismResult(null);
    }
  };

  // Delete file
  const deleteFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setEvaluationResult(null);
    setPlagiarismResult(null);
  };

  const fileToGenerativePart = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: file.type
          }
        });
      };
    });
  };

  // Enhanced JSON preprocessing
  const preprocessJsonResponse = (text) => {
    let cleanedText = text.trim();
    // Remove markdown wrappers if present
    cleanedText = cleanedText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/`/g, '')
      .trim();
    
    try {
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('JSON Parse Error:', error, 'Raw Text:', cleanedText);
      return { error: 'Invalid response format', rawResponse: cleanedText };
    }
  };

  const evaluateAnswer = async () => {
    if (!selectedFile || !rubric) {
      alert('Please upload an answer script and provide rubric');
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const imagePart = await fileToGenerativePart(selectedFile);
      
      const prompt = `
        Analyze the provided image of an answer script and perform the following:
        1. Extract the complete text from the image accurately.
        2. Evaluate the extracted text based on this rubric:
           ${rubric}
        3. Return a JSON object with:
           - extractedText: string (the full text from the image)
           - score: number (0-100, based on rubric)
           - feedback: string (detailed comments on the evaluation)
        4. Ensure the response is pure JSON, with no markdown, code blocks, or additional text outside the JSON structure.
      `;

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      const evaluation = preprocessJsonResponse(responseText);
      
      setEvaluationResult(evaluation);
    } catch (error) {
      console.error('Evaluation error:', error);
      setEvaluationResult({ error: 'Failed to evaluate answer', details: error.message });
    }
  };

  const checkPlagiarism = async () => {
    if (!selectedFile) {
      alert('Please upload an answer script first');
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const imagePart = await fileToGenerativePart(selectedFile);
      
      const prompt = `
        Analyze the provided image and perform the following:
        1. Extract the complete text from the image accurately.
        2. Check the extracted text for potential plagiarism.
        3. Return a JSON object with:
           - extractedText: string (the full text from the image)
           - plagiarismPercentage: number (0-100, estimated plagiarism level)
           - similarSources: array of strings (potential matching sources, if any; empty array if none)
        4. Ensure the response is pure JSON, with no markdown, code blocks, or additional text outside the JSON structure.
      `;

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      const plagiarismData = preprocessJsonResponse(responseText);
      
      setPlagiarismResult(plagiarismData);
    } catch (error) {
      console.error('Plagiarism check error:', error);
      setPlagiarismResult({ error: 'Failed to check plagiarism', details: error.message });
    }
  };

  const filteredExams = pendingValidations
    .filter(exam => 
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(exam => statusFilter === 'all' || exam.status === statusFilter);

  const getStatusBadge = (status) => {
    // ... (your original getStatusBadge function)
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Validate Results</h2>
      
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* ... (original search and filter inputs) */}
      </div>

      {/* Enhanced Answer Script Section */}
      <div className="mb-6 space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <label className="flex items-center px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600">
              <Upload className="w-5 h-5 mr-2 text-gray-300" />
              <span className="text-white">{selectedFile ? 'Reupload Script' : 'Upload Answer Script'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            {selectedFile && (
              <>
                <button
                  onClick={deleteFile}
                  className="flex items-center px-4 py-2 bg-red-700 rounded-lg text-white hover:bg-red-600"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete
                </button>
                <button
                  onClick={evaluateAnswer}
                  className="flex items-center px-4 py-2 bg-blue-700 rounded-lg text-white hover:bg-blue-600"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Evaluate
                </button>
                <button
                  onClick={checkPlagiarism}
                  className="flex items-center px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
                >
                  <Book className="w-5 h-5 mr-2" />
                  Check Plagiarism
                </button>
              </>
            )}
          </div>

          {/* File Preview */}
          {filePreview && (
            <div className="mt-4">
              <h3 className="text-white font-semibold mb-2">Uploaded Answer Script:</h3>
              <img 
                src={filePreview} 
                alt="Answer Script Preview" 
                className="max-w-full h-auto rounded-lg border border-gray-600 max-h-96"
              />
            </div>
          )}
        </div>

        {/* Rubric Input */}
        <div>
          <h3 className="text-white font-semibold mb-2">Evaluation Rubric:</h3>
          <textarea
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter evaluation rubric (e.g., Content: 40%, Clarity: 30%, Structure: 30%)"
            rows={4}
            value={rubric}
            onChange={(e) => setRubric(e.target.value)}
          />
        </div>

        {/* Evaluation Result */}
        {evaluationResult && (
          <div className="p-4 bg-gray-900 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Evaluation Result:</h3>
            {evaluationResult.error ? (
              <div className="text-red-400">
                <p>Error: {evaluationResult.error}</p>
                {evaluationResult.details && <p>Details: {evaluationResult.details}</p>}
                {evaluationResult.rawResponse && (
                  <pre className="text-gray-400 text-sm mt-2">Raw Response: {evaluationResult.rawResponse}</pre>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-300"><span className="font-semibold text-white">Extracted Text:</span> {evaluationResult.extractedText}</p>
                <p className="text-gray-300"><span className="font-semibold text-white">Score:</span> {evaluationResult.score}/100</p>
                <p className="text-gray-300"><span className="font-semibold text-white">Feedback:</span> {evaluationResult.feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* Plagiarism Result */}
        {plagiarismResult && (
          <div className="p-4 bg-gray-900 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Plagiarism Check:</h3>
            {plagiarismResult.error ? (
              <div className="text-red-400">
                <p>Error: {plagiarismResult.error}</p>
                {plagiarismResult.details && <p>Details: {plagiarismResult.details}</p>}
                {plagiarismResult.rawResponse && (
                  <pre className="text-gray-400 text-sm mt-2">Raw Response: {plagiarismResult.rawResponse}</pre>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-300"><span className="font-semibold text-white">Extracted Text:</span> {plagiarismResult.extractedText}</p>
                <p className="text-gray-300"><span className="font-semibold text-white">Plagiarism Percentage:</span> {plagiarismResult.plagiarismPercentage}%</p>
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Similar Sources:</span> 
                  {plagiarismResult.similarSources.length > 0 
                    ? plagiarismResult.similarSources.join(', ') 
                    : 'None detected'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exams Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
          {/* ... (original table structure) */}
          <tbody className="divide-y divide-gray-600">
            {filteredExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-650 transition-colors">
                {/* ... (original table columns) */}
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-400 hover:text-blue-300 rounded-full hover:bg-gray-600" title="View Exam Results">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-green-400 hover:text-green-300 rounded-full hover:bg-gray-600"
                      title="Validate Results"
                      disabled={exam.status === 'fully_validated'}
                      onClick={() => evaluateAnswer()}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-300 rounded-full hover:bg-gray-600" title="Download Results">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}