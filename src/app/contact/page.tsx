"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{t("contact_title")}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Have questions about AgriSmart AI, government schemes, or need technical support? Our farmer support team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex items-start gap-4">
              <div className="p-3 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-2xl">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Farmer Helpline</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Toll-free, available 24/7 in 10 languages.</p>
                <a href="tel:18001201011" className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:underline">1800-120-1011</a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email Support</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Drop us an email. We reply within 24 hours.</p>
                <a href="mailto:support@agrismart.ai" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline">support@agrismart.ai</a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex items-start gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-2xl">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Head Office</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  AgriSmart Innovations HQ<br/>
                  Sector 45, Cyber Hub,<br/>
                  Gurugram, Haryana 122003<br/>
                  India
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden"
          >
            {isSubmitted ? (
              <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-8 z-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle2 size={80} className="text-green-500 mb-6" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                  Thank you for reaching out. A member of our support team will contact you shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("contact_msg")}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input type="text" required placeholder="John Doe" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone / Mobile</label>
                      <input type="tel" required placeholder="+91 9876543210" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition-all" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address (Optional)</label>
                    <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                    <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition-all">
                      <option>Technical Support</option>
                      <option>Government Scheme Inquiry</option>
                      <option>App Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Message</label>
                    <textarea required rows={4} placeholder="How can we help you?" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white transition-all resize-none"></textarea>
                  </div>

                  <button type="submit" className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                    Send Message <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>

        {/* FAQs Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Looking for quick answers?</p>
          <a href="#" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
            <HelpCircle size={18} /> Visit our Frequently Asked Questions
          </a>
        </div>
      </main>
    </div>
  );
}
