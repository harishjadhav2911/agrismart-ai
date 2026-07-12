"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocationData, reverseGeocode } from '@/utils/locationApi';

interface LocationContextType {
  location: LocationData | null;
  setLocation: (loc: LocationData | null) => void;
  isLoadingGPS: boolean;
  detectLocation: () => Promise<void>;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<LocationData | null>(null);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved location on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agrismart_location');
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocationState(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load location', e);
    }
  }, []);

  const setLocation = (loc: LocationData | null) => {
    setLocationState(loc);
    if (loc) {
      localStorage.setItem('agrismart_location', JSON.stringify(loc));
    } else {
      localStorage.removeItem('agrismart_location');
    }
  };

  const detectLocation = async () => {
    setIsLoadingGPS(true);
    setError(null);
    
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setIsLoadingGPS(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          timeout: 10000,
          maximumAge: 60000 
        });
      });

      const data = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      
      setLocation({
        state: data.state || "",
        district: data.district || "",
        taluka: data.taluka || "",
        village: data.village || "",
        pincode: data.pincode || "",
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
    } catch (err) {
      console.error(err);
      setError("Failed to detect location. Please select manually.");
    } finally {
      setIsLoadingGPS(false);
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, isLoadingGPS, detectLocation, error }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
