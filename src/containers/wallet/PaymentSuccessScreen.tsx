import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate } from '@/navigation/NavigationService';
import BaseComponent from '@/components/BaseComponent';
import LottieView from 'lottie-react-native';
import SuccessAnimation from '@/assets/lotties/success.json';
import moment from 'moment';
import { useTranslation } from '@/hooks/useTranslation';

interface PaymentSuccessScreenProps {
    route?: {
        params?: {
            amount?: number;
            transactionId?: string;
            date?: string;
        };
    };
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ route }) => {
    const lottieRef = useRef<LottieView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { t } = useTranslation();
    
    const amount = route?.params?.amount || 0;
    const transactionId = route?.params?.transactionId || t('common.notAvailable');
    const date = route?.params?.date || new Date().toLocaleDateString();

    useEffect(() => {
        lottieRef.current?.play();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            delay: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <BaseComponent isBack={true} onPress={()=>navigate('Main')} title="wallet.paymentSuccessHeader">
            <View style={styles.container}>
                <View style={styles.lottieContainer}>
                    <LottieView
                        ref={lottieRef}
                        source={SuccessAnimation}
                        style={styles.lottie}
                        loop={false}
                        autoPlay={false}
                    />
                </View>
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.successTitle}>{t('wallet.paymentSuccessTitle')}</Text>
                    <Text style={styles.successSubtitle}>
                        {t('wallet.paymentSuccessSubtitle')}
                    </Text>

                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>{t('wallet.amountPaid')}</Text>
                        <Text style={styles.amount}>
                            {amount.toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.detailsCard}>
                        <Text style={styles.detailsTitle}>{t('wallet.transactionDetails')}</Text>
                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <MaterialCommunityIcons name="receipt" size={20} color={Colors.textMuted} />
                                <Text style={styles.detailLabel}>{t('wallet.transactionId')}</Text>
                            </View>
                            <Text style={styles.detailValue}>{transactionId}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <Ionicons name="calendar-outline" size={20} color={Colors.textMuted} />
                                <Text style={styles.detailLabel}>{t('wallet.transactionDate')}</Text>
                            </View>
                            <Text style={styles.detailValue}>{moment(date).format('MMMM DD, YYYY')}</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </BaseComponent>
    );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: safePadding,
    },
    lottieContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        width: 250,
        height: 250,
    },
    contentContainer: {
        flex: 1,
    },
    successTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        textAlign: 'center',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    amountContainer: {
        backgroundColor: Colors.surfaceTint,
        padding: Spacing.xl,
        borderRadius: Radius.md,
        alignItems: 'center',
        marginBottom: safePadding,
        borderWidth: 1,
        borderColor: Colors.borderTint,
    },
    amountLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
        marginBottom: 8,
    },
    amount: {
        fontSize: FontSize.large + 10,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    detailsCard: {
        backgroundColor: Colors.white,
        borderRadius: Radius.md,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: Colors.borderMuted,
        ...Shadows.card,
    },
    detailsTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
        marginLeft: 12,
    },
    detailValue: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        flex: 1,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderMuted,
        marginVertical: 4,
    },
});
