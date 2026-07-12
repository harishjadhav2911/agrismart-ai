"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, Image as ImageIcon, ShieldAlert, Sparkles, Loader2, 
  CheckCircle, Activity, Leaf, FlaskConical, Stethoscope,
  Mic, MicOff, Volume2, VolumeX, Send, Bot, User, Trash2, Camera, X, AlertCircle
} from "lucide-react";

// Extend window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: unknown;
    webkitSpeechRecognition: unknown;
  }
}
import { useLanguage } from "@/context/LanguageContext";
import { useGeminiChat } from "@/hooks/useGeminiChat";
const mockDiseaseData = {
  name: "Tomato Early Blight",
  confidence: 96,
  cause: "Fungus (Alternaria solani)",
  symptoms: "Dark, concentric rings on older leaves, lower leaves turning yellow and dropping prematurely.",
  organicTreatment: "Remove and destroy affected leaves. Apply copper-based organic fungicides. Use compost tea to boost plant immunity.",
  chemicalTreatment: "Apply fungicides containing Chlorothalonil or Mancozeb every 7-10 days during humid weather.",
  recommendedPesticide: "Daconil or similar Chlorothalonil-based spray.",
  prevention: "Practice crop rotation, ensure proper plant spacing for air circulation, and water at the base to keep leaves dry."
};

