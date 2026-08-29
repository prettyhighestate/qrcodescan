import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useAppContext } from '../context/AppContext';

const QR_TYPES = [ //available data types for generations
    { key: 'text', label: 'Text' },
    { key: 'phone', label: 'Phone' },
    { key: 'geo', label: 'Geo' },
    { key: 'url', label: 'URL' },
];

export default function GeneratorScreen() {
    const { addGeneratedCode, actualTheme } = useAppContext();
    const [qrType, setQrType] = useState('text');
    const [generatedQR, setGeneratedQR] = useState('');
    //Form field states
    const [textValue, setTextValue] = useState('');
    const [phoneValue, setPhoneValue] = useState('');
    const [geoLat, setGeoLat] = useState('');
    const [geoLng, setGeoLng] = useState('');
    const [geoLabel, setGeoLabel] = useState('');
    const [urlValue, setUrlValue] = useState('');
    const qrContainerRef = useRef(null);

    const isDark = actualTheme === 'dark';
    //color
    const dynamicContainer = { backgroundColor: isDark ? '#121212' : '#ffffff' };
    const dynamicText = { color: isDark ? '#ffffff' : '#000000' };
    const dynamicInput = {
        backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000',
        borderColor: isDark ? '#555' : '#ccc',
    };
    const dynamicPlaceholder = isDark ? '#aaa' : '#888';
    const dynamicHint = { color: isDark ? '#ccc' : '#888' };


    //Build the final string to encode based on selected QR type
    const buildQRValue = () => {
        switch (qrType) {
        case 'text':
            return textValue.trim();
        case 'phone':
            return `contact:${phoneValue.trim()}`;
        case 'geo': {
            let locationStr = `location:${geoLat.trim()},${geoLng.trim()}`;
            if (geoLabel.trim()) locationStr += `\n${geoLabel.trim()}`;
            return locationStr;
        }
        case 'url': {
            const url = urlValue.trim();
            if (!/^https?:\/\//i.test(url)) return `https://${url}`;
            return url;
        }
        default:
            return '';
        }
    };
//Generate QR code and add to history
    const handleGenerate = () => {
        const value = buildQRValue();
        if (!value) {
        Alert.alert('Missing Info', 'Please fill in the required fields.');
        return;
        }
        setGeneratedQR(value);
        addGeneratedCode(value);
    };

    const shareQR = async () => {//share generated QR code as image
        try {
        if (!qrContainerRef.current) {
            Alert.alert('Error', 'QR code not ready');
            return;
        }
        const uri = await captureRef(qrContainerRef.current, { format: 'png', quality: 1 });
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, { mimeType: 'image/png' });
        } else {
            Alert.alert('Sharing not available', 'Cannot share on this device');
        }
        } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to share QR code');
        }
    };
//renders type selection button
    const renderTypeButtons = () => (
        <View style={styles.typeContainer}>
        {QR_TYPES.map((type) => (
            <TouchableOpacity
            key={type.key}
            style={[
                styles.typeButton,
                { borderColor: isDark ? '#555' : '#ccc' },
                qrType === type.key && styles.typeButtonActive,
            ]}
            onPress={() => setQrType(type.key)}
            >
            <Text
                style={[
                styles.typeText,
                { color: isDark ? '#ccc' : '#555' },
                qrType === type.key && styles.typeTextActive,
                ]}
            >
                {type.label}
            </Text>
            </TouchableOpacity>
        ))}
        </View>
    );
//render  right input fields for the qr selected types
    const renderInputFields = () => {
        switch (qrType) {
        case 'text':
            return (
            <TextInput
                style={[styles.input, dynamicInput]}
                placeholder="Enter text"
                placeholderTextColor={dynamicPlaceholder}
                value={textValue}
                onChangeText={setTextValue}
                multiline
            />
            );
        case 'phone':
            return (
            <TextInput
                style={[styles.input, dynamicInput]}
                placeholder="Enter phone number"
                placeholderTextColor={dynamicPlaceholder}
                value={phoneValue}
                onChangeText={setPhoneValue}
                keyboardType="phone-pad"
            />
            );
        case 'geo':
            return (
            <>
                <TextInput
                style={[styles.input, dynamicInput]}
                placeholder="Latitude"
                placeholderTextColor={dynamicPlaceholder}
                value={geoLat}
                onChangeText={setGeoLat}
                keyboardType="decimal-pad"
                />
                <TextInput
                style={[styles.input, dynamicInput]}
                placeholder="Longitude"
                placeholderTextColor={dynamicPlaceholder}
                value={geoLng}
                onChangeText={setGeoLng}
                keyboardType="decimal-pad"
                />
                <TextInput
                style={[styles.input, dynamicInput]}
                placeholder="Label (optional)"
                placeholderTextColor={dynamicPlaceholder}
                value={geoLabel}
                onChangeText={setGeoLabel}
                />
            </>
            );
        case 'url':
            return (
            <TextInput
                style={[styles.input, dynamicInput]}
                placeholder="Enter URL (e.g., example.com)"
                placeholderTextColor={dynamicPlaceholder}
                value={urlValue}
                onChangeText={setUrlValue}
                keyboardType="url"
                autoCapitalize="none"
            />
            );
        default:
            return null;
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
            style={[styles.container, dynamicContainer]}
            contentContainerStyle={{ paddingBottom: 30 }}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={[styles.title, dynamicText]}>QR Code Generator</Text>

            {renderTypeButtons()}
            {renderInputFields()}

            <TouchableOpacity style={[styles.generateButton, { backgroundColor: '#396491' }]} onPress={handleGenerate}>
            <Text style={styles.generateButtonText}>Generate QR Code</Text>
            </TouchableOpacity>

            {generatedQR !== '' && (
            <View style={styles.qrContainer}>
                <View ref={qrContainerRef} collapsable={false}>
                <QRCode value={generatedQR} size={220} />
                </View>
                <Text style={[styles.qrHint, dynamicHint]}>Scan this with another device</Text>
                <TouchableOpacity style={[styles.shareButton, { backgroundColor: '#396491' }]} onPress={shareQR}>
                <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
            </View>
            )}
        </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    typeButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 10,
        marginBottom: 10,
    },
    typeButtonActive: {
        backgroundColor: '#396491',
        borderColor: '#396491',
    },
    typeText: { fontWeight: '500' },
    typeTextActive: { color: 'white' },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        minHeight: 44,
        marginBottom: 10,
        fontSize: 16,
    },
    generateButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    generateButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    qrContainer: { alignItems: 'center', marginBottom: 30 },
    qrHint: { marginTop: 10 },
    shareButton: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 20,
    },
    shareButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});