import React, { useEffect, useRef, useMemo, useState, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, AppState } from 'react-native';
import BaseComponent from '@/components/BaseComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Shadows } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import { useEVConnector } from '@/hooks/useEVConnector';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@/hooks/useTranslation';
import { useWebSocket } from '@/context/WebSocketProvider';
import CustomButton from '@/components/CustomButton';
import Feather from 'react-native-vector-icons/Feather';

const RING_SIZE = 220;

const pad2 = (value: number): string => String(Math.max(0, Math.floor(value))).padStart(2, '0');

const formatElapsed = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
};

const formatTimeOfDay = (value?: string | null): string => {
    if (!value) return '--:--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
};

// Ticks every second so "Time elapsed" stays live; falls back to the last known
// charging_minutes (no seconds) when started_at hasn't been populated by the API yet.
const useElapsedSeconds = (startedAt: string | null | undefined, fallbackMinutes: number | string): number => {
    const [, tick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => tick((n) => n + 1), 1000);
        return () => clearInterval(id);
    }, []);

    const startMs = startedAt ? new Date(startedAt).getTime() : NaN;
    if (!Number.isNaN(startMs)) {
        return Math.max(0, Math.floor((Date.now() - startMs) / 1000));
    }
    return typeof fallbackMinutes === 'number' ? fallbackMinutes * 60 : 0;
};

