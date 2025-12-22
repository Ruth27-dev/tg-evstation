import BaseComponent from "@/components/BaseComponent";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, AppState, AppStateStatus, Animated, Easing } from "react-native";
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
    const { width, height } = useWindowDimensions();
    const scanFrameSize = useMemo(() => width * 0.8, [width]);
    const [scanGuideLayout, setScanGuideLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const scanLineProgress = useRef(new Animated.Value(0)).current;
    const scanLineTranslate = useMemo(() => scanLineProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [-(scanFrameSize / 2) + 6, (scanFrameSize / 2) - 6]
    }), [scanFrameSize, scanLineProgress]);
    const detectionAnim = useRef(new Animated.Value(0)).current;
    const [detectedPreview, setDetectedPreview] = useState<string | null>(null);
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back', {
        physicalDevices: ['ultra-wide-angle-camera', 'wide-angle-camera', 'telephoto-camera']
    });
    const preferredFormat = useMemo(() => {
        if (!device?.formats) return undefined;
        const sortedByPixelsAsc = [...device.formats]
            .filter(f => f.videoWidth && f.videoHeight)
            .sort((a, b) => (a.videoWidth * a.videoHeight) - (b.videoWidth * b.videoHeight));

        // Prefer a medium/low resolution to avoid moiré when scanning another screen.
        const medium = sortedByPixelsAsc.find(f => f.videoWidth >= 720 && f.videoWidth <= 1920);
        return medium || sortedByPixelsAsc[0];
    }, [device?.formats]);
    const [flash, setFlash] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [pendingCode, setPendingCode] = useState<{ value: string; count: number; lastDetected: number } | null>(null);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const hasSentScan = useRef(false);
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
    const scanArea = useMemo(() => {
        if (scanGuideLayout) {
            return {
                left: scanGuideLayout.x,
                right: scanGuideLayout.x + scanGuideLayout.width,
                top: scanGuideLayout.y,
                bottom: scanGuideLayout.y + scanGuideLayout.height,
            };
        }

        // Fallback: center of the screen if layout is not yet measured
        const left = (width - scanFrameSize) / 2;
        const top = (height - scanFrameSize) / 2;
        return {
            left,
            right: left + scanFrameSize,
            top,
            bottom: top + scanFrameSize
        };
    }, [height, scanFrameSize, scanGuideLayout, width]);

    const checkBalanceAndStartCharging = useCallback(async (qrCode: string) => {
        if (Number(userWalletBalance?.balance) < 0.10) {
            setShowBalanceModal(true);
            setScannedCode(null);
            hasSentScan.current = false;
            return;
        }
        postStart(qrCode, String(userData?.phone_number));
    }, [postStart, userData?.phone_number, userWalletBalance?.balance]);

    const isCodeCentered = useCallback((frameData?: { x: number; y: number; width: number; height: number }) => {
        if (!frameData || [frameData.x, frameData.y, frameData.width, frameData.height].some(v => typeof v !== 'number')) {
            return true;
        }
        const padding = 10;
        const withinHorizontal = frameData.x >= (scanArea.left + padding) && (frameData.x + frameData.width) <= (scanArea.right - padding);
        const withinVertical = frameData.y >= (scanArea.top + padding) && (frameData.y + frameData.height) <= (scanArea.bottom - padding);
        const largeEnough = frameData.width >= scanFrameSize * 0.25 && frameData.height >= scanFrameSize * 0.25;
        return withinHorizontal && withinVertical && largeEnough;
    }, [scanArea.bottom, scanArea.left, scanArea.right, scanArea.top, scanFrameSize]);

    const handleCloseModal = () => {
        setShowBalanceModal(false);
        hasSentScan.current = false;
    };

    const handleTopUp = () => {
        setShowBalanceModal(false);
        hasSentScan.current = false;
        navigate('TopUp');
    };

    const handleRescan = () => {
        setScannedCode(null);
        setPendingCode(null);
        hasSentScan.current = false;
        setDetectedPreview(null);
        updateCameraActiveState();
    };

    const handleStableScan = useCallback((value: string, frameData?: { x: number; y: number; width: number; height: number }) => {
        if (scannedCode || hasSentScan.current) return;
        if (!isCodeCentered(frameData)) {
            setPendingCode(null);
            return;
        }

        setPendingCode((prev) => {
            const now = Date.now();
            if (prev && prev.value === value && now - prev.lastDetected < 1200) {
                const nextCount = prev.count + 1;
                if (nextCount >= 2) { // require two consistent reads to accept
                    setScannedCode(value);
                    hasSentScan.current = true;
                    checkBalanceAndStartCharging(value);
                    setDetectedPreview(value);
                    detectionAnim.setValue(0);
                    Animated.sequence([
                        Animated.spring(detectionAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 120 }),
                        Animated.timing(detectionAnim, { toValue: 0, duration: 600, delay: 800, easing: Easing.out(Easing.quad), useNativeDriver: true })
                    ]).start(() => setDetectedPreview(null));
                    return null;
                }
                return { ...prev, count: nextCount, lastDetected: now };
            }
            return { value, count: 1, lastDetected: now };
        });
    }, [checkBalanceAndStartCharging, detectionAnim, isCodeCentered, scannedCode]);

    const codeScanner = useCodeScanner({
        codeTypes: ["code-128", "code-39", "code-93", "ean-13", "ean-8", "itf", "upc-e", "qr", "pdf-417", "aztec", "data-matrix"],
        onCodeScanned: async (codes) => {
            if (!codes[0]?.value || hasSentScan.current) return;
            handleStableScan(codes[0].value, (codes[0] as any).frame);
        }
    });

    useEffect(() => {
        if (!isCameraActive) {
            scanLineProgress.stopAnimation();
            scanLineProgress.setValue(0);
            return;
        }
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineProgress, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
                Animated.timing(scanLineProgress, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [isCameraActive, scanLineProgress]);

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
                        format={preferredFormat}
                        enableZoomGesture
                        videoStabilizationMode="auto"
                        codeScanner={codeScanner}
                    />
                ) : (
                    <View style={[styles.camera, styles.placeholderBackground]}>
                        <Text style={styles.placeholderText}>{placeholderMessage}</Text>
                    </View>
                )}
                <View style={[styles.overlay, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 }]}>
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
                        <View 
                            style={[styles.scanGuide, { width: scanFrameSize, height: scanFrameSize }]}
                            onLayout={({ nativeEvent }) => setScanGuideLayout(nativeEvent.layout)}
                        >
                            <View style={[styles.corner, styles.topLeftCorner]} />
                            <View style={[styles.corner, styles.topRightCorner]} />
                            <View style={[styles.corner, styles.bottomLeftCorner]} />
                            <View style={[styles.corner, styles.bottomRightCorner]} />
                            <Animated.View 
                                pointerEvents="none"
                                style={[
                                    styles.scanLine, 
                                    { width: scanFrameSize, transform: [{ translateY: scanLineTranslate }] }
                                ]}
                            />
                        </View>
                        {detectedPreview && (
                            <Animated.View
                                pointerEvents="none"
                                style={[
                                    styles.detectedBubble,
                                    {
                                        opacity: detectionAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                                        transform: [
                                            {
                                                scale: detectionAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] })
                                            },
                                            {
                                                translateY: detectionAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] })
                                            }
                                        ]
                                    }
                                ]}
                            >
                                <Text style={styles.detectedLabel}>{t('connector.qrDetected') || 'QR Detected'}</Text>
                                <Text style={styles.detectedValue} numberOfLines={1}>{detectedPreview}</Text>
                            </Animated.View>
                        )}
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
    scanLine: {
        position: 'absolute',
        height: 3,
        borderRadius: 2,
        backgroundColor: '#3B82F6',
        shadowColor: '#3B82F6',
        shadowOpacity: 0.6,
        shadowRadius: 8,
        opacity: 0.95,
    },
    detectedBubble: {
        marginTop: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(0,0,0,0.72)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.4)',
        alignItems: 'center',
        maxWidth: '80%',
    },
    detectedLabel: {
        color: Colors.white,
        fontFamily: CustomFontConstant.EnRegular,
        fontSize: FontSize.medium,
        marginBottom: 4,
    },
    detectedValue: {
        color: Colors.white,
        fontFamily: CustomFontConstant.EnRegular,
        fontSize: FontSize.small + 1,
        textAlign: 'center',
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
