import BaseComponent from "@/components/BaseComponent";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import { Colors } from "@/theme";
import React, { useState, useEffect, useCallback } from "react";
import { Keyboard, StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { navigate } from '@/navigation/NavigationService';
import { useTranslation } from "@/hooks/useTranslation";
import NetInfo from "@react-native-community/netinfo";
import { resendOTP, verifyOTP } from "@/services/useApi";

const CELL_COUNT: number = 6;
const OTP_EXPIRES_IN_SECONDS = 300;
const SUCCESS_CODE = '000';

const formatDuration = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getValidExpiresIn = (value?: number | null): number =>
    value && value > 0 ? value : OTP_EXPIRES_IN_SECONDS;

interface VerifyScreenProps {
    route?: {
        params?: {
            phoneNumber?: string;
            isForget?: boolean;
            sessionToken?: string | null;
            expires_in?: number | null;
        };
    };
}

const VerifyScreen = ({ route }: VerifyScreenProps) => {
    const [code, setCode] = useState('');
    const [phoneNumber] = useState<string>(route?.params?.phoneNumber ?? '');
    const [isForget] = useState<boolean>(route?.params?.isForget ?? false);
    const [sessionToken, setSessionToken] = useState<string | null>(route?.params?.sessionToken ?? null);
    const [durationCode, setDurationCode] = useState<number>(getValidExpiresIn(route?.params?.expires_in));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [networkHint, setNetworkHint] = useState<string | null>(null);
    const { t } = useTranslation();
    
    const ref = useBlurOnFulfill({value: code, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });
    const formattedDuration = formatDuration(durationCode);
    const canResend = durationCode <= 0 && !isResending && !isVerifying;

    // Timer countdown while OTP remains valid.
    useEffect(() => {
        if (durationCode <= 0) {
            return;
        }

        const timerId = setInterval(() => {
            setDurationCode((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timerId);
    }, [durationCode]);

    useEffect(() => {
        let isMounted = true;
        NetInfo.fetch().then((state) => {
            if (!isMounted) {
                return;
            }
            setNetworkHint(state.type === 'wifi' ? 'Having trouble? Try switching to mobile data.' : null);
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const handleVerifyOTP = useCallback(async () => {
        try {
            setIsVerifying(true);
            if (!sessionToken) {
                Alert.alert('Error', 'Session expired. Please request OTP again.');
                setCode('');
                return;
            }

            const data = {
                session_token: sessionToken,
                otp: Number(code),
            };
            const response = await verifyOTP(data);

            if (response?.data?.code === SUCCESS_CODE) {
                if (isForget) {
                    navigate('ChangePasswordScreen');
                } else {
                    navigate('CreateAccount', { phoneNumber, register_token: response?.data?.data?.register_token || '' });
                }
            } else {
                Alert.alert('Error', response?.data?.message || 'Invalid OTP. Please try again.');
                setCode('');
            }
        } catch (error: any) {
            console.error('Verification error:', error);
            Alert.alert('Error', 'Verification failed. Please try again.');
            setCode('');
        } finally {
            setIsVerifying(false);
        }
    }, [code, isForget, phoneNumber, sessionToken]);

    // Auto verify when code is complete
    useEffect(() => {
        if (code.length === CELL_COUNT) {
            handleVerifyOTP();
        }
    }, [code, handleVerifyOTP]);

    const handleResendCode = async () => {
        if (!canResend) return;

        try {
            setIsResending(true);
            const data = {
                session_token: sessionToken,
            };
            const response = await resendOTP(data);
            const payload = response?.data?.data ?? response?.data ?? {};
            const nextSessionToken = payload?.session_token ?? sessionToken;
            const nextExpiresIn = Number(payload?.expires_in ?? 0);

            setSessionToken(nextSessionToken);
            setDurationCode(getValidExpiresIn(nextExpiresIn));
            setCode('');
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Resend OTP failed. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <BaseComponent isBack={true} title='auth.verify'>
            <View style={style.container}>
                <View style={style.headerSection}>
                    <Text style={style.title}>{t('auth.verificationCode')}</Text>
                    <Text style={style.description}>
                        {t('auth.verificationCodeSent')}
                    </Text>
                    <Text style={style.phoneNumber}>{phoneNumber}</Text>
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
                        editable={!isVerifying}
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
                    {(isResending || isVerifying) && (
                        <Text style={style.statusText}>Verifying your number...</Text>
                    )}
                    {canResend && (
                        <Text style={style.timeoutText}>
                            Network seems unstable. Try mobile data or retry.
                        </Text>
                    )}
                    {networkHint && (
                        <Text style={style.hintText}>{networkHint}</Text>
                    )}
                    <Text style={style.resendText}>{t('auth.didntReceiveCode')}</Text>
                    <TouchableOpacity 
                        onPress={handleResendCode}
                        disabled={!canResend}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            style.resendLink,
                            !canResend && style.resendLinkDisabled
                        ]}>
                            {isResending ? t('common.loading') : t('auth.resendCode')}
                        </Text>
                    </TouchableOpacity>
                    {durationCode > 0 && (
                        <Text style={style.timerText}>
                            {t('auth.resendIn')} {formattedDuration}
                        </Text>
                    )}
                </View>
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
    statusText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        marginBottom: 8,
        textAlign: 'center',
    },
    timeoutText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#DC2626',
        marginBottom: 6,
        textAlign: 'center',
    },
    hintText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        marginBottom: 10,
        textAlign: 'center',
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
    timerText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        fontWeight: '500',
    },
});