const ChargingDetailScreen = () => {
    const navigation = useNavigation<any>();
    const { sessionDetail, evConnect, postStop, getSessionDetail } = useEVConnector();
    const lastChargingMinutesRef = useRef<number | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const { t } = useTranslation();
    const { lastMessage } = useWebSocket();

    useEffect(() => {
        // Store session ID in ref to persist even if evConnect is cleared
        if (evConnect?.session_id) {
            sessionIdRef.current = evConnect.session_id;
        } else {
            sessionIdRef.current = null;
            lastChargingMinutesRef.current = null;
        }
    }, [evConnect?.session_id]);

    useEffect(() => {
        const sessionId = sessionIdRef.current;
        if (sessionId) {
            getSessionDetail(sessionId);
        }
    }, [evConnect?.session_id, getSessionDetail]);

    useEffect(() => {
        const sessionId = sessionIdRef.current;
        if (!sessionId || !lastMessage || lastMessage.event_type !== "METER_CHANGE") {
            return;
        }

        const payload = lastMessage?.data;
        const payloadSessionId =
            payload?.session_id ??
            payload?.charging_session_id ??
            payload?.id ??
            (typeof payload === 'string' ? payload : null);

        if (!payloadSessionId || String(payloadSessionId) === String(sessionId)) {
            getSessionDetail(sessionId);
        }
    }, [lastMessage, getSessionDetail]);
    

    useEffect(() => {
        const val = sessionDetail?.charging_minutes;

        if (val === null || val === undefined) {
            return;
        }

        lastChargingMinutesRef.current = val;
    }, [sessionDetail?.charging_minutes]);

    const displayChargingMinutes = sessionDetail?.charging_minutes ?? lastChargingMinutesRef.current;

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === "active") {
                const sessionId = sessionIdRef.current;
                if (sessionId) getSessionDetail(sessionId);
            }
        });

        return () => subscription.remove();
    }, [getSessionDetail]);

    const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

    const batteryPercentage = sessionDetail?.current_soc ?? 0;
    const energyConsumed = sessionDetail?.energy_kwh ?? 0;
    const currentCost = sessionDetail?.price_so_far ?? 0;
    const currentPowerKw = sessionDetail?.current_power_kw ?? 0;

    const chargingMinutesValue = typeof displayChargingMinutes === 'number' ? displayChargingMinutes : '--';

    const elapsedSeconds = useElapsedSeconds(sessionDetail?.started_at, chargingMinutesValue);
    const chargeStartedLabel = formatTimeOfDay(sessionDetail?.started_at);
    const estCompletionLabel = formatTimeOfDay(sessionDetail?.estimated_finish_time);
    const pricePerKwh = energyConsumed > 0 ? currentCost / energyConsumed : 0;

    const handleStopCharging = () => {
        Alert.alert(
            t('charging.stopCharging'),
            t('charging.confirmStop'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('charging.stopCharging'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const sessionData = sessionDetail;
                            const sessionId =
                                sessionDetail?.session_id ??
                                sessionIdRef.current ??
                                evConnect?.session_id ??
                                null;
                            await postStop(sessionId);
                            navigation.replace('ChargingSuccess', {
                                sessionData,
                                sessionId
                            });
                        } catch (error: any) {
                            const message =
                                error?.message && typeof error.message === 'string'
                                    ? error.message
                                    : t('charging.stopChargingError');
                            Alert.alert(t('common.error'), message);
                        }
                    }
                }
            ]
        );
    };


    const BatteryRing = useMemo(() => (
        <View style={styles.ringOuter}>
            <View style={styles.ringMid}>
                <View style={styles.ringInner}>
                    <View style={styles.ringCenter}>
                        <Text style={styles.percentageText}>{batteryPercentage}%</Text>
                        <Text style={styles.percentageLabel}>{t('charging.batteryLevel')}</Text>
                    </View>
                </View>
            </View>
        </View>
    ), [batteryPercentage, t]);

    const statsData = useMemo(() => ([
        {
            title: t('charging.amountCharged'),
            value: `${energyConsumed.toFixed(1)} kWh`,
            icon: <MaterialCommunityIcons name="flash" size={20} color={Colors.mainColor} />,
        },
        {
            title: t('charging.currentChargingSpeed'),
            value: `${currentPowerKw.toFixed(0)} kW`,
            icon: <MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.mainColor} />,
        },
    ]), [energyConsumed, currentPowerKw, t]);

    return (
        <BaseComponent isBack title="charging.chargingSession">
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.titleSection}>
                    <View style={styles.titleIconBadge}>
                        <MaterialCommunityIcons name="flash" size={20} color={Colors.mainColor} />
                    </View>
                    <Text style={styles.titleText}>{t('charging.charging')}</Text>
                    <Text style={styles.elapsedText}>
                        {t('charging.timeElapsed')} {formatElapsed(elapsedSeconds)}
                    </Text>
                </View>

                <View style={styles.progressSection}>{BatteryRing}</View>

                <View style={styles.timeRow}>
                    <View style={styles.timeCol}>
                        <Text style={styles.timeLabel}>{t('charging.chargeStarted')}</Text>
                        <Text style={styles.timeValue}>{chargeStartedLabel}</Text>
                    </View>
                    <View style={styles.timeDivider} />
                    <View style={styles.timeCol}>
                        <Text style={styles.timeLabel}>{t('charging.estCompletion')}</Text>
                        <Text style={styles.timeValue}>{estCompletionLabel}</Text>
                    </View>
                </View>

                <View style={styles.listSection}>
                    {statsData.map((stat) => (
                        <DetailRow
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            isLast={false}
                        />
                    ))}

                    <DetailRow
                        title={t('charging.accumulatedPrice')}
                        value={`$${currentCost.toFixed(2)}`}
                        icon={<MaterialCommunityIcons name="cash-multiple" size={18} color={Colors.white} />}
                        iconStyle={styles.detailIconWrapFilled}
                        isLast={!showPriceBreakdown}
                        onPress={() => setShowPriceBreakdown((v) => !v)}
                        trailing={
                            <Ionicons
                                name={showPriceBreakdown ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color={Colors.textMuted}
                            />
                        }
                    />

                    {showPriceBreakdown && (
                        <View style={styles.breakdownPanel}>
                            <Text style={styles.breakdownTitle}>{t('charging.priceOverview')}</Text>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{t('charging.chargeAmount')}</Text>
                                <Text style={styles.breakdownValue}>{energyConsumed.toFixed(1)} kWh</Text>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{t('charging.chargePrice')}</Text>
                                <Text style={styles.breakdownValue}>${pricePerKwh.toFixed(2)}/kWh</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.stopButtonWrapper}>
                    <CustomButton
                        buttonTitle={t('charging.stopCharging')}
                        icon={<Feather name="stop-circle" size={22} color={Colors.white} />}
                        buttonColor={Colors.dangerColor}
                        buttonHeight={56}
                        onPress={handleStopCharging}
                    />
                </View>
            </ScrollView>
        </BaseComponent>
    );
};

