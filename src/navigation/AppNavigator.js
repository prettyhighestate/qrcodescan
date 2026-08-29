import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

import ScannerScreen from '../screens/ScannerScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HistoryDetailScreen from '../screens/HistoryDetailScreen';
import GeneratorScreen from '../screens/GeneratorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useAppContext } from '../context/AppContext';
//navigators 
const Tab = createBottomTabNavigator();
const HistoryStack = createNativeStackNavigator();

//light theme
const LightTheme = {
    ...NavigationDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        primary: '#396491',
        background: '#ffffff',
        card: '#396491',
        text: '#000000',
        border: '#cccccc',
        notification: '#396491',
    },
};

//dark theme
const DarkTheme = {
    ...NavigationDarkTheme,
    colors: {
        ...NavigationDarkTheme.colors,
        primary: '#396491',
        background: '#121212',
        card: '#396491',
        text: '#ffffff',
        border: '#333333',
        notification: '#396491',
    },
};

function HistoryStackScreen() { //history tab 
    return (
        <HistoryStack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#396491' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold' },
        }}
        >
        <HistoryStack.Screen
            name="HistoryList"
            component={HistoryScreen}
            options={{ title: 'History' }}
        />
        <HistoryStack.Screen
            name="HistoryDetail"
            component={HistoryDetailScreen}
            options={{ title: 'Details' }}
        />
        </HistoryStack.Navigator>
    );
}

//custom loading screen
function LoadingScreen({ theme }) {
    const isDark = theme === 'dark';
    return (
        <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#121212' : '#ffffff' }]}>
        <Ionicons name="qr-code" size={180} color="#396491" />
        <Text style={[styles.loadingTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            QR Scanner
        </Text>
        <ActivityIndicator size="large" color="#396491" style={{ marginTop: 20 }} />
        </View>
    );
}

export default function AppNavigator() {
    const { loading, actualTheme } = useAppContext();
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMinTimeElapsed(true), 5000);
        return () => clearTimeout(timer);
    }, []);//a minimum 5 secs loading screen on startup

    //Shows loading screen if context is loading OR minimum 5 seconds not passed
    if (loading || !minTimeElapsed) {
        return <LoadingScreen theme={actualTheme} />;
    }

    const theme = actualTheme === 'dark' ? DarkTheme : LightTheme;

    return (
        <NavigationContainer theme={theme}>
        <Tab.Navigator
            screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Scanner') iconName = focused ? 'scan' : 'scan-outline';
                else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
                else if (route.name === 'Generator') iconName = focused ? 'qr-code' : 'qr-code-outline';
                else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarStyle: { backgroundColor: '#396491' }, //forced blue theme
            headerStyle: { backgroundColor: '#396491' }, //forced blue theme
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold' },
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: actualTheme === 'dark' ? '#b0b0b0' : '#e0e0e0',
            })}
        >
            <Tab.Screen name="Scanner" component={ScannerScreen} />
            <Tab.Screen name="History" component={HistoryStackScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Generator" component={GeneratorScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
    },
});