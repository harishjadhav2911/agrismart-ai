"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, Droplets, ThermometerSun, ShieldAlert, CheckCircle2, 
  ArrowLeft, Calendar, Award, Beaker, Bug, ShieldCheck, 
  Printer, Sparkles, Bot, X, ArrowRight, BookOpen, AlertTriangle, Info
} from "lucide-react";
import { getCropGuide, CropGuideData } from "@/data/cropGuides";
import { useLanguage } from "@/context/LanguageContext";
import { useGeminiChat } from "@/hooks/useGeminiChat";
import { FormattedChatMessage } from "@/components/chat/FormattedChatMessage";

function GuideContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  
  const cropParam = searchParams.get("crop") || "Cotton";
  const stateParam = searchParams.get("state") || "";
  const seasonParam = searchParams.get("season") || "";

  const guide: CropGuideData = getCropGuide(cropParam);
  
  const [activeTab, setActiveTab] = useState<"overview" | "sowing" | "irrigation" | "fertilizer" | "protection" | "harvest">("overview");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading: isChatLoading, sendMessage } = useGeminiChat(
    `Comprehensive Cultivation Guide for ${guide.cropName} (${guide.marathiName} / ${guide.hindiName}) in ${stateParam || 'India'} (${seasonParam || guide.idealSeason})`,
    "guide_chat_welcome"
  );

  useEffect(() => {
    if (isChatOpen) {
      chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatLoading, isChatOpen]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button 
            onClick={() => router.push("/crop-recommendation")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft size={18} /> {language === 'mr' ? '← पीक शिफारसीवर परत जा' : language === 'hi' ? '← फसल सुझाव पर वापस जाएं' : '← Back to Crop Recommendation'}
          </button>

          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Printer size={16} /> {language === 'mr' ? 'प्रिंट / PDF सेव्ह करा' : language === 'hi' ? 'प्रिंट / PDF सहेजें' : 'Print / Save PDF'}
            </button>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="px-4 py-2 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all shadow-md shadow-primary-500/20 flex items-center gap-2"
            >
              <Bot size={16} /> {language === 'mr' ? `AI सल्लागार (${guide.marathiName})` : language === 'hi' ? `AI सलाहकार (${guide.hindiName})` : `Ask AI Advisor`}
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-700 via-primary-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden mb-8"
        >
          <div className="absolute right-0 top-0 opacity-10 translate-x-10 -translate-y-10 pointer-events-none">
            <Sprout size={280} />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-primary-100">
                {guide.category}
              </span>
              <span className="px-3 py-1 bg-emerald-500/30 border border-emerald-400/40 rounded-full text-xs font-semibold text-emerald-200 flex items-center gap-1">
                <Sparkles size={12} /> {language === 'mr' ? 'ICAR व कृषी विद्यापीठ शिफारशीत मार्गदर्शिका' : language === 'hi' ? 'ICAR एवं कृषि विश्वविद्यालय प्रमाणित मार्गदर्शिका' : 'ICAR & SAU Agronomic Reference'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
              {language === 'mr' ? guide.marathiName : language === 'hi' ? guide.hindiName : guide.cropName} 
              <span className="text-2xl sm:text-3xl font-medium text-primary-200 ml-2">
                ({language === 'mr' ? guide.cropName : guide.marathiName})
              </span>
            </h1>
            <p className="text-sm font-mono text-primary-200 italic mb-4">
              Botanical Name: {guide.scientificName}
            </p>
            <p className="text-primary-100 text-base sm:text-lg leading-relaxed mb-6">
              {guide.overview}
            </p>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="text-xs text-primary-200 flex items-center gap-1 mb-1">
                  <Calendar size={13} /> {language === 'mr' ? 'लागवड हंगाम' : language === 'hi' ? 'बुवाई का मौसम' : 'Sowing Season'}
                </div>
                <div className="font-bold text-xs sm:text-sm line-clamp-1">{seasonParam || guide.idealSeason}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="text-xs text-primary-200 flex items-center gap-1 mb-1">
                  <Award size={13} /> {language === 'mr' ? 'पीक कालावधी' : language === 'hi' ? 'फसल अवधि' : 'Crop Duration'}
                </div>
                <div className="font-bold text-xs sm:text-sm">{guide.durationDays}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="text-xs text-primary-200 flex items-center gap-1 mb-1">
                  <Sprout size={13} /> {language === 'mr' ? 'उत्पादन (बागायत)' : language === 'hi' ? 'उत्पादन (सिंचित)' : 'Yield (Irrigated)'}
                </div>
                <div className="font-bold text-xs sm:text-sm line-clamp-1">{guide.expectedYieldRange.irrigated.split('(')[0]}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="text-xs text-primary-200 flex items-center gap-1 mb-1">
                  <Droplets size={13} /> {language === 'mr' ? 'पाण्याची गरज' : language === 'hi' ? 'जल आवश्यकता' : 'Water Need'}
                </div>
                <div className="font-bold text-xs sm:text-sm">{guide.waterRequirementMm}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Environmental Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <ThermometerSun size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {language === 'mr' ? 'अनुकूल तापमान' : language === 'hi' ? 'अनुकूल तापमान' : 'Optimal Temperature'}
              </div>
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-0.5">{guide.climateTemp}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Droplets size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {language === 'mr' ? 'मातीचा सामू (pH)' : language === 'hi' ? 'मिट्टी का पीएच (pH)' : 'Soil pH Range'}
              </div>
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-0.5">{guide.optimalPh}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Beaker size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {language === 'mr' ? 'योग्य जमिनीचा प्रकार' : language === 'hi' ? 'उपयुक्त मिट्टी' : 'Ideal Soil Classification'}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-0.5 line-clamp-2">{guide.soilType}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Award size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {language === 'mr' ? 'उत्पादन क्षमता' : language === 'hi' ? 'उत्पादन दायरा' : 'Yield Spectrum'}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                {guide.expectedYieldRange.rainfed ? `Rainfed: ${guide.expectedYieldRange.rainfed.split('(')[0]}` : `Irrigated: ${guide.expectedYieldRange.irrigated.split('(')[0]}`}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-1.5 border border-gray-200 dark:border-gray-800 shadow-sm mb-8 overflow-x-auto flex gap-1 scrollbar-none">
          {[
            { 
              id: "overview", 
              label: language === 'mr' ? "१. जमीन व मशागत" : language === 'hi' ? "१. भूमि एवं जुताई" : "1. Land & Soil", 
              icon: Sprout 
            },
            { 
              id: "sowing", 
              label: language === 'mr' ? "२. पेरणी व बीजप्रक्रिया" : language === 'hi' ? "२. बुवाई एवं बीज उपचार" : "2. Sowing & Seed", 
              icon: BookOpen 
            },
            { 
              id: "irrigation", 
              label: language === 'mr' ? "३. पाणी व सिंचन" : language === 'hi' ? "३. जल एवं सिंचाई" : "3. Irrigation", 
              icon: Droplets 
            },
            { 
              id: "fertilizer", 
              label: language === 'mr' ? "४. खत व्यवस्थापन" : language === 'hi' ? "४. उर्वरक प्रबंधन" : "4. Fertilizer Plan", 
              icon: Beaker 
            },
            { 
              id: "protection", 
              label: language === 'mr' ? "५. कीड व रोग नियंत्रण" : language === 'hi' ? "५. कीट एवं रोग प्रबंधन" : "5. Pest & Disease", 
              icon: Bug 
            },
            { 
              id: "harvest", 
              label: language === 'mr' ? "६. काढणी व खबरदारी" : language === 'hi' ? "६. कटाई एवं सावधानियां" : "6. Harvest & Precautions", 
              icon: ShieldCheck 
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Cards */}
        <div className="space-y-6">
          
          {/* TAB 1: OVERVIEW & SOIL PREPARATION */}
          {activeTab === "overview" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sprout className="text-primary-600" /> {guide.soilPreparation.title}
                  </h2>
                  {guide.soilPreparation.timing && (
                    <span className="text-xs font-semibold px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full border border-primary-100 dark:border-primary-800">
                      {guide.soilPreparation.timing}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
                  {guide.soilPreparation.subtitle}
                </p>

                <div className="space-y-3 mb-6">
                  {guide.soilPreparation.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <CheckCircle2 className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>

                {guide.soilPreparation.tips && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4">
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                      <Sparkles size={16} /> Pro Tips for Soil Management
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-amber-900 dark:text-amber-300">
                      {guide.soilPreparation.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: SOWING & SEED */}
          {activeTab === "sowing" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="text-primary-600" /> {guide.sowingGuide.title}
                  </h2>
                  {guide.sowingGuide.timing && (
                    <span className="text-xs font-semibold px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full border border-primary-100 dark:border-primary-800">
                      {guide.sowingGuide.timing}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
                  {guide.sowingGuide.subtitle}
                </p>

                <div className="space-y-3 mb-6">
                  {guide.sowingGuide.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <CheckCircle2 className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>

                {guide.sowingGuide.tips && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4">
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                      <Sparkles size={16} /> Seedling Health & Density Guidelines
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-emerald-900 dark:text-emerald-300">
                      {guide.sowingGuide.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: IRRIGATION */}
          {activeTab === "irrigation" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Droplets className="text-blue-500" /> {guide.irrigationSchedule.title}
                  </h2>
                  {guide.irrigationSchedule.timing && (
                    <span className="text-xs font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-800">
                      {guide.irrigationSchedule.timing}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
                  {guide.irrigationSchedule.subtitle}
                </p>

                <div className="space-y-3 mb-6">
                  {guide.irrigationSchedule.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <Droplets className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>

                {guide.irrigationSchedule.tips && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-4">
                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                      <Sparkles size={16} /> Water Efficiency Best Practices
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-900 dark:text-blue-300">
                      {guide.irrigationSchedule.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: FERTILIZER PLAN */}
          {activeTab === "fertilizer" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Beaker className="text-purple-500" /> {guide.fertilizerPlan.title}
                  </h2>
                  {guide.fertilizerPlan.timing && (
                    <span className="text-xs font-semibold px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full border border-purple-100 dark:border-purple-800">
                      {guide.fertilizerPlan.timing}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
                  {guide.fertilizerPlan.subtitle}
                </p>

                <div className="space-y-3 mb-6">
                  {guide.fertilizerPlan.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <Beaker className="text-purple-500 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>

                {guide.fertilizerPlan.tips && (
                  <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 rounded-2xl p-4">
                    <h4 className="text-sm font-bold text-purple-800 dark:text-purple-400 mb-2 flex items-center gap-1.5">
                      <Sparkles size={16} /> Nutrient Efficiency & Foliar Spray Advice
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-purple-900 dark:text-purple-300">
                      {guide.fertilizerPlan.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 5: PEST & DISEASE */}
          {activeTab === "protection" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bug className="text-red-500" /> Integrated Pest & Disease Defense
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    CIBRC-approved chemical formulations and biological IPM controls
                  </p>
                </div>
                <Link 
                  href="/disease-detection"
                  className="px-4 py-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-100 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert size={16} /> Scan Leaves with AI &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.pestAndDisease.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          item.type === 'pest' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {item.type}
                        </span>
                        {item.cibrcNotes && (
                          <span className="text-[11px] text-gray-400 font-mono">
                            {item.cibrcNotes}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                        <strong className="text-gray-900 dark:text-gray-200">Symptoms: </strong> {item.symptoms}
                      </p>

                      <div className="space-y-3 mb-4">
                        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
                          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 mb-1">
                            <Sparkles size={13} /> Biological & Cultural Control
                          </div>
                          <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">{item.organicRemedy}</p>
                        </div>

                        <div className="p-3 bg-red-50/70 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl">
                          <div className="text-xs font-bold text-red-800 dark:text-red-400 flex items-center gap-1 mb-1">
                            <Beaker size={13} /> CIBRC Registered Chemical Formulation & Dosage
                          </div>
                          <p className="text-xs text-red-900 dark:text-red-200 font-medium mb-1.5">{item.chemicalRemedy}</p>
                          <div className="inline-block px-2.5 py-1 bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-200 text-xs font-mono font-semibold rounded-lg border border-red-200 dark:border-red-800">
                            {item.dosage}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 6: HARVEST & PRECAUTIONS */}
          {activeTab === "harvest" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" /> {guide.harvestingGuide.title}
                  </h2>
                  {guide.harvestingGuide.timing && (
                    <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-100 dark:border-emerald-800">
                      {guide.harvestingGuide.timing}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
                  {guide.harvestingGuide.subtitle}
                </p>

                <div className="space-y-3 mb-6">
                  {guide.harvestingGuide.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>

                {guide.harvestingGuide.tips && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 mb-6">
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                      <Sparkles size={16} /> Post-Harvest Preservation & Quality Storage
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-emerald-900 dark:text-emerald-300">
                      {guide.harvestingGuide.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Important Precautions */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <AlertTriangle className="text-amber-500" /> Critical Precautions & Golden Rules
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {guide.precautions.map((precaution, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">!</span>
                        <span className="text-sm text-amber-950 dark:text-amber-200">{precaution}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* References & Government MSP Benchmark */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Award size={16} className="text-primary-600" /> Market Price & Support Benchmark
            </h3>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-300 mb-1">
              {guide.mspBenchmark.price}
            </div>
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {guide.mspBenchmark.seasonYear}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {guide.mspBenchmark.note}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-primary-600" /> Authoritative Institutional Sources
            </h3>
            <ul className="space-y-2 text-xs">
              {guide.references.map((ref, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300 leading-tight">
                  <strong className="text-gray-900 dark:text-white">&bull; {ref.institution}: </strong>
                  <span className="italic text-gray-600 dark:text-gray-400">{ref.title} ({ref.publicationType})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Authoritative Disclaimer Card */}
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl flex items-start gap-3">
          <Info size={20} className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <strong className="text-gray-900 dark:text-gray-200 font-semibold">Agronomic Advisory Notice: </strong>
            {guide.disclaimer} Always consult your local Krishi Vigyan Kendra (KVK) or Block Agricultural Officer for site-specific micro-nutrient and irrigation schedules tailored to your exact soil test report.
          </div>
        </div>

      </main>

      {/* Floating AI Assistant Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
              style={{ height: '500px' }}
            >
              {/* Header */}
              <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot size={20} />
                  <span className="font-bold">{guide.cropName} AI Advisor</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-primary-100 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              {/* Chat Body */}
              <div className="flex-grow p-4 bg-gray-50 dark:bg-gray-950 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary-600' : 'bg-primary-100 dark:bg-primary-900/50'}`}>
                      {msg.role === 'user' ? <span className="text-white text-xs">Me</span> : <Bot size={16} className="text-primary-600 dark:text-primary-400" />}
                    </div>
                    <div className={`border p-3 rounded-2xl text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none border-primary-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-tl-none'}`}>
                      <FormattedChatMessage content={msg.text} isUser={msg.role === 'user'} />
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={chatScrollRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if(chatInput.trim() && !isChatLoading) {
                      sendMessage(chatInput);
                      setChatInput("");
                    }
                  }} 
                  className="flex gap-2"
                >
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask any question about ${guide.cropName}...`} 
                    className="flex-grow px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 caret-primary-600 dark:caret-primary-400 text-sm focus:outline-none focus:border-primary-500" 
                  />
                  <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors flex-shrink-0">
                    <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 hover:scale-105 transition-transform"
        >
          {isChatOpen ? <X size={24} /> : <Bot size={28} />}
        </button>
      </div>
    </div>
  );
}

export default function CultivationGuidePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <GuideContent />
    </Suspense>
  );
}