type DetailRowProps = {
    title: string;
    value: string | number;
    icon: ReactNode;
    iconStyle?: object;
    isLast: boolean;
    onPress?: () => void;
    trailing?: ReactNode;
};

const DetailRow = React.memo(({ title, value, icon, iconStyle, isLast, onPress, trailing }: DetailRowProps) => {
    const Wrapper = onPress ? TouchableOpacity : View;
    return (
        <Wrapper
            style={[styles.detailRow, isLast && styles.detailRowLast]}
            {...(onPress ? { activeOpacity: 0.7, onPress } : {})}
        >
            <View style={styles.detailLeft}>
                <View style={[styles.detailIconWrap, iconStyle]}>{icon}</View>
                <Text style={styles.detailLabel}>{title}</Text>
            </View>
            <View style={styles.detailRight}>
                <Text style={styles.detailValue}>{value}</Text>
                {trailing}
            </View>
        </Wrapper>
    );
});

const RING_STEP = 14;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        padding: safePadding,
    },
    titleSection: {
        alignItems: 'center',
        marginTop: 12,
    },
    titleIconBadge: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: Colors.surfaceTint,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    titleText: {
        fontSize: FontSize.huge,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    elapsedText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
    },
    progressSection: {
        alignItems: 'center',
        marginTop: 24,
    },
    ringOuter: {
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: RING_SIZE / 2,
        backgroundColor: `${Colors.mainColor}08`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringMid: {
        width: RING_SIZE - RING_STEP,
        height: RING_SIZE - RING_STEP,
        borderRadius: (RING_SIZE - RING_STEP) / 2,
        backgroundColor: `${Colors.mainColor}0D`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringInner: {
        width: RING_SIZE - RING_STEP * 2,
        height: RING_SIZE - RING_STEP * 2,
        borderRadius: (RING_SIZE - RING_STEP * 2) / 2,
        backgroundColor: `${Colors.mainColor}12`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringCenter: {
        width: RING_SIZE - RING_STEP * 3,
        height: RING_SIZE - RING_STEP * 3,
        borderRadius: (RING_SIZE - RING_STEP * 3) / 2,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.card,
    },
    percentageText: {
        fontSize: 34,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    percentageLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
        marginTop: 2,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        gap: 24,
    },
    timeCol: {
        alignItems: 'center',
    },
    timeDivider: {
        width: 1,
        height: 32,
        backgroundColor: Colors.borderMuted,
    },
    timeLabel: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
        marginBottom: 4,
    },
    timeValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    listSection: {
        marginTop: 28,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderMuted,
    },
    detailRowLast: {
        borderBottomWidth: 0,
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: Colors.borderMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailIconWrapFilled: {
        borderWidth: 0,
        backgroundColor: Colors.mainColor,
    },
    detailLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    detailValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    breakdownPanel: {
        borderLeftWidth: 2,
        borderLeftColor: Colors.borderMuted,
        paddingLeft: 14,
        marginLeft: 18,
        paddingVertical: 12,
        gap: 8,
    },
    breakdownTitle: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 2,
    },
    breakdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    breakdownLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
    },
    breakdownValue: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    stopButtonWrapper: {
        marginTop: 28,
        marginBottom: 20,
    },
});

export default ChargingDetailScreen;
