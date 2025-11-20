import BaseComponent from "@/components/BaseComponent";
import { CustomFontConstant, FontSize, safePadding, safePaddingAndroid } from "@/constants/GeneralConstants";
import { Colors } from "@/theme";
import React, { useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

let interval: any;
const CELL_COUNT: number = 6;

const VerifyScreen = () => {
    const [code, setCode] = useState('');
    const [verifiedID, setVerifiedID] = useState('');
    const [DurationCode, setDurationCode] = useState<number>(60);
    const ref = useBlurOnFulfill({value: code, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

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
                    <Text style={style.resendLink}>Resend Code</Text>
                    {DurationCode > 0 && (
                        <Text style={style.timerText}>
                            Resend in {DurationCode}s
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
    timerText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        fontWeight: '500',
    },
});