import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BaseComponent from "@/components/BaseComponent";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import { useHistory } from "@/hooks/useHistory";
import Loading from "@/components/Loading";
import { useTranslation } from "@/hooks/useTranslation";

const HistoryDetailScreen = (props:any) => {
    const { sessionId } = props.route?.params;
    const { fetchDetail,chargingHistoryDetails,isLoading } = useHistory();
    const { t, tVar } = useTranslation();
    
    useEffect(() => {
        fetchDetail(sessionId);
    }, [sessionId]);

    const getStatusColor = (status: any) => {
        switch (status) {
            case 'COMPLETED':
                return { bg: '#10B98115', color: Colors.secondaryColor, icon: 'checkmark-circle' };
            case 'CHARGING':
                return { bg: '#3B82F615', color: '#3B82F6', icon: 'sync' };
            case 'FAILED':
                return { bg: '#EF444415', color: '#EF4444', icon: 'close-circle' };
            default:
                return { bg: '#9CA3AF15', color: '#6B7280', icon: 'information-circle' };
        }
    };

    const formatDate = (dateString: any) => {
        return moment.utc(dateString).local().format("dddd, MMMM D, YYYY");
    };

    const formatTimeLocal = (dateString: any) => {
        return moment(dateString).local().format("hh:mm A");
    };

    const formatTime = (dateString: any) => {
        return moment(dateString).local().format("hh:mm A");
    };
   
    const statusColors = getStatusColor(chargingHistoryDetails?.status);

    if(isLoading) return <Loading/>

    return (
        <BaseComponent isBack={true} title="history.historyDetails">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Status Header */}
                <View style={styles.statusCard}>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusIcon, { backgroundColor: statusColors.bg }]}>
                            <Ionicons name={statusColors.icon as any} size={24} color={statusColors.color} />
                        </View>
                        <View style={styles.statusInfo}>
                            <Text style={styles.statusTitle}>{chargingHistoryDetails?.status}</Text>
                            <Text style={styles.sessionId}>#{chargingHistoryDetails?.session_id.slice(0, 12)}</Text>
                        </View>
                    </View>
                </View>

                {/* Main Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <MaterialCommunityIcons name="lightning-bolt" size={22} color={Colors.secondaryColor} />
                        <Text style={styles.statValue}>{chargingHistoryDetails?.energy_kwh.toFixed(2)}</Text>
                        <Text style={styles.statLabel}>{t('charging.energyUnit')}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <MaterialCommunityIcons name="battery-charging" size={22} color={Colors.secondaryColor} />
                        <Text style={styles.statValue}>{chargingHistoryDetails?.current_soc}%</Text>
                        <Text style={styles.statLabel}>{t('charging.batteryLabel')}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <MaterialCommunityIcons name="clock-outline" size={22} color={Colors.secondaryColor} />
                        <Text style={styles.statValue}>{chargingHistoryDetails?.charging_minutes}</Text>
                        <Text style={styles.statLabel}>{t('charging.minutes')}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <MaterialCommunityIcons name="cash" size={22} color={Colors.secondaryColor} />
                        <Text style={styles.statValue}>${chargingHistoryDetails?.price_so_far.toFixed(2)}</Text>
                        <Text style={styles.statLabel}>{t('charging.cost')}</Text>
                    </View>
                </View>

                {/* Session Timeline */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="time-outline" size={18} color={Colors.mainColor} />
                        <Text style={styles.cardTitle}>{t('history.sessionTimeline')}</Text>
                    </View>
                    <View style={styles.timelineRow}>
                        <View style={styles.timelineCol}>
                            <Text style={styles.timeLabel}>{t('charging.started')}</Text>
                            <Text style={styles.timeValue}>{formatTimeLocal(chargingHistoryDetails?.started_at)}</Text>
                            <Text style={styles.dateValue}>{formatDate(chargingHistoryDetails?.started_at)}</Text>
                        </View>
                        <View style={styles.timelineSeparator}>
                            <View style={styles.timelineDotSmall} />
                            <View style={styles.timelineLineSmall} />
                            <View style={styles.timelineDotSmall} />
                        </View>
                        <View style={styles.timelineCol}>
                            <Text style={styles.timeLabel}>{t('history.updated')}</Text>
                            <Text style={styles.timeValue}>{formatTime(chargingHistoryDetails?.last_update_at)}</Text>
                        </View>
                    </View>
                </View>

                {/* Additional Info */}
                {chargingHistoryDetails?.minutes_remaining && (
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="timer-outline" size={18} color={Colors.mainColor} />
                        <Text style={styles.infoText}>
                            {tVar('history.minutesRemaining', { minutes: chargingHistoryDetails?.minutes_remaining })}
                        </Text>
                    </View>
                )}
                {chargingHistoryDetails?.max_amount_cents && (
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="credit-card-outline" size={18} color={Colors.mainColor} />
                        <Text style={styles.infoText}>
                            {tVar('history.maxAmount', { amount: (chargingHistoryDetails?.max_amount_cents / 100).toFixed(2) })}
                        </Text>
                    </View>
                )}

                <View style={{ height: 20 }} />
            </ScrollView>
        </BaseComponent>
    )
};

export default HistoryDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: safePadding,
    },
    statusCard: {
        backgroundColor: Colors.white,
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusIcon: {
        width: 44,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusInfo: {
        flex: 1,
    },
    statusTitle: {
        fontSize: FontSize.medium + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    sessionId: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        marginTop: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 12,
    },
    statBox: {
        backgroundColor: Colors.white,
        width: '48%',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        gap: 6,
    },
    statValue: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    statLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    card: {
        backgroundColor: Colors.white,
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timelineCol: {
        flex: 1,
    },
    timeLabel: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    timeValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    dateValue: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        marginTop: 2,
    },
    timelineSeparator: {
        alignItems: 'center',
        gap: 4,
    },
    timelineDotSmall: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.secondaryColor,
    },
    timelineLineSmall: {
        width: 2,
        height: 20,
        backgroundColor: '#E5E7EB',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
    },
    infoText: {
        flex: 1,
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
});
