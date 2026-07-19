import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Lottie from 'lottie-react-native';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@/hooks/useTranslation';

const DOT_STAGGER_MS = 200;

const PreparingChargingScreen = () => {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const dotAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const loops = dotAnims.map((anim, index) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(index * DOT_STAGGER_MS),
                    Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: false }),
                    Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: false }),
                    Animated.delay((dotAnims.length - 1 - index) * DOT_STAGGER_MS),
                ])
            )
        );
        loops.forEach(loop => loop.start());
        return () => loops.forEach(loop => loop.stop());
    }, [dotAnims]);

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
                    {dotAnims.map((anim, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [Colors.trackColor, Colors.secondaryColor],
                                    }),
                                },
                            ]}
                        />
                    ))}
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
        backgroundColor: Colors.trackColor,
    },
});
