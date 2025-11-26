import BaseComponent from "@/components/BaseComponent";
import { CustomFontConstant, FontSize, safePadding, safePaddingAndroid } from "@/constants/GeneralConstants";
import { Colors } from "@/theme";
import React, { useState, useEffect } from "react";
import { Keyboard, StyleSheet, Text, View, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { navigate } from '@/navigation/NavigationService';
import CustomButton from "@/components/CustomButton";

let interval: any;
const CELL_COUNT: number = 6;

interface VerifyScreenProps {
    route?: {
        params?: {
            phoneNumber?: string;
            confirmation?: FirebaseAuthTypes.ConfirmationResult;
        };
    };
}

const VerifyScreen = ({ route }: VerifyScreenProps) => {
    const [code, setCode] = useState('');
    const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(
        route?.params?.confirmation || null
    );
    const [phoneNumber, setPhoneNumber] = useState<string>(route?.params?.phoneNumber || '+855 12 284 294');
    const [DurationCode, setDurationCode] = useState<number>(60);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    
    const ref = useBlurOnFulfill({value: code, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    // Timer countdown
    useEffect(() => {
        if (DurationCode > 0) {
            interval = setInterval(() => {
                setDurationCode(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [DurationCode]);

    // Auto verify when code is complete
    useEffect(() => {
        if (code.length === CELL_COUNT) {
            handleVerifyOTP();
        }
    }, [code]);

    const handleVerifyOTP = async () => {
        if (!confirmation) {
            Alert.alert('Error', 'Verification session expired. Please request a new code.');
            return;
        }

        try {
            setIsVerifying(true);
            const credential:any = await confirmation.confirm(code);
            
            if (credential.user) {
                Alert.alert(
                    'Success',
                    'Phone number verified successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigate('Main')
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error('Verification error:', error);
            if (error.code === 'auth/invalid-verification-code') {
                Alert.alert('Error', 'Invalid verification code. Please try again.');
            } else if (error.code === 'auth/code-expired') {
                Alert.alert('Error', 'Verification code has expired. Please request a new code.');
            } else {
                Alert.alert('Error', 'Verification failed. Please try again.');
            }
            setCode('');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (DurationCode > 0 || isResending) return;

        try {
            setIsResending(true);
            const formattedPhone = phoneNumber.replace(/\s/g, '');
            const newConfirmation = await auth().signInWithPhoneNumber(formattedPhone);
            
            setConfirmation(newConfirmation);
            setDurationCode(60);
            setCode('');
            Alert.alert('Success', 'Verification code sent successfully!');
        } catch (error: any) {
            console.error('Resend error:', error);
            Alert.alert('Error', 'Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <BaseComponent isBack={true} title="Verify">
            <View style={style.container}>
                <View style={style.headerSection}>
                    <Text style={style.title}>Verification Code</Text>
                    <Text style={style.description}>
                        We've sent a 6-digit verification code to
                    </Text>
                    <Text style={style.phoneNumber}>+855 12 284 294</Text>
                </View>

                <View style={style.codeSection}>
                    <CodeField
                        ref={ref}
                        {...props}
                        value={code}
                        onChangeText={setCode}
                        cellCount={CELL_COUNT}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        autoComplete="one-time-code"
                        rootStyle={style.codeFieldRoot}
                        onSubmitEditing={() => {
                            Keyboard.dismiss();
                        }}
                        renderCell={({index, symbol, isFocused}: any) => (
                            <View
                                onLayout={getCellOnLayoutHandler(index)}
                                key={index}
                                style={[
                                    style.cellRoot,
                                    isFocused && style.cellFocused,
                                    symbol && style.cellFilled,
                                ]}>
                                <Text style={style.cellText}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            </View>
                        )}
                    />
                </View>

                <View style={style.footerSection}>
                    <Text style={style.resendText}>Didn't receive the code?</Text>
                    <TouchableOpacity 
                        onPress={handleResendCode}
                        disabled={DurationCode > 0 || isResending}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            style.resendLink,
                            (DurationCode > 0 || isResending) && style.resendLinkDisabled
                        ]}>
                            {isResending ? 'Sending...' : 'Resend Code'}
                        </Text>
                    </TouchableOpacity>
                    {DurationCode > 0 && (
                        <Text style={style.timerText}>
                            Resend in {DurationCode}s
                        </Text>
                    )}
                </View>

                {/* Verify Button */}
                {code.length === CELL_COUNT && (
                    <View style={style.buttonContainer}>
                        <CustomButton
                            onPress={handleVerifyOTP}
                            isLoading={isVerifying}
                            buttonTitle="Verify"
                        />
                    </View>
                )}
            </View>
        </BaseComponent>
    );
}
export default VerifyScreen;

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        width: '100%',
        backgroundColor: '#FAFBFC',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 48,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EBF5F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconText: {
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        marginBottom: 12,
    },
    description: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 8,
    },
    phoneNumber: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
        letterSpacing: 1,
    },
    codeSection: {
        marginBottom: 40,
    },
    codeFieldRoot: {
        marginTop: 20,
        paddingHorizontal: 0,
        gap: 12,
    },
    cellRoot: {
        flex: 1,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: Colors.white,
    },
    cellFocused: {
        borderColor: Colors.mainColor,
        backgroundColor: '#F0F9FF',
        shadowColor: Colors.mainColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    cellFilled: {
        borderColor: Colors.secondaryColor,
    },
    cellText: {
        color: Colors.mainColor,
        fontFamily: CustomFontConstant.EnBold,
        fontSize: 28,
        textAlign: 'center',
    },
    footerSection: {
        alignItems: 'center',
        marginTop: 24,
    },
    resendText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        marginBottom: 8,
    },
    resendLink: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        fontWeight: '700',
        textDecorationLine: 'underline',
        marginBottom: 12,
    },
    resendLinkDisabled: {
        color: '#9CA3AF',
        opacity: 0.5,
    },
    buttonContainer: {
        marginTop: 24,
        paddingHorizontal: 24,
    },
    timerText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        fontWeight: '500',
    },
});