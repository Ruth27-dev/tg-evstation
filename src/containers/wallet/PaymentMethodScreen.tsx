import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, Images, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTopUp } from "@/hooks/useTopUp";
import CustomButton from "@/components/CustomButton";
import PaymentTermsModal from "@/components/PaymentTermsModal";
import { useTranslation } from "@/hooks/useTranslation";

interface PaymentMethod {
    id: string;
    name: string;
    icon: string;
    description: string;
    type: 'cards' | 'abapay_khqr_deeplink' | 'aba_khqr';
}

interface PaymentMethodScreenProps {
    route?: {
        params?: {
            amount?: number;
            currency?: string;
        };
    };
}

const PaymentMethodScreen: React.FC<PaymentMethodScreenProps> = ({ route }) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    const { postTopUp ,isLoading } = useTopUp();
    const { t } = useTranslation();
    const amount = route?.params?.amount || 0;

    const paymentMethods: PaymentMethod[] = [
        { 
            id: '1', 
            name: 'ABA KHQR', 
            icon: 'card-outline', 
            description: 'Scan to pay with any banking app',
            type: 'abapay_khqr_deeplink',
        },
        { 
            id: '2', 
            name: 'Credit/Debit Card', 
            icon: 'card-outline', 
            description: 'Scan to pay with any banking app',
            type: 'cards',
        }
    ];

    const handleContinue = () => {
        postTopUp(amount.toString(), selectedMethod?.type || '');
    };

    return (
        <BaseComponent isBack={true} title="wallet.selectPaymentMethod">
            <ScrollView 
                style={styles.container} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                <View style={styles.section}>
                    <View style={styles.methodsContainer}>
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.methodCard,
                                    selectedMethod?.id === method.id && styles.methodCardSelected,
                                ]}
                                onPress={() => setSelectedMethod(method)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.methodLeft}>
                                    <Image source={ method.id === '1' ? Images.icKhqr : Images.icCard} style={{width: 50, height: 40 }} resizeMode="contain" />
                                    <View style={styles.methodInfo}>
                                        <Text style={[
                                            styles.methodName,
                                            selectedMethod?.id === method.id && styles.methodNameSelected
                                        ]}>
                                            {method.name}
                                        </Text>
                                        {method.id === '2' ? 
                                            <Image source={ Images.ic4Cards} style={{ width: 120, height: 20 }} resizeMode="contain" />
                                            :
                                             <Text style={[
                                                styles.methodDescription,
                                                styles.methodDescriptionDisabled
                                            ]}>
                                                {method.description}
                                            </Text>
                                        }
                                       
                                    </View>
                                </View>

                                {
                                    selectedMethod?.id === method.id && (
                                        <View style={styles.checkIcon}>
                                            <Ionicons 
                                                name="checkmark-circle" 
                                                size={24} 
                                                color={Colors.mainColor} 
                                            />
                                        </View>
                                    )
                                }
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <CustomButton
                    buttonTitle={t('common.continue')}
                    buttonColor={selectedMethod ? Colors.mainColor : Colors.gray}
                    onPress={handleContinue}
                    disabled={!selectedMethod}
                    isLoading={isLoading}
                />
            </View>
        </BaseComponent>
    );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContent: {
        paddingBottom: 20,
    },
    amountValue: {
        fontSize: FontSize.large + 16,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: safePadding,
    },
    methodsContainer: {
        gap: 12,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 10
    },
    methodCardSelected: {
        borderColor: Colors.mainColor,
        shadowColor: Colors.mainColor,
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    methodInfo: {
        flex: 1,
        marginLeft:15
    },
    methodName: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: '#081B37',
        marginBottom: 4,
    },
    methodNameSelected: {
        color: Colors.black,
    },
    methodDescription: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#697386',
    },
    methodDescriptionDisabled: {
        color: Colors.gray,
    },
    checkIcon: {
        marginLeft: 8,
    },
    // Terms Section
    termsSection: {
        marginTop: 24,
        paddingHorizontal: safePadding,
        alignItems: 'center',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    termsText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        textAlign: 'center',
    },
    termsLink: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    // Bottom Action
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        paddingHorizontal: safePadding,
        paddingTop: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    continueButton: {
        flexDirection: 'row',
        backgroundColor: Colors.mainColor,
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: Colors.mainColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    continueButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
});
