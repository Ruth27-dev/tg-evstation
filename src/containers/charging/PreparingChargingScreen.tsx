import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@/hooks/useTranslation';

const PreparingChargingScreen = () => {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <Lottie
                    source={require('@/assets/lotties/ev-charging.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
                <Text style={styles.title}>{t('charging.preparingTitle')}</Text>
                <Text style={styles.subtitle}>{t('charging.preparingSubtitle')}</Text>
                
                <View style={styles.dotsContainer}>
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={[styles.dot, styles.dotActive]} />
                </View>
            </View>
        </View>
    );
};

export default PreparingChargingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 300,
        height: 300,
        marginBottom: 30,
    },
    title: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.7,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 30,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
    },
    dotActive: {
        backgroundColor: Colors.secondaryColor,
    },
});
