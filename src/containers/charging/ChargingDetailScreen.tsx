import React, { useEffect, useRef, useState, useCallback, useMemo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, AppState } from 'react-native';
import BaseComponent from '@/components/BaseComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle } from 'react-native-svg';
import Lottie from 'lottie-react-native';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import { useEVConnector } from '@/hooks/useEVConnector';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import { useTranslation } from '@/hooks/useTranslation';

const CIRCLE_SIZE = 220;
const STROKE_WIDTH = 14;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ChargingDetailScreen = () => {
    const navigation = useNavigation<any>();
    const { sessionDetail, evConnect, postStop, getSessionDetail } = useEVConnector();
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<number | null>(null);
    const lastMinutesRef = useRef<number | null>(null);
    const lastChargingMinutesRef = useRef<number | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const { t } = useTranslation();

    const [connected, setConnected] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        // Store session ID in ref to persist even if evConnect is cleared
        if (evConnect?.session_id) {
            sessionIdRef.current = evConnect.session_id;
        } else {
            sessionIdRef.current = null;
            lastMinutesRef.current = null;
            lastChargingMinutesRef.current = null;
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
            setConnected(false);
        }
    }, [evConnect?.session_id]);
    
    useEffect(() => {
        (async () => {
            try {
                const credentials = await Keychain.getGenericPassword();
                if (credentials) setAccessToken(credentials.password);
            } catch (error) {
                console.error("Keychain error:", error);
            }
        })();
    }, []);

    const connectWebSocket = useCallback(() => {
        const sessionId = sessionIdRef.current;
        if (!accessToken || !sessionId) return;

        if (ws.current) {
            ws.current.onopen = null;
            ws.current.onmessage = null;
            ws.current.onerror = null;
            ws.current.onclose = null;
            ws.current.close();
        }

        const socket = new WebSocket(`wss://tgevstation.com/ws/mobile?token=${accessToken}`);
        ws.current = socket;

        socket.onopen = () => {
            setConnected(true);
            getSessionDetail(sessionId);
        };

        socket.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.event_type === "METER_CHANGE") {
                    getSessionDetail(sessionId);
                }
            } catch (error) {
                console.log("WS Parse Error:", error);
            }
        };

        socket.onerror = () => console.log("WS error");

        socket.onclose = () => {
            setConnected(false);

            if (!reconnectTimeout.current && sessionIdRef.current) {
                reconnectTimeout.current = setTimeout(() => {
                    connectWebSocket();
                    reconnectTimeout.current = null;
                }, 3000);
            }
        };
    }, [accessToken, getSessionDetail]);

    useEffect(() => {
        const sessionId = sessionIdRef.current;
        if (accessToken && sessionId) {
            connectWebSocket();
            getSessionDetail(sessionId);
        }

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = null;
            }
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, [accessToken, connectWebSocket, getSessionDetail]);
    

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
                if (!connected && sessionId) connectWebSocket();
                if (sessionId) getSessionDetail(sessionId);
            }
        });

        return () => subscription.remove();
    }, [connected, connectWebSocket, getSessionDetail]);

    const batteryPercentage = sessionDetail?.current_soc ?? 0;
    const energyConsumed = sessionDetail?.energy_kwh ?? 0;
    const currentCost = sessionDetail?.price_so_far ?? 0;
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
                            await postStop();
                            navigation.replace('ChargingSuccess', {
                                sessionData,
                                sessionId
                            });
                        } catch {
                            Alert.alert(t('common.error'), t('charging.stopChargingError'));
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
                    stroke="#e0e0e0"
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
                <Lottie
                    source={require('@/assets/lotties/bettery.json')}
                    autoPlay
                    loop
                    style={styles.chargingLottie}
                />
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
            icon: <Lottie source={require('@/assets/lotties/electricity.json')} autoPlay loop style={{ width: 35, height: 35 }} />
        },
        {
            title: t('charging.chargingTime'),
            value: chargingMinutesValue,
            unit: t('charging.minutes'),
            icon: <Lottie source={require('@/assets/lotties/charging.json')} autoPlay loop style={{ width: 90, height: 50 }} />
        },
        {
            title: t('charging.cost'),
            value: `$${currentCost.toFixed(2)}`,
            unit: t('charging.current'),
            icon: <MaterialCommunityIcons name="cash" size={28} color={Colors.secondaryColor} />
        },
        {
            title: t('charging.estFinishTime'),
            value: minutesRemainingValue,
            unit: t('charging.minutes'),
            icon: <MaterialCommunityIcons name="clock-outline" size={28} color={Colors.secondaryColor} />
        }
    ]), [chargingMinutesValue, currentCost, energyConsumed, minutesRemainingValue, t]);

    return (
        <BaseComponent isBack title="charging.chargingSession">
            <ScrollView style={styles.scrollView}>
                <View style={styles.progressSection}>{CircularProgress}</View>

                <View style={styles.statsGrid}>
                    {statsData.map((stat) => (
                        <StatCard
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            unit={stat.unit}
                            icon={stat.icon}
                        />
                    ))}
                </View>

                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={18} color={Colors.secondaryColor} />
                    <Text style={styles.infoText}>
                        {t('charging.autoStop')}
                    </Text>
                </View>

                {/* Stop Charging */}
                <TouchableOpacity style={styles.stopButton} onPress={handleStopCharging}>
                    <MaterialCommunityIcons name="stop" size={24} color={Colors.white} />
                    <Text style={styles.stopButtonText}>{t('charging.stopCharging')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </BaseComponent>
    );
};

type StatCardProps = {
    title: string;
    value: string | number;
    unit: string;
    icon: ReactNode;
};

const StatCard = React.memo(({ title, value, unit, icon }: StatCardProps) => (
    <View style={styles.statCard}>
        {icon}
        <Text style={styles.statLabel}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
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
    chargingLottie: { width: 70, height: 70 },
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 12,
    },
    statCard: {
        backgroundColor: Colors.backGroundColor,
        borderRadius: 16,
        padding: 10,
        width: '48%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    statLabel: {
        fontSize: FontSize.small,
        color: Colors.mainColor,
        marginTop: 8,
    },
    statValue: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginTop: 4,
    },
    statUnit: {
        fontSize: FontSize.small - 1,
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
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 20,
        gap: 10,
    },
    stopButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
});

export default ChargingDetailScreen;
