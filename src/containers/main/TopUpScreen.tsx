import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import { navigate } from "@/navigation/NavigationService";
import { useWallet } from "@/hooks/useWallet";
import CustomButton from "@/components/CustomButton";
import PaymentTermsModal from "@/components/PaymentTermsModal";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const TopUpScreen = () => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const { userWalletBalance } = useWallet();
    const [showTermsModal, setShowTermsModal] = useState(false);
    

    const quickAmounts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 100];
    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setCustomAmount(numericValue);
        if (numericValue) {
            setSelectedAmount(parseInt(numericValue));
        } else {
            setSelectedAmount(null);
        }
    };

    const handleTopUp = () => {
        navigate('PaymentMethod', {
            amount: selectedAmount,
            currency: userWalletBalance?.currency ?? '$'
        });
    };


    const handleAcceptTerms = () => {
        setShowTermsModal(false);
    };
    
    const handleDeclineTerms = () => {
        setShowTermsModal(false);
    };
    

    return (
        <BaseComponent isBack={true} title="Top Up">
            <KeyboardAwareScrollView
                style={{flex:1}}
                extraScrollHeight={40}
            >

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Amount</Text>
                    <View style={styles.amountGrid}>
                        {quickAmounts.map((amount) => (
                            <TouchableOpacity
                                key={amount}
                                style={[
                                    styles.amountButton,
                                    selectedAmount === amount && !customAmount && styles.amountButtonSelected
                                ]}
                                onPress={() => handleAmountSelect(amount)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.amountText,
                                    selectedAmount === amount && !customAmount && styles.amountTextSelected
                                ]}>
                                    ${amount?.toFixed(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Or Enter Custom Amount</Text>
                    <View style={styles.customAmountContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.customAmountInput}
                            placeholder="0.00"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            value={customAmount}
                            onChangeText={handleCustomAmountChange}
                        />
                    </View>
                </View>
            
                <View style={styles.termsSection}>
                    <TouchableOpacity 
                        onPress={() => setShowTermsModal(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.termsLink}>
                            Payment Terms & Conditions
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                    <CustomButton
                        buttonTitle={`Continue ${selectedAmount && selectedAmount > 0 ? `$${selectedAmount.toFixed(2)}` : ''}`}
                        buttonColor={selectedAmount && selectedAmount > 0  ? Colors.mainColor : Colors.gray}
                        onPress={handleTopUp}
                        disabled={!selectedAmount || selectedAmount <= 0}
                    />

                </View>
                <PaymentTermsModal
                    visible={showTermsModal}
                    onClose={handleDeclineTerms}
                    onAccept={handleAcceptTerms}
                />
            </KeyboardAwareScrollView>
           
        </BaseComponent>
    );
}

export default TopUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backGroundColor,
    },
    // Balance Card
    balanceCard: {
        backgroundColor: Colors.mainColor,
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        marginBottom: 24
    },
    balanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    balanceInfo: {
        flex: 1,
    },
    balanceLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    balanceAmount: {
        fontSize: FontSize.large + 8,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
    dividerLine: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginVertical: 16,
    },
    newBalanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    newBalanceLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    newBalanceAmount: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.primaryColor,
    },
    // Section
    section: {
        marginBottom: 28,
        marginTop: safePadding,
        paddingHorizontal: safePadding,
    },
    sectionTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 16,
    },
    // Amount Grid
    amountGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    amountButton: {
        width: '31%',
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center'
    },
    amountButtonSelected: {
        backgroundColor: Colors.mainColor,
        borderColor: Colors.mainColor,
        shadowColor: Colors.mainColor,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    amountText: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    amountTextSelected: {
        color: Colors.white,
    },
    // Custom Amount
    customAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        paddingHorizontal: 20,
        paddingVertical: 16
    },
    currencySymbol: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginRight: 8,
    },
    customAmountInput: {
        flex: 1,
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        padding: 0,
    },
    amountLimits: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingHorizontal: 4,
    },
    limitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    limitText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    bottomContainer: {
        paddingHorizontal: safePadding,
        marginTop: 40,
    },
    topUpButton: {
        flexDirection: 'row',
        backgroundColor: Colors.mainColor,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    topUpButtonDisabled: {
        backgroundColor: Colors.mainColor,
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    topUpButtonText: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
    termsSection: {
        paddingHorizontal: safePadding,
        alignItems: 'center',
    },
    termsLink: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
});
