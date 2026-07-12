"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { 
  MapPin, CloudRain, Sun, Wind, Droplets, ThermometerSun, 
  Sunrise, Sunset, CloudLightning, Activity, AlertTriangle, 
  Tractor, Sparkles, Navigation, Loader2
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";
import { useLocation } from "@/context/LocationContext";
import { fetchStates, fetchDistricts, fetchTalukas } from "@/utils/locationApi";

// Simulated 7-day forecast data
const forecastData = [
  { day: 'Mon', tempMax: 32, tempMin: 22, rainProb: 10 },
  { day: 'Tue', tempMax: 34, tempMin: 23, rainProb: 5 },
  { day: 'Wed', tempMax: 35, tempMin: 24, rainProb: 0 },
  { day: 'Thu', tempMax: 33, tempMin: 23, rainProb: 40 },
  { day: 'Fri', tempMax: 29, tempMin: 21, rainProb: 80 },
  { day: 'Sat', tempMax: 28, tempMin: 20, rainProb: 90 },
  { day: 'Sun', tempMax: 30, tempMin: 21, rainProb: 30 },
];

export default function WeatherPage() {
  const { t } = useLanguage();
  const { location, setLocation, detectLocation, isLoadingGPS, error } = useLocation();
  
  // Manual location state
  const [statesList, setStatesList] = useState<string[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [talukasList, setTalukasList] = useState<string[]>([]);
  
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [village, setVillage] = useState("");

  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Initialize states list
  useEffect(() => {
    fetchStates().then(setStatesList);
  }, []);

  // Update districts when state changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedDistrict("");
    setSelectedTaluka("");
    setDistrictsList([]);
    setTalukasList([]);
    if (selectedState) {
      setIsLoadingDropdowns(true);
      fetchDistricts(selectedState).then(d => {
        setDistrictsList(d);
        setIsLoadingDropdowns(false);
      });
    }
  }, [selectedState]);

  // Update talukas when district changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedTaluka("");
    setTalukasList([]);
    if (selectedDistrict) {
      setIsLoadingDropdowns(true);
      fetchTalukas(selectedDistrict).then(t => {
        setTalukasList(t);
        setIsLoadingDropdowns(false);
      });
    }
  }, [selectedDistrict]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedState && selectedDistrict) {
      setLocation({
        state: selectedState,
        district: selectedDistrict,
        taluka: selectedTaluka,
        village: village,
        pincode: ""
      });
    }
  };

  const clearLocation = () => {
    setLocation(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Location & Current Weather */}
            <div className="w-full lg:w-1/3 space-y-6">
              
              {/* Location Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="text-primary-500" /> Farm Location
                  </h2>
                  {location && (
                    <button onClick={clearLocation} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Change
                    </button>
                  )}
                </div>
                
                {!location ? (
                  <>
                    <button 
                      onClick={detectLocation}
                      disabled={isLoadingGPS}
                      className="w-full mb-6 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/50 py-3 rounded-xl font-bold transition-all hover:bg-primary-100 dark:hover:bg-primary-900/40 flex items-center justify-center gap-2"
                    >
                      {isLoadingGPS ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                      {isLoadingGPS ? "Detecting GPS..." : "Auto-Detect Location"}
                    </button>

                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                    <div className="relative flex items-center py-2 mb-6">
                      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR MANUAL ENTRY</span>
                      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    <form onSubmit={handleManualSubmit} className="space-y-4">
                      <select 
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        required 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select State</option>
                        {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      
                      <select 
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        required
                        disabled={!selectedState}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        <option value="">Select District</option>
                        {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>

                      <select 
                        value={selectedTaluka}
                        onChange={(e) => setSelectedTaluka(e.target.value)}
                        disabled={!selectedDistrict || isLoadingDropdowns}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        <option value="">Select Taluka (Optional)</option>
                        {talukasList.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>

                      <input 
                        type="text" 
                        placeholder="Village/City (Optional)"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button type="submit" className="w-full bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-colors">
                        Get Weather
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="font-bold text-gray-900 dark:text-white mb-1">
                      {location.village || location.taluka || location.district}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {[location.district, location.state].filter(Boolean).join(", ")}
                    </p>
                    {location.pincode && <p className="text-xs text-gray-500 mt-1">PIN: {location.pincode}</p>}
                  </div>
                )}
              </div>

              {/* Current Weather Snapshot (Visible after location) */}
              {location && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-blue-100 text-sm font-medium">{location.village || location.taluka || location.district}</h3>
                      <p className="text-3xl font-bold mt-1">{t("dash_weather")}</p>
                    </div>
                    <CloudRain size={48} className="text-blue-100" />
                  </div>
                  
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-6xl font-black">28°</span>
                    <span className="text-xl text-blue-200 mb-1">C</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Droplets size={16} className="text-blue-200" />
                      <span className="text-sm">Humidity: 65%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind size={16} className="text-blue-200" />
                      <span className="text-sm">Wind: 12 km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThermometerSun size={16} className="text-blue-200" />
                      <span className="text-sm">UV: 6 (High)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-blue-200" />
                      <span className="text-sm">AQI: 45 (Good)</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-blue-400/30 flex justify-between">
                    <div className="flex items-center gap-2">
                      <Sunrise size={18} className="text-yellow-300" />
                      <span className="text-sm">06:14 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunset size={18} className="text-orange-300" />
                      <span className="text-sm">06:48 PM</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Right Column: Forecast & AI Advisory */}
            <div className="w-full lg:w-2/3 space-y-6">
              
              {!location ? (
                <div className="bg-white dark:bg-gray-900 rounded-3xl h-full min-h-[400px] flex flex-col items-center justify-center p-10 border border-gray-100 dark:border-gray-800 text-center">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-6">
                    <Sun size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Weather Dashboard</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">Detect or enter your farm&apos;s location on the left to view hyper-local weather forecasts and AI advisories.</p>
                </div>
              ) : (
                <>
                  {/* AI Weather Guidance Panel */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-primary-100 dark:border-primary-900/30 overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5"><Sparkles size={120} /></div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6 relative z-10">
                      <Sparkles className="text-primary-500" /> AI Weather Guidance
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      
                      {/* Irrigation */}
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                          <Droplets size={18} /> Irrigation Advisory
                        </h3>
                        <p className="text-sm text-blue-900 dark:text-blue-300">
                          <span className="font-bold">Hold Irrigation.</span> Heavy rain (80% probability) is expected starting Thursday. Current soil moisture should suffice until then.
                        </p>
                      </div>

                      {/* Spraying */}
                      <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                        <h3 className="font-bold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                          <Tractor size={18} /> Spraying Schedule
                        </h3>
                        <p className="text-sm text-green-900 dark:text-green-300">
                          <span className="font-bold">Optimal Window: Tomorrow 6:00 AM - 9:00 AM.</span> Wind speeds will be below 8 km/h and temperatures will be mild, preventing chemical drift and evaporation.
                        </p>
                      </div>

                      {/* Warnings */}
                      <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30 md:col-span-2">
                        <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                          <AlertTriangle size={18} /> Weather Alerts & Crop Protection
                        </h3>
                        <p className="text-sm text-amber-900 dark:text-amber-300">
                          <strong>High UV & Heat Alert:</strong> UV Index is 6 today in {location.district}. If you have tender vegetable seedlings, consider applying temporary shade nets. 
                          <strong>Storm Warning:</strong> Ensure proper drainage channels are clear before Friday&apos;s heavy downpour.
                        </p>
                      </div>

                    </div>
                  </motion.div>

                  {/* 7-Day Forecast Chart */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                      <CloudLightning className="text-gray-500" /> 7-Day Temperature Trend
                    </h2>
                    
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                          />
                          <Area type="monotone" name="Max Temp °C" dataKey="tempMax" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                          <Area type="monotone" name="Min Temp °C" dataKey="tempMin" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Daily summaries */}
                    <div className="grid grid-cols-7 gap-2 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                      {forecastData.map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                          <span className="text-xs font-bold text-gray-900 dark:text-white mb-2">{day.day}</span>
                          {day.rainProb > 50 ? <CloudRain size={20} className="text-blue-500 mb-2"/> : <Sun size={20} className="text-yellow-500 mb-2"/>}
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{day.tempMax}°</span>
                          <span className="text-xs text-gray-500">{day.tempMin}°</span>
                          <div className="mt-2 text-[10px] text-blue-500 font-medium flex items-center"><Droplets size={10}/> {day.rainProb}%</div>
                        </div>
                      ))}
                    </div>

                  </motion.div>
                </>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
