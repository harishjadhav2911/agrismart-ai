"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  CloudSun, MapPin, Droplets, TrendingUp, ShieldCheck, 
  MessageSquare, Bell, ArrowRight, Zap, Search, Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from "recharts";

// Mock Data for Charts
const healthData = [
  { day: 'Mon', health: 85 }, { day: 'Tue', health: 86 }, { day: 'Wed', health: 88 },
  { day: 'Thu', health: 84 }, { day: 'Fri', health: 89 }, { day: 'Sat', health: 92 }, { day: 'Sun', health: 95 }
];

const waterData = [
  { day: 'Mon', required: 400, used: 380 },
  { day: 'Tue', required: 420, used: 420 },
  { day: 'Wed', required: 400, used: 350 },
  { day: 'Thu', required: 450, used: 440 },
  { day: 'Fri', required: 410, used: 410 },
  { day: 'Sat', required: 390, used: 400 },
  { day: 'Sun', required: 400, used: 395 },
];

const marketTrendData = [
  { day: 'Mon', price: 4200 }, { day: 'Tue', price: 4250 }, { day: 'Wed', price: 4300 },
  { day: 'Thu', price: 4280 }, { day: 'Fri', price: 4350 }, { day: 'Sat', price: 4400 }, { day: 'Sun', price: 4450 }
];

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
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const primaryCrop = user.farmDetails.primaryCrops[0] || "Cotton";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user.name.split(" ")[0]}! 👋
            </h1>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <MapPin size={16} />
              <span>{user.location.taluka || user.location.district}, {user.location.state}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl">
              <CloudSun size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t("dash_weather")}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">32°C</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Scrollable */}
        <div className="flex overflow-x-auto pb-6 gap-4 snap-x hide-scrollbar">
          {[
            { title: "Ask AI Assistant", icon: <MessageSquare size={20} />, href: "/guidance", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
            { title: "Scan Crop Disease", icon: <Search size={20} />, href: "/disease-detection", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
            { title: "Check Weather", icon: <CloudSun size={20} />, href: "/weather", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
            { title: "View Market Prices", icon: <TrendingUp size={20} />, href: "/market", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
            { title: "Govt Schemes", icon: <ShieldCheck size={20} />, href: "/schemes", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
          ].map((action, i) => (
            <Link key={i} href={action.href} className="flex-shrink-0 snap-start">
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 pr-5 pl-3 py-3 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-primary-500 hover:shadow-md transition-all group">
                <div className={`p-2 rounded-xl ${action.color}`}>
                  {action.icon}
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm whitespace-nowrap">{action.title}</span>
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
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 rounded-3xl p-6 text-white shadow-lg shadow-primary-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={120} />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-4">
                  <Zap size={14} />{t("dash_ai_tip")}</div>
                <h2 className="text-2xl font-bold mb-2">Optimal time to spray fertilizer on {primaryCrop}.</h2>
                <p className="text-primary-100 max-w-lg leading-relaxed">
                  Weather conditions in {user.location.district} show low wind and no rain expected for the next 48 hours. Spraying liquid fertilizer early morning tomorrow will yield a 15% better absorption rate.
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="px-5 py-2.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm">
                  Ask AI Follow-up
                </button>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Bell size={18} className="text-gray-400" />{t("dash_notifications")}</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg">2 New</span>
            </div>
            <div className="space-y-4 flex-grow">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">Heavy Rain Alert</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Expected in 3 hours. Secure your harvested crops.</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">Market Price Surge</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{primaryCrop} prices jumped by ₹150/qtl in {user.location.district} APMC.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Crop Health Trend */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Activity size={18} className="text-green-500" />{t("dash_crop_health")}</h3>
              <span className="text-sm font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-lg">95% Excellent</span>
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
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Droplets size={18} className="text-blue-500" /> Water Usage (L)</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">Past 7 Days</span>
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
                  <Bar dataKey="used" name="Used" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="required" name="Optimal" fill="#93c5fd" opacity={0.5} radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Market Trends (Favourite Crop) */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><TrendingUp size={18} className="text-orange-500" /> {primaryCrop} Prices</h3>
              <div className="flex items-center gap-1 text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-lg text-sm font-bold">
                <TrendingUp size={14} /> +₹50
              </div>
            </div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₹4,450</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">/ Quintal</span>
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
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><ShieldCheck size={18} className="text-primary-500" />{t("dash_saved_schemes")}</h3>
              <Link href="/schemes" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">{t("dash_view_all")}</Link>
            </div>
            
            {user.savedSchemes.length > 0 ? (
              <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {user.savedSchemes.map((scheme, i) => (
                  <div key={i} className="group p-3 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all cursor-pointer flex justify-between items-center">
                    <span className="font-medium text-gray-800 dark:text-gray-200 text-sm uppercase">{scheme.replace("-", " ")}</span>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
                <ShieldCheck size={32} className="text-gray-300 dark:text-gray-700 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No schemes saved yet. Browse schemes to bookmark them.</p>
                <Link href="/schemes" className="mt-3 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg">Browse Schemes</Link>
              </div>
            )}
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}
