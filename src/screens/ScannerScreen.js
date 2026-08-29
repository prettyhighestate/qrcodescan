import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Vibration,
    TouchableOpacity,
    Modal,
    Pressable,
    Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';//clipboard for copy and paste
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';//funny icons

export default function ScannerScreen() {
    // Camera permission hook
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [modalData, setModalData] = useState(null); //(date and type )
    const [flashOn, setFlashOn] = useState(false);//flashlight remember 
    const lastScanTimeRef = useRef(0); //store of last processed time stamp (way to prevent duplicates)

    //setting function from context
    const {
        addScannedCode,
        vibrationEnabled,
        historyAutoSave,
        autoOpenUrls,
        scanConfirmation,
        actualTheme,
    } = useAppContext();

    const isDark = actualTheme === 'dark';

    const handleBarcodeScanned = ({ data }) => {
        const now = Date.now();
        if (now - lastScanTimeRef.current < 5000) { //cooldown 
        return;
        }
        lastScanTimeRef.current = now;

        setScanned(true);
        //Detects QR content type using our parser
        const detectedType = require('../utils/qrParser').detectQRType(data);
        
        if (vibrationEnabled) {//vibration
        Vibration.vibrate(100);
        }

        if (historyAutoSave) { //if on auto saves history
        addScannedCode(data);
        }
        //auto url opener  when enabled
        if (autoOpenUrls && detectedType === 'url') {
        const url = /^https?:\/\//i.test(data) ? data : `https://${data}`;
        Linking.openURL(url).catch(() => alert('Could not open URL'));
        setScanned(false);
        return;
        }

        if (scanConfirmation) { //confimation thing
        setModalData({ data, type: detectedType });
        } else {
        setTimeout(() => setScanned(false), 1000);
        }
    };

    const copyToClipboard = async () => { //copy data to clipboard
        if (modalData) {
        await Clipboard.setStringAsync(modalData.data);
        alert('Copied to clipboard!');
        }
    };

    const closeModal = () => { 
        setModalData(null);
        setScanned(false);
    };

    const toggleFlash = () => { //flashlight manual
        setFlashOn(!flashOn);
    };

    if (!permission) {//permission loading state
        return (
        <View style={[styles.center, { backgroundColor: isDark ? '#121212' : '#ffffff' }]}>
            <Text style={{ color: isDark ? '#fff' : '#000' }}>Requesting camera permission...</Text>
        </View>
        );
    }

    if (!permission.granted) {//permission denied 
        return (
        <View style={[styles.center, { backgroundColor: isDark ? '#121212' : '#ffffff' }]}>
            <Text style={[styles.errorText, { color: isDark ? '#fff' : '#000' }]}>No access to camera</Text>
            <TouchableOpacity style={[styles.permissionButton, { backgroundColor: '#396491' }]} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
        </View>
        );
    }
//camera 
    return (
        <View style={styles.container}>
        <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            enableTorch={flashOn}
        />
        {/* Scan overlay with dark background and blue corners */}
        <View style={styles.overlay} pointerEvents="none"> 
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.square}>
                <View style={[styles.corner, styles.cornerTL, { borderColor: '#396491' }]} />
                <View style={[styles.corner, styles.cornerTR, { borderColor: '#396491' }]} />
                <View style={[styles.corner, styles.cornerBL, { borderColor: '#396491' }]} />
                <View style={[styles.corner, styles.cornerBR, { borderColor: '#396491' }]} />
            </View>
            <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom} />
        </View>
        {/*Flashlight  button*/}
        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            <Ionicons name={flashOn ? 'flash' : 'flash-off'} size={30} color={flashOn ? '#FFD700' : '#fff'} />
        </TouchableOpacity>
        
        {scanned && !scanConfirmation && (
            <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
            <Text style={styles.rescanText}>Tap to Scan Again</Text>
            </TouchableOpacity>
        )}

        <Modal
            visible={modalData !== null}
            transparent
            animationType="slide"
            onRequestClose={closeModal}
        >
            <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
                <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>QR Code Scanned</Text>
                <Text style={[styles.modalType, { color: '#396491' }]}>
                Type: {modalData?.type?.toUpperCase() || 'TEXT'}
                </Text>
                <Text style={[styles.modalData, { color: isDark ? '#fff' : '#000' }]} numberOfLines={5}>
                {modalData?.data}
                </Text>
                <View style={styles.modalButtons}>
                <Pressable style={[styles.copyButton, { backgroundColor: '#396491' }]} onPress={copyToClipboard}>
                    <Text style={styles.buttonText}>Copy</Text>
                </Pressable>
                <Pressable style={[styles.closeButton, { backgroundColor: '#FF3B30' }]} onPress={closeModal}>
                    <Text style={styles.buttonText}>Close</Text>
                </Pressable>
                </View>
            </View>
            </View>
        </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  permissionButton: { padding: 15, borderRadius: 8 },
  permissionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  overlay: { ...StyleSheet.absoluteFillObject },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  overlayMiddle: { flexDirection: 'row', height: 260 },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  overlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  square: { width: 260, height: 260, position: 'relative' },
  corner: { position: 'absolute', width: 30, height: 30 },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 5 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 5 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 5 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 5 },
  flashButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  rescanButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#396491',
    padding: 15,
    borderRadius: 10,
  },
  rescanText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { width: '85%', borderRadius: 15, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalType: { fontSize: 14, marginBottom: 10, textTransform: 'uppercase' },
  modalData: { fontSize: 16, marginBottom: 20, textAlign: 'center', maxHeight: 120, width: '100%' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  copyButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginRight: 10 },
  closeButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});