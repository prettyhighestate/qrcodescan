import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import { useAppContext } from '../context/AppContext';

export default function HistoryDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const { updateHistoryItem, deleteHistoryItem, actualTheme } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(item.data);
    const qrContainerRef = useRef(null);

    const isDark = actualTheme === 'dark';
//Copies data to clipboard
    const handleCopy = async () => {
        await Clipboard.setStringAsync(editedData);
        Alert.alert('Copied', 'Data copied to clipboard');
    };
//save edited
    const handleSave = () => {
        if (!editedData.trim()) {
        Alert.alert('Error', 'Data cannot be empty');
        return;
        }
        updateHistoryItem(item.id, editedData.trim());
        setIsEditing(false);
    };
//delete with confimation
    const handleDelete = () => {
        Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
        { text: 'Cancel', style: 'cancel' },
        {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
            deleteHistoryItem(item.id);
            navigation.goBack();
            },
        },
        ]);
    };

    const handleShare = async () => { //share QR code as image
        try {
        if (!qrContainerRef.current) {
            Alert.alert('Error', 'QR code not ready');
            return;
        }
        const uri = await captureRef(qrContainerRef.current, {
            format: 'png',
            quality: 1,
        });

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

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
        <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
            <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>Type</Text>
            <Text style={[styles.typeBadge, { color: '#396491' }]}>{item.type.toUpperCase()}</Text>

            <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>Information</Text>
            {isEditing ? ( //editable text when in edit mode
            <TextInput
                style={[
                styles.input,
                {
                    backgroundColor: isDark ? '#121212' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    borderColor: isDark ? '#555' : '#ccc',
                },
                ]}
                value={editedData}
                onChangeText={setEditedData}
                multiline
                autoFocus
            />
            //display data
            ) : (
            <Text style={[styles.data, { color: isDark ? '#fff' : '#000' }]}>{editedData}</Text>
            )}

            <Text style={[styles.label, { color: isDark ? '#aaa' : '#888' }]}>When</Text>
            <Text style={[styles.timestamp, { color: isDark ? '#aaa' : '#555' }]}>
            {new Date(item.timestamp).toLocaleString()}
            </Text>
            {/* QR code preview */}
            <View style={styles.qrWrapper}>
            <View ref={qrContainerRef} collapsable={false}>
                <QRCode value={editedData} size={180} />
            </View>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            {isEditing ? (
            <>
                <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#396491' }]}
                onPress={handleSave}
                >
                <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#888' }]}
                onPress={() => setIsEditing(false)}
                >
                <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </>
            ) : (
            <>
                <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#396491' }]}
                onPress={handleCopy}
                >
                <Text style={styles.buttonText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#396491' }]}
                onPress={() => setIsEditing(true)}
                >
                <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#396491' }]}
                onPress={handleShare}
                >
                <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: '#FF3B30' }]}
                onPress={handleDelete}
                >
                <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </>
            )}
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    card: { borderRadius: 10, padding: 20, marginBottom: 20, alignItems: 'center' },
    label: { fontSize: 14, marginTop: 10, marginBottom: 5, alignSelf: 'flex-start' },
    typeBadge: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, alignSelf: 'flex-start' },
    data: { fontSize: 16, marginBottom: 10, alignSelf: 'flex-start' },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 10,
        fontSize: 16,
        alignSelf: 'stretch',
    },
    timestamp: { fontSize: 14, alignSelf: 'flex-start' },
    qrWrapper: { marginTop: 20, alignItems: 'center' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' },
    primaryButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginBottom: 10 },
    deleteButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginBottom: 10 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});