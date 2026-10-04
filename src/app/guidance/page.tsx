"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, MapPin, Droplets, Maximize, Sprout, CloudSun,
  CheckCircle2, ArrowRight, Loader2, Sparkles, Activity, ShieldCheck,
  TrendingUp, X, BookOpen, Clock, AlertTriangle, Check, ShieldAlert,
  Calendar, Layers, CalendarCheck
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { useLocation } from "@/context/LocationContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGeminiChat } from "@/hooks/useGeminiChat";
import { FormattedChatMessage } from "@/components/chat/FormattedChatMessage";
import { fetchLiveWeatherData, getCoordinatesForLocation, LiveWeatherData } from "@/utils/weatherApi";
import { generatePersonalizedGuidance, GeneratedGuidanceReport } from "@/data/agronomicGuidance";
import { getLocalizedState, getLocalizedDistrict } from "@/data/indiaLocations";

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];

const SUGGESTED_CROPS = [
  { id: "Cotton", en: "Cotton (कापूस / कपास)", mr: "कापूस (Cotton)", hi: "कपास (Cotton)" },
  { id: "Soybean", en: "Soybean (सोयाबीन)", mr: "सोयाबीन (Soybean)", hi: "सोयाबीन (Soybean)" },
  { id: "Wheat", en: "Wheat (गहू / गेहूं)", mr: "गहू (Wheat)", hi: "गेहूं (Wheat)" },
  { id: "Sugarcane", en: "Sugarcane (ऊस / गन्ना)", mr: "ऊस (Sugarcane)", hi: "गन्ना (Sugarcane)" },
  { id: "Onion", en: "Onion (कांदा / प्याज)", mr: "कांदा (Onion)", hi: "प्याज (Onion)" },
  { id: "Tomato", en: "Tomato (टोमॅटो / टमाटर)", mr: "टोमॅटो (Tomato)", hi: "टमाटर (Tomato)" },
  { id: "Maize", en: "Maize (मका / मक्का)", mr: "मका (Maize)", hi: "मक्का (Maize)" },
  { id: "Gram", en: "Gram / Chickpea (हरभरा / चना)", mr: "हरभरा (Gram)", hi: "चना (Gram)" },
  { id: "Paddy", en: "Paddy / Rice (भात / धान)", mr: "भात (Paddy)", hi: "धान (Paddy)" },
  { id: "Groundnut", en: "Groundnut (भुईमूग / मूंगफली)", mr: "भुईमूग (Groundnut)", hi: "मूंगफली (Groundnut)" },
  { id: "Grapes", en: "Grapes (द्राक्षे / अंगूर)", mr: "द्राक्षे (Grapes)", hi: "अंगूर (Grapes)" },
  { id: "Banana", en: "Banana (केळी / केला)", mr: "केळी (Banana)", hi: "केला (Banana)" }
];

