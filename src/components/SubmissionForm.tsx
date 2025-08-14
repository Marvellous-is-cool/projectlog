"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  Loader2,
  User,
  Hash,
  BookOpen,
  FileText,
  Send,
  ArrowDown,
  Heart,
  Trophy,
  Sparkles,
  Star,
  Zap,
  Edit3,
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
    discipline: string;
    projectTopic: string;
    submissionDate: string;
  };
}

export default function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem("lastSubmission");
    if (savedData && submitStatus === "idle") {
      try {
        const parsedData = JSON.parse(savedData);

        // Extract ID and form data
        const { id, ...formData } = parsedData;
        setSubmissionId(id || null); // Restore submission ID
        reset(formData); // Reset form with the saved data (without ID)
        setIsEditMode(true); // If there's saved data, we're likely in edit mode
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, [reset, submitStatus]); // Include dependencies

  // Watch form values to determine when to show next field
  const fullName = watch("fullName");
  const matricNumber = watch("matricNumber");
  const discipline = watch("discipline");
  const projectTopic = watch("projectTopic");

  // Determine which fields should be visible based on completion OR edit mode
  const shouldShowMatricNumber =
    isEditMode || (fullName && fullName.trim().length >= 3);
  const shouldShowDiscipline =
    isEditMode ||
    (shouldShowMatricNumber && matricNumber && matricNumber.trim().length >= 5);
  const shouldShowProjectTopic =
    isEditMode ||
    (shouldShowDiscipline && discipline && discipline.trim().length > 0);
  const shouldShowSubmitButton =
    isEditMode ||
    (shouldShowProjectTopic &&
      projectTopic &&
      projectTopic.trim().length >= 10);

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Determine if this is an update or create operation
      const isUpdate = isEditMode && submissionId;
      const url = isUpdate
        ? `/api/submissions/${submissionId}`
        : "/api/submissions";
      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: SubmissionResponse = await response.json();

      if (response.ok && result.success) {
        // Save submitted data and ID to session storage for potential editing
        const submissionData = {
          ...data,
          id: result.data?.id || submissionId,
        };
        sessionStorage.setItem(
          "lastSubmission",
          JSON.stringify(submissionData)
        );

        // Update submission ID if it's a new submission
        if (!isUpdate && result.data?.id) {
          setSubmissionId(result.data.id);
        }

        setSubmitStatus("success");
        setStatusMessage(
          isUpdate
            ? "Your topic has been successfully updated!"
            : "Your topic has been successfully submitted!"
        );
        setIsEditMode(false); // Exit edit mode when successfully submitted
        // Don't reset form immediately - keep data for potential editing
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

  const resetForm = () => {
    setSubmitStatus("idle");
    setStatusMessage("");
    setIsEditMode(false); // Exit edit mode
    setSubmissionId(null); // Clear submission ID
    reset(); // Reset form fields
    sessionStorage.removeItem("lastSubmission"); // Clear saved data
  };

  const editSubmission = () => {
    setSubmitStatus("idle");
    setStatusMessage("");
    setIsEditMode(true); // Enable edit mode to show all fields

    // Restore data from session storage if available
    const savedData = sessionStorage.getItem("lastSubmission");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // Extract ID and form data
        const { id, ...formData } = parsedData;
        setSubmissionId(id || null); // Restore submission ID
        reset(formData); // Reset form with the saved data (without ID)
      } catch (error) {
        console.error("Error parsing saved submission data:", error);
      }
    }
  };

  // Simple, efficient animations
  const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  const fieldColors = {
    fullName: "from-pink-400 to-rose-400",
    matricNumber: "from-blue-400 to-cyan-400",
    discipline: "from-purple-400 to-indigo-400",
    projectTopic: "from-emerald-400 to-green-400",
  };

  const fieldBgColors = {
    fullName: "focus:bg-pink-50 focus:border-pink-300",
    matricNumber: "focus:bg-blue-50 focus:border-blue-300",
    discipline: "focus:bg-purple-50 focus:border-purple-300",
    projectTopic: "focus:bg-emerald-50 focus:border-emerald-300",
  };

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          {/* Success State - Full Screen Celebration */}
          {submitStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1,
                },
              }}
              className="relative overflow-hidden"
            >
              {/* Floating celebration elements */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${10 + i * 7}%`,
                      top: `${20 + (i % 3) * 20}%`,
                    }}
                    animate={{
                      y: [-10, -30, -10],
                      rotate: [0, 180, 360],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2 + i * 0.2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  >
                    {i % 4 === 0 && (
                      <Star className="w-3 h-3 text-yellow-400" />
                    )}
                    {i % 4 === 1 && (
                      <Sparkles className="w-3 h-3 text-pink-400" />
                    )}
                    {i % 4 === 2 && <Zap className="w-3 h-3 text-blue-400" />}
                    {i % 4 === 3 && <Heart className="w-3 h-3 text-red-400" />}
                  </motion.div>
                ))}
              </div>

              {/* Main success container */}
              <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-8 text-center relative z-10">
                {/* Trophy icon with animation */}
                <motion.div
                  className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>

                {/* Main success title */}
                <motion.h3
                  className="text-3xl font-bold text-emerald-700 mb-3"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🎉 Submission Successful! 🎉
                </motion.h3>

                {/* Encouraging message */}
                <p className="text-lg text-emerald-600 mb-4 font-medium">
                  Your project topic has been recorded! Need to make changes? No
                  worries - you can edit it below.
                </p>

                {/* Celebration message */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    And that&apos;s a wrap! 🎊
                  </p>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {/* Edit submission button */}
                  <motion.button
                    onClick={editSubmission}
                    className="px-5 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Submission
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Edit mode header */}
              {isEditMode && (
                <motion.div
                  className="text-center mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-lg font-semibold text-orange-700 flex items-center justify-center">
                    <Edit3 className="w-5 h-5 mr-2" />
                    Editing Your Submission
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    Make your changes below and resubmit
                  </p>
                </motion.div>
              )}
              {/* Full Name Field - Always visible */}
              <motion.div variants={fadeIn} className="space-y-3">
                <label className="flex items-center text-gray-700 font-semibold text-lg">
                  <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-r ${fieldColors.fullName} flex items-center justify-center mr-3`}
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                  What&apos;s your name?
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  className={`w-full px-4 py-4 rounded-2xl border-2 border-gray-200 outline-none transition-all duration-200 text-lg placeholder:text-gray-400 ${fieldBgColors.fullName}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <motion.p
                    className="text-red-500 text-sm flex items-center bg-red-50 p-2 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.fullName.message}
                  </motion.p>
                )}

                {fullName &&
                  fullName.trim().length >= 1 &&
                  fullName.trim().length < 3 && (
                    <motion.p
                      className="text-pink-600 text-sm flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <ArrowDown className="w-4 h-4 mr-2 animate-bounce" />
                      Keep going, you&apos;re doing great! ✨
                    </motion.p>
                  )}
              </motion.div>

              {/* Matric Number Field */}
              <AnimatePresence>
                {shouldShowMatricNumber && (
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <label className="flex items-center text-gray-700 font-semibold text-lg">
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-r ${fieldColors.matricNumber} flex items-center justify-center mr-3`}
                      >
                        <Hash className="w-4 h-4 text-white" />
                      </div>
                      Your matric number?
                    </label>
                    <input
                      {...register("matricNumber")}
                      type="text"
                      className={`w-full px-4 py-4 rounded-2xl border-2 border-gray-200 outline-none transition-all duration-200 text-lg placeholder:text-gray-400 uppercase ${fieldBgColors.matricNumber}`}
                      placeholder="e.g., 2021/34825"
                    />
                    {errors.matricNumber && (
                      <motion.p
                        className="text-red-500 text-sm flex items-center bg-red-50 p-2 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.matricNumber.message}
                      </motion.p>
                    )}

                    {matricNumber &&
                      matricNumber.trim().length >= 1 &&
                      matricNumber.trim().length < 5 && (
                        <motion.p
                          className="text-blue-600 text-sm flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <ArrowDown className="w-4 h-4 mr-2 animate-bounce" />
                          Almost there! 💙
                        </motion.p>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Discipline Field */}
              <AnimatePresence>
                {shouldShowDiscipline && (
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <label className="flex items-center text-gray-700 font-semibold text-lg">
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-r ${fieldColors.discipline} flex items-center justify-center mr-3`}
                      >
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      Choose your discipline
                    </label>
                    <select
                      {...register("discipline")}
                      className={`w-full px-4 py-4 rounded-2xl border-2 border-gray-200 outline-none transition-all duration-200 text-lg ${fieldBgColors.discipline}`}
                    >
                      <option value="">Select your field of study</option>
                      <option value="linguistics">Linguistics</option>
                      <option value="communication">Communication</option>
                    </select>
                    {errors.discipline && (
                      <motion.p
                        className="text-red-500 text-sm flex items-center bg-red-50 p-2 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.discipline.message}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Project Topic Field */}
              <AnimatePresence>
                {shouldShowProjectTopic && (
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <label className="flex items-center text-gray-700 font-semibold text-lg">
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-r ${fieldColors.projectTopic} flex items-center justify-center mr-3`}
                      >
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      Tell us about your project! 🚀
                    </label>
                    <textarea
                      {...register("projectTopic")}
                      rows={4}
                      className={`w-full px-4 py-4 rounded-2xl border-2 border-gray-200 outline-none transition-all duration-200 text-lg placeholder:text-gray-400 resize-none ${fieldBgColors.projectTopic}`}
                      placeholder="Describe your amazing project topic..."
                    />
                    {errors.projectTopic && (
                      <motion.p
                        className="text-red-500 text-sm flex items-center bg-red-50 p-2 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.projectTopic.message}
                      </motion.p>
                    )}

                    {projectTopic &&
                      projectTopic.trim().length >= 1 &&
                      projectTopic.trim().length < 10 && (
                        <motion.p
                          className="text-emerald-600 text-sm flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <ArrowDown className="w-4 h-4 mr-2 animate-bounce" />
                          We&apos;re excited to hear more! 💚
                        </motion.p>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Messages */}
              <AnimatePresence>
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl flex items-center text-lg font-medium bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-2 border-red-200"
                  >
                    <AlertCircle className="w-6 h-6 mr-3 text-red-500" />
                    {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <AnimatePresence>
                {shouldShowSubmitButton && (
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          {isEditMode
                            ? "Updating your submission..."
                            : "Recording your details..."}
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-3" />
                          {isEditMode
                            ? "Update My Topic ✨"
                            : "Submit My Topic ✨"}
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Colorful footer - only show with form */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center text-gray-600 text-lg">
                  <span>Made with</span>
                  <Heart className="w-5 h-5 mx-2 text-red-500 animate-pulse" />
                  <span>for easy submissions</span>
                </div>
              </motion.div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
