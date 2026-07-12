"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Sprout, Beaker, MapPin, Search, ArrowRight, AlertCircle } from "lucide-react";

export default function CropRecommendationPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    ph: "",
    rainfall: "",
    state: "",
    season: "Kharif",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate API delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        crop: "Cotton",
        confidence: 94.5,
        yield: "18-22 Quintals / Hectare",
        fertilizer: "Urea (50kg), DAP (25kg)",
        marketPrice: "₹4,200 - ₹4,500 / qtl",
        reason: "The NPK values and soil pH (6.5) are ideal for Cotton cultivation during the Kharif season in this region with expected rainfall."
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full mb-4">
            <Sprout size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("croprec_title")}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Enter your soil parameters and environmental conditions to get the most profitable crop recommendation powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Beaker size={20} className="text-primary-500" /> Soil & Environment Data
            </h2>
            
            <form onSubmit={handlePredict} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nitrogen (N)</label>
                  <input type="number" required placeholder="e.g. 90" value={formData.nitrogen} onChange={(e) => setFormData({...formData, nitrogen: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phosphorous (P)</label>
                  <input type="number" required placeholder="e.g. 42" value={formData.phosphorous} onChange={(e) => setFormData({...formData, phosphorous: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Potassium (K)</label>
                  <input type="number" required placeholder="e.g. 43" value={formData.potassium} onChange={(e) => setFormData({...formData, potassium: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("croprec_ph")}</label>
                  <input type="number" step="0.1" required placeholder="e.g. 6.5" value={formData.ph} onChange={(e) => setFormData({...formData, ph: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rainfall (mm)</label>
                  <input type="number" required placeholder="e.g. 200" value={formData.rainfall} onChange={(e) => setFormData({...formData, rainfall: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / State</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input type="text" required placeholder="e.g. Maharashtra" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Season</label>
                  <select value={formData.season} onChange={(e) => setFormData({...formData, season: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white">
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                    <option value="All Year">All Year</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing Constraints...
                  </>
                ) : (
                  <>
                    <Search size={20} />{t("croprec_get")}</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Area */}
          <div className="relative">
            {/* Empty State */}
            {!isAnalyzing && !result && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-100/50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-8 text-center">
                <Sprout size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">Ready to Analyze</h3>
                <p className="text-gray-400 dark:text-gray-500 max-w-sm">
                  Fill in your farm&apos;s parameters on the left and our AI will crunch the data to find your optimal crop.
                </p>
              </div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 text-center shadow-lg"
              >
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-primary-500">
                    <Beaker size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Processing Data</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">AI couldn&apos;t generate a recommendation for these specific conditions. Please try adjusting your parameters.</p>
              </motion.div>
            )}

            {/* Results Display */}
            <AnimatePresence>
              {result && !isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full bg-gradient-to-br from-primary-600 to-primary-900 rounded-3xl p-8 shadow-xl text-white overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sprout size={160} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                        <AlertCircle size={14} /> AI Recommendation
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-primary-200">Confidence</div>
                        <div className="text-2xl font-bold">{result.confidence}%</div>
                      </div>
                    </div>

                    <h2 className="text-5xl font-extrabold mb-2">{result.crop}</h2>
                    <p className="text-primary-100 text-lg mb-8 max-w-md">
                      {result.reason}
                    </p>

                    <div className="space-y-4 flex-grow">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="text-primary-200 text-sm mb-1">Expected Yield</div>
                        <div className="text-xl font-bold">{result.yield}</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="text-primary-200 text-sm mb-1">Fertilizer Recommendation</div>
                        <div className="text-xl font-bold">{result.fertilizer}</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="text-primary-200 text-sm mb-1">Current Market Trend</div>
                        <div className="text-xl font-bold">{result.marketPrice}</div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button className="w-full py-4 bg-white text-primary-700 hover:bg-gray-50 font-bold rounded-xl transition-all shadow-md flex justify-center items-center gap-2">
                        View Detailed Cultivation Guide <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
