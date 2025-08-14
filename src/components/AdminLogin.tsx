"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Lock, User, Sparkles, Shield, Star } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
}

// Floating particles component
const LoginFloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white/20 rounded-full"
        initial={{
          x:
            Math.random() *
            (typeof window !== "undefined" ? window.innerWidth : 1920),
          y:
            Math.random() *
            (typeof window !== "undefined" ? window.innerHeight : 1080),
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          x:
            Math.random() *
            (typeof window !== "undefined" ? window.innerWidth : 1920),
          y:
            Math.random() *
            (typeof window !== "undefined" ? window.innerHeight : 1080),
          scale: [0.5, 1.5, 0.5],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (username === "florence" && password === "admin") {
      onLogin();
    } else {
      setError("Invalid credentials. Please check your username and password.");
    }

    setIsLoading(false);
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 30px rgba(124, 58, 237, 0.3)",
      borderColor: "rgba(124, 58, 237, 0.5)",
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0px rgba(124, 58, 237, 0)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
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
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <LoginFloatingElements />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Login Card */}
        <motion.div
          className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-3xl shadow-2xl p-10 relative overflow-hidden"
          whileHover={{
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative elements */}
          <motion.div
            className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-8 left-6 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center items-center space-x-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Star className="w-6 h-6 text-purple-400" />
              </motion.div>
            </div>

            <motion.h1
              className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-3"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Admin Portal
            </motion.h1>
            <p className="text-slate-300/80 text-lg">
              Secure access to your dashboard
            </p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Username Field */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-center text-sm font-medium text-slate-200 mb-2">
                <User className="w-4 h-4 mr-2 text-blue-400" />
                Username
              </label>
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
                initial="blur"
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center text-sm font-medium text-slate-200 mb-2">
                <Lock className="w-4 h-4 mr-2 text-purple-400" />
                Password
              </label>
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
                initial="blur"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-6 py-4 pr-14 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="p-4 bg-red-500/10 border border-red-400/30 rounded-2xl text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white font-bold py-5 px-8 rounded-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl text-lg group"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                      />
                      Authenticating...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
                    >
                      <Shield className="w-6 h-6 mr-3" />
                      Access Dashboard
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Footer Info */}
          <motion.div
            className="mt-8 pt-6 border-t border-white/[0.08] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-slate-400 text-sm">
              Secure login • Advanced encryption • Protected access
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          className="mt-8 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
      </motion.div>
    </div>
  );
}
