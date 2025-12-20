import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/theme';
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
                                <MaterialCommunityIcons name="receipt" size={20} color="#6B7280" />
                                <Text style={styles.detailLabel}>{t('wallet.transactionId')}</Text>
                            </View>
                            <Text style={styles.detailValue}>{transactionId}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
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
    successIconContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    successCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    amountContainer: {
        backgroundColor: '#F0F9FF',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: safePadding,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    amountLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        marginBottom: 8,
    },
    amount: {
        fontSize: FontSize.large + 10,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    detailsCard: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 20,
        marginBottom: 32,
        shadowColor: '#000',
        borderWidth: 1,
        borderColor: '#F3F4F6',
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
        color: '#6B7280',
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
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
    },
    buttonContainer: {
        gap: 12,
        paddingBottom: 20,
    },
    primaryButton: {
        backgroundColor: Colors.mainColor,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: Colors.mainColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
    secondaryButton: {
        backgroundColor: Colors.white,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: Colors.mainColor,
    },
    secondaryButtonText: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
});
