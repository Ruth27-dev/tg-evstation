import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Colors } from '@/theme';
import { reset } from '@/navigation/NavigationService';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/assets/logo/logo.svg';
const SplashScreen = () => {
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated) {
                reset('Main');
            } else {
                reset('AuthChoice');
            }
        }, 1500);
        
        return () => clearTimeout(timer);
    }, [isAuthenticated]);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:Colors.white }}>
            <AppLogo width={300} height={300} />
        </View>
    )
}

export default SplashScreen;
