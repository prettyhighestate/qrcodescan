import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { detectQRType } from '../utils/qrParser';
//AsyncStorage persistence
const STORAGE_KEYS = {
    HISTORY: '@qr_history',
    VIBRATION: '@qr_vibration_enabled',
    THEME: '@qr_theme_preference',
    AUTO_SAVE: '@qr_auto_save',
    AUTO_OPEN_URLS: '@qr_auto_open_urls',
    SCAN_CONFIRMATION: '@qr_scan_confirmation',
};

const AppContext = createContext(); //creates Context object for global state management
export const AppProvider = ({ children }) => {
    const [history, setHistory] = useState([]);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [themePreference, setThemePreference] = useState('auto');
    const [actualTheme, setActualTheme] = useState('light'); //themes based on time or preference
    const [historyAutoSave, setHistoryAutoSave] = useState(true);
    const [autoOpenUrls, setAutoOpenUrls] = useState(false);
    const [scanConfirmation, setScanConfirmation] = useState(true);


//load saved data from asyncstorage 
    useEffect(() => {
        const loadData = async () => {
        try {
            const storedHistory = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
            const storedVibration = await AsyncStorage.getItem(STORAGE_KEYS.VIBRATION);
            const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
            const storedAutoSave = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
            const storedAutoOpenUrls = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_OPEN_URLS);
            const storedScanConfirmation = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_CONFIRMATION);
            //checks and set state if values exist
            if (storedHistory) setHistory(JSON.parse(storedHistory));
            if (storedVibration !== null) setVibrationEnabled(JSON.parse(storedVibration));
            if (storedTheme) setThemePreference(storedTheme);
            if (storedAutoSave !== null) setHistoryAutoSave(JSON.parse(storedAutoSave));
            if (storedAutoOpenUrls !== null) setAutoOpenUrls(JSON.parse(storedAutoOpenUrls));
            if (storedScanConfirmation !== null) setScanConfirmation(JSON.parse(storedScanConfirmation));
        } catch (error) {
            console.error('Failed to load data from storage', error);
        } finally {
            setLoading(false);
        }
        };
        loadData();
    }, []);
    //Persists history whenver changes 
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history)).catch(err => console.error(err));
    }, [history]);
//persist vibration settings
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.VIBRATION, JSON.stringify(vibrationEnabled)).catch(err => console.error(err));
    }, [vibrationEnabled]);
//theme preference persist
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.THEME, themePreference).catch(err => console.error(err));
    }, [themePreference]);
//auto save setting for history
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.AUTO_SAVE, JSON.stringify(historyAutoSave)).catch(err => console.error(err));
    }, [historyAutoSave]);
//persists auto url opening
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.AUTO_OPEN_URLS, JSON.stringify(autoOpenUrls)).catch(err => console.error(err));
    }, [autoOpenUrls]);
//confirm scan persists
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.SCAN_CONFIRMATION, JSON.stringify(scanConfirmation)).catch(err => console.error(err));
    }, [scanConfirmation]);
//Determine actual theme based on preference and time (auto mode)
    useEffect(() => {
        const updateActualTheme = () => {
        if (themePreference === 'auto') {
            const hour = new Date().getHours();
            setActualTheme(hour >= 18 || hour < 6 ? 'dark' : 'light');
        } else {
            setActualTheme(themePreference);
        }
        };
        updateActualTheme();
        let interval = null;
        if (themePreference === 'auto') {
        interval = setInterval(updateActualTheme, 60000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [themePreference]);
//Adds a scanned QR code to history with type detection
    const addScannedCode = (code) => {
        const type = detectQRType(code);
        const newEntry = {
        id: Date.now().toString(),
        data: code,
        type: type,
        source: 'scanned',
        timestamp: new Date().toISOString(),
        };
        setHistory((prev) => [newEntry, ...prev]);
    };
//generated QR code code sent to history
    const addGeneratedCode = (code) => {
        const type = detectQRType(code);
        const newEntry = {
        id: Date.now().toString(),
        data: code,
        type: type,
        source: 'generated',
        timestamp: new Date().toISOString(),
        };
        setHistory((prev) => [newEntry, ...prev]);
    };

    const clearHistory = () => setHistory([]);//clear history

    const updateHistoryItem = (id, newData) => {  //will update a history item's data and recompute its type
        setHistory((prev) =>
        prev.map((item) =>
            item.id === id ? { ...item, data: newData, type: detectQRType(newData) } : item
        )
        );
    };

    const deleteHistoryItem = (id) => {
        setHistory((prev) => prev.filter((item) => item.id !== id));
    };//deletes a single history item by id

    return (
        <AppContext.Provider
        value={{
            history,
            addScannedCode,
            addGeneratedCode,
            clearHistory,
            updateHistoryItem,
            deleteHistoryItem,
            vibrationEnabled,
            setVibrationEnabled,
            loading,
            themePreference,
            setThemePreference,
            actualTheme,
            historyAutoSave,
            setHistoryAutoSave,
            autoOpenUrls,
            setAutoOpenUrls,
            scanConfirmation,
            setScanConfirmation,
        }}
        >
        {children}
        </AppContext.Provider>
    );
    };
//custom hook to access the context with ease
export const useAppContext = () => useContext(AppContext);