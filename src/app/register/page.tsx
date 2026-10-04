"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, ChevronRight, Check, ChevronLeft, Loader2, Sprout } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { fetchStates, fetchDistricts, fetchTalukas, fetchVillages } from "@/utils/locationApi";
import BrandLogo from "@/components/BrandLogo";

export default function RegisterPage() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    farmSize: "",
    soilType: "",
    primaryCrop: "",
  });

  // Location Data State
  const [statesList, setStatesList] = useState<string[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [talukasList, setTalukasList] = useState<string[]>([]);
  const [villagesList, setVillagesList] = useState<string[]>([]);

  useEffect(() => {
    fetchStates().then(setStatesList).catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.state) {
      fetchDistricts(formData.state).then(setDistrictsList).catch(console.error);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, district: "", taluka: "", village: "" }));
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.district) {
      fetchTalukas(formData.district).then(setTalukasList).catch(console.error);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, taluka: "", village: "" }));
    }
  }, [formData.district]);

  useEffect(() => {
    if (formData.taluka) {
      fetchVillages(formData.taluka).then(setVillagesList).catch(console.error);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, village: "" }));
    }
  }, [formData.taluka]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }
    
    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: {
          state: formData.state,
          district: formData.district,
          taluka: formData.taluka,
          village: formData.village
        },
        farmDetails: {
          farmSize: formData.farmSize,
          soilType: formData.soilType,
          primaryCrops: formData.primaryCrop ? [formData.primaryCrop] : []
        },
        preferences: { language }
      }, formData.password);
      
      router.push("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center mb-8 gap-4">
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
            step >= num 
              ? "bg-primary-600 text-white" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
          }`}>
            {step > num ? <Check size={18} /> : num}
          </div>
          {num < 3 && (
            <div className={`w-12 h-1 mx-2 rounded-full transition-colors ${
              step > num ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8 flex flex-col items-center">
              <BrandLogo size="lg" className="mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("reg_title", "Create Account")}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                {t("reg_subtitle", "Join AgriSmart AI and transform your farming.")}
              </p>
            </div>

            {renderStepIndicator()}

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-4">
                      <User className="text-primary-600 dark:text-primary-400" size={20} />{t("reg_step1")}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_full_name", "Full Name")}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none" placeholder="Ramesh Kumar" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_phone_num", "Phone Number")}</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none" placeholder="+91 9876543210" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_email_opt", "Email (Optional)")}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none" placeholder="farmer@agrismart.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_create_pass", "Create Password")}</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none" placeholder="••••••••" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-4">
                      <MapPin className="text-primary-600 dark:text-primary-400" size={20} />{t("reg_step2")}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_state_label", "State")}</label>
                        <select name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none">
                          <option value="">{t("reg_select_state", "Select State")}</option>
                          {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_district_label", "District")}</label>
                        <select name="district" value={formData.district} onChange={handleChange} required disabled={!formData.state} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none disabled:opacity-50">
                          <option value="">{t("reg_select_district", "Select District")}</option>
                          {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_taluka_label", "Taluka")}</label>
                        <select name="taluka" value={formData.taluka} onChange={handleChange} required disabled={!formData.district} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none disabled:opacity-50">
                          <option value="">{t("reg_select_taluka", "Select Taluka")}</option>
                          {talukasList.map(tOption => <option key={tOption} value={tOption}>{tOption}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_village_label", "Village (Optional)")}</label>
                        <select name="village" value={formData.village} onChange={handleChange} disabled={!formData.taluka} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none disabled:opacity-50">
                          <option value="">{t("reg_select_village", "Select Village")}</option>
                          {villagesList.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-4">
                      <Sprout className="text-primary-600 dark:text-primary-400" size={20} />{t("reg_step3")}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_farm_size_label", "Farm Size")}</label>
                        <select name="farmSize" value={formData.farmSize} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none">
                          <option value="">{t("reg_select_size", "Select Size")}</option>
                          <option value="Less than 2 Acres">{t("reg_size_less2", "Less than 2 Acres")}</option>
                          <option value="2-5 Acres">{t("reg_size_2to5", "2-5 Acres")}</option>
                          <option value="5-10 Acres">{t("reg_size_5to10", "5-10 Acres")}</option>
                          <option value="More than 10 Acres">{t("reg_size_more10", "More than 10 Acres")}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_soil_type_label", "Soil Type")}</label>
                        <select name="soilType" value={formData.soilType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none">
                          <option value="">{t("guide_soil_type", "Select Soil Type")}</option>
                          <option value="Black Soil">{t("guide_soil_black", "Black Soil")}</option>
                          <option value="Red Soil">{t("guide_soil_red", "Red Soil")}</option>
                          <option value="Alluvial Soil">{t("guide_soil_alluvial", "Alluvial Soil")}</option>
                          <option value="Laterite Soil">{t("guide_soil_laterite", "Laterite Soil")}</option>
                          <option value="Sandy Soil">{t("guide_soil_sandy", "Sandy Soil")}</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("reg_primary_crop_label", "Primary Crop")}</label>
                        <input type="text" name="primaryCrop" value={formData.primaryCrop} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:outline-none" placeholder="e.g. Cotton, Wheat, Rice" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-10">
                {step > 1 ? (
                  <button type="button" onClick={handleBack} className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <ChevronLeft size={18} /> {t("reg_back_btn", "Back")}
                  </button>
                ) : (
                  <div></div>
                )}
                <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : step < 3 ? t("reg_next_btn", "Next Step") : t("reg_submit_btn", "Complete Registration")}
                  {!isSubmitting && step < 3 && <ChevronRight size={18} />}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {t("reg_already_acc", "Already have an account?")}{" "}
              <Link href="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                {t("reg_login_link", "Sign in here")}
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
