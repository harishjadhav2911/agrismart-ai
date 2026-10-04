"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import BrandLogo from "@/components/BrandLogo";

export default function ForgotPasswordPage() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call for password reset
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-8">
            <div className="mb-6">
              <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                {t("login_back_btn", "Back to login")}
              </Link>
            </div>

            <div className="text-center mb-8 flex flex-col items-center">
              <BrandLogo size="lg" className="mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("forgot_title", "Reset Password")}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                {t("forgot_sub", "Enter your email and we'll send you instructions to reset your password.")}
              </p>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-2xl text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full text-green-600 dark:text-green-300 mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">
                  {t("forgot_check_email", "Check your email")}
                </h3>
                <p className="text-green-700 dark:text-green-400 text-sm mb-6">
                  {t("forgot_sent_desc", "We've sent a password reset link to your email address.")}
                </p>
                <Link 
                  href="/login"
                  className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all"
                >
                  {t("forgot_return", "Return to Login")}
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("login_email")}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                      placeholder="farmer@agrismart.com"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !email}
                  className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    t("forgot_btn", "Send Reset Link")
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