export default function GuidancePage() {
  const { t, language } = useLanguage();
  const { location } = useLocation();

  // Form State
  const [soilType, setSoilType] = useState("black");
  const [farmSize, setFarmSize] = useState<number>(5);
  const [cropInput, setCropInput] = useState("Cotton");
  const [season, setSeason] = useState("Kharif (Monsoon)");

  // Workflow State
  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [report, setReport] = useState<GeneratedGuidanceReport | null>(null);

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const { messages, isLoading: isChatLoading, sendMessage } = useGeminiChat("Smart Farmer Guidance Page (Crop, Fertilizer, Irrigation, Pest)", "guidance_chat_welcome");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatLoading, isChatOpen]);

  // Fetch real weather and generate agronomic guidance
  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("loading");

    try {
      const stateName = location?.state || "Maharashtra";
      const districtName = location?.district || "Pune";
      const coords = await getCoordinatesForLocation(stateName, districtName);
      const wData = await fetchLiveWeatherData(coords.lat, coords.lon);
      setWeatherData(wData);

      const generated = generatePersonalizedGuidance(
        cropInput,
        soilType,
        farmSize,
        season,
        wData,
        districtName
      );
      setReport(generated);

      // Brief animation buffer for user experience
      setTimeout(() => {
        setStep("results");
      }, 1000);
    } catch (err) {
      console.error("Error generating guidance report:", err);
      // Fallback with null weather
      const generated = generatePersonalizedGuidance(
        cropInput,
        soilType,
        farmSize,
        season,
        null,
        location?.district || "Maharashtra"
      );
      setReport(generated);
      setStep("results");
    }
  };

  const getLocalizedField = (obj?: { en: string; mr: string; hi: string }) => {
    if (!obj) return "";
    if (language === "mr") return obj.mr || obj.en;
    if (language === "hi") return obj.hi || obj.en;
    return obj.en;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          <AnimatePresence mode="wait">
            {/* Step 1: Input Form */}
            {step === "form" && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto"
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full mb-4">
                    <Sparkles size={28} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("guide_title", "Smart Farmer Guidance")}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {t("guide_subtitle", "Enter your farm details to get personalized, science-backed agricultural guidance tailored to your crop, soil, and live weather.")}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-10">
                  <form onSubmit={handleGenerateReport} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Farm Location Display */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <MapPin size={16} className="text-primary-500" /> {t("guide_farm_location", "Farm Location")}
                        </label>
                        {location ? (
                          <div className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white flex justify-between items-center">
                            <div>
                              <p className="font-bold text-base">{getLocalizedDistrict(location.district, language)}, {getLocalizedState(location.state, language)}</p>
                              {location.taluka && <p className="text-xs text-gray-500 dark:text-gray-400">{location.taluka}</p>}
                            </div>
                            <Link href="/weather" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
                              {language === 'mr' ? "स्थान बदला" : language === 'hi' ? "स्थान बदलें" : "Change Location"}
                            </Link>
                          </div>
                        ) : (
                          <div className="w-full px-4 py-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-300 flex justify-between items-center">
                            <p className="text-sm font-medium">{language === 'mr' ? "स्थान निश्चित केलेले नाही" : language === 'hi' ? "स्थान सेट नहीं है" : "Default Location: Maharashtra"}</p>
                            <Link href="/weather" className="text-sm font-bold underline">
                              {language === 'mr' ? "स्थान सेट करा" : language === 'hi' ? "स्थान सेट करें" : "Set Location"}
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Soil Type Select */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Droplets size={16} className="text-primary-500" /> {t("guide_soil_type", "Soil Type")}
                        </label>
                        <select 
                          value={soilType}
                          onChange={(e) => setSoilType(e.target.value)}
                          required 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none font-medium text-sm"
                        >
                          <option value="black">{t("guide_soil_black", "Black Soil (काळी जमीन / Vertisol)")}</option>
                          <option value="red">{t("guide_soil_red", "Red Soil (तांबडी जमीन / Alfisol)")}</option>
                          <option value="alluvial">{t("guide_soil_alluvial", "Alluvial / Loamy Soil (गाळाची जमीन)")}</option>
                          <option value="laterite">{t("guide_soil_laterite", "Laterite Soil (जांभी जमीन)")}</option>
                          <option value="clayey">{t("guide_soil_clayey", "Heavy Clayey Soil (चिकणमाती जमीन)")}</option>
                          <option value="sandy">{t("guide_soil_sandy", "Sandy Loam Soil (रेतीयुक्त जमीन)")}</option>
                        </select>
                      </div>

                      {/* Farm Size Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Maximize size={16} className="text-primary-500" /> {t("guide_farm_size", "Farm Size (Acres)")}
                        </label>
                        <input 
                          required 
                          type="number" 
                          min="0.5" 
                          step="0.5" 
                          value={farmSize}
                          onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                          placeholder="e.g. 5" 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none font-medium text-sm" 
                        />
                      </div>

                      {/* Crop Input / Selector */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Sprout size={16} className="text-primary-500" /> {t("guide_crop_label", "Current / Planned Crop")}
                        </label>
                        <div className="flex gap-2">
                          <select 
                            value={cropInput}
                            onChange={(e) => setCropInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none font-medium text-sm"
                          >
                            {SUGGESTED_CROPS.map(c => (
                              <option key={c.id} value={c.id}>
                                {language === 'mr' ? c.mr : language === 'hi' ? c.hi : c.en}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Season Selector */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <CloudSun size={16} className="text-primary-500" /> {t("guide_season_label", "Season")}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { key: "Kharif (Monsoon)", label: t("guide_season_kharif", "Kharif (Monsoon: Jun - Oct)") },
                            { key: "Rabi (Winter)", label: t("guide_season_rabi", "Rabi (Winter: Nov - Mar)") },
                            { key: "Zaid (Summer)", label: t("guide_season_zaid", "Zaid (Summer: Feb - Jun)") }
                          ].map((item) => (
                            <label 
                              key={item.key} 
                              onClick={() => setSeason(item.key)}
                              className={`flex items-center justify-center p-3.5 border rounded-2xl cursor-pointer text-center font-bold text-xs transition-all ${
                                season === item.key 
                                  ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300 shadow-sm" 
                                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              <span>{item.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                    </div>

                    <button 
                      type="submit" 
                      className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                    >
                      {t("guide_btn_generate", "Generate Personalized Guidance")} <ArrowRight size={20} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Step 2: Loading Analyzing View */}
            {step === "loading" && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <Loader2 size={64} className="text-primary-500 animate-spin relative z-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-2">
                  {t("guide_analyzing_title", "AgriSmart AI is Analyzing Your Farm Profile...")}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                  {t("guide_analyzing_desc", "Cross-referencing crop physiology, ICAR agronomic standards, and live Open-Meteo climate data...")}
                </p>
              </motion.div>
            )}

            {/* Step 3: Personalized Guidance Results */}
            {step === "results" && report && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Results Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Sparkles className="text-primary-500" /> {t("guide_report_title", "Personalized Smart Farming Advisory")}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {language === 'mr'
                        ? `आपल्या ${report.farmSize} एकर ${report.cropName} शेतीसाठी (${location?.district ? getLocalizedDistrict(location.district, language) : "महाराष्ट्र"}) शास्त्रोक्त कृषी शिफारशी.`
                        : language === 'hi'
                        ? `आपके ${report.farmSize} एकड़ ${report.cropName} खेत के लिए (${location?.district ? getLocalizedDistrict(location.district, language) : "महाराष्ट्र"}) वैज्ञानिक कृषि सिफारिशें।`
                        : `Personalized scientific recommendations for your ${report.farmSize}-acre ${report.cropName} farm in ${location?.district || "Maharashtra"}.`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link 
                      href={`/crop-recommendation/guide?crop=${encodeURIComponent(report.cropName)}`}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-primary-500/20 flex items-center gap-2"
                    >
                      <BookOpen size={16} /> {t("guide_view_full_guide", "View Full Cultivation Guide")} &rarr;
                    </Link>
                    <button 
                      onClick={() => setStep("form")} 
                      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {t("guide_btn_edit", "Edit Farm Details")}
                    </button>
                  </div>
                </div>

                {/* Section 1: Suitability & Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Crop Suitability & Alternatives */}
                  <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" /> {t("guide_suitability_title", "Crop Suitability Analysis")}
                      </h3>
                      <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {report.suitabilityScore}% Match
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">
                      {getLocalizedField(report.suitabilityStatus)}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {report.alternatives.map((alt, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{alt.localizedName}</h4>
                            <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold px-2 py-0.5 rounded-md">
                              {alt.matchScore}% Match
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {getLocalizedField(alt.reason)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-primary-600 to-primary-900 text-white rounded-3xl p-6 shadow-xl shadow-primary-500/20 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black mb-6 text-primary-50 flex items-center gap-2">
                        <Layers size={18} /> {t("guide_summary_title", "Farm Plan Summary")}
                      </h3>
                      <div className="space-y-3.5 text-sm">
                        <div className="flex justify-between items-center pb-3 border-b border-primary-500/40">
                          <span className="text-primary-100 font-medium">{t("guide_est_duration", "Est. Duration")}</span>
                          <span className="font-bold">{report.summary.durationDays}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-primary-500/40">
                          <span className="text-primary-100 font-medium">{t("guide_seed_rate", "Seed Rate")}</span>
                          <span className="font-bold">{report.summary.seedRateForFarm}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-primary-500/40">
                          <span className="text-primary-100 font-medium">{t("guide_water_req", "Water Need")}</span>
                          <span className="font-bold">{report.summary.waterRequirement}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-primary-100 font-medium">{t("guide_pest_risk", "Weather Risk")}</span>
                          <span className="font-bold text-amber-200">{getLocalizedField(report.summary.weatherRiskStatus)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Section 2: Actionable Timeline ("आज काय करावे", "पुढील ७ दिवसांत काय करावे", "महत्त्वाच्या सूचना") */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <CalendarCheck className="text-primary-500" /> {t("guide_timeline_title", "Actionable Timelines & Immediate Tasks")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Today */}
                    <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-2">
                        <Clock size={18} /> {t("guide_today_task", "What to do Today")}
                      </div>
                      <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                        {getLocalizedField(report.timeline.today)}
                      </p>
                    </div>

                    {/* Next 7 Days */}
                    <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold mb-2">
                        <Calendar size={18} /> {t("guide_week_task", "Next 7 Days Action Plan")}
                      </div>
                      <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
                        {getLocalizedField(report.timeline.next7Days)}
                      </p>
                    </div>

                    {/* Precautions */}
                    <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold mb-2">
                        <AlertTriangle size={18} /> {t("guide_precautions_task", "Important Precautions & Warnings")}
                      </div>
                      <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                        {getLocalizedField(report.timeline.precautions)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Visual Progression & Nutrition Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Growth Progression Chart */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <TrendingUp className="text-primary-500" /> {t("guide_yield_chart", "Estimated Growth & Yield Progression")}
                    </h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={report.yieldChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                          <XAxis 
                            dataKey={language === "mr" ? "stageMr" : language === "hi" ? "stageHi" : "stage"} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#6b7280', fontSize: 11}} 
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                          <Line type="monotone" name={language === "mr" ? "प्रमाणित वाढ निर्देशांक" : language === "hi" ? "मानक वृद्धि सूचकांक" : "Standard Growth"} dataKey="standard" stroke="#16a34a" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                          <Line type="monotone" name={language === "mr" ? "वैज्ञानिक व्यवस्थापनासह उत्पादन" : language === "hi" ? "उन्नत प्रबंधन सहित उत्पादन" : "Optimal (AI Managed)"} dataKey="optimal" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* NPK Ratio Pie Chart */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Activity className="text-primary-500" /> {t("guide_fert_chart", "Recommended NPK Nutrient Split")}
                    </h3>
                    <div className="h-72 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={report.fertilizer.npkChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={88}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {report.fertilizer.npkChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Section 4: 6 Detailed Actionable Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Card 1: Sowing & Seed Rate */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4">
                        <Sprout size={20} />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t("guide_sowing_card", "Sowing & Seed Rate")}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed font-medium">
                        {getLocalizedField(report.sowing.seedRateText)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        <span className="font-bold text-gray-700 dark:text-gray-300">Seed Treatment:</span> {getLocalizedField(report.sowing.treatment)}
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Weather-Linked Irrigation */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                        <Droplets size={20} />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t("guide_irrig_card", "Irrigation Management")}</h4>
                      <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-100 dark:border-blue-900/50">
                        {getLocalizedField(report.irrigation.liveAdvice)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {getLocalizedField(report.irrigation.criticalStages)}
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Fertilizer Plan */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
                        <Activity size={20} />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t("guide_fert_card", "Fertilizer & Nutrition Plan")}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                        <span className="font-bold text-gray-900 dark:text-white">Basal:</span> {getLocalizedField(report.fertilizer.basalDose)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        <span className="font-bold text-gray-700 dark:text-gray-300">Splits:</span> {getLocalizedField(report.fertilizer.topDressing)}
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Pest & Disease Prevention */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-4">
                        <ShieldCheck size={20} />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t("guide_pest_card", "Pest & Disease Prevention")}</h4>
                      <div className="space-y-2">
                        {report.pestDisease.keyRisks.map((p, i) => (
                          <div key={i} className="text-xs border-b border-gray-100 dark:border-gray-800 pb-1.5 last:border-none">
                            <span className="font-bold text-gray-900 dark:text-white">{p.localizedName}: </span>
                            <span className="text-gray-500 dark:text-gray-400">{p.remedy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Duration & Harvest Signs */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-4">
                        <Clock size={20} />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t("guide_harvest_card", "Duration & Harvest Signs")}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                        {getLocalizedField(report.harvest.maturitySigns)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {getLocalizedField(report.harvest.harvestTips)}
                      </p>
                    </div>
                  </div>

                  {/* Card 6: Do's and Don'ts */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
                        <ShieldAlert size={20} />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t("guide_dos_donts_card", "Important Do's and Don'ts")}</h4>
                      <div className="space-y-2 text-xs">
                        {report.dosAndDonts.dos.map((d, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                            <Check size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{getLocalizedField(d)}</span>
                          </div>
                        ))}
                        {report.dosAndDonts.donts.map((d, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-red-600 dark:text-red-400 font-medium">
                            <X size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{getLocalizedField(d)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  <span className="font-bold">
                    {language === "mr" ? "कृषी सल्लागार बॉट" : language === "hi" ? "कृषि सलाहकार बॉट" : "AgriSmart AI Assistant"}
                  </span>
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
                      {msg.role === 'user' ? <span className="text-white text-xs">{t("market_chat_me", "Me")}</span> : <Bot size={16} className="text-primary-600 dark:text-primary-400" />}
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
                    placeholder={language === "mr" ? "उदा. खताचा पहिला डोस कधी द्यावा?" : language === "hi" ? "उदा. पहला खाद कब दें?" : "Ask about your farm..."}
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
