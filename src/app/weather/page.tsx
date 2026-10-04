"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { 
  MapPin, CloudRain, Sun, Wind, Droplets, ThermometerSun, 
  Sunrise, Sunset, CloudLightning, Activity, AlertTriangle, 
  Tractor, Sparkles, Navigation, Loader2, RefreshCw, AlertCircle
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";
import { useLocation } from "@/context/LocationContext";
import { fetchStates, fetchDistricts, fetchTalukas } from "@/utils/locationApi";
import { getLocalizedState, getLocalizedDistrict, getLocalizedTaluka } from "@/data/indiaLocations";
import { fetchLiveWeatherData, getCoordinatesForLocation, LiveWeatherData } from "@/utils/weatherApi";

export default function WeatherPage() {
  const { t, language } = useLanguage();
  const { location, setLocation, detectLocation, isLoadingGPS, error: gpsError } = useLocation();
  
  // Manual location state
  const [statesList, setStatesList] = useState<string[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [talukasList, setTalukasList] = useState<string[]>([]);
  
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [village, setVillage] = useState("");

  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Live Weather API state
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Initialize states list
  useEffect(() => {
    fetchStates().then(setStatesList);
  }, []);

  // Update districts when state changes
  useEffect(() => {
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

  // Fetch Live Weather function
  const loadWeatherForCurrentLocation = useCallback(async () => {
    if (!location) return;

    setIsLoadingWeather(true);
    setWeatherError(null);

    try {
      let lat = location.lat;
      let lon = location.lon;

      if (!lat || !lon) {
        const coords = await getCoordinatesForLocation(
          location.state,
          location.district,
          location.taluka,
          location.village
        );
        lat = coords.lat;
        lon = coords.lon;
      }

      const liveData = await fetchLiveWeatherData(lat, lon);
      setWeatherData(liveData);
    } catch (err: unknown) {
      console.error("Live weather fetching error:", err);
      setWeatherError("Unable to fetch live weather. Please check your internet connection and try again.");
    } finally {
      setIsLoadingWeather(false);
    }
  }, [location]);

  // Auto-fetch weather when location changes
  useEffect(() => {
    if (location) {
      loadWeatherForCurrentLocation();
    } else {
      setWeatherData(null);
    }
  }, [location, loadWeatherForCurrentLocation]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedState && selectedDistrict) {
      setIsLoadingWeather(true);
      const coords = await getCoordinatesForLocation(selectedState, selectedDistrict, selectedTaluka, village);
      
      setLocation({
        state: selectedState,
        district: selectedDistrict,
        taluka: selectedTaluka,
        village: village,
        pincode: "",
        lat: coords.lat,
        lon: coords.lon
      });
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setWeatherData(null);
  };

  const displayForecastData = (weatherData?.forecast || []).map(d => ({
    ...d,
    day: language === 'mr' ? d.dayMr : language === 'hi' ? d.dayHi : d.dayEn
  }));

  const conditionText = weatherData?.current.weatherCondition[language as 'en' | 'mr' | 'hi'] || 
                        weatherData?.current.weatherCondition.en || 
                        t("dash_weather", "Partly Cloudy");

  const aqiLabelText = weatherData?.current.aqiLabel[language as 'en' | 'mr' | 'hi'] || 
                       weatherData?.current.aqiLabel.en || 
                       "Good";

  const irrigAdvisory = weatherData?.advisory.irrigation[language as 'en' | 'mr' | 'hi'] || 
                        weatherData?.advisory.irrigation.en || "";

  const sprayAdvisory = weatherData?.advisory.spraying[language as 'en' | 'mr' | 'hi'] || 
                        weatherData?.advisory.spraying.en || "";

  const protectAdvisory = weatherData?.advisory.protection[language as 'en' | 'mr' | 'hi'] || 
                          weatherData?.advisory.protection.en || "";

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
                    <MapPin className="text-primary-500" /> {t("weather_farm_loc", "Farm Location")}
                  </h2>
                  {location && (
                    <button onClick={clearLocation} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                      {t("weather_change", "Change")}
                    </button>
                  )}
                </div>
                
                {!location ? (
                  <>
                    <button 
                      onClick={detectLocation}
                      disabled={isLoadingGPS}
                      className="w-full mb-6 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/50 py-3 rounded-xl font-bold transition-all hover:bg-primary-100 dark:hover:bg-primary-900/40 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoadingGPS ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                      <span>{isLoadingGPS ? "Detecting GPS..." : t("weather_autodetect", "Auto-Detect Location")}</span>
                    </button>

                    {gpsError && <p className="text-red-500 text-sm mb-4 text-center">{gpsError}</p>}

                    <div className="relative flex items-center py-2 mb-6">
                      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">{t("weather_manual_or", "OR MANUAL ENTRY")}</span>
                      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    </div>

                    <form onSubmit={handleManualSubmit} className="space-y-4">
                      <select 
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        required 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                      >
                        <option value="">{t("weather_select_state", "Select State")}</option>
                        {statesList.map(s => (
                          <option key={s} value={s}>
                            {getLocalizedState(s, language)}
                          </option>
                        ))}
                      </select>
                      
                      <select 
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        required
                        disabled={!selectedState}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 font-medium"
                      >
                        <option value="">{t("weather_select_district", "Select District")}</option>
                        {districtsList.map(d => (
                          <option key={d} value={d}>
                            {getLocalizedDistrict(d, language)}
                          </option>
                        ))}
                      </select>

                      <select 
                        value={selectedTaluka}
                        onChange={(e) => setSelectedTaluka(e.target.value)}
                        disabled={!selectedDistrict || isLoadingDropdowns}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 font-medium"
                      >
                        <option value="">{t("weather_select_taluka", "Select Taluka (Optional)")}</option>
                        {talukasList.map(tName => (
                          <option key={tName} value={tName}>
                            {getLocalizedTaluka(tName, language)}
                          </option>
                        ))}
                      </select>

                      <input 
                        type="text" 
                        placeholder={t("weather_village", "Village/City (Optional)")}
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                      />
                      <button 
                        type="submit" 
                        disabled={isLoadingWeather}
                        className="w-full bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {isLoadingWeather ? <Loader2 size={18} className="animate-spin" /> : null}
                        <span>{isLoadingWeather ? "Fetching Live Data..." : t("weather_get_btn", "Get Weather")}</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          {location.village || getLocalizedTaluka(location.taluka, language) || getLocalizedDistrict(location.district, language)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {[getLocalizedTaluka(location.taluka, language), getLocalizedDistrict(location.district, language), getLocalizedState(location.state, language)].filter(Boolean).join(", ")}
                        </p>
                        {location.lat && location.lon && (
                          <p className="text-[11px] text-gray-400 mt-1">
                            GPS: {location.lat.toFixed(3)}°N, {location.lon.toFixed(3)}°E
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={loadWeatherForCurrentLocation}
                        disabled={isLoadingWeather}
                        title="Refresh Live Weather"
                        className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                      >
                        <RefreshCw size={16} className={isLoadingWeather ? "animate-spin" : ""} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Weather Snapshot (Live Data) */}
              {location && (
                isLoadingWeather && !weatherData ? (
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-xl flex flex-col items-center justify-center min-h-[300px]">
                    <Loader2 size={36} className="animate-spin mb-3 text-blue-200" />
                    <p className="text-sm font-semibold text-blue-100">Fetching live Open-Meteo data...</p>
                  </div>
                ) : weatherData ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-blue-100 text-xs font-medium uppercase tracking-wider">
                          {[location.village || getLocalizedTaluka(location.taluka, language), getLocalizedDistrict(location.district, language)].filter(Boolean).join(", ") || getLocalizedDistrict(location.district, language)}
                        </h3>
                        <p className="text-2xl sm:text-3xl font-bold mt-1">{conditionText}</p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        {weatherData.current.precipitation > 0 ? (
                          <CloudRain size={36} className="text-blue-200" />
                        ) : (
                          <Sun size={36} className="text-yellow-300" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-end gap-2 mb-8">
                      <span className="text-6xl font-black">{weatherData.current.temp}°</span>
                      <span className="text-xl text-blue-200 mb-1">C</span>
                      <span className="text-xs text-blue-200 ml-2 mb-2 font-medium">
                        (Feels like {weatherData.current.feelsLike}°C)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 text-xs">
                      <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                        <Droplets size={16} className="text-blue-200 shrink-0" />
                        <span>{t("weather_humidity", "Humidity")}: <strong>{weatherData.current.humidity}%</strong></span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                        <Wind size={16} className="text-blue-200 shrink-0" />
                        <span>{t("weather_wind", "Wind")}: <strong>{weatherData.current.windSpeed} km/h</strong></span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                        <ThermometerSun size={16} className="text-yellow-300 shrink-0" />
                        <span>{t("weather_uv", "UV")}: <strong>{weatherData.current.uvIndex}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                        <Activity size={16} className="text-emerald-300 shrink-0" />
                        <span>{t("weather_aqi", "AQI")}: <strong>{weatherData.current.aqi} ({aqiLabelText})</strong></span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-5 border-t border-blue-400/30 flex justify-between text-xs text-blue-100">
                      <div className="flex items-center gap-1.5">
                        <Sunrise size={16} className="text-yellow-300" />
                        <span>{weatherData.current.sunriseTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sunset size={16} className="text-orange-300" />
                        <span>{weatherData.current.sunsetTime}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : null
              )}

            </div>

            {/* Right Column: Forecast & AI Advisory */}
            <div className="w-full lg:w-2/3 space-y-6">
              
              {!location ? (
                <div className="bg-white dark:bg-gray-900 rounded-3xl h-full min-h-[400px] flex flex-col items-center justify-center p-10 border border-gray-100 dark:border-gray-800 text-center">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-6">
                    <Sun size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("weather_title", "Smart Weather & Location")}</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
                    {t("weather_detect_prompt", "Detect or enter your farm's location on the left to view hyper-local weather forecasts and AI advisories.")}
                  </p>
                </div>
              ) : weatherError ? (
                <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-3xl text-center">
                  <AlertCircle size={36} className="text-red-500 mx-auto mb-2" />
                  <h3 className="font-bold text-red-900 dark:text-red-300 mb-1">Weather Data Unavailable</h3>
                  <p className="text-xs text-red-700 dark:text-red-400 mb-4">{weatherError}</p>
                  <button 
                    onClick={loadWeatherForCurrentLocation}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    Retry Fetching
                  </button>
                </div>
              ) : weatherData ? (
                <>
                  {/* Dynamic Agrometeorological Guidance Panel */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-primary-100 dark:border-primary-900/30 overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5"><Sparkles size={120} /></div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6 relative z-10">
                      <Sparkles className="text-primary-500" /> {t("weather_ai_guidance", "AI Weather Guidance")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      
                      {/* Dynamic Irrigation Guidance */}
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2 text-sm sm:text-base">
                          <Droplets size={18} className="text-blue-600" /> {t("weather_irrig_advisory", "Irrigation Advisory")}
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-300 leading-relaxed">
                          {irrigAdvisory}
                        </p>
                      </div>

                      {/* Dynamic Spraying Guidance */}
                      <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                        <h3 className="font-bold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2 text-sm sm:text-base">
                          <Tractor size={18} className="text-green-600" /> {t("weather_spray_sched", "Spraying Schedule")}
                        </h3>
                        <p className="text-xs sm:text-sm text-green-900 dark:text-green-300 leading-relaxed">
                          {sprayAdvisory}
                        </p>
                      </div>

                      {/* Dynamic Weather Alerts & Crop Protection */}
                      <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30 md:col-span-2">
                        <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2 text-sm sm:text-base">
                          <AlertTriangle size={18} className="text-amber-600" /> {t("weather_alerts_title", "Weather Alerts & Crop Protection")}
                        </h3>
                        <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-300 leading-relaxed">
                          {protectAdvisory}
                        </p>
                      </div>

                    </div>
                  </motion.div>

                  {/* Real 7-Day Forecast Chart */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                      <CloudLightning className="text-gray-500" /> {t("weather_7day_trend", "7-Day Temperature Trend")}
                    </h2>
                    
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={displayForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

                    {/* Daily summaries with live probabilities */}
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                      {displayForecastData.map((dayItem, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                          <span className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white mb-1.5">{dayItem.day}</span>
                          {dayItem.rainProb > 40 || dayItem.weatherCode >= 51 ? (
                            <CloudRain size={18} className="text-blue-500 mb-1.5 shrink-0" />
                          ) : (
                            <Sun size={18} className="text-yellow-500 mb-1.5 shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{dayItem.tempMax}°</span>
                          <span className="text-[10px] sm:text-xs text-gray-400">{dayItem.tempMin}°</span>
                          <div className="mt-1.5 text-[9px] sm:text-[10px] text-blue-500 font-semibold flex items-center gap-0.5">
                            <Droplets size={9} /> {dayItem.rainProb}%
                          </div>
                        </div>
                      ))}
                    </div>

                  </motion.div>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800">
                  <Loader2 size={36} className="animate-spin text-primary-500 mb-3" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Loading live weather and agrometeorological insights...</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
