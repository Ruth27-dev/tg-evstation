import BaseComponent from "@/components/BaseComponent";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, AppState, AppStateStatus } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useEVConnector } from "@/hooks/useEVConnector";
import { useMeStore } from "@/store/useMeStore";
import Loading from "@/components/Loading";
import { goBack, navigate } from "@/navigation/NavigationService";
import { useWalletStore } from "@/store/useWalletStore";
import InsufficientBalanceModal from "@/components/InsufficientBalanceModal";
import TextTranslation from "@/components/TextTranslation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "@/hooks/useTranslation";
import { useIsFocused } from "@react-navigation/native";

const ConnectorScreen = () => {
    const { width } = useWindowDimensions();
    const scanFrameSize = useMemo(() => width * 0.8, [width]);
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back', {
        physicalDevices: ['ultra-wide-angle-camera', 'wide-angle-camera', 'telephoto-camera']
    });
    const [flash, setFlash] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const isStartingRef = useRef(false);
    const { postStart, isLoading } = useEVConnector();
    const camera = useRef(null);
    const { userData } = useMeStore();
    const { userWalletBalance } = useWalletStore();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const isFocused = useIsFocused();
    const appState = useRef(AppState.currentState);

    const updateCameraActiveState = useCallback(() => {
        const shouldActivate = hasPermission && !!device && isFocused && appState.current === 'active';
        setIsCameraActive(shouldActivate);
    }, [device, hasPermission, isFocused]);

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission]);

    useEffect(() => {
        updateCameraActiveState();
        return () => {
            setIsCameraActive(false);
        };
    }, [updateCameraActiveState]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            appState.current = nextAppState;
            if (nextAppState === 'active') {
                updateCameraActiveState();
            } else {
                setIsCameraActive(false);
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [updateCameraActiveState]);
    const checkBalanceAndStartCharging = useCallback(async (qrCode: string) => {
        if (isStartingRef.current) return;
        isStartingRef.current = true;

        if (Number(userWalletBalance?.balance) < 0.10) {
            setShowBalanceModal(true);
            setScannedCode(null);
            isStartingRef.current = false;
            return;
        }

        const started = await postStart(qrCode, String(userData?.phone_number));
        if (!started) {
            setScannedCode(null);
        }
        isStartingRef.current = false;
    }, [postStart, userData?.phone_number, userWalletBalance?.balance]);

    const handleCloseModal = () => {
        setShowBalanceModal(false);
    };

    const handleTopUp = () => {
        setShowBalanceModal(false);
        navigate('TopUp');
    };

    const handleRescan = () => {
        setScannedCode(null);
        isStartingRef.current = false;
        updateCameraActiveState();
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

    if(isLoading) return <Loading/>
    
    const canUseCamera = hasPermission && !!device;
    const placeholderMessage = !hasPermission
        ? t('errors.cameraPermission')
        : t('connector.initializingCamera');

    return (
        <BaseComponent isBack={false} hideHeader>
            <View style={styles.container}>
                {canUseCamera ? (
                    <Camera
                        ref={camera}
                        style={styles.camera}
                        device={device}
                        isActive={isCameraActive}
                        torch={flash ? 'on' : 'off'}
                        codeScanner={codeScanner}
                    />
                ) : (
                    <View style={[styles.camera, styles.placeholderBackground]}>
                        <Text style={styles.placeholderText}>{placeholderMessage}</Text>
                    </View>
                )}
                <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom + 32 }]}>
                    <View style={styles.topSection}>
                        <Text style={styles.screenTitle}>{t('connector.qrScanner')}</Text>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={goBack}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close" size={22} color={Colors.white} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.centerSection}>
                        <View style={[styles.scanGuide, { width: scanFrameSize, height: scanFrameSize }]}>
                            <View style={[styles.corner, styles.topLeftCorner]} />
                            <View style={[styles.corner, styles.topRightCorner]} />
                            <View style={[styles.corner, styles.bottomLeftCorner]} />
                            <View style={[styles.corner, styles.bottomRightCorner]} />
                        </View>
                        <View style={styles.instructionWrapper}>
                            <TextTranslation 
                                textKey="common.positionQRCodeInCenter" 
                                fontSize={FontSize.medium} 
                                color={Colors.white}
                            />
                        </View>
                    </View>

                    <View style={styles.bottomSection}>
                        <View style={styles.bottomActions}>
                            <View style={styles.actionGroup}>
                                <TouchableOpacity 
                                    style={[styles.actionButton, flash && styles.actionButtonActive]}
                                    onPress={() => setFlash(!flash)}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons 
                                        name={flash ? "flash" : "flash-off"} 
                                        size={26} 
                                        color={Colors.white} 
                                    />
                                </TouchableOpacity>
                                <TextTranslation textKey="common.flash" fontSize={FontSize.small + 1} color={Colors.white}/>
                            </View>
                            <View style={styles.actionGroup}>
                                <TouchableOpacity 
                                    style={styles.actionButton}
                                    onPress={handleRescan}
                                    activeOpacity={0.85}
                                >
                                    <MaterialCommunityIcons 
                                        name="camera-retake" 
                                        size={26} 
                                        color={Colors.white} 
                                    />
                                </TouchableOpacity>
                                <TextTranslation textKey="common.rescan" fontSize={FontSize.small + 1} color={Colors.white}/>
                            </View>
                        </View>
                    </View>
                </View>
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
        backgroundColor: Colors.black,
    },
    camera: {
        ...StyleSheet.absoluteFillObject,
    },
    placeholderBackground: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black,
    },
    placeholderText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.white,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    screenTitle: {
        color: Colors.white,
        fontFamily: CustomFontConstant.EnBold,
        fontSize: FontSize.large,
    },
    closeButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanGuide: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        position: 'absolute',
        width: 58,
        height: 58,
        borderColor: '#3B82F6',
        borderRadius: 12,
    },
    topLeftCorner: {
        top: 0,
        left: 0,
        borderLeftWidth: 4,
        borderTopWidth: 4,
    },
    topRightCorner: {
        top: 0,
        right: 0,
        borderRightWidth: 4,
        borderTopWidth: 4,
    },
    bottomLeftCorner: {
        bottom: 0,
        left: 0,
        borderLeftWidth: 4,
        borderBottomWidth: 4,
    },
    bottomRightCorner: {
        bottom: 0,
        right: 0,
        borderRightWidth: 4,
        borderBottomWidth: 4,
    },
    bottomSection: {
        alignItems: 'center',
        marginBottom:80
    },
    instructionWrapper: {
        marginTop: 24,
        alignItems: 'center',
    },
    bottomActions: {
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        marginTop: 12,
    },
    actionGroup: {
        alignItems: 'center',
        marginHorizontal: 16,
    },
    actionButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    actionButtonActive: {
        backgroundColor: 'rgba(59,130,246,0.85)',
        borderColor: 'transparent',
    },
});
