import React, { useEffect, useRef, useMemo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, AppState } from 'react-native';
import BaseComponent from '@/components/BaseComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Radius, Shadows } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import { useEVConnector } from '@/hooks/useEVConnector';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@/hooks/useTranslation';
import { useWebSocket } from '@/context/WebSocketProvider';
import CustomButton from '@/components/CustomButton';

const CIRCLE_SIZE = 220;
const STROKE_WIDTH = 14;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ChargingDetailScreen = () => {
    const navigation = useNavigation<any>();
    const { sessionDetail, evConnect, postStop, getSessionDetail } = useEVConnector();
    const lastMinutesRef = useRef<number | null>(null);
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
            lastMinutesRef.current = null;
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
        const val = sessionDetail?.minutes_remaining;

        if (val === null || val === undefined) {
            return;
        }

        lastMinutesRef.current = val;
    }, [sessionDetail?.minutes_remaining]);

    const displayMinutesRemaining = sessionDetail?.minutes_remaining ?? lastMinutesRef.current;


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

    const batteryPercentage = sessionDetail?.current_soc ?? 0;
    const energyConsumed = sessionDetail?.energy_kwh ?? 0;
    const currentCost = sessionDetail?.price_so_far ?? 0;
    const averagePowerKw = sessionDetail?.average_power_kw ?? 0;
    const currentPowerKw = sessionDetail?.current_power_kw ?? 0;


    const chargingMinutesValue = typeof displayChargingMinutes === 'number' ? displayChargingMinutes : '--';
    const minutesRemainingValue = typeof displayMinutesRemaining === 'number' ? displayMinutesRemaining : '--';


    const strokeDashoffset = useMemo(() =>
        CIRCUMFERENCE - (CIRCUMFERENCE * batteryPercentage) / 100,
        [batteryPercentage]
    );

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


    const CircularProgress = useMemo(() => (
        <View style={styles.circularProgressContainer}>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                <Circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    stroke={Colors.trackColor}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                />
                <Circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    stroke={Colors.secondaryColor}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                />
            </Svg>

            <View style={styles.percentageContainer}>
                <MaterialCommunityIcons name="lightning-bolt" size={36} color={Colors.mainColor} />
                <Text style={styles.percentageText}>{batteryPercentage}%</Text>
                <Text style={styles.percentageLabel}>{t('charging.batteryLevel')}</Text>
            </View>
        </View>
    ), [batteryPercentage, strokeDashoffset, t]);


    const statsData = useMemo(() => ([
        {
            title: t('charging.energy'),
            value: energyConsumed.toFixed(2),
            unit: "kWh",
            icon: <MaterialCommunityIcons name="flash" size={22} color={Colors.secondaryColor} />
        },
        {
            title: t('charging.chargingTime'),
            value: chargingMinutesValue,
            unit: t('charging.minutes'),
            icon: <MaterialCommunityIcons name="timer-outline" size={22} color={Colors.secondaryColor} />
        },
        {
            title: t('charging.cost'),
            value: `$${currentCost.toFixed(2)}`,
            unit: t('charging.current'),
            icon: <MaterialCommunityIcons name="cash" size={22} color={Colors.secondaryColor} />
        },
        // {
        //     title: t('charging.estFinishTime'),
        //     value: minutesRemainingValue,
        //     unit: t('charging.minutes'),
        //     icon: <MaterialCommunityIcons name="clock-outline" size={22} color={Colors.secondaryColor} />
        // },
        {
            title: t('charging.averagePower'),
            value: averagePowerKw.toFixed(2),
            unit: t('charging.kw'),
            icon: <MaterialCommunityIcons name="speedometer" size={22} color={Colors.secondaryColor} />
        },
        {
            title: t('charging.currentPower'),
            value: currentPowerKw.toFixed(2),
            unit: t('charging.kw'),
            icon: <MaterialCommunityIcons name="lightning-bolt" size={22} color={Colors.secondaryColor} />
        }
    ]), [chargingMinutesValue, currentCost, energyConsumed, minutesRemainingValue, t]);

    return (
        <BaseComponent isBack title="charging.chargingSession">
            <ScrollView style={styles.scrollView}>
                <View style={styles.progressSection}>{CircularProgress}</View>

                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>{t('charging.chargingDetail')}</Text>
                    {statsData.map((stat, index) => (
                        <DetailRow
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            unit={stat.unit}
                            icon={stat.icon}
                            isLast={index === statsData.length - 1}
                        />
                    ))}
                </View>

                {/* <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={18} color={Colors.secondaryColor} />
                    <Text style={styles.infoText}>
                        {t('charging.autoStop')}
                    </Text>
                </View> */}

                {/* Stop Charging */}
                <View style={styles.stopButtonWrapper}>
                    <CustomButton
                        buttonTitle={t('charging.stopCharging')}
                        icon={<MaterialCommunityIcons name="stop" size={22} color={Colors.white} />}
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
    unit: string;
    icon: ReactNode;
    isLast: boolean;
};

const DetailRow = React.memo(({ title, value, unit, icon, isLast }: DetailRowProps) => (
    <View style={[styles.detailRow, isLast && styles.detailRowLast]}>
        <View style={styles.detailLeft}>
            <View style={styles.detailIconWrap}>{icon}</View>
            <Text style={styles.detailLabel}>{title}</Text>
        </View>
        <Text style={styles.detailValue}>{value} {unit}</Text>
    </View>
));

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        padding: safePadding,
    },
    progressSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    circularProgressContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 40,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginTop: 8,
    },
    percentageLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    detailsCard: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 20,
        ...Shadows.card,
    },
    detailsTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginTop: 8,
        marginBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderMuted,
    },
    detailRowLast: {
        borderBottomWidth: 0,
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    detailIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.surfaceTint,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: FontSize.small,
        color: Colors.textMuted,
    },
    detailValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backGroundColor,
        padding: 14,
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
        gap: 10,
    },
    infoText: {
        fontSize: FontSize.small,
        color: Colors.mainColor,
        flex: 1,
    },
    stopButtonWrapper: {
        marginTop: 20,
        marginBottom: 20,
    },
});

export default ChargingDetailScreen;
