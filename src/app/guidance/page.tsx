"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, MapPin, Droplets, Maximize, Sprout, CloudSun,
  CheckCircle2, ArrowRight, Loader2, Sparkles, Activity, ShieldCheck, ThermometerSun,
  TrendingUp, X
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { useLocation } from "@/context/LocationContext";
import { useGeminiChat } from "@/hooks/useGeminiChat";

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534'];

const yieldData = [
  { month: 'Month 1', expected: 0, optimal: 0 },
  { month: 'Month 2', expected: 10, optimal: 15 },
  { month: 'Month 3', expected: 45, optimal: 50 },
  { month: 'Month 4', expected: 80, optimal: 90 },
  { month: 'Month 5 (Harvest)', expected: 100, optimal: 110 },
];

const fertilizerData = [
  { name: 'Nitrogen (N)', value: 40 },
  { name: 'Phosphorus (P)', value: 30 },
  { name: 'Potassium (K)', value: 20 },
  { name: 'Micronutrients', value: 10 },
];

export default function GuidancePage() {
  const { t } = useLanguage();
  const { location } = useLocation();
  const [chatInput, setChatInput] = useState("");
  const { messages, isLoading, sendMessage } = useGeminiChat("Smart Farmer Guidance Page (Crop, Fertilizer, Irrigation, Pest)", "guidance_chat_welcome");
  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("loading");
    setTimeout(() => {
      setStep("results");
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          <AnimatePresence mode="wait">
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
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("guide_title")}</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Enter your farm details to get personalized, AI-powered agricultural recommendations.</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Global Location Display */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <MapPin size={16} className="text-primary-500" /> Farm Location
                        </label>
                        {location ? (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white flex justify-between items-center">
                            <div>
                              <p className="font-bold">{location.village || location.taluka || location.district}</p>
                              <p className="text-sm text-gray-500">{[location.district, location.state].filter(Boolean).join(", ")}</p>
                            </div>
                            <a href="/weather" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Change Location</a>
                          </div>
                        ) : (
                          <div className="w-full px-4 py-3 rounded-xl border border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-400 flex justify-between items-center">
                            <p className="text-sm">No location set. Some AI insights may be limited.</p>
                            <a href="/weather" className="text-sm font-bold hover:underline">Set Location</a>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Droplets size={16} className="text-primary-500" /> Soil Type
                        </label>
                        <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all">
                          <option value="">Select Soil Type</option>
                          <option value="black">Black Soil</option>
                          <option value="red">Red Soil</option>
                          <option value="alluvial">Alluvial Soil</option>
                          <option value="laterite">Laterite Soil</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Maximize size={16} className="text-primary-500" /> Farm Size (Acres)
                        </label>
                        <input required type="number" min="0.1" step="0.1" placeholder="e.g. 5" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Sprout size={16} className="text-primary-500" /> Current/Planned Crop
                        </label>
                        <input required type="text" placeholder="e.g. Cotton" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <CloudSun size={16} className="text-primary-500" /> Season
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'].map((season) => (
                            <label key={season} className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                              <input type="radio" name="season" value={season} required className="hidden peer" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-primary-600 dark:peer-checked:text-primary-400">{season}</span>
                              <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-primary-500 pointer-events-none"></div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2">
                      Generate AI Report <ArrowRight size={20} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-2">AgriSmart AI is Analyzing...</h2>
                <p className="text-gray-500 dark:text-gray-400">Processing climate data, soil metrics, and crop models.</p>
              </motion.div>
            )}

            {step === "results" && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Sparkles className="text-primary-500" /> AI Guidance Report
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Personalized recommendations for your 5-acre Cotton farm.</p>
                  </div>
                  <button onClick={() => setStep("form")} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors">
                    Edit Details
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Top Recommendations */}
                  <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <CheckCircle2 className="text-primary-500" /> Best Crop Alternatives
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-primary-100 dark:border-primary-900/30 bg-primary-50/50 dark:bg-primary-900/10">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-primary-900 dark:text-primary-300">BT Cotton (High Yield)</h4>
                          <span className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400 text-xs font-bold px-2 py-1 rounded-md">98% Match</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Perfect for black soil and current moisture levels. Expected to yield 15% higher than traditional variants.</p>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">Soybean (Intercropping)</h4>
                          <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-md">85% Match</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Excellent alternative to restore soil nitrogen levels if planted as an intercrop.</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-primary-600 dark:bg-primary-900 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/20">
                    <h3 className="text-lg font-bold mb-6 text-primary-50">Quick Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-primary-500 dark:border-primary-800">
                        <span className="text-primary-100">Est. Harvest Time</span>
                        <span className="font-bold">120-140 Days</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-primary-500 dark:border-primary-800">
                        <span className="text-primary-100">Water Req.</span>
                        <span className="font-bold">Medium (500mm)</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-primary-500 dark:border-primary-800">
                        <span className="text-primary-100">Disease Risk</span>
                        <span className="font-bold text-yellow-300">Moderate</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary-100">Expected Yield</span>
                        <span className="font-bold">12 Quintals/Acre</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Yield Chart */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <TrendingUp className="text-primary-500" /> Estimated Yield Progression
                    </h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={yieldData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                          <Line type="monotone" name="Expected Yield" dataKey="expected" stroke="#16a34a" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                          <Line type="monotone" name="Optimal Yield (with AI Guidance)" dataKey="optimal" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Fertilizer Chart */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Activity className="text-primary-500" /> Recommended NPK Ratio
                    </h3>
                    <div className="h-72 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={fertilizerData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {fertilizerData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Actionable Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Droplets size={64} /></div>
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                      <Droplets className="text-blue-600 dark:text-blue-400" size={20} />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Irrigation Schedule</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Water every 12-14 days. Avoid waterlogging during the early vegetative stage. Next watering suggested on <span className="font-semibold text-gray-900 dark:text-gray-200">Oct 15</span>.</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={64} /></div>
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mb-4">
                      <ShieldCheck className="text-red-600 dark:text-red-400" size={20} />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Pest Prevention</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">High risk of Pink Bollworm in your district this month. Spray Neem oil preemptively and install pheromone traps immediately.</p>
                  </div>

                  <a href="/disease-detection" className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-sm relative overflow-hidden block hover:shadow-md transition-shadow group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ThermometerSun size={64} /></div>
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center mb-4">
                      <ThermometerSun className="text-amber-600 dark:text-amber-400" size={20} />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Disease Alerts <span className="text-sm font-normal text-primary-500 ml-1 underline">Scan Now &rarr;</span></h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Weather indicates high humidity. Watch out for Leaf Spot disease. Click here to scan your leaves.</p>
                  </a>
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
                  <span className="font-bold">AgriSmart AI Assistant</span>
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
                    <div className={`border p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none border-primary-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
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
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if(chatInput.trim() && !isLoading) {
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
                    placeholder="Ask about your farm..." 
                    className="flex-grow px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 caret-primary-600 dark:caret-primary-400 text-sm focus:outline-none focus:border-primary-500" 
                  />
                  <button type="submit" disabled={isLoading || !chatInput.trim()} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors flex-shrink-0">
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
