// hooks/useAutoPrinterConnect.ts
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';
import reactotron from 'reactotron-react-native';
import { StorageKey } from '@/constants/GeneralConstants';
import { useGlobalToast } from '@/components/ToastProvider';

export const useAutoPrinterConnect = () => {
    const [macAddress, setMacAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { showToast } = useGlobalToast();
    // Load printer from AsyncStorage
    const loadPrinter = async () => {
        try {
        const saved = await AsyncStorage.getItem(StorageKey.printer);
        if (saved) {
            const printer = JSON.parse(saved);
            setMacAddress(printer?.state?.printerName?.inner_mac_address);
        }
        } catch (err) {
        console.warn('Failed to load saved printer:', err);
        }
    };

    // Request BLE permissions (Android only)
    const requestBluetoothPermissions = async () => {
        if (Platform.OS !== 'android') return true;
        try {
        if (Platform.Version >= 31) {
                const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);
            return (
                result['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
                result['android.permission.BLUETOOTH_CONNECT'] === 'granted'
            );
        } else {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        } catch (e) {
        console.error('Permission request error:', e);
        return false;
        }
    };

    // Connect to printer
    const connectPrinter = async (address: string) => {
        try {
            setLoading(true);
            await BLEPrinter.init();
            await BLEPrinter.connectPrinter(address);
            showToast('ភ្ជាប់ម៉ាស៊ីនបោះពុម្ពដោយជោគជ័យ!', 'success');
        } catch (err) {
            showToast('ភ្ជាប់ម៉ាស៊ីនបោះពុម្ពបរាជ័យ!', 'error');
        } finally {
        setLoading(false);
        }
    };

    // On mount
    useEffect(() => {
        loadPrinter();
    }, []);

    useEffect(() => {
        (async () => {
        if (macAddress) {
            const granted = await requestBluetoothPermissions();
            if (granted) await connectPrinter(macAddress);
        }
        })();
    }, [macAddress]);

    return { macAddress, loading };
};
