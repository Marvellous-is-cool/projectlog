"use client";

import { motion } from "framer-motion";
import SubmissionForm from "@/components/SubmissionForm";
import { FileText, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 relative overflow-hidden">
      {/* Simple geometric background - no random values */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Static positioned colorful shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-2xl" />
        <div className="absolute top-40 right-32 w-40 h-40 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-2xl" />
        <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-gradient-to-br from-purple-300/30 to-indigo-300/30 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-emerald-300/30 to-green-300/30 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl" />
      </div>

      {/* Simple animated dots - fixed positions */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { x: "10%", y: "20%", delay: 0, color: "bg-pink-400/40" },
          { x: "80%", y: "15%", delay: 0.5, color: "bg-blue-400/40" },
          { x: "20%", y: "70%", delay: 1, color: "bg-purple-400/40" },
          { x: "90%", y: "80%", delay: 1.5, color: "bg-emerald-400/40" },
          { x: "60%", y: "30%", delay: 2, color: "bg-yellow-400/40" },
          { x: "30%", y: "50%", delay: 2.5, color: "bg-rose-400/40" },
        ].map((dot, index) => (
          <motion.div
            key={index}
            className={`absolute w-2 h-2 rounded-full ${dot.color}`}
            style={{ left: dot.x, top: dot.y }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              delay: dot.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-16 pb-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FileText className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Topics
            </span>
            <span className="text-gray-800 ml-3">Log</span>
          </h1>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Submit and manage your project topics with style ✨
          </motion.p>

          {/* Colorful feature badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-sm font-medium border border-pink-200">
              Easy Submission
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
              Smart Validation
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
              Progressive Form
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
              Admin Dashboard
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="relative z-10 pb-16">
        <SubmissionForm />
      </div>

      {/* Footer */}
      <motion.footer
        className="relative z-10 py-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex items-center justify-center text-gray-600 mb-4">
          <Sparkles className="w-4 h-4 mr-2 text-violet-500" />
          <span>Built with ❤️ by Coolbuoy</span>
          <Sparkles className="w-4 h-4 ml-2 text-violet-500" />
        </div>
        <p className="text-sm text-gray-500">
          for Set &apos;25 easy submissions
        </p>
      </motion.footer>
    </main>
  );
}
