import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity, Alert, AppState, AppStateStatus } from 'react-native';
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
import { isEmpty } from 'lodash';

interface WSMessage {
    event_type: string;
    data?: any;
}

const CIRCLE_SIZE = 220;
const STROKE_WIDTH = 14;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ChargingDetailScreen = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<any>();
    const { sessionDetail, evConnect, postStop, getSessionDetail, clearSessionDetail } = useEVConnector();
    const sessionId = evConnect?.session_id;
    const ws = useRef<WebSocket | null>(null);
    const [connected, setConnected] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);

    // Get access token
    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const credentials = await Keychain.getGenericPassword();
                if (credentials) {
                    setAccessToken(credentials.password);
                }
            } catch (error) {
                console.error('Error retrieving token:', error);
            }
        };
        getAccessToken();
    }, []);

    const connectWebSocket = () => {
        if (!accessToken) return;
        
        if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
            ws.current.close();
        }

        const url = `wss://tgevstation.com/ws/mobile?token=${accessToken}`;
        console.log('Connecting to WebSocket...');
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log('WebSocket connected');
            setConnected(true);
        };

        ws.current.onmessage = (event) => {
            console.log('RAW MESSAGE:', event.data);

            try {
                const msg = JSON.parse(event.data);
                if (msg.event_type === "METER_CHANGE") {
                    if (sessionId) {
                        getSessionDetail(sessionId);
                    }
                }
            } catch (e) {
                console.log('JSON PARSE ERROR:', e);
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
            setConnected(false);
        };
    };

    useEffect(() => {
        if (accessToken) {
            connectWebSocket();
        }

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [accessToken]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (
                appStateRef.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App returned to foreground, refreshing charging session');
                
                if (accessToken) {
                    console.log('Reconnecting WebSocket...');
                    connectWebSocket();
                }
                
                if (!isEmpty(evConnect) && sessionId) {
                    console.log('Fetching session detail for:', sessionId);
                    getSessionDetail(sessionId);
                }
            }
            appStateRef.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [evConnect, sessionId, getSessionDetail, accessToken]);

    useEffect(() => {
        if (sessionDetail?.current_soc) {
            Animated.timing(animatedValue, {
                toValue: sessionDetail.current_soc,
                duration: 1500,
                useNativeDriver: false,
            }).start();
        }
    }, [sessionDetail?.current_soc]);

    const formatTimeRemaining = () => {
        const mins = sessionDetail?.minutes_remaining;
        if (mins == null) return null;

        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;

        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    };

    const batteryPercentage = sessionDetail?.current_soc || 0;
    const energyConsumed = sessionDetail?.energy_kwh || 0;
    const currentCost = sessionDetail?.price_so_far || 0;
    const estimatedTimeRemaining = formatTimeRemaining();

    const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * batteryPercentage) / 100;

    const handleStopCharging = () => {
        Alert.alert(
            'Stop Charging',
            'Are you sure you want to stop charging?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Stop',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await postStop();
                            // Navigate to success screen with session data
                            navigation.replace('ChargingSuccess', {
                                sessionData: sessionDetail
                            });
                        } catch (error) {
                            Alert.alert('Error', 'Failed to stop charging session');
                        }
                    },
                },
            ]
        );
    };

    const renderCircularProgress = () => {
        return (
            <View style={styles.circularProgressContainer}>
                <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                    {/* Background Circle */}
                    <Circle
                        cx={CIRCLE_SIZE / 2}
                        cy={CIRCLE_SIZE / 2}
                        r={RADIUS}
                        stroke="#e0e0e0"
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                    />
                    {/* Progress Circle */}
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
                    <Text style={styles.percentageLabel}>Battery Level</Text>
                </View>
            </View>
        );
    };

    return (
        <BaseComponent isBack={true} title="Charging Session">
            <ScrollView contentContainerStyle={styles.contentContainer} style={styles.scrollView}>
                <View style={styles.progressSection}>
                    {renderCircularProgress()}
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="lightning-bolt" size={28} color={Colors.secondaryColor} />
                        <Text style={styles.statLabel}>Energy</Text>
                        <Text style={styles.statValue}>{energyConsumed.toFixed(2)}</Text>
                        <Text style={styles.statUnit}>kWh</Text>
                    </View>

                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="clock-outline" size={28} color={Colors.secondaryColor} />
                        <Text style={styles.statLabel}>Est. Finish Time</Text>
                        <Text style={styles.statValue}>{!sessionDetail?.minutes_remaining? estimatedTimeRemaining: "N/A"}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="cash" size={28} color={Colors.secondaryColor} />
                        <Text style={styles.statLabel}>Cost</Text>
                        <Text style={styles.statValue}>${currentCost.toFixed(2)}</Text>
                        <Text style={styles.statUnit}>current</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="speedometer-outline" size={28} color={Colors.secondaryColor} />
                        <Text style={styles.statLabel}>Status</Text>
                        <Text style={[styles.statValue, { fontSize: FontSize.medium }]}>{sessionDetail?.status || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={18} color={Colors.secondaryColor} />
                    <Text style={styles.infoText}>
                        Charging will automatically stop when battery reaches 100%
                    </Text>
                </View>
                <TouchableOpacity 
                    style={styles.stopButton}
                    onPress={handleStopCharging}
                    activeOpacity={0.8}
                >
                    <MaterialCommunityIcons name="stop" size={24} color={Colors.white} />
                    <Text style={styles.stopButtonText}>Stop Charging</Text>
                </TouchableOpacity>
            </ScrollView>
        </BaseComponent>
    );
};

export default ChargingDetailScreen;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        padding:safePadding
    },
    contentContainer: {
        flex:1
    },
    sessionInfo: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sessionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sessionDetails: {
        flex: 1,
    },
    sessionName: {
        fontSize: FontSize.medium + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    sessionId: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    container: {
        flex: 1
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pulseContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    pulse: {
        position: 'absolute',
        borderRadius: 20,
        backgroundColor: Colors.secondaryColor,
    },
    pulseOuter: {
        width: 32,
        height: 32,
        opacity: 0.2,
    },
    pulseInner: {
        width: 24,
        height: 24,
        opacity: 0.4,
    },
    statusText: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
    },
    progressSection: {
        alignItems: 'center',
        marginVertical: 20,
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
    chargingLottie: {
        width: 70,
        height: 70,
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
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 20,
        gap: 12,
    },
    statCard: {
        backgroundColor: Colors.backGroundColor,
        borderRadius: 16,
        padding: 5,
        width: '48%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    statLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
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
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        marginTop: 2,
    },
    detailsSection: {
        backgroundColor: Colors.backGroundColor,
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.secondaryColor,
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    detailLabel: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    detailValue: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backGroundColor,
        padding: 14,
        borderRadius: 12,
        marginTop: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    infoText: {
        flex: 1,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        lineHeight: 18,
    },
    sessionCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: FontSize.medium + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 16,
    },
    sessionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    sessionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sessionLabel: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    sessionValue: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.secondaryColor,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        marginTop:20
    },
    stopButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
});
