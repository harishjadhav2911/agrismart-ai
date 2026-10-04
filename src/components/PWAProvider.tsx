"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Download, WifiOff, Wifi, X, Smartphone, CheckCircle, Share } from "lucide-react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  installApp: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType>({
  isInstallable: false,
  isInstalled: false,
  isOffline: false,
  installApp: async () => {},
});

export const usePWA = () => useContext(PWAContext);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [onlineNotice, setOnlineNotice] = useState<string | null>(null);

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker registered with scope:", registration.scope);
            
            // Check for service worker updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                    console.log("[PWA] New content is available; please refresh.");
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.warn("[PWA] Service Worker registration failed:", error);
          });
      });
    }

    // 2. Check if already running in standalone PWA mode
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");
      
      setIsInstalled(isStandalone);
    };
    checkStandalone();

    // 3. Online/Offline status listeners
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      setOnlineNotice("Back online! Reconnected to AgriSmart network.");
      setTimeout(() => setOnlineNotice(null), 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setOnlineNotice("You are offline. Cached records remain available.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 4. Capture beforeinstallprompt for Chrome/Edge/Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      // Check if user previously dismissed banner recently
      const dismissedUntil = localStorage.getItem("pwa_dismissed_until");
      if (!dismissedUntil || Date.now() > parseInt(dismissedUntil, 10)) {
        // Show after a short delay so the user first sees the landing page
        setTimeout(() => {
          setShowBanner(true);
        }, 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. Track when app is installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log("[PWA] AgriSmart app was successfully installed.");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else if (isIOS && !isInstalled) {
      setShowIOSPrompt(true);
    } else {
      // Direct notification or instructions
      alert("To install AgriSmart, tap the install icon in your browser address bar or menu.");
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    // Suppress for 3 days
    localStorage.setItem("pwa_dismissed_until", (Date.now() + 3 * 24 * 60 * 60 * 1000).toString());
  };

  return (
    <PWAContext.Provider value={{ isInstallable, isInstalled, isOffline, installApp }}>
      {children}

      {/* Online / Offline Toast */}
      {onlineNotice && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl border text-sm font-medium transition-all duration-300 backdrop-blur-md ${
            isOffline
              ? "bg-amber-950/90 border-amber-600/50 text-amber-200"
              : "bg-emerald-950/90 border-emerald-600/50 text-emerald-200"
          }`}
        >
          {isOffline ? <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
          <span>{onlineNotice}</span>
          <button
            onClick={() => setOnlineNotice(null)}
            className="ml-2 hover:opacity-75 p-0.5 rounded-full text-current"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* iOS Installation Modal */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in slide-in-from-bottom-6">
            <button
              onClick={() => setShowIOSPrompt(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-sm relative">
                <Image src="/icons/icon-96x96.png" alt="AgriSmart" fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Install AgriSmart</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Add to your iPhone / iPad</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0">
                  1
                </span>
                <p className="leading-snug">
                  Tap the <Share className="inline w-4 h-4 text-blue-500 mx-1 align-sub" /> <strong>Share</strong> button at the bottom of Safari.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0">
                  2
                </span>
                <p className="leading-snug">
                  Scroll down and tap <strong>Add to Home Screen</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSPrompt(false)}
              className="mt-5 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-center shadow-lg shadow-emerald-600/20 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Floating Install Prompt Banner for Desktop & Android */}
      {showBanner && !isInstalled && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm w-[calc(100vw-3rem)] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl shadow-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8">
          <div className="flex items-start gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md shrink-0 border border-emerald-500/30">
              <Image src="/icons/icon-96x96.png" alt="AgriSmart App Logo" fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">Install AgriSmart App</h4>
                <button
                  onClick={dismissBanner}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
                  aria-label="Close installation prompt"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                Get offline access, instant Mandi alerts & faster farming advisory on your device.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={installApp}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/25 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Install App
            </button>
            <button
              onClick={dismissBanner}
              className="py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      )}
    </PWAContext.Provider>
  );
}
