import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

/**

 *  QR Code Scanner App
 *  Dependency Usage
 * -----------------

 * @react-native-async-storage/async-storage : Local persistence (history, settings, theme)
 * @react-navigation/native : Core navigation
 * @react-navigation/bottom-tabs : Bottom tab bar
 * @react-navigation/native-stack : Stack navigation (History detail)
 * expo : Core Expo framework
 * expo-camera : Camera access for scanning and flashlight
 * expo-clipboard : Copy data to clipboard
 * expo-sharing : Share QR images
 * expo-status-bar : Status bar management
 * react : UI library
 * react-native : Base framework
 * react-native-qrcode-svg : Render QR codes as SVG
 * react-native-svg : SVG support
 * react-native-view-shot : Capture QR view for sharing
 * react-native-safe-area-context : Safe area handling
 * react-native-screens : Navigation performance

 */