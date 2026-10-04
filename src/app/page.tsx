"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Sprout,
  Bug,
  CloudSun,
  Landmark,
  TrendingUp,
  Droplets,
  LayoutDashboard,
  ChevronRight,
  Star,
  Leaf,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BellRing,
  Check,
  Globe,
  Activity,
  Cpu
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BrandLogo from "@/components/BrandLogo";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

const LANGUAGE_OPTIONS: { code: LanguageCode; native: string; label: string; flag: string }[] = [
  { code: "mr", native: "मराठी", label: "Marathi", flag: "🇮🇳" },
  { code: "hi", native: "हिंदी", label: "Hindi", flag: "🇮🇳" },
  { code: "en", native: "English", label: "English", flag: "🇬🇧" },
];

export default function HomePage() {
  const { t, language, setLanguage } = useLanguage();

  // Core feature modules of AgriSmart AI
  const coreFeatures = [
    {
      icon: Bot,
      title: t("f_ai_title", "AI Farming Assistant"),
      description: t("f_ai_desc", "Get instant 24/7 farming advice, fertilizer schedules, and pest solutions in your local language."),
      href: "/guidance",
      badge: language === "mr" ? "२४/७ कृषी सल्लागार" : language === "hi" ? "२४/७ कृषि सलाहकार" : "24/7 AI Guidance",
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
    },
    {
      icon: Sprout,
      title: t("f_crop_title", "Crop Recommendation"),
      description: t("f_crop_desc", "AI-driven suggestions for the most profitable crops based on your soil NPK, rainfall, and climate."),
      href: "/crop-recommendation",
      badge: language === "mr" ? "माती व हंगामानुसार" : language === "hi" ? "मिट्टी व मौसम अनुसार" : "Soil & Climate Match",
      color: "from-green-500 to-emerald-600",
      accentBg: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/60"
    },
    {
      icon: Bug,
      title: t("f_disease_title", "Crop Disease Detection"),
      description: t("f_disease_desc", "Snap a photo of any crop leaf to instantly identify diseases and get certified ICAR/CIBRC treatments."),
      href: "/disease-detection",
      badge: language === "mr" ? "९८% अचूक निदान" : language === "hi" ? "९८% सटीक पहचान" : "98% AI Precision",
      color: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
    },
    {
      icon: CloudSun,
      title: t("f_weather_title", "Hyperlocal Weather"),
      description: t("f_weather_desc", "Hyper-local, highly accurate rainfall, temperature, and spray suitability forecasts for your farm."),
      href: "/weather",
      badge: language === "mr" ? "थेट पाऊस अंदाज" : language === "hi" ? "सटीक मौसम अपडेट" : "Rain & Wind Radar",
      color: "from-blue-500 to-cyan-600",
      accentBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60"
    },
    {
      icon: TrendingUp,
      title: t("f_market_title", "Live Mandi & Market Prices"),
      description: t("f_market_desc", "Official real-time APMC/Agmarknet mandi prices, trend analysis, and highest price forecasts."),
      href: "/market",
      badge: language === "mr" ? "थेट बाजारभाव" : language === "hi" ? "लाइव मंडी भाव" : "Live Agmarknet Rates",
      color: "from-indigo-500 to-blue-600",
      accentBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60"
    },
    {
      icon: Landmark,
      title: t("f_gov_title", "Government Schemes & Subsidies"),
      description: t("f_gov_desc", "Stay updated on PM-Kisan, drip irrigation subsidies, solar pumps, and government grant schemes."),
      href: "/schemes",
      badge: language === "mr" ? "सबसिडी व योजना" : language === "hi" ? "सब्सिडी और योजनाएं" : "Subsidies & Grants",
      color: "from-purple-500 to-violet-600",
      accentBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60"
    },
    {
      icon: Droplets,
      title: t("nav_irrigation", "Smart Irrigation Management"),
      description: language === "mr" 
        ? "पिकाची दैनंदिन पाण्याची गरज व ठिबक सिंचनाचे अचूक वेळापत्रक तयार करून ४०% पाणी वाचवा." 
        : language === "hi" 
        ? "फसल की दैनिक जल आवश्यकता और ड्रिप सिंचाई के सटीक समय से 40% तक पानी बचाएं।" 
        : "Automate crop water requirements and optimize drip irrigation schedules to save up to 40% water.",
      href: "/smart-irrigation",
      badge: language === "mr" ? "पाणी बचत तंत्रज्ञान" : language === "hi" ? "जल बचत तकनीक" : "Water Optimization",
      color: "from-sky-500 to-blue-600",
      accentBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60"
    },
    {
      icon: LayoutDashboard,
      title: t("nav_dashboard", "Farmer Central Dashboard"),
      description: language === "mr" 
        ? "तुमच्या शेताचे संपूर्ण व्यवस्थापन, माती आरोग्य, हवामान सूचना आणि बाजारभाव एकाच ठिकाणी." 
        : language === "hi" 
        ? "अपने खेत का पूरा प्रबंधन, मिट्टी स्वास्थ्य, मौसम अलर्ट और मंडी भाव एक ही स्थान पर।" 
        : "Unified farm command center for soil health monitoring, field activities, and urgent alerts.",
      href: "/dashboard",
      badge: language === "mr" ? "एकात्मिक डॅशबोर्ड" : language === "hi" ? "एकीकृत डैशबोर्ड" : "Unified Platform",
      color: "from-rose-500 to-pink-600",
      accentBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
    }
  ];

  // Impact statistics
  const stats = [
    { value: "50,000+", label: t("stats_farmers", "Happy Farmers") },
    { value: "120+", label: t("stats_crops", "Crop Varieties") },
    { value: "98%", label: t("stats_acc", "Prediction Accuracy") },
    { value: "15+", label: t("stats_lang", "Languages Supported") }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Suresh Patil (सुरेश पाटील)",
      role: language === "mr" ? "द्राक्ष व ऊस बागायतदार, नाशिक, महाराष्ट्र" : language === "hi" ? "अंगूर व गन्ना किसान, नाशिक, महाराष्ट्र" : "Grape & Sugarcane Farmer, Nashik, Maharashtra",
      comment: language === "mr"
        ? "अॅग्रीस्मार्ट एआय मुळे माझ्या द्राक्ष बागेतील डाऊनी मिल्ड्यू रोगाचे २ दिवस आधीच अचूक निदान झाले. फवारणीच्या योग्य डोसमुळे माझे ५०,००० रुपयांचे नुकसान टळले!"
        : language === "hi"
        ? "एग्रीस्मार्ट एआई से मेरे अंगूर के बाग में डाउनी मिल्ड्यू रोग की तुरंत पहचान हुई। सही समय पर छिड़काव से भारी नुकसान बच गया!"
        : "AgriSmart AI detected Downy Mildew on my grape bunches immediately from a photo. The exact CIBRC dosage saved my entire harvest!",
      rating: 5
    },
    {
      name: "Rajesh Kumar (राजेश कुमार)",
      role: language === "mr" ? "गहू व मोहरी उत्पादक शेतकरी, पंजाब" : language === "hi" ? "गेहूं व सरसों किसान, पंजाब" : "Wheat & Mustard Farmer, Punjab",
      comment: language === "mr"
        ? "थेट बाजारभाव आणि ट्रेंड अंदाजामुळे मी गहू योग्य वेळी विकला आणि क्विंटलमागे २०० रुपये जास्त नफा मिळाला."
        : language === "hi"
        ? "लाइव मंडी भाव और मूल्य पूर्वानुमान के कारण मैंने अपनी उपज सही समय पर बेची और प्रति क्विंटल ₹200 अधिक मुनाफा प्राप्त किया।"
        : "Real-time Agmarknet mandi trends helped me choose the best selling window, earning ₹200 extra per quintal on my wheat crop.",
      rating: 5
    },
    {
      name: "Lakshmi Devi (लक्ष्मी देवी)",
      role: language === "mr" ? "भाताच्या शेतीतील महिला शेतकरी, आंध्र प्रदेश" : language === "hi" ? "धान किसान, आंध्र प्रदेश" : "Paddy Farmer, Andhra Pradesh",
      comment: language === "mr"
        ? "एआय सहाय्यक माझ्या मातृभाषेत बोलतो आणि खतांचा योग्य वापर सांगतो. हे प्रत्येक शेतकऱ्याच्या खिशात असलेला कृषी तज्ज्ञ आहे."
        : language === "hi"
        ? "एआई सहायक मेरी भाषा में बात करता है और सही खाद की मात्रा बताता है। हर किसान के लिए यह वरदान है।"
        : "The AI voice assistant answers all my fertilizer questions in my own language. It's like having a senior agriculture officer always in my pocket.",
      rating: 5
    }
  ];

  const headlineFirst = t("hero_title1", "Smart Agriculture");
  const headlineSecond = t("hero_title2", "for Every Farmer");

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 font-sans transition-colors selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* Main Content Area starting directly below the fixed 72px/80px Navbar */}
      <div className="pt-[72px] sm:pt-20 flex flex-col">
        
        {/* 1. TOP DEDICATED LANGUAGE SELECTION BAR (Full-width, clearly visible, never overlapping) */}
        <div className="w-full bg-gradient-to-r from-gray-950 via-emerald-950 to-gray-950 text-white border-b border-emerald-800/60 px-4 py-3 sm:py-3.5 shadow-lg relative z-40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Label / Title */}
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                <Globe size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                  {language === "mr" 
                    ? "कृपया आपली भाषा निवडा" 
                    : language === "hi" 
                    ? "कृपया अपनी भाषा चुनें" 
                    : "Please Select Your Language"}
                </h2>
                <p className="text-[11px] text-emerald-300/80 hidden sm:block font-medium">
                  {language === "mr" 
                    ? "निवडलेली भाषा संपूर्ण प्लॅटफॉर्म आणि डॅशबोर्डवर लागू होईल" 
                    : language === "hi" 
                    ? "चयनित भाषा पूरे प्लेटफॉर्म और डैशबोर्ड पर लागू होगी" 
                    : "Selected language applies to the entire platform & dashboard"}
                </p>
              </div>
            </div>

            {/* 3 Interactive Language Selector Buttons */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 bg-black/70 p-1.5 rounded-2xl border border-emerald-700/50 backdrop-blur-md w-full sm:w-auto">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLanguage(opt.code)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/50 scale-[1.02] border border-emerald-300/60 ring-2 ring-emerald-400/20"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-base">{opt.flag}</span>
                    <span>{opt.native}</span>
                    {isSelected && <Check size={14} className="stroke-[3] text-emerald-200" />}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

      {/* Top Advisory Ticker */}
      <div className="bg-emerald-700 dark:bg-emerald-950 text-white text-xs sm:text-sm font-medium py-2 px-4 border-b border-emerald-600/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-2 flex-shrink-0 font-bold bg-emerald-800 dark:bg-emerald-900 px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
            <BellRing size={13} className="text-amber-300 animate-pulse" />
            <span>{language === "mr" ? "थेट सूचना" : language === "hi" ? "लाइव अलर्ट" : "Live Alert"}</span>
          </div>
          <div className="truncate flex-grow text-emerald-50">
            {language === "mr"
              ? "📢 खरीप व रब्बी हंगामासाठी खतांचे अधिकृत दर व हवामानानुसार फवारणी सल्ला अद्ययावत करण्यात आला आहे."
              : language === "hi"
              ? "📢 खरीफ व रबी मौसम के लिए उर्वरक के आधिकारिक रेट एवं मौसम अनुसार छिड़काव परामर्श अपडेट किया गया है।"
              : "📢 Official crop weather advisories, seasonal fertilizer schedules, and Agmarknet mandi rates updated live."}
          </div>
          <Link
            href="/weather"
            className="hidden sm:inline-flex items-center gap-1 font-bold underline hover:text-emerald-200 flex-shrink-0 text-xs"
          >
            <span>{language === "mr" ? "पहा" : language === "hi" ? "देखें" : "View Forecast"}</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* 2. HERO SECTION WITH PROFESSIONAL AGRICULTURE BACKGROUND IMAGE */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        
        {/* Realistic Indian Agriculture Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/hero-bg.jpg"
            alt="Indian Agriculture & Smart Farming"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
            sizes="100vw"
            quality={90}
          />
          {/* Subtle Dark/Green Gradient Overlay for High Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/85 via-emerald-950/80 to-gray-950/95 dark:from-black/90 dark:via-emerald-950/85 dark:to-black/95 backdrop-blur-[1px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              {/* Top Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 text-xs sm:text-sm font-bold mb-6 border border-emerald-500/40 shadow-lg backdrop-blur-md">
                <Leaf size={15} className="text-emerald-400" />
                <span>{t("hero_tag", "Empowering Agriculture with AI")}</span>
                <Sparkles size={13} className="text-amber-400 ml-0.5" />
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] mb-6 drop-shadow-md">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300">
                  {headlineFirst}
                </span>{" "}
                <span>{headlineSecond}</span>
              </h1>

              {/* Farmer-Friendly Subtitle */}
              <p className="text-base sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-sm">
                {t("hero_sub", "AI-powered farming guidance, weather updates, crop recommendations, government schemes, and multilingual support.")}
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-xl mx-auto mb-12">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-emerald-600/40 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{t("btn_get_started", "Get Started")}</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/guidance"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900/90 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold text-base border border-gray-700 shadow-md backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Bot size={20} className="text-emerald-400" />
                  <span>{t("btn_talk_ai", "Talk to AI Assistant")}</span>
                </Link>

                <Link
                  href="/disease-detection"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-6 py-4 rounded-2xl font-bold text-sm border border-amber-500/40 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Bug size={18} className="text-amber-400" />
                  <span>{language === "mr" ? "रोग स्कॅन करा" : language === "hi" ? "रोग स्कैन करें" : "Scan Crop Leaf"}</span>
                </Link>
              </div>

              {/* Micro Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-gray-800/80 text-left">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-950/70 border border-emerald-900/50 backdrop-blur-md shadow-sm">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-200">
                    {language === "mr" ? "ICAR व CIBRC प्रमाणित" : language === "hi" ? "ICAR व CIBRC प्रमाणित" : "ICAR & CIBRC Aligned"}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-950/70 border border-blue-900/50 backdrop-blur-md shadow-sm">
                  <Activity size={16} className="text-blue-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-200">
                    {language === "mr" ? "थेट Agmarknet बाजारभाव" : language === "hi" ? "लाइव Agmarknet भाव" : "Official Agmarknet Rates"}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-950/70 border border-purple-900/50 backdrop-blur-md shadow-sm">
                  <Cpu size={16} className="text-purple-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-200">
                    {language === "mr" ? "मराठी, हिंदी व इंग्रजी" : language === "hi" ? "मराठी, हिंदी व अंग्रेजी" : "Marathi, Hindi & English"}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-950/70 border border-teal-900/50 backdrop-blur-md shadow-sm">
                  <ShieldCheck size={16} className="text-teal-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-200">
                    {language === "mr" ? "१००% मोफत व सुरक्षित" : language === "hi" ? "१००% मुफ्त व सुरक्षित" : "100% Free & Secure"}
                  </span>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Services & Features Grid */}
      <section id="features" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <span>{language === "mr" ? "एआय कृषी प्रणाली" : language === "hi" ? "एआई कृषि प्रणाली" : "Smart Farming Modules"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              {t("feat_title", "Powerful Features for Modern Farming")}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("feat_sub", "Everything you need to increase your yield and maximize your profits in one intelligent platform.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, index) => {
              const IconComp = feature.icon;
              return (
                <Link 
                  href={feature.href} 
                  key={index} 
                  className="group block cursor-pointer"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="bg-white dark:bg-gray-800 p-6 sm:p-7 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-200/80 dark:border-gray-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-1.5 transition-all flex flex-col justify-between h-full relative overflow-hidden"
                  >
                    {/* Top Accent Pill */}
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className={`w-13 h-13 rounded-2xl flex items-center justify-center p-3 bg-gradient-to-br ${feature.color} text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform`}>
                          <IconComp size={24} />
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${feature.accentBg}`}>
                          {feature.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {feature.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-normal">
                        {feature.description}
                      </p>
                    </div>

                    {/* Card Footer Link */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                      <span>{language === "mr" ? "सविस्तर पहा" : language === "hi" ? "विस्तार से देखें" : "Explore Module"}</span>
                      <ChevronRight size={16} />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* How It Works - 3 Step Flow */}
      <section className="py-20 bg-white dark:bg-gray-950 border-y border-gray-200/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
              {language === "mr" 
                ? "अॅग्रीस्मार्ट एआय कसे कार्य करते?" 
                : language === "hi" 
                ? "एग्रीस्मार्ट एआई कैसे काम करता है?" 
                : "How AgriSmart AI Works"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {language === "mr"
                ? "३ सोप्या टप्प्यांत मिळवा अचूक शेती मार्गदर्शन आणि वाढवा नफा."
                : language === "hi"
                ? "३ सरल चरणों में पाएं सटीक कृषि मार्गदर्शन और बढ़ाएं मुनाफा।"
                : "Get precision farming advice and maximize your yields in 3 simple steps."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-600/30">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {language === "mr" ? "१. भाषा व पीक निवडा" : language === "hi" ? "१. भाषा और फसल चुनें" : "1. Select Language & Farm"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {language === "mr"
                  ? "मराठी, हिंदी किंवा इंग्रजी भाषा निवडून तुमच्या जिल्ह्याची व पिकाची माहिती नोंदवा."
                  : language === "hi"
                  ? "मराठी, हिंदी या अंग्रेजी भाषा चुनकर अपने जिले और फसल का चयन करें।"
                  : "Choose Marathi, Hindi, or English to receive localized advisories for your district and crops."}
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-600/30">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {language === "mr" ? "२. फोटो काढा किंवा प्रश्न विचारा" : language === "hi" ? "२. फोटो लें या प्रश्न पूछें" : "2. Snap Photo or Ask AI"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {language === "mr"
                  ? "पानावरील रोगाचा फोटो अपलोड करा किंवा खतांच्या प्रमाणाबाबत एआय सल्लागाराशी बोला."
                  : language === "hi"
                  ? "पत्ती की फोटो अपलोड करें या उर्वरक मात्रा के लिए एआई से सीधे पूछें।"
                  : "Upload a diseased leaf photo or chat with the 24/7 AI Agricultural Advisor."}
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-600/30">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {language === "mr" ? "३. अचूक उपाय व अधिक नफा" : language === "hi" ? "३. सटीक उपाय व अधिक मुनाफा" : "3. Apply Solution & Prosper"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {language === "mr"
                  ? "प्रमाणित रासायनिक/सेंद्रिय डोस फवारा, योग्य बाजारभाव पहा आणि पिकाचे उत्पादन वाढवा."
                  : language === "hi"
                  ? "प्रमाणित रासायनिक/जैविक उपाय अपनाएं, सही मंडी भाव देखें और रिकॉर्ड उत्पादन पाएं।"
                  : "Apply certified remedies, monitor live Agmarknet mandi rates, and harvest maximum yield."}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-emerald-950 dark:bg-black text-white border-y border-emerald-900 dark:border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-800/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 sm:p-6 rounded-2xl bg-emerald-900/30 border border-emerald-800/50 backdrop-blur-sm">
                <div className="text-3xl sm:text-5xl font-black text-emerald-400 mb-2 tracking-tight">{stat.value}</div>
                <div className="text-emerald-100 font-semibold text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Star size={13} className="fill-emerald-500 text-emerald-500" />
              <span>{language === "mr" ? "शेतकऱ्यांचे अनुभव" : language === "hi" ? "किसानों के अनुभव" : "Farmer Success Stories"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              {t("test_title", "Trusted by Farmers Nationwide")}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              {t("test_sub", "See how AgriSmart AI is transforming lives across the country.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="bg-emerald-50/40 dark:bg-gray-900/90 p-8 rounded-3xl border border-emerald-100/80 dark:border-gray-800 flex flex-col justify-between shadow-lg shadow-gray-200/40 dark:shadow-none"
              >
                <div>
                  <div className="flex text-amber-400 mb-5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed italic mb-6">
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>
                </div>
                
                <div className="pt-4 border-t border-emerald-100 dark:border-gray-800">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">{testimonial.name}</h4>
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold mt-0.5">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* High-Impact Call to Action */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            <span>{language === "mr" ? "आताच जोडले जा" : language === "hi" ? "अभी जुड़ें" : "Join Today"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight leading-tight">
            {t("cta_title", "Ready to transform your farm?")}
          </h2>
          
          <p className="text-lg sm:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("cta_sub", "Join thousands of successful farmers using AgriSmart AI today.")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-9 py-4 rounded-2xl font-bold text-base transition-all shadow-2xl hover:scale-[1.02] cursor-pointer"
            >
              <span>{t("cta_btn", "Get Started for Free")}</span>
              <ArrowRight size={18} />
            </Link>

            <Link 
              href="/guidance" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-800/60 hover:bg-emerald-800/90 text-white border border-white/30 px-8 py-4 rounded-2xl font-bold text-base transition-all backdrop-blur-sm cursor-pointer"
            >
              <Bot size={18} />
              <span>{language === "mr" ? "एआय कृषी सल्लागार" : language === "hi" ? "एआई कृषि सलाहकार" : "Try AI Chatbot"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-950 text-gray-400 py-14 border-t border-gray-800 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Column 1: Brand & Mission */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <BrandLogo size="md" />
              </div>
              <p className="text-sm text-gray-400 max-w-md leading-relaxed mb-6 font-normal">
                {language === "mr"
                  ? "अॅग्रीस्मार्ट एआय - भारतीय शेतकऱ्यांसाठी कृत्रिम बुद्धिमत्ता (AI) आधारित आधुनिक तंत्रज्ञान. पीक रोग निदान, अचूक खत सल्ला, थेट बाजारभाव व हवामान अंदाज."
                  : language === "hi"
                  ? "एग्रीस्मार्ट एआई - भारतीय किसानों के लिए कृत्रिम बुद्धिमत्ता (AI) आधारित आधुनिक तकनीक। फसल रोग पहचान, सटीक उर्वरक सलाह, लाइव मंडी भाव व मौसम पूर्वानुमान।"
                  : "Empowering farmers with artificial intelligence for crop disease diagnosis, precision fertilizer management, live Agmarknet mandi rates, and hyper-local weather predictions."}
              </p>
              <div className="flex items-center gap-3 text-xs text-emerald-400 font-semibold">
                <ShieldCheck size={16} />
                <span>CIBRC & ICAR Certified Agricultural Protocols</span>
              </div>
            </div>
            
            {/* Column 2: Core Platform Links */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 tracking-wide">
                {language === "mr" ? "महत्त्वाच्या सेवा" : language === "hi" ? "प्रमुख सेवाएं" : "Core Modules"}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/guidance" className="hover:text-emerald-400 transition-colors">{t("nav_ai_assistant", "AI Assistant")}</Link></li>
                <li><Link href="/disease-detection" className="hover:text-emerald-400 transition-colors">{t("nav_disease", "Disease Detection")}</Link></li>
                <li><Link href="/crop-recommendation" className="hover:text-emerald-400 transition-colors">{t("nav_crop_rec", "Crop Recommendation")}</Link></li>
                <li><Link href="/weather" className="hover:text-emerald-400 transition-colors">{t("nav_weather", "Weather Forecast")}</Link></li>
                <li><Link href="/market" className="hover:text-emerald-400 transition-colors">{t("nav_market", "Market Prices")}</Link></li>
                <li><Link href="/schemes" className="hover:text-emerald-400 transition-colors">{t("nav_gov", "Government Schemes")}</Link></li>
                <li><Link href="/smart-irrigation" className="hover:text-emerald-400 transition-colors">{t("nav_irrigation", "Smart Irrigation")}</Link></li>
              </ul>
            </div>

            {/* Column 3: Farmers Support & Language */}
            <div>
              <h3 className="text-white font-bold text-base mb-4 tracking-wide">
                {language === "mr" ? "मदत व संपर्क" : language === "hi" ? "सहायता व संपर्क" : "Farmer Support"}
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">{t("nav_dashboard", "Farmer Dashboard")}</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">{t("nav_contact", "Contact Support")}</Link></li>
                <li className="pt-2">
                  <span className="text-xs text-gray-500 block">{language === "mr" ? "शेतकरी हेल्पलाइन:" : language === "hi" ? "किसान हेल्पलाइन:" : "Kisan Helpline:"}</span>
                  <span className="text-sm font-bold text-emerald-400">1800-180-1551</span>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-gray-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-3">
            <p>&copy; {new Date().getFullYear()} AgriSmart AI. {language === "mr" ? "सर्व हक्क राखीव." : language === "hi" ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}</p>
            <p className="flex items-center gap-1">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>for Indian Farmers (भारतीय शेतकऱ्यांसाठी)</span>
            </p>
          </div>

        </div>
      </footer>
      </div>
    </div>
  );
}