export default function DiseaseDetectionPage() {
  const { } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "scanning" | "results">("upload");
  
  // Camera State
  const [isCameraMode, setIsCameraMode] = useState(false);
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

  const startCamera = async () => {
    setIsCameraMode(true);
    setCameraError(null);
    setIsLoadingCamera(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // The onLoadedMetadata event will fire to remove loading spinner in JSX
      }
    } catch (err: unknown) {
      console.error("Error accessing camera:", err);
      setCameraError("Camera access denied or not available. Please use image upload.");
      setIsCameraMode(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraMode(false);
    setIsLoadingCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setFile(capturedFile);
            setPreviewUrl(URL.createObjectURL(capturedFile));
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  
  // Chat State
  const { messages, isLoading, sendMessage } = useGeminiChat("Crop Disease Detection Results", "disease_chat_welcome");
  const [inputValue, setInputValue] = useState("");
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (SpeechRecognition as any)();
        recognition.continuous = false;
        recognition.interimResults = false;
        // recognition.lang = 'en-US'; // Could map this to selected language
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
        };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err: unknown) {
        console.error("Failed to start speech recognition", err);
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        setPreviewUrl(URL.createObjectURL(droppedFile));
      }
    }
  };

  const startAnalysis = () => {
    if (!file) return;
    setStep("scanning");
    setTimeout(() => {
      setStep("results");
      // Auto-read diagnosis when results load
      setTimeout(() => {
        speakText(`Disease Detected: ${mockDiseaseData.name}. Confidence score: ${mockDiseaseData.confidence} percent.`);
      }, 500);
    }, 3000);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setStep("upload");
    stopSpeaking();
    stopCamera();
    setCameraError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-4">
              <ShieldAlert size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">AI Crop Disease Detection</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Upload a clear photo of the affected plant leaf. Our AI will instantly identify the disease and provide treatment plans.
            </p>
          </div>

          <AnimatePresence mode="wait">
            
            {/* Upload Step */}
            {step === "upload" && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div 
                  className={`bg-white dark:bg-gray-900 border-2 border-dashed ${previewUrl ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} rounded-3xl p-8 text-center transition-all hover:border-primary-500 dark:hover:border-primary-500 relative overflow-hidden`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    id="file-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  
                  {isCameraMode ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-80 bg-black rounded-xl overflow-hidden flex items-center justify-center">
                        {isLoadingCamera && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900 z-10">
                            <Loader2 size={32} className="animate-spin mb-2" />
                            <p>Starting camera...</p>
                          </div>
                        )}
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover"
                          onLoadedMetadata={() => setIsLoadingCamera(false)}
                        />
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                      
                      <div className="flex gap-4">
                        <button 
                          onClick={capturePhoto}
                          disabled={isLoadingCamera}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <Camera size={20} /> Capture Photo
                        </button>
                        <button 
                          onClick={stopCamera}
                          className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <X size={20} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : previewUrl ? (
                    <div className="space-y-6">
                      <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                        <Image src={previewUrl} alt="Crop Preview" fill className="object-cover" unoptimized />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }}
                          className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <button 
                        onClick={startAnalysis}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                      >
                        Analyze Image <Sparkles size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 space-y-8">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-500 shadow-sm border border-gray-100 dark:border-gray-700">
                          <ImageIcon size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload or Capture Image</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                          For best results, ensure the leaf is well-lit and the disease spots are clearly visible in the center.
                        </p>
                      </div>

                      {cameraError && (
                        <div className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start gap-2 text-sm text-left">
                          <AlertCircle size={18} className="shrink-0 mt-0.5" />
                          <p>{cameraError}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <button 
                          onClick={startCamera}
                          className="flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 p-6 rounded-2xl transition-all group"
                        >
                          <Camera size={32} className="text-gray-500 group-hover:text-primary-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">Open Camera</span>
                        </button>
                        
                        <label 
                          htmlFor="file-upload" 
                          className="flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 p-6 rounded-2xl transition-all cursor-pointer group"
                        >
                          <UploadCloud size={32} className="text-gray-500 group-hover:text-primary-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">Upload Image</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Scanning Step */}
            {step === "scanning" && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20"
              >
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-primary-500 mb-8 shadow-2xl shadow-primary-500/30">
                  <Image src={previewUrl!} alt="Scanning" fill className="object-cover" unoptimized />
                  
                  {/* Scanner Line Animation */}
                  <motion.div 
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-primary-400 shadow-[0_0_15px_3px_#4ade80]"
                  />
                  <div className="absolute inset-0 bg-primary-500/10" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Loader2 size={24} className="animate-spin text-primary-500" /> Scanning with AgriSmart AI...
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Comparing with 10,000+ disease signatures.</p>
              </motion.div>
            )}

            {/* Results Step */}
            {step === "results" && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Left Column: Diagnosis & Treatment */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Header & Voice Output */}
                  <div className="flex justify-between items-start bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <Activity size={14} /> High Confidence ({mockDiseaseData.confidence}%)
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{mockDiseaseData.name}</h1>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">Cause: {mockDiseaseData.cause}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={isSpeaking ? stopSpeaking : () => speakText(`Disease Detected: ${mockDiseaseData.name}. Cause: ${mockDiseaseData.cause}.`)}
                        className={`p-3 rounded-xl transition-colors ${isSpeaking ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        title="Read aloud"
                      >
                        {isSpeaking ? <Volume2 size={24} className="animate-pulse" /> : <VolumeX size={24} />}
                      </button>
                    </div>
                  </div>

                  {/* Image & Symptoms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative group">
                      <div className="relative w-full h-48">
                        <Image src={previewUrl!} alt="Your upload" fill className="object-cover rounded-xl" unoptimized />
                      </div>
                      <button onClick={resetForm} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white font-medium gap-2">
                        <UploadCloud size={20} /> Scan Another
                      </button>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Stethoscope size={20} className="text-primary-500" /> Symptoms
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{mockDiseaseData.symptoms}</p>
                      
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Similar Cases</h4>
                        <div className="flex gap-2">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400"><ImageIcon size={24}/></div>
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400"><ImageIcon size={24}/></div>
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400"><ImageIcon size={24}/></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Plans */}
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
                      <h3 className="font-bold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                        <Leaf size={20} /> Organic Treatment
                      </h3>
                      <p className="text-green-700 dark:text-green-500 text-sm">{mockDiseaseData.organicTreatment}</p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                      <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <FlaskConical size={20} /> Chemical Treatment
                      </h3>
                      <p className="text-blue-700 dark:text-blue-500 text-sm mb-3">{mockDiseaseData.chemicalTreatment}</p>
                      <div className="inline-flex items-center gap-2 bg-white dark:bg-blue-950 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-800 dark:text-blue-400">
                        Recommended: {mockDiseaseData.recommendedPesticide}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <CheckCircle size={20} className="text-gray-400" /> Prevention Tips
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{mockDiseaseData.prevention}</p>
                    </div>
                  </div>

                </div>

                {/* Right Column: AI Follow-up Chat */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col h-[600px] lg:h-auto overflow-hidden">
                  <div className="bg-primary-600 p-4 text-white">
                    <h3 className="font-bold flex items-center gap-2"><Bot size={20}/> Ask Follow-up Questions</h3>
                    <p className="text-primary-100 text-xs mt-1">Get detailed advice based on this diagnosis.</p>
                  </div>
                  
                  <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-950">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'}`}>
                          {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-gray-800 text-white rounded-tr-none' 
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-tl-none'
                        }`}>
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

                  <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <form onSubmit={handleChatSubmit} className="relative">
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type or speak your question..." 
                        className="w-full pl-4 pr-24 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 caret-primary-600 dark:caret-primary-400 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button 
                          type="button"
                          onClick={toggleListening}
                          className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                          title="Voice Input"
                        >
                          {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                        </button>
                        <button 
                          type="submit" 
                          disabled={!inputValue.trim()}
                          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
