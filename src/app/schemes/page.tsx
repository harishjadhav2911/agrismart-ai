"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Bookmark, BookmarkCheck, Volume2, ArrowRight, Info, MapPin, Landmark,
  X, User, ArrowUpRight, Bot
} from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import { schemesData, Scheme } from "@/data/schemes";
import { useLanguage } from "@/context/LanguageContext";
import { useGeminiChat } from "@/hooks/useGeminiChat";

export default function SchemesPage() {
  const { t } = useLanguage();
  const { location } = useLocation();
  const { language } = useLanguage();
  const [chatInput, setChatInput] = useState("");
  const { messages, isLoading, sendMessage } = useGeminiChat("Government Schemes Page", "schemes_chat_welcome");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  
  // Load bookmarks on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("agrismart_bookmarks");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setBookmarks(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening modal if clicking on card bookmark button
    setBookmarks(prev => {
      const updated = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      localStorage.setItem("agrismart_bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Rough language mapping for TTS if supported by OS, defaulting to current OS lang
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const categories = ["All", "Financial", "Insurance", "Infrastructure", "Technology", "Soil Health", "Bookmarked"];

  // Sort and Filter logic
  const filteredSchemes = schemesData
    .filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            scheme.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeCategory === "Bookmarked") {
        return matchesSearch && bookmarks.includes(scheme.id);
      }
      
      const matchesCategory = activeCategory === "All" || scheme.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Prioritize by location if available
      if (location && location.state) {
        const aRelevant = a.stateTags.includes("All") || a.stateTags.includes(location.state);
        const bRelevant = b.stateTags.includes("All") || b.stateTags.includes(location.state);
        if (aRelevant && !bRelevant) return -1;
        if (!aRelevant && bRelevant) return 1;
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Landmark className="text-primary-500" size={36} />{t("nav_gov")}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl text-lg">
                Discover and apply for agricultural subsidies, insurance, and financial support.
              </p>
              {location && location.state && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium border border-primary-100 dark:border-primary-800">
                  <MapPin size={14} /> Showing prioritized schemes for {location.state}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-auto relative">
              <input 
                type="text" 
                placeholder={t("schemes_search")} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex overflow-x-auto pb-4 mb-6 gap-2 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                  activeCategory === cat 
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/30" 
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {cat === "Bookmarked" && <Bookmark size={14} className="inline mr-1" />}
                {cat}
              </button>
            ))}
          </div>

          {/* Schemes Grid */}
          {filteredSchemes.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
              <Landmark size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No schemes found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => {
                const isBookmarked = bookmarks.includes(scheme.id);
                const isHighlyRelevant = location?.state && (scheme.stateTags.includes(location.state) || scheme.stateTags.includes("All"));

                return (
                  <motion.div
                    key={scheme.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedScheme(scheme)}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
                  >
                    {isHighlyRelevant && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                        Recommended
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {scheme.category}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleSpeak(`${scheme.name}. ${scheme.shortDescription}`, e)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="Listen"
                        >
                          <Volume2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => toggleBookmark(scheme.id, e)}
                          className={`p-1.5 transition-colors ${isBookmarked ? "text-primary-600 dark:text-primary-400" : "text-gray-400 hover:text-primary-600"}`}
                        >
                          {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {scheme.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                      {scheme.shortDescription}
                    </p>
                    
                    <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Updated: {scheme.updatedDate}</span>
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Details <ArrowRight size={16} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Scheme Detail Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScheme(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-3 inline-block">
                      {selectedScheme.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedScheme.name}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedScheme(null)}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 border-l-4 border-primary-500 pl-4">
                  {selectedScheme.shortDescription}
                </p>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Landmark className="text-primary-500" size={20} /> Key Benefits
                    </h3>
                    <ul className="space-y-2">
                      {selectedScheme.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <span className="text-green-500 mt-1">•</span> {b}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <User className="text-primary-500" size={20} /> Eligibility
                    </h3>
                    <ul className="space-y-2">
                      {selectedScheme.eligibility.map((e, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <span className="text-blue-500 mt-1">•</span> {e}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Info className="text-primary-500" size={20} /> Required Documents
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedScheme.documents.map((d, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-gray-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-2">Application Process</h3>
                    <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
                      {selectedScheme.process}
                    </p>
                  </section>
                </div>
              </div>

              {/* Modal Footer / CTA */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-4">
                <button 
                  onClick={() => {
                    if ("speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(`
                        ${selectedScheme.name}. 
                        Benefits include: ${selectedScheme.benefits.join(". ")}.
                        Eligibility: ${selectedScheme.eligibility.join(". ")}.
                      `);
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="px-6 py-3 rounded-xl font-bold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Volume2 size={18} /> Read Aloud
                </button>
                
                <a 
                  href={selectedScheme.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2"
                >{t("schemes_apply")}<ArrowUpRight size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  <span className="font-bold">Schemes Assistant</span>
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
                    placeholder="Ask about PM-KISAN, KCC..." 
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
