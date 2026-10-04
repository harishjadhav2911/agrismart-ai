"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, Image as ImageIcon, ShieldAlert, Sparkles, Loader2, 
  CheckCircle, Activity, Leaf, FlaskConical, Stethoscope,
  Volume2, VolumeX, Send, Bot, User, Trash2, Camera, X, 
  AlertCircle, ShieldCheck, HelpCircle, Layers, RefreshCw, GitCompare
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGeminiChat } from "@/hooks/useGeminiChat";
import { FormattedChatMessage } from "@/components/chat/FormattedChatMessage";

// Extend window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: unknown;
    webkitSpeechRecognition: unknown;
  }
}

interface DiseaseDiagnosisResult {
  isPlant: boolean;
  isClear: boolean;
  isHealthy: boolean;
  confidenceScore: number;
  confidenceLevel: "High Confidence" | "Possible / Not Certain" | "Uncertain / Re-take Photo";
  crop: string;
  cropMarathi?: string;
  cropHindi?: string;
  diseaseName: string;
  diseaseNameMarathi?: string;
  diseaseNameHindi?: string;
  pathogen: string;
  symptoms: string;
  rootObservations?: string;
  consistencyCheck?: string;
  organicTreatment: string;
  chemicalTreatment: string;
  recommendedChemical: string;
  dosagePerLiter: string;
  dosagePerAcre: string;
  phiDays: number;
  prevention: string;
  sourceReference: {
    institution: string;
    document: string;
  };
  warnings?: string[];
}

