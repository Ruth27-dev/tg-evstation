import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BaseComponent from '@/components/BaseComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import moment from 'moment';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import { navigate } from '@/navigation/NavigationService';
import { useEVConnector } from '@/hooks/useEVConnector';
import { useEVStore } from '@/store/useEVStore';
import CustomButton from '@/components/CustomButton';
import { useHistory } from '@/hooks/useHistory';
import Loading from '@/components/Loading';
import { useTranslation } from '@/hooks/useTranslation';

const ChargingSuccessScreen = ( props : any) => {
    const { evConnect } = useEVStore();
    const { sessionId } = props?.route?.params;

    const { clearSessionDetail, clearEvConnect } = useEVConnector();
    const { fetchDetail,chargingHistoryDetails } = useHistory();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const { t } = useTranslation();

    const resolvedSessionId = sessionId || evConnect?.session_id || null;
    const summaryData = chargingHistoryDetails;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (resolvedSessionId) {
                const numericId = Number(resolvedSessionId);
                if (!Number.isNaN(numericId)) {
                    fetchDetail(numericId);
                }
            }
            setIsLoading(false)
        }, 3000);

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
    if(isLoading) return <Loading/>
    return (
        <BaseComponent isBack={true} onPress={handleBackPress}>
            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <View style={styles.successContainer}>
                    <Lottie
                        source={require('@/assets/lotties/success.json')}
                        autoPlay
                        loop={false}
                        style={{height:200,width:200}}
                    />
                    <Text style={styles.thankYouText}>{t('charging.thankYou')}</Text>
                    <Text style={styles.successMessage}>
                        {t('charging.successMessage')}
                    </Text>
                </View>

                <View style={styles.mainStatsContainer}>
                    <View style={styles.primaryStatCard} >
                        <MaterialCommunityIcons name="cash" size={40} color="#fff" />
                        <View style={styles.primaryStatContent}>
                            <Text style={styles.primaryStatLabel}>{t('charging.totalCost')}</Text>
                            <Text style={styles.primaryStatValue}>${summaryData?.price_so_far?.toFixed(2) || '0.00'}</Text>
                        </View>
                    </View>

                    <View style={styles.secondaryStatsRow}>
                        <View style={styles.secondaryStatCard}>
                            <MaterialCommunityIcons name="lightning-bolt" size={28} color={Colors.secondaryColor} />
                            <Text style={styles.secondaryStatValue}>{summaryData?.energy_kwh?.toFixed(2) || '0.00'}</Text>
                            <Text style={styles.secondaryStatLabel}>{t('charging.energyUnit')}</Text>
                        </View>

                        <View style={styles.secondaryStatCard}>
                            <MaterialCommunityIcons name="battery-charging" size={28} color={Colors.secondaryColor} />
                            <Text style={styles.secondaryStatValue}>{summaryData?.current_soc || '0'}%</Text>
                            <Text style={styles.secondaryStatLabel}>{t('charging.batteryLabel')}</Text>
                        </View>

                        <View style={styles.secondaryStatCard}>
                            <MaterialCommunityIcons name="clock-outline" size={28} color={Colors.secondaryColor} />
                            <Text style={styles.secondaryStatValue}>{summaryData?.charging_minutes || '0'}</Text>
                            <Text style={styles.secondaryStatLabel}>{t('charging.durationLabel')}</Text>
                        </View>
                    </View>
                </View>

                <View
                    style={styles.detailsCard}
                >
                    <View style={styles.detailsHeader}>
                        <MaterialCommunityIcons name="information" size={22} color={Colors.secondaryColor} />
                        <Text style={styles.detailsTitle}>{t('charging.sessionDetails')}</Text>
                    </View>

                    <View style={styles.detailsList}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconLabel}>
                                <Ionicons name="calendar" size={20} color={Colors.secondaryColor} />
                                <Text style={styles.detailItemLabel}>{t('charging.date')}</Text>
                            </View>
                            <Text style={styles.detailItemValue}>
                                {summaryData?.started_at ? moment(summaryData.started_at).format('MMM DD, YYYY') : t('common.notAvailable')}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIconLabel}>
                                <Ionicons name="play-circle" size={20} color={Colors.secondaryColor} />
                                <Text style={styles.detailItemLabel}>{t('charging.started')}</Text>
                            </View>
                            <Text style={styles.detailItemValue}>
                                {summaryData?.started_at ? moment(summaryData.started_at).format('h:mm A') : t('common.notAvailable')}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIconLabel}>
                                <Ionicons name="checkmark-circle" size={20} color={Colors.secondaryColor} />
                                <Text style={styles.detailItemLabel}>{t('charging.completed')}</Text>
                            </View>
                            <Text style={styles.detailItemValue}>
                                {summaryData?.last_update_at ? moment(summaryData.last_update_at).format('h:mm A') : t('common.notAvailable')}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIconLabel}>
                                <MaterialCommunityIcons name="identifier" size={20} color={Colors.secondaryColor} />
                                <Text style={styles.detailItemLabel}>{t('charging.sessionId')}</Text>
                            </View>
                            <Text style={styles.detailItemValue}>
                                {summaryData?.session_id?.slice(0, 12) || t('common.notAvailable')}
                            </Text>
                        </View>
                    </View>
                </View>

                <CustomButton 
                    buttonTitle={t('common.done')}
                    onPress={handleDone}
                    buttonColor={Colors.secondaryColor}
                />
                
                <View style={{ height: 30 }} />
            </ScrollView>
        </BaseComponent>
    );
};

export default ChargingSuccessScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:safePadding
    },
    contentContainer: {
    },
    successContainer: {
        alignItems: 'center',
    },
    successGradient: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thankYouText: {
        fontSize: FontSize.large + 8,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 12,
    },
    successMessage: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 24,
    },
    mainStatsContainer: {
        marginBottom: 20,
        marginTop:15
    },
    primaryStatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10,
        marginBottom: safePadding,
        width:'100%',
        backgroundColor: Colors.secondaryColor,
    },
    primaryStatContent: {
        marginLeft: 20,
        flex: 1,
    },
    primaryStatLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#fff',
        opacity: 0.9,
    },
    primaryStatValue: {
        fontSize: FontSize.extraLarge,
        fontFamily: CustomFontConstant.EnBold,
        color: '#fff',
    },
    secondaryStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    secondaryStatCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    secondaryStatValue: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginTop: 8,
    },
    secondaryStatLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        marginTop: 4,
    },
    detailsCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    detailsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.secondaryColor,
    },
    detailsTitle: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    detailsList: {
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailIconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailItemLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    detailItemValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1.5,
        borderColor: Colors.secondaryColor,
    },
    secondaryButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
    },
    primaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondaryColor,
        paddingVertical: 16,
        borderRadius: 10,
        gap: 8,
    },
    primaryButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: '#fff',
    },

});
