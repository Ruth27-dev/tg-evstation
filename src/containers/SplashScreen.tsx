import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Colors } from '@/theme';
import { reset } from '@/navigation/NavigationService';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/assets/logo/logo.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '@/constants/GeneralConstants';

const hasActiveSessionInStorage = async (): Promise<boolean> => {
    try {
        const raw = await AsyncStorage.getItem(StorageKey.ev);
        if (!raw) {
            return false;
        }

        const parsed = JSON.parse(raw);
        const sessionId = parsed?.state?.evConnect?.session_id;
        return Boolean(sessionId);
    } catch (error) {
        return false;
    }
};

const SplashScreen = () => {
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        let isMounted = true;
        const timer = setTimeout(async () => {
            if (!isMounted) {
                return;
            }

            if (!isAuthenticated) {
                reset('AuthChoice');
                return;
            }

            const hasActiveSession = await hasActiveSessionInStorage();
            if (!isMounted) {
                return;
            }

            if (hasActiveSession) {
                reset('ChargingDetail');
            } else {
                reset('Main');
            }
        }, 1500);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [isAuthenticated]);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:Colors.white }}>
            <AppLogo width={300} height={300} />
        </View>
    )
}

export default SplashScreen;
