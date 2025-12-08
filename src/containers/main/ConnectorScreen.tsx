import BaseComponent from "@/components/BaseComponent";
import React, { use, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useEVConnector } from "@/hooks/useEVConnector";
import { useMeStore } from "@/store/useMeStore";
import Loading from "@/components/Loading";
import { isEmpty } from "lodash";
import { navigate } from "@/navigation/NavigationService";
import { useWalletStore } from "@/store/useWalletStore";
import InsufficientBalanceModal from "@/components/InsufficientBalanceModal";

const { width } = Dimensions.get('window');
const SCAN_FRAME_SIZE = width * 0.8;
const CIRCLE_SIZE = 200;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;

const ConnectorScreen = () => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device: any = useCameraDevice('back');
    const [flash, setFlash] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const { postStart, isLoading,evConnect } = useEVConnector();
    const camera = useRef(null);
    const { userData } = useMeStore();
    const { userWalletBalance } = useWalletStore();

    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission]);

    const checkBalanceAndStartCharging = async (qrCode: string) => {
        const balance = userWalletBalance?.balanceCents || 0;
        
        if (balance < 1) {
            setShowBalanceModal(true);
            setScannedCode(null);
            return;
        }

        // Proceed with charging if balance is sufficient
        postStart(qrCode, String(userData?.phone_number));
    };

    const handleCloseModal = () => {
        setShowBalanceModal(false);
    };

    const handleTopUp = () => {
        setShowBalanceModal(false);
        navigate('TopUp');
    };

    const codeScanner = useCodeScanner({
        codeTypes: ["code-128", "code-39", "code-93", "ean-13", "ean-8", "itf", "upc-e", "qr", "pdf-417", "aztec", "data-matrix"],
        onCodeScanned: async (codes) => {
            if (codes[0].value && !scannedCode) {
                setScannedCode(codes[0].value);
                checkBalanceAndStartCharging(codes[0].value);
            }
        }
    })
    useEffect(() => {
        if(!isEmpty(evConnect)){
            // navigate('ChargingDetail');
        }
    }, [evConnect]);

    if(isLoading) return <Loading/>

    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                <View style={styles.scannerContainer}>
                    <View style={styles.scanFrame}>
                        {device && device !== null ? (
                            <Camera
                                ref={camera}
                                style={styles.camera}
                                device={device}
                                isActive={true}
                                torch={flash ? 'on' : 'off'}
                                codeScanner={codeScanner}
                            />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <MaterialCommunityIcons 
                                    name="qrcode-scan" 
                                    size={100} 
                                    color={Colors.mainColor}
                                    style={{ opacity: 0.3 }}
                                />
                            </View>
                        )}
                        <View style={styles.scanBorder} />
                    </View>

                    <Text style={styles.instruction}>Position QR code in center</Text>
                    {scannedCode && (
                        <View style={styles.successBadge}>
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                            <Text style={styles.successText}>Scanned Successfully</Text>
                        </View>
                    )}
                </View>

                {/* Flash Button */}
                <TouchableOpacity 
                    style={[styles.flashButton, flash && styles.flashActive]}
                    onPress={() => setFlash(!flash)}
                    activeOpacity={0.8}
                >
                    <Ionicons 
                        name={flash ? "flash" : "flash-off"} 
                        size={26} 
                        color={flash ? Colors.white : Colors.mainColor} 
                    />
                    <Text style={[styles.flashText, flash && styles.flashTextActive]}>Flash</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.demoButton}
                    onPress={() => setIsConnected(!isConnected)}
                >
                    <Text style={styles.demoButtonText}>
                        {isConnected ? 'Show Scanner' : 'Show Connected'}
                    </Text>
                </TouchableOpacity>

                {/* Insufficient Balance Modal */}
                <InsufficientBalanceModal
                    visible={showBalanceModal}
                    currentBalance={userWalletBalance?.balance || '0.00'}
                    currency={userWalletBalance?.currency || '$'}
                    onClose={handleCloseModal}
                    onTopUp={handleTopUp}
                />
            </View>
        </BaseComponent>
    );
}

export default ConnectorScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        textAlign: 'center',
        marginBottom: 40,
    },
    scannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    scanFrame: {
        width: SCAN_FRAME_SIZE,
        height: SCAN_FRAME_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    camera: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        borderRadius: 24,
        overflow: 'hidden',
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: Colors.mainColor,
        borderStyle: 'dashed',
    },
    scanBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: Colors.mainColor,
        pointerEvents: 'none',
    },
    instruction: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 24,
    },
    successBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d1fae5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 16,
        gap: 6,
    },
    successText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: '#059669',
    },
    flashButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 24,
        gap: 8,
        marginBottom:120
    },
    flashActive: {
        backgroundColor: Colors.mainColor,
        borderColor: Colors.mainColor,
    },
    flashText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    flashTextActive: {
        color: Colors.white,
    },
    connectedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    connectedTitle: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 40,
    },
    circularProgressContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    percentageContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: FontSize.large + 16,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginTop: 8,
    },
    percentageLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#64748b',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 16,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 30,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: 50,
        backgroundColor: '#E5E7EB',
    },
    statLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#64748b',
        marginTop: 8,
        marginBottom: 4,
    },
    statValue: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    stopButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 12,
        width: '100%',
    },
    stopButtonText: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        textAlign: 'center',
    },
    demoButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#9CA3AF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    demoButtonText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.white,
    },
});