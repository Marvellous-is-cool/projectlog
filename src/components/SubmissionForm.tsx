"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Hash,
  BookOpen,
  FileText,
} from "lucide-react";

const submissionSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name should only contain letters and spaces"),
  matricNumber: z
    .string()
    .min(3, "Matric number is required")
    .max(20, "Matric number cannot exceed 20 characters")
    .regex(
      /^[A-Z0-9/]+$/,
      "Matric number should only contain uppercase letters, numbers, and forward slashes"
    ),
  discipline: z.enum(["linguistics", "communication"], {
    message: "Please select a discipline",
  }),
  projectTopic: z
    .string()
    .min(10, "Project topic must be at least 10 characters")
    .max(500, "Project topic cannot exceed 500 characters"),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface SubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    fullName: string;
    matricNumber: string;
  };
}

export default function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: SubmissionResponse = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setStatusMessage("Your topic has been successfully submitted!");
        reset();
      } else {
        setSubmitStatus("error");
        setStatusMessage(
          result.message || "An error occurred while submitting your topic."
        );
      }
    } catch {
      setSubmitStatus("error");
      setStatusMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200/50"
          variants={itemVariants}
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Topic Submission
            </h1>
            <p className="text-gray-600 text-lg">
              Submit your project topic for collation
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                {...register("fullName")}
                type="text"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fullName.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 mr-2" />
                Matric Number
              </label>
              <input
                {...register("matricNumber")}
                type="text"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 placeholder-gray-500 uppercase"
                placeholder="Enter your matric number (e.g., 2021/34825)"
              />
              {errors.matricNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.matricNumber.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 mr-2" />
                Discipline
              </label>
              <select
                {...register("discipline")}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900"
              >
                <option value="" className="text-gray-500">Select your discipline</option>
                <option value="linguistics" className="text-gray-900">Linguistics</option>
                <option value="communication" className="text-gray-900">Communication</option>
              </select>
              {errors.discipline && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.discipline.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Project Topic
              </label>
              <textarea
                {...register("projectTopic")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 placeholder-gray-500 resize-none"
                placeholder="Enter your project topic......"
              />
              {errors.projectTopic && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.projectTopic.message}
                </p>
              )}
            </motion.div>

            {submitStatus !== "idle" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl flex items-center ${
                  submitStatus === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitStatus === "success" ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                {statusMessage}
              </motion.div>
            )}

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Topic"
              )}
            </motion.button>
          </form>

          <motion.div
            variants={itemVariants}
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>Made with ❤️ to ease project topic submission</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
