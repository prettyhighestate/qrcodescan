import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  HISTORY: '@qr_history',
  BEEP: '@qr_beep_enabled',
  VIBRATION: '@qr_vibration_enabled',
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [beepEnabled, setBeepEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load data from AsyncStorage when app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
        const storedBeep = await AsyncStorage.getItem(STORAGE_KEYS.BEEP);
        const storedVibration = await AsyncStorage.getItem(STORAGE_KEYS.VIBRATION);

        if (storedHistory) setHistory(JSON.parse(storedHistory));
        if (storedBeep !== null) setBeepEnabled(JSON.parse(storedBeep));
        if (storedVibration !== null) setVibrationEnabled(JSON.parse(storedVibration));
      } catch (error) {
        console.error('Failed to load data from storage', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history)).catch(err =>
      console.error('Failed to save history', err)
    );
  }, [history]);

  // Save beep setting
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.BEEP, JSON.stringify(beepEnabled)).catch(err =>
      console.error('Failed to save beep setting', err)
    );
  }, [beepEnabled]);

  // Save vibration setting
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.VIBRATION, JSON.stringify(vibrationEnabled)).catch(err =>
      console.error('Failed to save vibration setting', err)
    );
  }, [vibrationEnabled]);

  // Add a scanned code to history
  const addScannedCode = (code) => {
    const newEntry = {
      id: Date.now().toString(),
      data: code,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        history,
        addScannedCode,
        clearHistory,
        beepEnabled,
        setBeepEnabled,
        vibrationEnabled,
        setVibrationEnabled,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext);