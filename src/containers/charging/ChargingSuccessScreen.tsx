import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BaseComponent from '@/components/BaseComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { Colors, Radius } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import { navigate } from '@/navigation/NavigationService';
import { useEVConnector } from '@/hooks/useEVConnector';
import { useEVStore } from '@/store/useEVStore';
import CustomButton from '@/components/CustomButton';
import { useHistory } from '@/hooks/useHistory';
import Loading from '@/components/Loading';
import { useTranslation } from '@/hooks/useTranslation';

const formatAmount = (value?: number | null) => {
    const amount = value ?? 0;
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDuration = (start?: Date | string | null, end?: Date | string | null) => {
    if (!start || !end) return null;
    const totalSeconds = Math.max(0, moment(end).diff(moment(start), 'seconds'));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
};

const ChargingSuccessScreen = ( props : any) => {
    const { evConnect } = useEVStore();
    const { sessionId, sessionData } = props?.route?.params ?? {};

    const { clearSessionDetail, clearEvConnect } = useEVConnector();
    const { fetchDetail,chargingHistoryDetails } = useHistory();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const resolvedSessionId =
        sessionId ||
        sessionData?.session_id ||
        sessionData?.charging_session_id ||
        evConnect?.session_id ||
        null;
    const summaryData = chargingHistoryDetails;

    console.log("ChargingSuccessScreen sessionId:", summaryData);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (resolvedSessionId) {
                const numericId = Number(resolvedSessionId);
                // if (!Number.isNaN(numericId)) {
                    fetchDetail(resolvedSessionId);
                // }
            }
            setIsLoading(false)
        }, 10000);

        return () => clearTimeout(timer);
    }, [resolvedSessionId]);

    const handleDone = () => {
        clearEvConnect();
        clearSessionDetail();
        navigate('Main');
    };

    const handleBackPress = () => {
        clearEvConnect();
        clearSessionDetail();
        navigate('Main');
    };

    const handleHelp = () => {
        navigate('CustomerSupportScreen');
    };

    if(isLoading) return <Loading/>

    const durationLabel = formatDuration(summaryData?.started_at, summaryData?.last_update_at) || t('common.notAvailable');

    return (
        <BaseComponent isBack={true} hideHeader>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity activeOpacity={0.7} onPress={handleBackPress} style={styles.closeButton}>
                    <Ionicons name="close" size={22} color={Colors.mainColor} />
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={0.7} onPress={handleHelp} style={styles.helpButton}>
                    <Text style={styles.helpButtonText}>{t('common.help')}</Text>
                </TouchableOpacity> */}
            </View>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <View style={styles.heroSection}>
                    <View style={styles.heroIconCircle}>
                        <MaterialCommunityIcons name="lightning-bolt-outline" size={36} color={Colors.mainColor} />
                    </View>
                    <Text style={styles.billedLabel}>{t('charging.billed')}</Text>
                    <Text style={styles.billedAmount}>${formatAmount(summaryData?.price_so_far)}</Text>
                    <Text style={styles.heroSubtitle}>{t('charging.forYourSession')}</Text>

                    <View style={styles.sessionPill}>
                        <MaterialCommunityIcons name="lightning-bolt-outline" size={16} color={Colors.mainColor} />
                        <Text style={styles.sessionPillText}>{t('charging.chargingSession')}</Text>
                    </View>
                </View>

                <View style={styles.detailsCard}>
                    <Text style={styles.sectionTitle}>{t('charging.sessionDetails')}</Text>

                    <View style={styles.detailItem}>
                        <View style={styles.detailIconLabel}>
                            <Ionicons name="time-outline" size={20} color={Colors.textMuted} />
                            <Text style={styles.detailItemLabel}>{t('charging.sessionStarted')}</Text>
                        </View>
                        <Text style={styles.detailItemValue}>
                            {summaryData?.started_at ? moment(summaryData.started_at).format('DD/MM/YY • HH:mm') : t('common.notAvailable')}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailItem}>
                        <View style={styles.detailIconLabel}>
                            <Ionicons name="time-outline" size={20} color={Colors.textMuted} />
                            <Text style={styles.detailItemLabel}>{t('charging.sessionEnded')}</Text>
                        </View>
                        <Text style={styles.detailItemValue}>
                            {summaryData?.last_update_at ? moment(summaryData.last_update_at).format('DD/MM/YY • HH:mm') : t('common.notAvailable')}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailItem}>
                        <View style={styles.detailIconLabel}>
                            <MaterialCommunityIcons name="timer-sand" size={20} color={Colors.textMuted} />
                            <Text style={styles.detailItemLabel}>{t('charging.durationOfCharging')}</Text>
                        </View>
                        <Text style={styles.detailItemValue}>{durationLabel}</Text>
                    </View>

                    <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>{t('charging.billingDetails')}</Text>

                    <View style={styles.detailItem}>
                        <View style={styles.detailIconLabel}>
                            <MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.textMuted} />
                            <Text style={styles.detailItemLabel}>{t('charging.unitConsumed')}</Text>
                        </View>
                        <Text style={styles.detailItemValue}>
                            {summaryData?.energy_kwh?.toFixed(2) || '0.00'} {t('charging.energyUnit')}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailItem}>
                        <View style={styles.detailIconLabel}>
                            <MaterialCommunityIcons name="cash" size={20} color={Colors.textMuted} />
                            <Text style={styles.detailItemLabel}>{t('charging.totalCost')}</Text>
                        </View>
                        <Text style={styles.detailItemValue}>${formatAmount(summaryData?.price_so_far)}</Text>
                    </View>

                    <View style={styles.solidDivider} />

                    <View style={styles.detailItem}>
                        <Text style={styles.youPaidLabel}>{t('charging.youPaid')}</Text>
                        <Text style={styles.youPaidValue}>${formatAmount(summaryData?.price_so_far)}</Text>
                    </View>
                </View>

                <View style={styles.buttonWrapper}>
                    <CustomButton
                        buttonTitle={t('common.done')}
                        onPress={handleDone}
                        buttonColor={Colors.secondaryColor}
                    />
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </BaseComponent>
    );
};

export default ChargingSuccessScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: safePadding,
        paddingBottom: 12,
        backgroundColor: Colors.white,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.backGroundColor,
    },
    helpButton: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: Radius.pill,
        backgroundColor: Colors.mainColor,
    },
    helpButtonText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
    container: {
        flex: 1,
    },
    contentContainer: {},
    heroSection: {
        alignItems: 'center',
        backgroundColor: Colors.backGroundColor,
        paddingHorizontal: safePadding,
        paddingTop: 20,
        paddingBottom: 28,
    },
    heroIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    billedLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
        marginBottom: 8,
    },
    billedAmount: {
        fontSize: FontSize.huge + 6,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    heroSubtitle: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
        marginTop: 6,
        marginBottom: 16,
    },
    sessionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: Radius.pill,
        borderWidth: 1,
        borderColor: Colors.borderMuted,
        backgroundColor: Colors.white,
    },
    sessionPillText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    detailsCard: {
        paddingHorizontal: safePadding,
        paddingTop: 24,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 14,
    },
    sectionTitleSpacing: {
        marginTop: 24,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailIconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailItemLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
    },
    detailItemValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderMuted,
    },
    solidDivider: {
        height: 1,
        backgroundColor: Colors.dividerColor,
        marginTop: 8,
        marginBottom: 4,
    },
    youPaidLabel: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    youPaidValue: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    buttonWrapper: {
        paddingHorizontal: safePadding,
        marginTop: 12,
    },
});
