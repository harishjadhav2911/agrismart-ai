"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, Globe, ArrowRight, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";
import Link from "next/link";

interface LanguageOption {
  code: LanguageCode;
  flag: string;
  nativeTitle: string;
  englishLabel: string;
  subtitle: string;
  welcomeSnippet: string;
  badge: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "mr",
    flag: "🇮🇳",
    nativeTitle: "मराठी",
    englishLabel: "Marathi",
    subtitle: "महाराष्ट्रातील शेतकरी बांधवांसाठी",
    welcomeSnippet: "हवामान अंदाज, थेट बाजारभाव, रोग निदान आणि अचूक शेती सल्ला.",
    badge: "महाराष्ट्रातील शेतकऱ्यांची पहिली पसंती"
  },
  {
    code: "hi",
    flag: "🇮🇳",
    nativeTitle: "हिंदी",
    englishLabel: "Hindi",
    subtitle: "सभी किसान भाइयों के लिए",
    welcomeSnippet: "मौसम, लाइव मंडी भाव, फसल रोग पहचान और संपूर्ण कृषि समाधान।",
    badge: "सरल व आसान भाषा"
  },
  {
    code: "en",
    flag: "🇬🇧",
    nativeTitle: "English",
    englishLabel: "English",
    subtitle: "Smart Agriculture for Every Farmer",
    welcomeSnippet: "AI Crop Disease Detection, Real-time Mandi Rates, and Weather Advisories.",
    badge: "Global Standard"
  }
];

export default function LanguageSelectionPage() {
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language || "mr");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("agrismart_lang") as LanguageCode;
    if (saved && ["mr", "hi", "en"].includes(saved)) {
      setSelectedLang(saved);
    }
  }, []);

  const activeOption = LANGUAGE_OPTIONS.find(l => l.code === selectedLang) || LANGUAGE_OPTIONS[0];

  const handleSelectLanguage = (lang: LanguageCode) => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const handleProceed = () => {
    // 1. Save language preference permanently
    setLanguage(selectedLang);
    localStorage.setItem("agrismart_lang", selectedLang);
    localStorage.setItem("agrismart_lang_selected", "true");
    
    // 2. Navigate to Login / Signup as required:
    // Flow: Open platform -> Language Selection -> Select Language -> Login / Signup -> Home / Dashboard
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-900 px-4 py-8 relative overflow-hidden font-sans">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-emerald-200/80 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
      >
        {/* Top Banner Accent */}
        <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-primary-500 to-green-600" />

        <div className="p-6 sm:p-10">
          
          {/* Header / Branding */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              <BrandLogo size="lg" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200 dark:border-emerald-800/60">
              <Sparkles size={14} className="text-emerald-500" />
              <span>
                {selectedLang === "mr" 
                  ? "शेतकरी-प्रथम बहुभाषिक प्रणाली" 
                  : selectedLang === "hi" 
                  ? "किसान-प्रथम बहुभाषी प्रणाली" 
                  : "Farmer-First Multilingual Access"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {selectedLang === "mr" 
                ? "कृपया आपली भाषा निवडा" 
                : selectedLang === "hi" 
                ? "कृपया अपनी भाषा चुनें" 
                : "Please Select Your Language"}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2.5 max-w-lg leading-relaxed">
              {selectedLang === "mr"
                ? "अॅग्रीस्मार्ट एआय मध्ये प्रवेश करण्यासाठी भाषा निवडा. ही भाषा संपूर्ण प्लॅटफॉर्म आणि लॉगिनवर लागू होईल."
                : selectedLang === "hi"
                ? "एग्रीस्मार्ट एआई में प्रवेश करने के लिए भाषा चुनें। यह भाषा पूरे प्लेटफॉर्म और लॉगिन पर लागू होगी।"
                : "Please select your preferred language to enter AgriSmart AI. It will apply to Login, Signup, and all features."}
            </p>
          </div>

          {/* 3 Prominent Language Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = selectedLang === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelectLanguage(opt.code)}
                  className={`relative text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                      : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-white dark:hover:bg-gray-800"
                  }`}
                >
                  <div>
                    {/* Top Row: Flag & Indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl" role="img" aria-label={opt.englishLabel}>
                        {opt.flag}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                            : "border-2 border-gray-300 dark:border-gray-600 text-transparent"
                        }`}
                      >
                        <Check size={14} className="stroke-[3]" />
                      </div>
                    </div>

                    {/* Native Title */}
                    <div className="font-black text-xl text-gray-900 dark:text-white mb-0.5">
                      {opt.nativeTitle}
                    </div>
                    
                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                      {opt.englishLabel}
                    </div>

                    {/* Subtitle */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {opt.subtitle}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-gray-200/60 dark:border-gray-700/60">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block truncate">
                      {opt.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Language Preview Card */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 mb-7 flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 rounded-xl flex-shrink-0 mt-0.5">
              <Globe size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
                {selectedLang === "mr" ? "निवडलेल्या भाषेची झलक" : selectedLang === "hi" ? "चयनित भाषा की झलक" : "Selected Language Preview"}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                {activeOption.welcomeSnippet}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base transition-all shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {selectedLang === "mr" 
                  ? "भाषा निश्चित करा व लॉगिन करा (Continue)" 
                  : selectedLang === "hi" 
                  ? "भाषा चुनें और लॉगिन करें (Continue)" 
                  : "Select Language & Continue to Login"}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* New User Signup Link */}
          <div className="mt-4 text-center">
            <Link 
              href="/register" 
              onClick={() => {
                setLanguage(selectedLang);
                localStorage.setItem("agrismart_lang", selectedLang);
                localStorage.setItem("agrismart_lang_selected", "true");
              }}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {selectedLang === "mr" 
                ? "नवीन शेतकरी आहात? येथे नोंदणी करा (New Signup)" 
                : selectedLang === "hi" 
                ? "नए किसान हैं? यहाँ पंजीकरण करें (New Signup)" 
                : "New farmer? Register here"}
            </Link>
          </div>

          {/* Footer Hint */}
          <div className="text-center mt-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>
                {selectedLang === "mr"
                  ? "तुम्ही नंतरही वर दिलेल्या 🌐 चिन्हावर क्लिक करून भाषा बदलू शकता."
                  : selectedLang === "hi"
                  ? "आप बाद में भी ऊपर दिए गए 🌐 आइकन से कभी भी भाषा बदल सकते हैं।"
                  : "You can change your language anytime from the globe icon in the navigation bar."}
              </span>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
