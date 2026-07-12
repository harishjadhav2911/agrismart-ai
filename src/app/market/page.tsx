"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, Search, Bell, Heart, Volume2, TrendingUp, TrendingDown,
  Bot, X, ArrowRight, Loader2, MapPin, AlertCircle, CheckCircle2, ChevronRight
} from "lucide-react";
import { AreaChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from "@/context/LocationContext";
import { marketApi, MarketData, DailyPrice } from "@/services/marketApi";
import { fetchStates, fetchDistricts } from "@/utils/locationApi";
import { useLanguage } from "@/context/LanguageContext";
import { useGeminiChat } from "@/hooks/useGeminiChat";

export default function MarketPage() {
  const { location } = useLocation();
  const { language } = useLanguage();
  
  const [chatInput, setChatInput] = useState("");
  const { messages, isLoading: isChatLoading, sendMessage } = useGeminiChat("Live Market Prices & AI Economic Advisor", "market_chat_welcome");
  
  // Location States
  const [statesList, setStatesList] = useState<string[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  
  const [selectedState, setSelectedState] = useState(location?.state || "Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState(location?.district || "Pune");
  const [selectedCrop, setSelectedCrop] = useState("");
  
  // Data States
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load favorites
  useEffect(() => {
    try {
      const saved = localStorage.getItem("agrismart_fav_crops");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (cropName: string) => {
    setFavorites(prev => {
      const updated = prev.includes(cropName) ? prev.filter(c => c !== cropName) : [...prev, cropName];
      localStorage.setItem("agrismart_fav_crops", JSON.stringify(updated));
      return updated;
    });
  };

  // Initialize dropdowns
  useEffect(() => {
    fetchStates().then(setStatesList);
    if (selectedState) {
      fetchDistricts(selectedState).then(setDistrictsList);
    }
  }, [selectedState]);

  // Fetch Data
  const loadMarketData = async () => {
    if (!selectedState || !selectedDistrict) return;
    setIsLoading(true);
    try {
      const crops = await marketApi.fetchAvailableCrops(selectedState, selectedDistrict);
      setAvailableCrops(crops);
      const data = await marketApi.fetchMarketData(selectedState, selectedDistrict, selectedCrop || undefined);
      setMarketData(data);
    } catch (error) {
      console.error("Failed to load market data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMarketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // AI Advisor Logic
  const getAIAdvice = (trend: DailyPrice[], currentAvg: number) => {
    if (trend.length < 7) return { action: "Wait", text: "Insufficient data", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" };
    
    const day1 = trend[0].avgPrice;
    const avg7Days = trend.reduce((sum, d) => sum + d.avgPrice, 0) / 7;
    const isTrendingUp = currentAvg > day1;
    const isAboveAverage = currentAvg > avg7Days * 1.02; // 2% above 7-day average

    if (isAboveAverage && !isTrendingUp) {
      // Prices are high but starting to fall
      return { 
        action: "Sell Now", 
        text: "Prices are above the weekly average but showing signs of dropping. Good time to sell.", 
        color: "text-green-600 dark:text-green-400", 
        bg: "bg-green-50 dark:bg-green-900/20",
        icon: <CheckCircle2 className="text-green-500" size={18} />
      };
    } else if (!isAboveAverage && isTrendingUp) {
      // Prices are low but rising
      return { 
        action: "Wait", 
        text: "Prices are currently low but trending upwards. Wait a few days for better margins.", 
        color: "text-amber-600 dark:text-amber-400", 
        bg: "bg-amber-50 dark:bg-amber-900/20",
        icon: <AlertCircle className="text-amber-500" size={18} />
      };
    } else if (isAboveAverage && isTrendingUp) {
       // High and rising
      return { 
        action: "Hold", 
        text: "Prices are high and continuing to rise. Hold momentarily to maximize profit.", 
        color: "text-blue-600 dark:text-blue-400", 
        bg: "bg-blue-50 dark:bg-blue-900/20",
        icon: <TrendingUp className="text-blue-500" size={18} />
      };
    } else {
      // Low and falling
      return { 
        action: "Hold", 
        text: "Prices are currently low and falling. Avoid selling unless urgent.", 
        color: "text-red-600 dark:text-red-400", 
        bg: "bg-red-50 dark:bg-red-900/20",
        icon: <TrendingDown className="text-red-500" size={18} />
      };
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Store className="text-primary-500" size={36} />
              Live Market Prices
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl text-lg">
              Track APMC Mandi prices, analyze 7-day trends, and get AI-powered advice on when to sell your crops.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {statesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select 
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Crops</option>
                {availableCrops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <button 
                onClick={loadMarketData}
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                {isLoading ? "Fetching..." : "Search Prices"}
              </button>
            </div>
          </div>

          {/* Favorites Filter (Optional) */}
          {favorites.length > 0 && (
            <div className="mb-6 flex gap-2 overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setSelectedCrop("")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${!selectedCrop ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
              >
                All
              </button>
              {favorites.map(f => (
                <button 
                  key={f}
                  onClick={() => setSelectedCrop(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border flex items-center gap-1 ${selectedCrop === f ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
                >
                  <Heart size={12} fill="currentColor" /> {f}
                </button>
              ))}
            </div>
          )}

          {/* Results Grid */}
          {marketData.length === 0 && !isLoading ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
              <Store size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No market data found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try selecting a different district or crop.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {marketData.map((data) => {
                const advice = getAIAdvice(data.trend7Days, data.currentAvg);
                const isFav = favorites.includes(data.crop);
                
                // Voice string preparation
                const speakText = `${data.crop} price in ${data.mandi}. Today's average is ${data.currentAvg} Rupees per quintal. AI Advice: ${advice.action}. ${advice.text}`;

                return (
                  <motion.div 
                    key={data.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col xl:flex-row gap-6"
                  >
                    {/* Left: Info & Prices */}
                    <div className="w-full xl:w-1/3 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-gray-100 dark:border-gray-800 pb-6 xl:pb-0 xl:pr-6">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.crop}</h2>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSpeak(speakText)}
                              className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-500 hover:text-primary-600 transition-colors"
                              title="Listen"
                            >
                              <Volume2 size={16} />
                            </button>
                            <button 
                              onClick={() => toggleFavorite(data.crop)}
                              className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                              title="Favorite"
                            >
                              <Heart size={16} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-red-500" : ""} />
                            </button>
                            <button 
                              className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-500 hover:text-blue-500 transition-colors"
                              title="Set Alert"
                            >
                              <Bell size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <MapPin size={14} /> {data.mandi}, {data.district}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Last Updated: {data.lastUpdated}</p>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Avg Price</p>
                          <p className="text-2xl font-black text-gray-900 dark:text-white">₹{data.currentAvg}</p>
                          <p className="text-xs text-gray-400 mt-1">per quintal</p>
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Maximum</p>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400">₹{data.currentMax}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Minimum</p>
                            <p className="text-sm font-bold text-red-600 dark:text-red-400">₹{data.currentMin}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Chart */}
                    <div className="w-full xl:w-1/3">
                      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary-500" /> 7-Day Trend
                      </h3>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data.trend7Days} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id={`color-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                            <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} width={40} />
                            <RechartsTooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px' }}
                              labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              formatter={(value: any) => [`₹${value}`, 'Avg Price']}
                            />
                            <Line type="monotone" dataKey="price" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Right: AI Advisor */}
                    <div className="w-full xl:w-1/3 flex flex-col justify-center">
                      <div className={`p-6 rounded-2xl border ${advice.bg} border-transparent`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Bot size={20} className={advice.color} />
                          <h3 className={`font-black uppercase tracking-wider text-sm ${advice.color}`}>
                            AI Advisor: {advice.action}
                          </h3>
                        </div>
                        <p className={`text-sm leading-relaxed font-medium ${advice.color.replace('500', '700').replace('400', '300')}`}>
                          {advice.text}
                        </p>
                        <button className={`mt-4 text-xs font-bold flex items-center gap-1 ${advice.color} hover:underline`}>
                          Ask AI for details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
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
              <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot size={20} />
                  <span className="font-bold">Market Assistant</span>
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
              </div>

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
                    placeholder="E.g. Will Cotton prices rise?" 
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
