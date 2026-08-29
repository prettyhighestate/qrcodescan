import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
//Qr Type
const typeLabels = {
    url: 'URL',
    text: 'Text',
    email: 'Email',
    phone: 'Phone',
    sms: 'SMS',
    wifi: 'Wi-Fi',
    geo: 'Geo',
    contact: 'Contact',
};

export default function HistoryScreen({ navigation }) {
    const { history, clearHistory, actualTheme } = useAppContext();
    const [filter, setFilter] = useState('all'); //filters 'all' , 'scanned' and 'generated'

    const isDark = actualTheme === 'dark';

    const filteredHistory = history.filter((item) => {
        if (filter === 'all') return true;
        return item.source === filter;
    });
    //confirmation dialog when clearing history
    const confirmClear = () => {
        Alert.alert('Clear History', 'Are you sure you want to clear all scanned codes?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearHistory },
        ]);
    };
    //renders each history items
    const renderItem = ({ item }) => (
        <TouchableOpacity
        style={[styles.item, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}
        onPress={() => navigation.navigate('HistoryDetail', { item })}
        >
        <QRCode value={item.data} size={50} />
        <View style={styles.itemText}>
            <Text style={[styles.data, { color: isDark ? '#ffffff' : '#000000' }]} numberOfLines={2}>
            {item.data}
            </Text>
            <View style={styles.metaRow}>
            <Text style={styles.typeBadge}>{typeLabels[item.type] || 'Other'}</Text>
            <Text style={[styles.sourceBadge, item.source === 'generated' ? styles.generatedBadge : styles.scannedBadge]}>
                {item.source === 'generated' ? 'Generated' : 'Scanned'}
            </Text>
            <Text style={[styles.timestamp, { color: isDark ? '#aaa' : '#888' }]}>
                {new Date(item.timestamp).toLocaleString()}
            </Text>
            </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={isDark ? '#ccc' : '#ccc'} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
        {/* Filter Buttons */}
        <View style={[styles.filterContainer, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff', borderBottomColor: isDark ? '#333' : '#eee' }]}>
            {['all', 'scanned', 'generated'].map((f) => (
            <TouchableOpacity
                key={f}
                style={[styles.filterButton, filter === f && styles.filterButtonActive]}
                onPress={() => setFilter(f)}
            >
                <Text
                style={[
                    styles.filterText,
                    { color: filter === f ? '#fff' : isDark ? '#ccc' : '#555' },
                    filter === f && styles.filterTextActive,
                ]}
                >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
            </TouchableOpacity>
            ))}
        </View>

        {filteredHistory.length === 0 ? (
            <View style={styles.empty}>
            <Ionicons name="time-outline" size={50} color={isDark ? '#ccc' : '#ccc'} />
            <Text style={[styles.emptyText, { color: isDark ? '#ccc' : '#888' }]}>No codes found</Text>
            </View>
        ) : (
            <>
            <FlatList
                data={filteredHistory}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
            <TouchableOpacity style={styles.clearButton} onPress={confirmClear}>
                <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
            </>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 15,
    },
    filterButtonActive: {
        backgroundColor: '#396491',
    },
    filterText: { fontWeight: '500' },
    filterTextActive: { color: 'white' },
    item: {
        flexDirection: 'row',
        padding: 15,
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    itemText: { marginLeft: 15, flex: 1 },
    data: { fontWeight: 'bold', fontSize: 16 },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        flexWrap: 'wrap',
    },
    typeBadge: {
        backgroundColor: '#e0f0ff',
        color: '#396491',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 5,
    },
    sourceBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 5,
    },
    scannedBadge: { backgroundColor: '#d1f7d1', color: '#1e7b1e' },
    generatedBadge: { backgroundColor: '#ffe8cc', color: '#a86400' },
    timestamp: { fontSize: 12 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { marginTop: 10 },
    clearButton: {
        backgroundColor: '#FF3B30',
        padding: 15,
        margin: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    clearText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});