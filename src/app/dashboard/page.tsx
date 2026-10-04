"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  CloudSun, MapPin, Droplets, TrendingUp, ShieldCheck, 
  MessageSquare, Bell, ArrowRight, Zap, Search, Activity, Waves, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from "recharts";
import { getLocalizedState, getLocalizedDistrict } from "@/data/indiaLocations";
import { getCoordinatesForLocation, fetchLiveWeatherData, LiveWeatherData } from "@/utils/weatherApi";
import { getLocalizedSchemes } from "@/data/schemes";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const { user, isLoading, toggleSaveScheme } = useAuth();
  const router = useRouter();
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);

  const allLocalizedSchemes = useMemo(() => getLocalizedSchemes(language), [language]);

  const savedSchemesList = useMemo(() => {
    if (!user?.savedSchemes || user.savedSchemes.length === 0) return [];
    return user.savedSchemes
      .map(id => allLocalizedSchemes.find(s => s.id === id))
      .filter(Boolean) as typeof allLocalizedSchemes;
  }, [user?.savedSchemes, allLocalizedSchemes]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Load live weather for user's location
  useEffect(() => {
    if (user?.location?.state && user?.location?.district) {
      getCoordinatesForLocation(user.location.state, user.location.district)
        .then(coords => fetchLiveWeatherData(coords.lat, coords.lon))
        .then(setLiveWeather)
        .catch(err => console.warn("Dashboard weather fetch fallback:", err));
    }
  }, [user]);

  const localizedDistrict = useMemo(() => {
    if (!user?.location?.district) return language === 'mr' ? "महाराष्ट्र" : language === 'hi' ? "महाराष्ट्र" : "Maharashtra";
    return getLocalizedDistrict(user.location.district, language);
  }, [user, language]);

  const localizedState = useMemo(() => {
    if (!user?.location?.state) return "";
    return getLocalizedState(user.location.state, language);
  }, [user, language]);

  const rawCrop = user?.farmDetails?.primaryCrops?.[0] || "Cotton";

  const localizedCrop = useMemo(() => {
    const cropMap: Record<string, { en: string; mr: string; hi: string }> = {
      Cotton: { en: "Cotton", mr: "कापूस", hi: "कपास" },
      Soybean: { en: "Soybean", mr: "सोयाबीन", hi: "सोयाबीन" },
      Wheat: { en: "Wheat", mr: "गहू", hi: "गेहूं" },
      Sugarcane: { en: "Sugarcane", mr: "ऊस", hi: "गन्ना" },
      Onion: { en: "Onion", mr: "कांदा", hi: "प्याज" },
      Tomato: { en: "Tomato", mr: "टोमॅटो", hi: "टमाटर" },
      Maize: { en: "Maize", mr: "मका", hi: "मक्का" },
      Gram: { en: "Gram", mr: "हरभरा", hi: "चना" },
      Paddy: { en: "Paddy", mr: "भात", hi: "धान" }
    };
    const c = cropMap[rawCrop] || { en: rawCrop, mr: rawCrop, hi: rawCrop };
    if (language === 'mr') return c.mr;
    if (language === 'hi') return c.hi;
    return c.en;
  }, [rawCrop, language]);

  // Localized Days for Charts
  const healthData = useMemo(() => [
    { day: t("dash_days_mon", "Mon"), health: 85 },
    { day: t("dash_days_tue", "Tue"), health: 86 },
    { day: t("dash_days_wed", "Wed"), health: 88 },
    { day: t("dash_days_thu", "Thu"), health: 84 },
    { day: t("dash_days_fri", "Fri"), health: 89 },
    { day: t("dash_days_sat", "Sat"), health: 92 },
    { day: t("dash_days_sun", "Sun"), health: 95 }
  ], [t]);

  const waterData = useMemo(() => [
    { day: t("dash_days_mon", "Mon"), required: 400, used: 380 },
    { day: t("dash_days_tue", "Tue"), required: 420, used: 420 },
    { day: t("dash_days_wed", "Wed"), required: 400, used: 350 },
    { day: t("dash_days_thu", "Thu"), required: 450, used: 440 },
    { day: t("dash_days_fri", "Fri"), required: 410, used: 410 },
    { day: t("dash_days_sat", "Sat"), required: 390, used: 400 },
    { day: t("dash_days_sun", "Sun"), required: 400, used: 395 },
  ], [t]);

  const marketTrendData = useMemo(() => [
    { day: t("dash_days_mon", "Mon"), price: 4200 },
    { day: t("dash_days_tue", "Tue"), price: 4250 },
    { day: t("dash_days_wed", "Wed"), price: 4300 },
    { day: t("dash_days_thu", "Thu"), price: 4280 },
    { day: t("dash_days_fri", "Fri"), price: 4350 },
    { day: t("dash_days_sat", "Sat"), price: 4400 },
    { day: t("dash_days_sun", "Sun"), price: 4450 }
  ], [t]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t("dash_welcome", "Welcome back")}, {user.name.split(" ")[0]}! 👋
            </h1>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm">
              <MapPin size={16} className="text-primary-500" />
              <span>
                {[user.location?.taluka, localizedDistrict, localizedState].filter(Boolean).join(", ")}
              </span>
            </div>
          </div>
          
          <Link href="/weather" className="flex items-center gap-4 bg-white dark:bg-gray-900 p-3.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl">
              <CloudSun size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                {t("dash_weather", "Weather")}
              </div>
              <div className="text-xl font-black text-gray-900 dark:text-white">
                {liveWeather ? `${liveWeather.current.temp}°C` : "32°C"}
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions Scrollable */}
        <div className="flex overflow-x-auto pb-6 gap-4 snap-x hide-scrollbar">
          {[
            { title: t("dash_action_guidance", "Ask AI Assistant"), icon: <MessageSquare size={20} />, href: "/guidance", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
            { title: t("dash_action_disease", "Scan Crop Disease"), icon: <Search size={20} />, href: "/disease-detection", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
            { title: t("dash_action_irrigation", "Smart Irrigation"), icon: <Waves size={20} />, href: "/smart-irrigation", color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
            { title: t("dash_action_weather", "Check Weather"), icon: <CloudSun size={20} />, href: "/weather", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
            { title: t("dash_action_market", "View Market Prices"), icon: <TrendingUp size={20} />, href: "/market", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
            { title: t("dash_action_schemes", "Govt Schemes"), icon: <ShieldCheck size={20} />, href: "/schemes", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
          ].map((action, i) => (
            <Link key={i} href={action.href} className="flex-shrink-0 snap-start">
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 pr-5 pl-3.5 py-3 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-primary-500 hover:shadow-md transition-all group">
                <div className={`p-2.5 rounded-xl ${action.color}`}>
                  {action.icon}
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm whitespace-nowrap">{action.title}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bento Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {/* AI Tip of the Day - spans 2 columns on xl */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 rounded-3xl p-6 text-white shadow-lg shadow-primary-900/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={120} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase mb-4 tracking-wider">
                <Zap size={14} />{t("dash_ai_tip", "AI Farming Tip of the Day")}
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-2 leading-snug">
                {t("dash_ai_tip_title", "Optimal time to spray fertilizer on {crop}.").replace("{crop}", localizedCrop)}
              </h2>
              <p className="text-primary-100 max-w-xl leading-relaxed text-sm md:text-base font-medium">
                {t("dash_ai_tip_desc", "Weather conditions in {location} show calm wind and favorable humidity for the next 48 hours. Applying foliar nutrition early morning tomorrow will yield optimal crop absorption.").replace("{location}", localizedDistrict)}
              </p>
            </div>
            <div className="mt-6 flex gap-3 relative z-10">
              <Link 
                href="/guidance"
                className="px-5 py-2.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm"
              >
                {t("dash_ai_ask_btn", "Ask AI Follow-up")}
              </Link>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell size={18} className="text-gray-400" />{t("dash_notifications", "Notifications & Alerts")}
              </h3>
              <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                2 {t("dash_notif_new", "New")}
              </span>
            </div>
            <div className="space-y-4 flex-grow">
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {t("dash_notif_rain_title", "Weather & Crop Advisory")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed font-medium">
                    {t("dash_notif_rain_desc", "Weather conditions are favorable. Carry out planned intercultural and spraying operations.")}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {t("dash_notif_market_title", "Market Price Update")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed font-medium">
                    {t("dash_notif_market_desc", "{crop} prices are steady in {location} APMC.").replace("{crop}", localizedCrop).replace("{location}", localizedDistrict)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Crop Health Trend */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity size={18} className="text-emerald-500" />{t("dash_crop_health", "Crop Health Index")}
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-lg">
                {t("dash_health_status", "95% Excellent Condition")}
              </span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="health" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Water Usage / Irrigation */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Droplets size={18} className="text-blue-500" /> {t("dash_water_usage", "Estimated Irrigation Trend")}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{t("dash_past_7_days", "Past 7 Days")}</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="used" name={t("dash_water_used", "Actual Used")} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="required" name={t("dash_water_optimal", "Optimal Need")} fill="#93c5fd" opacity={0.5} radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Market Trends (Favourite Crop) */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-orange-500" /> {localizedCrop} {t("dash_market_prices_title", "Market Price Trend")}
              </h3>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-lg text-xs font-bold">
                <TrendingUp size={14} /> +₹50
              </div>
            </div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₹4,450</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-bold">{t("dash_per_quintal", "/ Quintal")}</span>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketTrendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* Saved Schemes List */}
          <motion.div variants={itemVariants} className="md:col-span-2 xl:col-span-1 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary-500" />{t("dash_saved_schemes", "Bookmarked Schemes")}
              </h3>
              <Link href="/schemes?category=Bookmarked" className="text-sm text-primary-600 dark:text-primary-400 font-bold hover:underline">
                {t("dash_view_all", "View All")}
              </Link>
            </div>
            
            {savedSchemesList.length > 0 ? (
              <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {savedSchemesList.map((scheme) => (
                  <div 
                    key={scheme.id}
                    className="group p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex justify-between items-center gap-3"
                  >
                    <Link href="/schemes?category=Bookmarked" className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-200/70 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {scheme.category}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {scheme.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {scheme.name}
                      </h4>
                    </Link>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveScheme(scheme.id);
                      }}
                      title={language === 'mr' ? "योजना काढा (Unsave)" : language === 'hi' ? "योजना हटाएं (Unsave)" : "Remove bookmark"}
                      className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                <ShieldCheck size={36} className="text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {t("dash_no_schemes", "No schemes bookmarked yet. Explore government subsidies to bookmark them.")}
                </p>
                <Link 
                  href="/schemes" 
                  className="mt-3 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors"
                >
                  {t("dash_browse_schemes", "Explore Schemes")}
                </Link>
              </div>
            )}
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}
