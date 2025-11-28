import BaseComponent from "@/components/BaseComponent";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useEVConnector } from "@/hooks/useEVConnector";

const { width } = Dimensions.get('window');
const SCAN_FRAME_SIZE = width * 0.8;

const ConnectorScreen = () => {
    const { hasPermission, requestPermission } = useCameraPermission();

    const device: any = useCameraDevice('back');
    const [flash, setFlash] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const { postStart, isLoading } = useEVConnector();
    const camera = useRef(null);
    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission]);


    const codeScanner = useCodeScanner({
        codeTypes: ["code-128", "code-39", "code-93", "ean-13", "ean-8", "itf", "upc-e", "qr", "pdf-417", "aztec", "data-matrix"],
        onCodeScanned: async (codes) => {
            if (codes[0].value && !scannedCode) {
                setScannedCode(codes[0].value);
                console.log('Scanned:', codes[0].value);
                postStart(codes[0].value, "85512284294");
            }
        }
    })


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
            </View>
        </BaseComponent>
    );
}

export default ConnectorScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingBottom: 40,
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
    },
    scanFrame: {
        width: SCAN_FRAME_SIZE,
        height: SCAN_FRAME_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    camera: {
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
        marginBottom:80
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
});