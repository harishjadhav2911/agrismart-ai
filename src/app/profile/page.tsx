"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  User, MapPin, Sprout, ShieldCheck, TrendingUp, LogOut, Camera, 
  Settings, Save, Globe, MessageSquare, ChevronRight, Edit3, Trash2, ExternalLink
} from "lucide-react";
import { useAuth, UserProfile } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { getLocalizedSchemes } from "@/data/schemes";
import { getLocalizedDistrict, getLocalizedState } from "@/data/indiaLocations";

export default function ProfilePage() {
  const { t, language, openLanguageModal } = useLanguage();
  const { user, isLoading, logout, updateProfile, toggleSaveScheme } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditForm(user);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateProfile({ photoUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile(editForm);
    setIsSaving(false);
    setIsEditing(false);
  };

  const tabs = [
    { id: "personal", label: t("prof_tab_personal", "Personal Details"), icon: <User size={18} /> },
    { id: "farm", label: t("prof_tab_farm", "Farm & Location"), icon: <Sprout size={18} /> },
    { id: "saved", label: t("prof_tab_saved", "Saved Items"), icon: <ShieldCheck size={18} /> },
    { id: "preferences", label: t("prof_tab_pref", "Preferences"), icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 pt-28 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                    {user.photoUrl ? (
                      <Image src={user.photoUrl} alt="Profile" fill className="object-cover" unoptimized />
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {getLocalizedDistrict(user.location.district, language)}, {getLocalizedState(user.location.state, language)}
                </p>
              </div>

              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                      activeTab === tab.id
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium text-sm"
                >
                  <LogOut size={18} />{t("nav_logout")}</button>
              </div>
            </motion.div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-8 lg:col-span-9">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                {(activeTab === "personal" || activeTab === "farm") && (
                  <button 
                    onClick={() => {
                      if(isEditing) handleSave();
                      else setIsEditing(true);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                      isEditing 
                        ? "bg-primary-600 text-white shadow-md shadow-primary-500/20" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isEditing ? (
                      <><Save size={16} /> {t("prof_save_btn", "Save Changes")}</>
                    ) : (
                      <><Edit3 size={16} /> {t("prof_edit_btn", "Edit")}</>
                    )}
                  </button>
                )}
              </div>

              {/* Personal Details */}
              {activeTab === "personal" && (
                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t("reg_full_name", "Full Name")}</label>
                      {isEditing ? (
                        <input type="text" value={editForm.name || ""} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary-500" />
                      ) : (
                        <div className="text-gray-900 dark:text-white font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent">{user.name}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t("reg_phone_num", "Phone Number")}</label>
                      {isEditing ? (
                        <input type="text" value={editForm.phone || ""} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary-500" />
                      ) : (
                        <div className="text-gray-900 dark:text-white font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent">{user.phone}</div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t("login_email")}</label>
                      {isEditing ? (
                        <input type="email" value={editForm.email || ""} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary-500" />
                      ) : (
                        <div className="text-gray-900 dark:text-white font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent">{user.email || "—"}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Farm Details */}
              {activeTab === "farm" && (
                <div className="space-y-8 max-w-2xl">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-primary-500" /> {t("prof_location_title", "Farm Location")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 mb-1">{t("reg_state_label", "State")}</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{getLocalizedState(user.location.state, language)}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 mb-1">{t("reg_district_label", "District")}</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{getLocalizedDistrict(user.location.district, language)}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 mb-1">{t("reg_taluka_label", "Taluka")}</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{user.location.taluka || "—"}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 mb-1">{t("reg_village_label", "Village")}</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{user.location.village || "—"}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                      <Sprout size={20} className="text-green-500" /> {t("prof_profile_title", "Farm Profile")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t("reg_farm_size_label", "Farm Size")}</label>
                        {isEditing ? (
                          <select 
                            value={editForm.farmDetails?.farmSize || ""} 
                            onChange={e => setEditForm({...editForm, farmDetails: {...editForm.farmDetails!, farmSize: e.target.value}})}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary-500"
                          >
                            <option value="Less than 2 Acres">{t("reg_size_less2", "Less than 2 Acres")}</option>
                            <option value="2-5 Acres">{t("reg_size_2to5", "2-5 Acres")}</option>
                            <option value="5-10 Acres">{t("reg_size_5to10", "5-10 Acres")}</option>
                            <option value="More than 10 Acres">{t("reg_size_more10", "More than 10 Acres")}</option>
                          </select>
                        ) : (
                          <div className="text-gray-900 dark:text-white font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent">{user.farmDetails.farmSize || "—"}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t("reg_soil_type_label", "Soil Type")}</label>
                        {isEditing ? (
                          <select 
                            value={editForm.farmDetails?.soilType || ""} 
                            onChange={e => setEditForm({...editForm, farmDetails: {...editForm.farmDetails!, soilType: e.target.value}})}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary-500"
                          >
                            <option value="Black Soil">{t("guide_soil_black", "Black Soil")}</option>
                            <option value="Red Soil">{t("guide_soil_red", "Red Soil")}</option>
                            <option value="Alluvial Soil">{t("guide_soil_alluvial", "Alluvial Soil")}</option>
                            <option value="Sandy Soil">{t("guide_soil_sandy", "Sandy Soil")}</option>
                          </select>
                        ) : (
                          <div className="text-gray-900 dark:text-white font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent">{user.farmDetails.soilType || "—"}</div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t("reg_primary_crop_label", "Primary Crop")}</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editForm.farmDetails?.primaryCrops?.join(", ") || ""} 
                            onChange={e => setEditForm({...editForm, farmDetails: {...editForm.farmDetails!, primaryCrops: e.target.value.split(", ")}})}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary-500" 
                            placeholder="e.g. Cotton, Wheat"
                          />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {user.farmDetails.primaryCrops.length > 0 ? user.farmDetails.primaryCrops.map((crop, i) => (
                              <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">{crop}</span>
                            )) : <span className="text-gray-500 text-sm">—</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Items */}
              {activeTab === "saved" && (
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-primary-500" /> 
                        {t("prof_saved_schemes_title", "Saved Government Schemes")}
                      </h3>
                      <Link 
                        href="/schemes?category=Bookmarked" 
                        className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        {language === 'mr' ? "योजना पोर्टलवर पहा" : language === 'hi' ? "योजना पोर्टल पर देखें" : "View on Portal"}
                        <ExternalLink size={13} />
                      </Link>
                    </div>

                    {savedSchemesList.length > 0 ? (
                      <div className="grid gap-3">
                        {savedSchemesList.map((scheme) => (
                          <div 
                            key={scheme.id} 
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group gap-4"
                          >
                            <Link href="/schemes?category=Bookmarked" className="flex-grow min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-200/70 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                  {scheme.category}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                  {scheme.status}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                  {scheme.launchDate}
                                </span>
                              </div>
                              <div className="font-bold text-gray-900 dark:text-white text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {scheme.name}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                                {scheme.shortDescription}
                              </p>
                            </Link>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button 
                                onClick={() => toggleSaveScheme(scheme.id)}
                                title={language === 'mr' ? "योजना काढा (Unsave)" : language === 'hi' ? "योजना हटाएं (Unsave)" : "Remove bookmark"}
                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center border border-dashed border-gray-300 dark:border-gray-700">
                        <ShieldCheck size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="font-medium text-gray-600 dark:text-gray-300 mb-2">
                          {language === 'mr' ? "अद्याप कोणतीही सरकारी योजना जतन केलेली नाही." : language === 'hi' ? "अभी तक कोई सरकारी योजना सहेजी नहीं गई है।" : "No government schemes bookmarked yet."}
                        </p>
                        <Link 
                          href="/schemes" 
                          className="inline-block mt-1 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors"
                        >
                          {language === 'mr' ? "योजना शोधा व जतन करा" : language === 'hi' ? "योजनाएं खोजें व सहेजें" : "Explore Schemes"}
                        </Link>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                      <TrendingUp size={20} className="text-orange-500" /> {t("prof_saved_market_title", "Saved Market Prices")}
                    </h3>
                    {user.savedMarketPrices.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {user.savedMarketPrices.map((price, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer group">
                            <div className="font-medium text-gray-900 dark:text-white">{price}</div>
                            <ChevronRight size={18} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center border border-dashed border-gray-300 dark:border-gray-700">
                        {t("prof_no_market_saved", "No market prices saved yet.")}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === "preferences" && (
                <div className="space-y-6 max-w-xl">
                  <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                        <Globe size={18} className="text-primary-500" /> {t("prof_app_lang", "App Language")}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("prof_app_lang_desc", "Your selected language for AI recommendations and interface.")}
                      </p>
                    </div>
                    <button 
                      onClick={openLanguageModal}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Globe size={15} />
                      <span>{language === "mr" ? "मराठी (बदला)" : language === "hi" ? "हिंदी (बदलें)" : "English (Change)"}</span>
                    </button>
                  </div>

                  <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                        <MessageSquare size={18} className="text-purple-500" /> {t("prof_chat_history", "AI Chat History")}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === "mr" 
                          ? `तुमच्याकडे ${user.chatHistoryCount} मागील सल्ला सत्रे आहेत.` 
                          : language === "hi" 
                          ? `आपके पास ${user.chatHistoryCount} पिछले परामर्श सत्र हैं।` 
                          : `You have ${user.chatHistoryCount} past AI consultations.`}
                      </p>
                    </div>
                    <Link href="/guidance" className="text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                      {language === "mr" ? "सल्लागार उघडा" : language === "hi" ? "सलाहकार खोलें" : "Open Advisor"}
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
