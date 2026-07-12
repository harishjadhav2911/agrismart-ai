"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Droplets, Power, CloudRain, Clock, AlertTriangle, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const moistureData = [
  { time: '06:00', level: 45 },
  { time: '09:00', level: 42 },
  { time: '12:00', level: 38 },
  { time: '15:00', level: 32 },
  { time: '18:00', level: 30 },
  { time: '21:00', level: 65 }, // Irrigated here
  { time: '00:00', level: 62 },
];

export default function SmartIrrigationPage() {
  const { t } = useLanguage();
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [moisture, setMoisture] = useState(30);
  const [waterTank, setWaterTank] = useState(78);

  const togglePump = () => {
    setIsPumpOn(!isPumpOn);
    if (!isPumpOn) {
      // Simulate pumping water
      setTimeout(() => {
        setMoisture(65);
        setWaterTank(60);
        setIsPumpOn(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full mb-3">
              <Droplets size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{t("irrig_title")}</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor soil moisture and manage water resources intelligently.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 p-3 rounded-xl">
              <CloudRain size={24} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Rain Forecast</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">None in 48 hrs</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Soil Moisture Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Droplets size={80} className="text-blue-500" />
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Avg. Soil Moisture</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className={`text-5xl font-bold ${moisture < 40 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                {moisture}%
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-2">
              <div className={`h-3 rounded-full transition-all duration-1000 ${moisture < 40 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${moisture}%` }}></div>
            </div>
            {moisture < 40 && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-3">
                <AlertTriangle size={14} /> Critical level. Irrigation required.
              </div>
            )}
          </motion.div>

          {/* Water Tank Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden"
          >
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Water Tank Level</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-5xl font-bold text-teal-600 dark:text-teal-400">{waterTank}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-2">
              <div className="bg-teal-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${waterTank}%` }}></div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium mt-3">
              <Info size={14} /> Approx 3,900 Liters remaining.
            </div>
          </motion.div>

          {/* Pump Control Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`rounded-3xl p-6 shadow-sm border transition-colors ${
              isPumpOn 
                ? 'bg-blue-600 border-blue-700 text-white' 
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
            }`}
          >
            <h3 className={`font-medium mb-6 ${isPumpOn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{t("irrig_pump")}</h3>
            <div className="flex flex-col items-center justify-center">
              <button 
                onClick={togglePump}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                  isPumpOn 
                    ? 'bg-white text-blue-600 shadow-blue-900/50' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Power size={32} />
              </button>
              <span className={`mt-4 font-bold text-xl ${isPumpOn ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {isPumpOn ? 'PUMP IS ON' : 'PUMP IS OFF'}
              </span>
              {isPumpOn && (
                <span className="text-sm text-blue-200 animate-pulse mt-1">Irrigating field...</span>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Moisture Trend (24h)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moistureData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="level" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* AI Advice & Schedule */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl p-6 shadow-sm text-white flex flex-col"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-6 self-start">
              <Droplets size={14} /> AI Irrigation Advice
            </div>
            <h3 className="text-xl font-bold mb-3">Action Recommended</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Soil moisture is at 30% which is below the optimal threshold for Cotton (40%). With no rain expected, we recommend turning on the pump for 45 minutes immediately.
            </p>

            <div className="mt-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold flex items-center gap-2"><Clock size={16} /> Auto-Schedule</span>
                <span className="text-xs bg-green-500 px-2 py-1 rounded text-white font-bold">ACTIVE</span>
              </div>
              <div className="text-sm text-blue-100">Next scheduled watering:</div>
              <div className="text-lg font-bold">Tomorrow, 06:00 AM</div>
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
