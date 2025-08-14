"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FileText,
  Users,
  BookOpen,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  FileDown,
  Trash2,
  ChevronDown,
  FileType,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";

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
  const [showExportModal, setShowExportModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

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
      if (discipline && discipline !== "all") {
        url += `&discipline=${discipline}`;
      }

      const response = await fetch(url);

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = downloadUrl;

        const disciplinePrefix =
          discipline && discipline !== "all" ? `${discipline}-` : "";
        a.download = `${disciplinePrefix}submissions-${
          new Date().toISOString().split("T")[0]
        }.${format}`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        setShowExportModal(false);
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
        setShowDeleteConfirm(null);
      } else {
        console.error("Failed to delete submission");
      }
    } catch (error) {
      console.error("Delete error:", error);
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
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-12" variants={itemVariants}>
          <motion.div
            className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl shadow-2xl p-8"
            whileHover={{
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <motion.h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    Admin Control Center
                  </motion.h1>
                  <p className="text-slate-300/80 mt-2 text-lg">
                    Advanced submission management & analytics
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={fetchSubmissions}
                  disabled={loading}
                  className="group relative flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      loading
                        ? "animate-spin"
                        : "group-hover:rotate-180 transition-transform duration-300"
                    }`}
                  />
                  <span>Refresh</span>
                </motion.button>

                {onLogout && (
                  <motion.button
                    onClick={onLogout}
                    className="relative flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Premium Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
          variants={itemVariants}
        >
          {[
            {
              icon: Users,
              label: "Total Submissions",
              value: stats.total,
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-500/20 to-cyan-500/20",
              trend: "+12%",
            },
            {
              icon: BookOpen,
              label: "Linguistics",
              value: stats.linguistics,
              gradient: "from-emerald-500 to-teal-500",
              bgGradient: "from-emerald-500/20 to-teal-500/20",
              trend: "+8%",
            },
            {
              icon: FileText,
              label: "Communication",
              value: stats.communication,
              gradient: "from-purple-500 to-pink-500",
              bgGradient: "from-purple-500/20 to-pink-500/20",
              trend: "+15%",
            },
            {
              icon: Calendar,
              label: "Today",
              value: stats.today,
              gradient: "from-amber-500 to-orange-500",
              bgGradient: "from-amber-500/20 to-orange-500/20",
              trend: "New",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${
                    stat.gradient.split(" ")[1]
                  }, ${stat.gradient.split(" ")[3]})`,
                }}
              />
              <div className="relative backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl shadow-xl p-8 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`p-4 bg-gradient-to-r ${stat.bgGradient} rounded-2xl`}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <motion.div
                    className={`px-3 py-1 bg-gradient-to-r ${stat.gradient} rounded-full text-xs font-bold text-white`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.trend}
                  </motion.div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-2">
                    {stat.label}
                  </p>
                  <motion.p
                    className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                  >
                    {stat.value}
                  </motion.p>
                </div>

                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Export */}
        <motion.div
          className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl shadow-2xl p-8 mb-12"
          variants={itemVariants}
          whileHover={{
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
              <motion.div
                className="relative flex-1 max-w-md"
                whileFocus={{ scale: 1.02 }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 text-lg backdrop-blur-sm"
                />
              </motion.div>

              <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  value={disciplineFilter}
                  onChange={(e) => setDisciplineFilter(e.target.value)}
                  className="appearance-none pl-12 pr-10 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 text-lg backdrop-blur-sm cursor-pointer"
                >
                  <option value="all" className="bg-slate-800 text-white">
                    All Disciplines
                  </option>
                  <option
                    value="linguistics"
                    className="bg-slate-800 text-white"
                  >
                    Linguistics
                  </option>
                  <option
                    value="communication"
                    className="bg-slate-800 text-white"
                  >
                    Communication
                  </option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </motion.div>
            </div>

            <motion.div className="relative">
              <motion.button
                onClick={() => setShowExportModal(true)}
                className="group flex items-center space-x-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all duration-500"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FileDown className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-lg">Export Data</span>
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Submissions List */}
        <motion.div
          className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl shadow-2xl p-8"
          variants={itemVariants}
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Project Submissions
            </h3>
            <p className="text-slate-300">
              Showing {filteredSubmissions.length} of {submissions.length}{" "}
              submissions
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"
              />
              <span className="ml-3 text-slate-300">
                Loading submissions...
              </span>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No submissions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  className="backdrop-blur-sm bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.01,
                    borderColor: "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h4 className="text-lg font-semibold text-white">
                          {submission.fullName}
                        </h4>
                        <span className="text-slate-400 font-mono text-sm">
                          {submission.matricNumber}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            submission.discipline === "linguistics"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {submission.discipline.charAt(0).toUpperCase() +
                            submission.discipline.slice(1)}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                        {submission.projectTopic}
                      </p>
                      <p className="text-slate-400 text-xs">
                        Submitted:{" "}
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      <motion.button
                        onClick={() => setSelectedSubmission(submission)}
                        className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        onClick={() => setShowDeleteConfirm(submission.id)}
                        disabled={deletingId === submission.id}
                        className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {deletingId === submission.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-4 h-4 border border-red-300 border-t-transparent rounded-full"
                          />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Export Options
                </h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 bg-white/[0.08] rounded-lg hover:bg-white/[0.12] transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    format: "csv",
                    label: "Export All (CSV)",
                    discipline: undefined,
                  },
                  {
                    format: "docx",
                    label: "Export All (DOCX)",
                    discipline: undefined,
                  },
                  {
                    format: "csv",
                    label: "Linguistics Only (CSV)",
                    discipline: "linguistics",
                  },
                  {
                    format: "docx",
                    label: "Linguistics Only (DOCX)",
                    discipline: "linguistics",
                  },
                  {
                    format: "csv",
                    label: "Communication Only (CSV)",
                    discipline: "communication",
                  },
                  {
                    format: "docx",
                    label: "Communication Only (DOCX)",
                    discipline: "communication",
                  },
                ].map((option, index) => (
                  <motion.button
                    key={`${option.format}-${option.discipline || "all"}`}
                    onClick={() =>
                      handleExport(
                        option.format as "csv" | "docx",
                        option.discipline
                      )
                    }
                    className="w-full flex items-center justify-between p-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl hover:bg-white/[0.08] transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <FileType className="w-5 h-5 text-purple-400 mr-3" />
                      <span className="text-white font-medium">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-purple-300 text-sm font-medium">
                      {option.format.toUpperCase()}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Submission Details
                </h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 bg-white/[0.08] rounded-lg hover:bg-white/[0.12] transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-400">
                    Full Name
                  </label>
                  <p className="text-lg text-white mt-1">
                    {selectedSubmission.fullName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400">
                    Matric Number
                  </label>
                  <p className="text-lg text-white mt-1 font-mono">
                    {selectedSubmission.matricNumber}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400">
                    Discipline
                  </label>
                  <p className="text-lg text-white mt-1 capitalize">
                    {selectedSubmission.discipline}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400">
                    Project Topic
                  </label>
                  <p className="text-white mt-1 leading-relaxed">
                    {selectedSubmission.projectTopic}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400">
                    Submitted
                  </label>
                  <p className="text-white mt-1">
                    {new Date(selectedSubmission.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Delete Submission
                </h3>
                <p className="text-slate-300 mb-6">
                  Are you sure you want to delete this submission? This action
                  cannot be undone.
                </p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 bg-white/[0.08] text-white rounded-xl hover:bg-white/[0.12] transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    disabled={deletingId === showDeleteConfirm}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {deletingId === showDeleteConfirm
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
