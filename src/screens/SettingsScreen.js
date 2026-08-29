import React from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function SettingsScreen() {//settings context
    const {
        vibrationEnabled,
        setVibrationEnabled,
        themePreference,
        setThemePreference,
        actualTheme,
        historyAutoSave,
        setHistoryAutoSave,
        autoOpenUrls,
        setAutoOpenUrls,
        scanConfirmation,
        setScanConfirmation,
    } = useAppContext();

    const isDark = actualTheme === 'dark'; //theme
    const themeOptions = [
        { key: 'light', label: 'Light' },
        { key: 'dark', label: 'Dark' },
        { key: 'auto', label: 'Auto' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#ffffff' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>Scanning</Text>

        <View style={[styles.settingRow, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>Vibration on Scan</Text>{/* Vibration toggle */}
            <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: '#767577', true: '#396491' }}
            />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>Auto-save to History</Text>{/* Auto-save toggle */}
            <Switch
            value={historyAutoSave}
            onValueChange={setHistoryAutoSave}
            trackColor={{ false: '#767577', true: '#396491' }}
            />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>Auto-open URLs</Text>{/* Auto-open URLs toggle */}
            <Switch
            value={autoOpenUrls}
            onValueChange={setAutoOpenUrls}
            trackColor={{ false: '#767577', true: '#396491' }}
            />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>Scan Confirmation Popup</Text>{/* Scan confirmation popup toggle */}
            <Switch
            value={scanConfirmation}
            onValueChange={setScanConfirmation}
            trackColor={{ false: '#767577', true: '#396491' }}
            />
        </View>

        <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>Theme</Text>
        <View style={styles.optionContainer}>
            {themeOptions.map((option) => (
            <TouchableOpacity
                key={option.key}
                style={[
                styles.optionButton,
                { borderColor: isDark ? '#555' : '#ccc' },
                themePreference === option.key && styles.optionButtonActive,
                ]}
                onPress={() => setThemePreference(option.key)}
            >
                <Text
                style={[
                    styles.optionButtonText,
                    { color: isDark ? '#ccc' : '#555' },
                    themePreference === option.key && styles.optionButtonTextActive,
                ]}
                >
                {option.label}
                </Text>
            </TouchableOpacity>
            ))}
        </View>
        <Text style={[styles.currentThemeText, { color: isDark ? '#aaa' : '#888' }]}>
            Current theme: {actualTheme.charAt(0).toUpperCase() + actualTheme.slice(1)}
        </Text>
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    settingLabel: { fontSize: 16, flex: 1 },
    optionContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
    optionButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
    },
    optionButtonActive: { backgroundColor: '#396491', borderColor: '#396491' },
    optionButtonText: {},
    optionButtonTextActive: { color: '#fff' },
    currentThemeText: { textAlign: 'center', marginTop: 10 },
});