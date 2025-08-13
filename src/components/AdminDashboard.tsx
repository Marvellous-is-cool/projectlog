'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  BookOpen, 
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  FileDown,
  Trash2,
  ChevronDown,
  FileType,
  LogOut
} from 'lucide-react';

interface Submission {
  id: string;
  fullName: string;
  matricNumber: string;
  discipline: "linguistics" | "communication";
  projectTopic: string;
  createdAt: string;
  updatedAt: string;
}

interface SubmissionsResponse {
  success: boolean;
  data: Submission[];
  count: number;
}

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/submissions");
      const data: SubmissionsResponse = await response.json();

      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.matricNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.projectTopic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDiscipline =
      disciplineFilter === "all" || submission.discipline === disciplineFilter;

    return matchesSearch && matchesDiscipline;
  });

  const handleExport = async (format: "csv" | "docx", discipline?: string) => {
    try {
      let url = `/api/export?format=${format}`;
      if (discipline && discipline !== 'all') {
        url += `&discipline=${discipline}`;
      }
      
      const response = await fetch(url);

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = downloadUrl;
        
        const disciplinePrefix = discipline && discipline !== 'all' ? `${discipline}-` : '';
        a.download = `${disciplinePrefix}submissions-${
          new Date().toISOString().split("T")[0]
        }.${format}`;
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted submission from state
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
        setShowDeleteConfirm(null);
      } else {
        console.error('Failed to delete submission');
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const stats = {
    total: submissions.length,
    linguistics: submissions.filter((s) => s.discipline === "linguistics")
      .length,
    communication: submissions.filter((s) => s.discipline === "communication")
      .length,
    today: submissions.filter(
      (s) => new Date(s.createdAt).toDateString() === new Date().toDateString()
    ).length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage topic submissions and exports
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={fetchSubmissions}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </motion.button>
                
                {onLogout && (
                  <motion.button
                    onClick={onLogout}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Submissions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Linguistics</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.linguistics}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Communication
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.communication}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.today}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Export */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-white/20"
          variants={itemVariants}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={disciplineFilter}
                  onChange={(e) => setDisciplineFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 appearance-none"
                >
                  <option value="all" className="text-gray-900">All Disciplines</option>
                  <option value="linguistics" className="text-gray-900">Linguistics</option>
                  <option value="communication" className="text-gray-900">Communication</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <motion.button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileDown className="w-4 h-4" />
                <span>Export Options</span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Submissions Table */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          variants={itemVariants}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Submissions ({filteredSubmissions.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="ml-2 text-gray-600">Loading submissions...</span>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No submissions found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discipline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/30 divide-y divide-gray-200">
                  {filteredSubmissions.map((submission, index) => (
                    <motion.tr
                      key={submission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.matricNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            submission.discipline === "linguistics"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {submission.discipline.charAt(0).toUpperCase() +
                            submission.discipline.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {submission.projectTopic}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <motion.button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 p-1 rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => setShowDeleteConfirm(submission.id)}
                            disabled={deletingId === submission.id}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded disabled:opacity-50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Delete Submission"
                          >
                            {deletingId === submission.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Modal for viewing submission details */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Submission Details
                </h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-900">
                    {selectedSubmission.fullName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Matric Number
                  </label>
                  <p className="text-lg text-gray-900 font-mono">
                    {selectedSubmission.matricNumber}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Discipline
                  </label>
                  <p className="text-lg text-gray-900 capitalize">
                    {selectedSubmission.discipline}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Project Topic
                  </label>
                  <p className="text-gray-900 leading-relaxed">
                    {selectedSubmission.projectTopic}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Date Submitted
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedSubmission.createdAt).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Submission
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this submission? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <motion.button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deletingId === showDeleteConfirm}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {deletingId === showDeleteConfirm ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Export Options Modal */}
      {showExportDropdown && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowExportDropdown(false)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Export Options</h3>
                <button
                  onClick={() => setShowExportDropdown(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* CSV Exports Section */}
                <div>
                  <div className="flex items-center mb-4">
                    <FileSpreadsheet className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-800">CSV Exports</h4>
                  </div>
                  <div className="space-y-2">
                    <motion.button
                      onClick={() => { handleExport("csv"); setShowExportDropdown(false); }}
                      className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <FileSpreadsheet className="w-4 h-4 text-green-600 mr-3" />
                        <span className="text-gray-800 font-medium">All Submissions</span>
                      </div>
                      <span className="text-green-600 text-sm font-medium">CSV</span>
                    </motion.button>

                    <motion.button
                      onClick={() => { handleExport("csv", "linguistics"); setShowExportDropdown(false); }}
                      className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <FileSpreadsheet className="w-4 h-4 text-green-600 mr-3" />
                        <span className="text-gray-800 font-medium">Linguistics Only</span>
                      </div>
                      <span className="text-green-600 text-sm font-medium">CSV</span>
                    </motion.button>

                    <motion.button
                      onClick={() => { handleExport("csv", "communication"); setShowExportDropdown(false); }}
                      className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <FileSpreadsheet className="w-4 h-4 text-green-600 mr-3" />
                        <span className="text-gray-800 font-medium">Communication Only</span>
                      </div>
                      <span className="text-green-600 text-sm font-medium">CSV</span>
                    </motion.button>
                  </div>
                </div>

                {/* DOCX Exports Section */}
                <div>
                  <div className="flex items-center mb-4">
                    <FileType className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="text-lg font-semibold text-gray-800">Word Documents</h4>
                  </div>
                  <div className="space-y-2">
                    <motion.button
                      onClick={() => { handleExport("docx"); setShowExportDropdown(false); }}
                      className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <FileType className="w-4 h-4 text-blue-600 mr-3" />
                        <span className="text-gray-800 font-medium">All Submissions</span>
                      </div>
                      <span className="text-blue-600 text-sm font-medium">DOCX</span>
                    </motion.button>

                    <motion.button
                      onClick={() => { handleExport("docx", "linguistics"); setShowExportDropdown(false); }}
                      className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <FileType className="w-4 h-4 text-blue-600 mr-3" />
                        <span className="text-gray-800 font-medium">Linguistics Only</span>
                      </div>
                      <span className="text-blue-600 text-sm font-medium">DOCX</span>
                    </motion.button>

                    <motion.button
                      onClick={() => { handleExport("docx", "communication"); setShowExportDropdown(false); }}
                      className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <FileType className="w-4 h-4 text-blue-600 mr-3" />
                        <span className="text-gray-800 font-medium">Communication Only</span>
                      </div>
                      <span className="text-blue-600 text-sm font-medium">DOCX</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowExportDropdown(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
