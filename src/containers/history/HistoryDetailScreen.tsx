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

const HistoryDetailScreen = (props: any) => {
    const { sessionId } = props.route?.params;
    const { fetchDetail, chargingHistoryDetails, isLoading } = useHistory();
    const { t, tVar } = useTranslation();

    useEffect(() => {
        fetchDetail(sessionId);
    }, [sessionId]);

    const getStatusConfig = (status: any) => {
        switch (status) {
            case 'COMPLETED':
                return { bg: `${Colors.secondaryColor}18`, color: Colors.secondaryColor, icon: 'checkmark-circle', label: 'Completed' };
            case 'CHARGING':
                return { bg: '#3B82F618', color: '#3B82F6', icon: 'sync', label: 'Charging' };
            case 'FAILED':
                return { bg: '#EF444418', color: '#EF4444', icon: 'close-circle', label: 'Failed' };
            default:
                return { bg: '#9CA3AF18', color: '#6B7280', icon: 'information-circle', label: status ?? '-' };
        }
    };

    const formatDate = (d: any) => moment.utc(d).local().format("ddd, MMM D, YYYY");
    const formatTime = (d: any) => moment.utc(d).local().format("hh:mm A");

    const status = getStatusConfig(chargingHistoryDetails?.status);

    if (isLoading) return <Loading />;

    return (
        <BaseComponent isBack={true} title="history.historyDetails">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* ── Hero Card ── */}
                <View style={styles.heroCard}>
                    <View style={[styles.heroIcon, { backgroundColor: status.bg }]}>
                        <MaterialCommunityIcons name="ev-station" size={22} color={status.color} />
                    </View>
                    <Text style={styles.heroAmount}>
                        ${chargingHistoryDetails?.price_so_far.toFixed(2) ?? '0.00'}
                    </Text>
                    <Text style={styles.heroAmountLabel}>{t('charging.totalCost')}</Text>
                    <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                        <Ionicons name={status.icon as any} size={13} color={status.color} />
                        <Text style={[styles.statusPillText, { color: status.color }]}>{status.label}</Text>
                    </View>
                    <Text style={styles.heroSessionId}>
                        Session #{chargingHistoryDetails?.session_id?.slice(0, 12)?.toUpperCase()}
                    </Text>
                </View>

                {/* ── Stats Grid ── */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
                            <MaterialCommunityIcons name="lightning-bolt" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.statValue}>{chargingHistoryDetails?.energy_kwh.toFixed(2)}</Text>
                        <Text style={styles.statUnit}>{t('charging.energyUnit')}</Text>
                        <Text style={styles.statLabel}>{t('charging.energy')}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: '#F0FDF4' }]}>
                            <MaterialCommunityIcons name="battery-charging" size={20} color={Colors.secondaryColor} />
                        </View>
                        <Text style={styles.statValue}>{chargingHistoryDetails?.current_soc}</Text>
                        <Text style={styles.statUnit}>%</Text>
                        <Text style={styles.statLabel}>{t('charging.batteryLabel')}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: '#FDF4FF' }]}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color="#A855F7" />
                        </View>
                        <Text style={styles.statValue}>{chargingHistoryDetails?.charging_minutes}</Text>
                        <Text style={styles.statUnit}>{t('charging.minutes')}</Text>
                        <Text style={styles.statLabel}>{t('charging.durationLabel')}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: '#FFF7ED' }]}>
                            <MaterialCommunityIcons name="cash" size={20} color="#F97316" />
                        </View>
                        <Text style={styles.statValue}>${chargingHistoryDetails?.price_so_far.toFixed(2)}</Text>
                        <Text style={styles.statUnit}> </Text>
                        <Text style={styles.statLabel}>{t('charging.cost')}</Text>
                    </View>
                </View>

                {/* ── Session Details ── */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="receipt-outline" size={17} color={Colors.mainColor} />
                        <Text style={styles.cardTitle}>{t('charging.sessionDetails')}</Text>
                    </View>

                    <InfoRow icon="barcode-outline" label={t('charging.sessionId')}
                        value={`#${chargingHistoryDetails?.session_id?.toUpperCase()}`} mono />
                    <InfoRow icon="calendar-outline" label={t('charging.date')}
                        value={formatDate(chargingHistoryDetails?.started_at)} />
                    <InfoRow icon="play-circle-outline" label={t('charging.started')}
                        value={formatTime(chargingHistoryDetails?.started_at)} />
                    <InfoRow icon="refresh-outline" label={t('history.updated')}
                        value={formatTime(chargingHistoryDetails?.last_update_at)} />
                    <InfoRow icon="time-outline" label={t('charging.chargingTime')}
                        value={`${chargingHistoryDetails?.charging_minutes ?? 0} ${t('charging.minutes')}`} last />
                </View>

                {/* ── Extra Info (conditional) ── */}
                {(chargingHistoryDetails?.minutes_remaining || chargingHistoryDetails?.max_amount_cents) && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="information-circle-outline" size={17} color={Colors.mainColor} />
                            <Text style={styles.cardTitle}>Additional Info</Text>
                        </View>
                        {chargingHistoryDetails?.minutes_remaining && (
                            <InfoRow icon="timer-outline" label="Remaining"
                                value={tVar('history.minutesRemaining', { minutes: chargingHistoryDetails.minutes_remaining })} last={!chargingHistoryDetails?.max_amount_cents} />
                        )}
                        {chargingHistoryDetails?.max_amount_cents && (
                            <InfoRow icon="card-outline" label="Max Amount"
                                value={tVar('history.maxAmount', { amount: (chargingHistoryDetails.max_amount_cents / 100).toFixed(2) })} last />
                        )}
                    </View>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
        </BaseComponent>
    );
};

/* ── Reusable row component ── */
interface InfoRowProps {
    icon: string;
    label: string;
    value: string;
    mono?: boolean;
    last?: boolean;
}

const InfoRow = ({ icon, label, value, mono, last }: InfoRowProps) => (
    <View style={[infoRowStyles.row, !last && infoRowStyles.rowBorder]}>
        <View style={infoRowStyles.iconBox}>
            <Ionicons name={icon as any} size={16} color={Colors.mainColor} />
        </View>
        <Text style={infoRowStyles.label}>{label}</Text>
        <Text style={[infoRowStyles.value, mono && infoRowStyles.mono]} numberOfLines={1}>{value}</Text>
    </View>
);

const infoRowStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 11,
        gap: 10,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconBox: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: `${Colors.mainColor}0D`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        flex: 1,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    value: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        maxWidth: '55%',
        textAlign: 'right',
    },
    mono: {
        fontFamily: CustomFontConstant.EnRegular,
        fontSize: FontSize.small - 1,
        color: '#6B7280',
    },
});

export default HistoryDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: safePadding,
    },

    /* Hero */
    heroCard: {
        backgroundColor: Colors.white,
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    heroIcon: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    heroAmount: {
        fontSize: FontSize.large + 6,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        letterSpacing: -0.5,
    },
    heroAmountLabel: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginTop: 2,
        marginBottom: 8,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginBottom: 10,
    },
    statusPillText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
    },
    heroSessionId: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },

    /* Stats */
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 14,
    },
    statCard: {
        backgroundColor: Colors.white,
        width: '48%',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 14,
        alignItems: 'center',
        gap: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    statValue: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    statUnit: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
    },
    statLabel: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginTop: 1,
    },

    /* Card */
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    cardTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
});
