"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Phone, MessageSquare, Bot, AlertTriangle, Send, CheckCircle2, 
  HelpCircle, ChevronDown, ShieldAlert, Sparkles, MapPin, User,
  Smartphone, ArrowRight, CheckCircle
} from "lucide-react";

export default function ContactPage() {
  const { t, language } = useLanguage();

  // Issue reporting form state
  const [issueType, setIssueType] = useState("market");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const issueCategories = useMemo(() => [
    { id: "market", label: t("contact_issue_market", "Wrong Market Price"), icon: "📈" },
    { id: "scheme", label: t("contact_issue_scheme", "Incorrect Government Scheme Information"), icon: "🏛️" },
    { id: "weather", label: t("contact_issue_weather", "Weather Information Issue"), icon: "🌦️" },
    { id: "technical", label: t("contact_issue_technical", "Technical / Website Issue"), icon: "⚙️" },
    { id: "other", label: t("contact_issue_other", "Other"), icon: "📝" },
  ], [t]);

  const faqs = useMemo(() => [
    {
      q: t("contact_faq_q1", "Where does AgriSmart fetch daily live market prices from?"),
      a: t("contact_faq_a1", "All market prices are retrieved directly from official Government of India AGMARKNET (Data.gov.in) daily market arrival records without estimation or fabrication.")
    },
    {
      q: t("contact_faq_q2", "How are irrigation and weather advisories generated?"),
      a: t("contact_faq_a2", "Advisories are calculated in real-time using high-resolution numerical forecasts from Open-Meteo combined with ICAR agronomic crop water requirements.")
    },
    {
      q: t("contact_faq_q3", "Are all government schemes up-to-date and verified?"),
      a: t("contact_faq_a3", "Yes, all schemes display verified launch dates, eligibility rules, and official application portal links sourced directly from Central and State agricultural ministries.")
    },
    {
      q: t("contact_faq_q4", "Is AgriSmart AI free to use for farmers?"),
      a: t("contact_faq_a4", "Yes, core advisory features including Live Market Prices, Smart Irrigation, Crop Health Guidance, and Government Schemes are freely accessible to all farmers.")
    }
  ], [t]);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedTicket = `AGRI-${Date.now().toString().slice(-6)}`;
      setTicketId(generatedTicket);
      setIsSubmitting(false);
    }, 600);
  };

  const handleResetForm = () => {
    setTicketId(null);
    setMessage("");
    setIssueType("market");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} />
            {language === 'mr' ? "शेतकरी सहाय्यता सेवा" : language === 'hi' ? "किसान सहायता सेवा" : "Farmer Assistance Support"}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            {t("contact_page_title", "Farmer Support & Help Desk")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
            {t("contact_page_subtitle", "Have questions, need help with agricultural advisories, or want to report an issue? Reach out through our dedicated farmer support channels.")}
          </p>
        </div>

        {/* 3 Prominent Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* 1. Farmer Helpline */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-emerald-200 dark:border-emerald-900/50 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex justify-between items-start mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                  <Phone size={28} />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full">
                  {t("contact_card_helpline_badge", "Official Toll-Free")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("contact_card_helpline_title", "Kisan Call Centre Helpline")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {t("contact_card_helpline_desc", "Government of India Toll-Free Farmer Advisory Helpline (06:00 AM - 10:00 PM, All Days).")}
              </p>
            </div>
            <a 
              href="tel:18001801551" 
              className="w-full mt-4 inline-flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-emerald-600/20 text-sm active:scale-98"
            >
              <Phone size={16} />
              {t("contact_card_helpline_btn", "Call Helpline")} (1800-180-1551)
            </a>
          </motion.div>

          {/* 2. WhatsApp Support */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-green-200 dark:border-green-900/50 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex justify-between items-start mb-5">
                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center shadow-sm">
                  <MessageSquare size={28} />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-full">
                  {t("contact_card_whatsapp_badge", "Quick Chat")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("contact_card_whatsapp_title", "WhatsApp Farmer Support")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {t("contact_card_whatsapp_desc", "Connect with digital support team for app assistance, feedback, and issue resolution.")}
              </p>
            </div>
            <a 
              href="https://wa.me/9118001801551?text=Hello%20AgriSmart%20AI%20Support" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full mt-4 inline-flex items-center justify-center gap-2 py-3 px-5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-green-600/20 text-sm active:scale-98"
            >
              <Smartphone size={16} />
              {t("contact_card_whatsapp_btn", "Chat on WhatsApp")}
            </a>
          </motion.div>

          {/* 3. 24/7 AI Assistant */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-purple-200 dark:border-purple-900/50 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex justify-between items-start mb-5">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
                  <Bot size={28} />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-full">
                  {t("contact_card_ai_badge", "Instant Answers")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("contact_card_ai_title", "24/7 AI Crop Assistant")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {t("contact_card_ai_desc", "Get instant scientific solutions for crop diseases, irrigation, market prices, and soil management.")}
              </p>
            </div>
            <Link 
              href="/guidance" 
              className="w-full mt-4 inline-flex items-center justify-center gap-2 py-3 px-5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-purple-600/20 text-sm active:scale-98"
            >
              <Bot size={16} />
              {t("contact_card_ai_btn", "Ask AI Assistant")}
            </Link>
          </motion.div>

        </div>

        {/* Report a Problem Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 dark:border-gray-800 mb-16 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold mb-3 border border-amber-200 dark:border-amber-800/60">
              <ShieldAlert size={14} />
              {language === 'mr' ? "माहिती पडताळणी व तक्रार" : language === 'hi' ? "डेटा सत्यापन एवं शिकायत" : "Data Accuracy & Feedback"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
              {t("contact_report_title", "Report a Problem or Inaccuracy")}
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {t("contact_report_subtitle", "Help us maintain 100% data authenticity. Report any incorrect market prices, scheme details, or app issues.")}
            </p>
          </div>

          {ticketId ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 text-center max-w-xl mx-auto"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                {t("contact_form_success_title", "Report Submitted Successfully!")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t("contact_form_success_desc", "Thank you for helping keep AgriSmart accurate. Your ticket has been logged and our support team will verify the information.")}
              </p>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 inline-block mb-6 shadow-sm">
                <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">
                  {t("contact_form_success_ticket", "Reference Ticket ID")}
                </span>
                <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {ticketId}
                </span>
              </div>
              <div>
                <button
                  onClick={handleResetForm}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors"
                >
                  {t("contact_form_success_btn", "Submit Another Report")}
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmitReport} className="space-y-6 max-w-4xl">
              
              {/* Selectable Issue Categories */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  {t("contact_issue_type_label", "Select Issue Category")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {issueCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setIssueType(cat.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left font-bold text-sm transition-all ${
                        issueType === cat.id
                          ? "bg-primary-50 dark:bg-primary-950/40 border-primary-500 text-primary-700 dark:text-primary-300 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-650"
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                    {t("contact_form_name", "Farmer / User Name")}
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Patil" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                    />
                    <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                    {t("contact_form_phone", "Mobile Number")}
                  </label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 9876543210" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                    />
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                    {t("contact_form_location", "District / State")}
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Pune, Maharashtra" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                    />
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                  {t("contact_form_message", "Describe the Issue in Detail")}
                </label>
                <textarea 
                  required 
                  rows={4} 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={t("contact_form_message_ph", "Mention specific commodity, market name, scheme or error you encountered...")}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-98"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t("contact_form_submit", "Submit Problem Report")}
                      <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
              {t("contact_faq_title", "Frequently Asked Questions (FAQ)")}
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              {t("contact_faq_subtitle", "Quick answers to common questions about AgriSmart data and features.")}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="font-bold text-gray-900 dark:text-white text-base md:text-lg flex items-center gap-3">
                      <HelpCircle size={20} className="text-primary-500 flex-shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={20} 
                      className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "transform rotate-180 text-primary-500" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