export default function DiseaseDetectionPage() {
  const { t, language } = useLanguage();
  
  // Dual Image State: Leaf and Root
  const [leafFile, setLeafFile] = useState<File | null>(null);
  const [leafPreviewUrl, setLeafPreviewUrl] = useState<string | null>(null);

  const [rootFile, setRootFile] = useState<File | null>(null);
  const [rootPreviewUrl, setRootPreviewUrl] = useState<string | null>(null);

  const [step, setStep] = useState<"upload" | "scanning" | "results" | "error">("upload");
  const [selectedCrop, setSelectedCrop] = useState("Auto-Detect");
  
  // Diagnosis Result State
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active camera target: 'leaf' | 'root' | null
  const [activeCameraTarget, setActiveCameraTarget] = useState<"leaf" | "root" | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async (target: "leaf" | "root") => {
    setActiveCameraTarget(target);
    setCameraError(null);
    setIsLoadingCamera(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: unknown) {
      console.error("Error accessing camera:", err);
      setCameraError(language === "mr" ? "कॅमेरा सुरू करता आला नाही. कृपया इमेज अपलोड वापरा." : language === "hi" ? "कैमरा शुरू नहीं हो सका। कृपया फोटो अपलोड का उपयोग करें।" : "Camera access denied or not available. Please use image upload.");
      setActiveCameraTarget(null);
    } finally {
      setIsLoadingCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setActiveCameraTarget(null);
    setIsLoadingCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && activeCameraTarget) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], `${activeCameraTarget}-capture.jpg`, { type: "image/jpeg" });
            if (activeCameraTarget === "leaf") {
              setLeafFile(capturedFile);
              setLeafPreviewUrl(URL.createObjectURL(capturedFile));
            } else {
              setRootFile(capturedFile);
              setRootPreviewUrl(URL.createObjectURL(capturedFile));
            }
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  // Follow-up Chat State
  const chatContext = diagnosis 
    ? `Diagnosed Crop: ${diagnosis.crop}, Disease: ${diagnosis.diseaseName}, Pathogen: ${diagnosis.pathogen}, Recommended: ${diagnosis.recommendedChemical}, Dosages: ${diagnosis.dosagePerLiter}`
    : "Crop Disease Diagnosis Assistant";

  const { messages, isLoading, sendMessage } = useGeminiChat(chatContext, "disease_chat_welcome");
  const [inputValue, setInputValue] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
  
  // Voice State
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN";
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleLeafFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setLeafFile(selected);
      setLeafPreviewUrl(URL.createObjectURL(selected));
      setErrorMessage(null);
    }
  };

  const handleRootFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setRootFile(selected);
      setRootPreviewUrl(URL.createObjectURL(selected));
      setErrorMessage(null);
    }
  };

  // File to Base64 helper
  const fileToBase64 = (fileObj: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileObj);
    });
  };

  const startAnalysis = async () => {
    if (!leafFile && !rootFile) {
      setErrorMessage(language === "mr" ? "कृपया किमान एक फोटो (पानाचा किंवा मुळांचा) निवडा." : language === "hi" ? "कृपया कम से कम एक फोटो (पत्ती या जड़) चुनें।" : "Please upload at least one image (Leaf or Root).");
      return;
    }

    setStep("scanning");
    setErrorMessage(null);

    try {
      let leafBase64 = null;
      let rootBase64 = null;

      if (leafFile) {
        leafBase64 = await fileToBase64(leafFile);
      }
      if (rootFile) {
        rootBase64 = await fileToBase64(rootFile);
      }

      const res = await fetch("/api/disease-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leafImageBase64: leafBase64,
          rootImageBase64: rootBase64,
          mimeType: leafFile?.type || "image/jpeg",
          rootMimeType: rootFile?.type || "image/jpeg",
          cropHint: selectedCrop,
          language: language,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "Failed to analyze image.");
      }

      const data: DiseaseDiagnosisResult = json.data;
      setDiagnosis(data);
      setStep("results");

      // Multilingual voice readout
      setTimeout(() => {
        const displayCrop = language === "mr" ? (data.cropMarathi || data.crop) : language === "hi" ? (data.cropHindi || data.crop) : data.crop;
        const displayDisease = language === "mr" ? (data.diseaseNameMarathi || data.diseaseName) : language === "hi" ? (data.diseaseNameHindi || data.diseaseName) : data.diseaseName;

        if (data.isHealthy) {
          speakText(language === "mr" ? `${displayCrop} पीक पूर्णपणे निरोगी आहे.` : language === "hi" ? `${displayCrop} की फसल पूर्णतः स्वस्थ है।` : `${displayCrop} plant is healthy.`);
        } else if (!data.isPlant || !data.isClear) {
          speakText(language === "mr" ? "चित्रात स्पष्ट दृश्य नाही. कृपया नवीन फोटो काढा." : language === "hi" ? "चित्र स्पष्ट नहीं है। कृपया नया फोटो लें।" : "Unable to identify plant. Please retake photo.");
        } else {
          const speech = language === "mr"
            ? `पीक: ${displayCrop}. ओळखलेला रोग: ${displayDisease}. खात्री: ${data.confidenceScore} टक्के.`
            : language === "hi"
            ? `फसल: ${displayCrop}. पहचाना गया रोग: ${displayDisease}. सटीकता: ${data.confidenceScore} प्रतिशत.`
            : `Diagnosed Crop: ${displayCrop}. Detected Disease: ${displayDisease}. Confidence: ${data.confidenceScore} percent.`;
          speakText(speech);
        }
      }, 600);

    } catch (err: unknown) {
      console.error("Diagnosis error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to analyze image. Please check your network and try again.");
      setStep("error");
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const resetForm = () => {
    setLeafFile(null);
    setLeafPreviewUrl(null);
    setRootFile(null);
    setRootPreviewUrl(null);
    setDiagnosis(null);
    setStep("upload");
    stopSpeaking();
    stopCamera();
    setCameraError(null);
    setErrorMessage(null);
  };

  const hasBoth = Boolean(leafFile && rootFile);
  const currentMode = hasBoth ? "combined" : rootFile ? "root_only" : leafFile ? "leaf_only" : "none";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-300 dark:border-emerald-800">
              <Stethoscope size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>{t("disease_tagline", "ICAR Aligned Plant Pathology AI")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {t("disease_title", "Crop Leaf & Root Disease Diagnosis")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2.5 text-sm sm:text-base leading-relaxed">
              {language === "mr"
                ? "पानाचा किंवा मुळांचा (किंवा दोन्ही एकत्र) फोटो अपलोड करा. एआय द्वारे पीक ओळख, रोग निदान, मुळांची तपासणी आणि ICAR/CIBRC प्रमाणित उपाय मिळवा."
                : language === "hi"
                ? "पत्ती या जड़ (अथवा दोनों) का फोटो अपलोड करें। एआई फसल पहचान, रोग निदान, जड़ परीक्षण और ICAR/CIBRC प्रमाणित उपचार प्रदान करता है।"
                : "Upload a Leaf image, Root image, or both. AI performs shoot and root pathology diagnosis with certified ICAR/CIBRC treatments."}
            </p>
          </div>

          {/* Active Mode Banner */}
          {currentMode !== "none" && (
            <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300">
                <Layers size={16} className="text-emerald-600" />
                <span>
                  {currentMode === "combined" 
                    ? (language === "mr" ? "🌿 + 🪵 संयुक्त विश्लेषण: पान + मूळ (Combined Leaf & Root Analysis)" : language === "hi" ? "🌿 + 🪵 संयुक्त विश्लेषण: पत्ती + जड़ (Combined Analysis)" : "🌿 + 🪵 Combined Shoot & Root Analysis Mode")
                    : currentMode === "root_only"
                    ? (language === "mr" ? "🪵 केवळ मूळ विश्लेषण (Root-Only Analysis)" : language === "hi" ? "🪵 केवल जड़ विश्लेषण (Root-Only Analysis)" : "🪵 Root-Only Diagnostic Mode")
                    : (language === "mr" ? "🌿 केवळ पान विश्लेषण (Leaf-Only Analysis)" : language === "hi" ? "🌿 केवल पत्ती विश्लेषण (Leaf-Only Analysis)" : "🌿 Leaf-Only Diagnostic Mode")}
                </span>
              </div>
              <button onClick={resetForm} className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors">
                {language === "mr" ? "रीसेट करा" : language === "hi" ? "रीसेट करें" : "Reset"}
              </button>
            </div>
          )}

          {/* Optional Crop Hint Selector */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
              <Leaf size={16} className="text-emerald-500" />
              <span>{t("disease_select_crop", "Crop Hint (Optional)")}:</span>
            </div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Auto-Detect">🔍 {t("disease_crop_autodetect", "Auto-Detect Crop from Photo")}</option>
              <option value="Grape">Grape / द्राक्ष (Nashik / Sangli)</option>
              <option value="Potato">Potato / बटाटा / आलू</option>
              <option value="Tomato">Tomato / टोमॅटो / टमाटर</option>
              <option value="Cotton">Cotton / कापूस / कपास</option>
              <option value="Soybean">Soybean / सोयाबीन</option>
              <option value="Wheat">Wheat / गहू / गेहूं</option>
              <option value="Maize">Maize / मका / मक्का</option>
              <option value="Chilli">Chilli / मिरची / मिर्च</option>
              <option value="Onion">Onion / कांदा / प्याज</option>
              <option value="Rice">Rice / Paddy / भात / धान</option>
              <option value="Sugarcane">Sugarcane / ऊस / गन्ना</option>
            </select>
          </div>

          {/* Camera View Modal */}
          {activeCameraTarget && (
            <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
              <div className="relative bg-gray-900 rounded-3xl overflow-hidden max-w-lg w-full border border-gray-700 shadow-2xl">
                <div className="p-4 bg-gray-800 flex justify-between items-center text-white">
                  <span className="font-bold text-sm">
                    {activeCameraTarget === "leaf" ? "🌿 Capture Leaf Photo" : "🪵 Capture Root Photo"}
                  </span>
                  <button onClick={stopCamera} className="p-1 hover:bg-gray-700 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <div className="relative aspect-square bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="p-4 bg-gray-800 flex justify-center">
                  <button
                    onClick={capturePhoto}
                    className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Camera size={24} className="text-gray-900" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Upload Cards (Dual Leaf & Root Interface) */}
          {step === "upload" && (
            <div className="max-w-4xl mx-auto">
              
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Zone A: Leaf Image Upload */}
                <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  leafFile 
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md" 
                    : "border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-400"
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                          1
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">
                          {language === "mr" ? "पानाचा फोटो (Leaf Photo)" : language === "hi" ? "पत्ती का फोटो (Leaf Photo)" : "Leaf / Shoot Photo"}
                        </h3>
                      </div>
                      {leafFile && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                          ✓ Ready
                        </span>
                      )}
                    </div>

                    {leafPreviewUrl ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800 mb-4 bg-black/10">
                        <Image src={leafPreviewUrl} alt="Leaf Preview" fill className="object-cover" />
                        <button
                          onClick={() => { setLeafFile(null); setLeafPreviewUrl(null); }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Leaf size={36} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-4">
                          {language === "mr" ? "बाधित पानावरील डाग दिसणारा स्पष्ट फोटो निवडा." : language === "hi" ? "प्रभावित पत्ती का स्पष्ट फोटो अपलोड करें।" : "Upload a sharp close-up photo of leaf lesions."}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <label className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      <UploadCloud size={15} />
                      <span>{language === "mr" ? "पान फोटो निवडा" : language === "hi" ? "पत्ती फोटो चुनें" : "Upload Leaf"}</span>
                      <input type="file" accept="image/*" onChange={handleLeafFileChange} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => startCamera("leaf")}
                      className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-colors"
                      title="Open Camera"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                </div>

                {/* Zone B: Root Image Upload (Optional / Additional) */}
                <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  rootFile 
                    ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md" 
                    : "border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-amber-400"
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center font-bold text-sm">
                          2
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">
                          {language === "mr" ? "मुळांचा फोटो (Root Photo — ऐच्छिक)" : language === "hi" ? "जड़ का फोटो (Root Photo — ऐच्छिक)" : "Root Photo (Optional / Additional)"}
                        </h3>
                      </div>
                      {rootFile && (
                        <span className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                          ✓ Ready
                        </span>
                      )}
                    </div>

                    {rootPreviewUrl ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-800 mb-4 bg-black/10">
                        <Image src={rootPreviewUrl} alt="Root Preview" fill className="object-cover" />
                        <button
                          onClick={() => { setRootFile(null); setRootPreviewUrl(null); }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <FlaskConical size={36} className="mx-auto text-amber-500 mb-2 opacity-80" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-4">
                          {language === "mr" ? "मूळकूज, गाठी किंवा वाळणे तपासण्यासाठी मुळांचा फोटो जोडा." : language === "hi" ? "जड़ सड़न अथवा गांठों की जांच के लिए जड़ का फोटो जोड़ें।" : "Optional: Add root photo to diagnose root rots & nematodes."}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <label className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      <UploadCloud size={15} />
                      <span>{language === "mr" ? "मूळ फोटो निवडा" : language === "hi" ? "जड़ फोटो चुनें" : "Upload Root"}</span>
                      <input type="file" accept="image/*" onChange={handleRootFileChange} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => startCamera("root")}
                      className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-colors"
                      title="Open Camera"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={startAnalysis}
                disabled={!leafFile && !rootFile}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white rounded-2xl font-bold text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Sparkles size={18} />
                <span>
                  {hasBoth
                    ? (language === "mr" ? "🌿 + 🪵 संयुक्त पीक व रोग निदान सुरू करा" : language === "hi" ? "🌿 + 🪵 संयुक्त फसल व रोग निदान शुरू करें" : "Start Combined Leaf + Root Diagnosis")
                    : rootFile
                    ? (language === "mr" ? "🪵 मुळांचे निदान सुरू करा" : language === "hi" ? "🪵 जड़ रोग निदान शुरू करें" : "Analyze Root Health")
                    : (language === "mr" ? "🌿 पानांचे रोग निदान सुरू करा" : language === "hi" ? "🌿 पत्ती रोग निदान शुरू करें" : "Analyze Leaf Disease")}
                </span>
              </button>

            </div>
          )}

          {/* Step 2: Scanning / Analyzing State */}
          {step === "scanning" && (
            <div className="max-w-2xl mx-auto py-16 px-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <Loader2 size={80} className="text-emerald-500 animate-spin" />
                <Leaf size={32} className="text-emerald-600 absolute inset-0 m-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "mr" ? "एआय द्वारे पीक व रोगाचे सखोल विश्लेषण चालू आहे..." : language === "hi" ? "एआई द्वारा फसल एवं रोग का गहन विश्लेषण जारी है..." : "AgriSmart AI is Analyzing Plant Pathology..."}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {language === "mr"
                  ? "पानावरील चट्टे, बुरशीचे ठिपके, मुळांचे आरोग्य आणि ICAR प्रोटोकॉल पडताळून अचूक औषध डोस तयार केला जात आहे."
                  : language === "hi"
                  ? "पत्ती के धब्बे, कवक संक्रमण, जड़ों का स्वास्थ्य और ICAR प्रोटोकॉल की जांच की जा रही है।"
                  : "Examining foliar lesions, root-zone vigor, and cross-referencing ICAR/CIBRC pesticide recommendations."}
              </p>
            </div>
          )}

          {/* Step 3: Error / Retry State */}
          {step === "error" && (
            <div className="max-w-2xl mx-auto py-12 px-6 bg-white dark:bg-gray-900 rounded-3xl border border-red-200 dark:border-red-900/60 shadow-xl text-center">
              <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "mr" ? "विश्लेषण पूर्ण होऊ शकले नाही" : language === "hi" ? "विश्लेषण पूरा नहीं हो सका" : "Diagnosis Could Not Complete"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {errorMessage || "An unexpected error occurred during image processing."}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={startAnalysis}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                  <RefreshCw size={15} />
                  <span>{language === "mr" ? "पुन्हा प्रयत्न करा" : language === "hi" ? "पुनः प्रयास करें" : "Retry"}</span>
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  {language === "mr" ? "नवीन फोटो अपलोड करा" : language === "hi" ? "नया फोटो चुनें" : "Upload New Photo"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Results Display */}
          {step === "results" && diagnosis && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Primary Diagnostic Summary Banner */}
              <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl ${
                diagnosis.isHealthy 
                  ? "bg-gradient-to-br from-green-600 to-emerald-800" 
                  : !diagnosis.isPlant || !diagnosis.isClear
                  ? "bg-gradient-to-br from-gray-700 to-gray-900"
                  : "bg-gradient-to-br from-red-600 via-rose-700 to-red-900"
              }`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                      <Stethoscope size={13} />
                      <span>
                        {diagnosis.isHealthy 
                          ? (language === "mr" ? "निरोगी पीक (Healthy)" : language === "hi" ? "स्वस्थ फसल (Healthy)" : "Healthy Crop")
                          : (language === "mr" ? "रोग निदान अहवाल" : language === "hi" ? "रोग निदान रिपोर्ट" : "Pathology Report")}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black">
                      {language === "mr" ? (diagnosis.diseaseNameMarathi || diagnosis.diseaseName) : language === "hi" ? (diagnosis.diseaseNameHindi || diagnosis.diseaseName) : diagnosis.diseaseName}
                    </h2>
                    <p className="text-emerald-100 text-sm font-semibold mt-1">
                      {language === "mr" ? "पीक:" : language === "hi" ? "फसल:" : "Host Crop:"} <span className="underline">{language === "mr" ? (diagnosis.cropMarathi || diagnosis.crop) : language === "hi" ? (diagnosis.cropHindi || diagnosis.crop) : diagnosis.crop}</span> | {language === "mr" ? "रोगकारक:" : language === "hi" ? "रोगकारक:" : "Pathogen:"} {diagnosis.pathogen}
                    </p>
                  </div>

                  <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center flex-shrink-0">
                    <div className="text-[11px] font-bold uppercase text-white/80">{t("stats_acc", "Confidence")}</div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{diagnosis.confidenceScore}%</div>
                    <div className="text-[10px] font-semibold text-white/90">{diagnosis.confidenceLevel}</div>
                  </div>
                </div>

                {/* Previews Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  {leafPreviewUrl && (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/20">
                        <Image src={leafPreviewUrl} alt="Leaf" fill className="object-cover" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-white uppercase text-[10px]">Leaf / Shoot Sample</div>
                        <div className="text-white/90 line-clamp-2">{diagnosis.symptoms}</div>
                      </div>
                    </div>
                  )}

                  {rootPreviewUrl && (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/20">
                        <Image src={rootPreviewUrl} alt="Root" fill className="object-cover" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-white uppercase text-[10px]">Root System Sample</div>
                        <div className="text-white/90 line-clamp-2">{diagnosis.rootObservations || "Root assessed."}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Consistency & Observation Card (When Root + Leaf Both Present) */}
              {(diagnosis.rootObservations || diagnosis.consistencyCheck) && (
                <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <GitCompare className="text-emerald-500" size={20} />
                    <span>{language === "mr" ? "पान व मूळ सुसंगतता तपासणी (Shoot & Root Correlation)" : language === "hi" ? "पत्ती व जड़ सुसंगतता जांच (Correlation Check)" : "Shoot & Root Pathological Correlation"}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-1">
                        {language === "mr" ? "मुळांची स्थिती व निरीक्षणे" : language === "hi" ? "जड़ों की स्थिति व लक्षण" : "Root Zone Observations"}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {diagnosis.rootObservations || "Root visual inspection normal."}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-1">
                        {language === "mr" ? "सुसंगतता निष्कर्ष (Consistency Check)" : language === "hi" ? "सुसंगतता निष्कर्ष (Consistency Check)" : "Shoot-Root Consistency"}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {diagnosis.consistencyCheck || "Foliar and root symptoms correlate consistently."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Treatment & Advisory Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Certified Chemical Treatment */}
                <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-bold mb-3">
                      <FlaskConical size={14} />
                      <span>CIBRC Certified Chemical Remedy</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {diagnosis.recommendedChemical || "Chemical Spray Treatment"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {diagnosis.chemicalTreatment}
                    </p>

                    {diagnosis.dosagePerLiter && (
                      <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 text-center text-xs">
                        <div>
                          <div className="text-gray-400 font-bold uppercase text-[10px]">Per Liter Water</div>
                          <div className="font-black text-gray-900 dark:text-white mt-0.5">{diagnosis.dosagePerLiter}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 font-bold uppercase text-[10px]">Per Acre</div>
                          <div className="font-black text-gray-900 dark:text-white mt-0.5">{diagnosis.dosagePerAcre || "Standard"}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 font-bold uppercase text-[10px]">PHI (Safety Days)</div>
                          <div className="font-black text-emerald-600 mt-0.5">{diagnosis.phiDays} Days</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Organic & Biological Treatment */}
                <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3">
                      <Leaf size={14} />
                      <span>Organic & Biological Management</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {language === "mr" ? "सेंद्रिय व जैविक उपाय" : language === "hi" ? "जैविक व प्राकृतिक उपचार" : "Organic & Preventative Care"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {diagnosis.organicTreatment}
                    </p>
                    <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300">
                      <strong>Prevention:</strong> {diagnosis.prevention}
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons: New Scan / Voice Readout */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  {language === "mr" ? "नवीन पीक स्कॅन करा (New Scan)" : language === "hi" ? "नया फसल स्कैन करें (New Scan)" : "Scan Another Plant"}
                </button>

                <div className="flex items-center gap-2">
                  {isSpeaking ? (
                    <button
                      onClick={stopSpeaking}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl font-bold text-xs flex items-center gap-1.5"
                    >
                      <VolumeX size={16} />
                      <span>{language === "mr" ? "आवाज बंद करा" : language === "hi" ? "आवाज बंद करें" : "Stop Voice"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const displayCrop = language === "mr" ? (diagnosis.cropMarathi || diagnosis.crop) : language === "hi" ? (diagnosis.cropHindi || diagnosis.crop) : diagnosis.crop;
                        const displayDisease = language === "mr" ? (diagnosis.diseaseNameMarathi || diagnosis.diseaseName) : language === "hi" ? (diagnosis.diseaseNameHindi || diagnosis.diseaseName) : diagnosis.diseaseName;
                        speakText(`पीक: ${displayCrop}. रोग: ${displayDisease}. औषध: ${diagnosis.recommendedChemical}`);
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-gray-200 transition-colors"
                    >
                      <Volume2 size={16} />
                      <span>{language === "mr" ? "माहिती ऐका" : language === "hi" ? "जानकारी सुनें" : "Listen in Voice"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Interactive AI Follow-up Chat for Farmers */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Bot size={20} className="text-emerald-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    {language === "mr" ? "एआय कृषी तज्ज्ञांशी बोला (Follow-up Questions)" : language === "hi" ? "एआई कृषि विशेषज्ञ से पूछें (Follow-up Questions)" : "Ask AI Follow-up Questions"}
                  </h3>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-3 mb-4 p-3 bg-gray-50 dark:bg-gray-950 rounded-2xl">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                        m.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none'
                      }`}>
                        <FormattedChatMessage content={m.text} isUser={m.role === 'user'} />
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Loader2 size={14} className="animate-spin text-emerald-500" />
                      <span>AI is thinking...</span>
                    </div>
                  )}
                  <div ref={chatScrollRef} />
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={language === "mr" ? "उदा. फवारणीनंतर किती तासांनी पाऊस आल्यास फरक पडत नाही?" : language === "hi" ? "उदा. दवा छिड़काव के बाद कब सिंचाई करें?" : "Ask a follow-up question (e.g. spray timing, mixing)..."}
                    className="flex-grow px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Send</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
