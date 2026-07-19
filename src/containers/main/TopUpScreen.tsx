import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Radius, Shadows } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import { navigate } from "@/navigation/NavigationService";
import { useWallet } from "@/hooks/useWallet";
import CustomButton from "@/components/CustomButton";
import PaymentTermsModal from "@/components/PaymentTermsModal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from "@/hooks/useTranslation";

const AMOUNT_DATA = [5, 10, 20, 30, 40, 50].map((amount, index) => ({ id: index + 1, amount }));

const TopUpScreen = () => {
    const [selectedAmount, setSelectedAmount] = useState<any>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [inputFocused, setInputFocused] = useState(false);
    const { userWalletBalance } = useWallet();
    const [showTermsModal, setShowTermsModal] = useState(false);
    const { t } = useTranslation();

    const handleAmountSelect = (amount: { id: number; amount: number }) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setCustomAmount(numericValue);
        if (numericValue) {
            setSelectedAmount({ amount: parseInt(numericValue) });
        } else {
            setSelectedAmount(null);
        }
    };

    const handleTopUp = () => {
        navigate('PaymentMethod', {
            amount: selectedAmount?.amount || parseInt(customAmount),
            currency: userWalletBalance?.currency ?? '$',
            promotionId: selectedAmount?.promotion_id ? selectedAmount.promotion_id : null,
        });
    };

    const handleAcceptTerms = () => setShowTermsModal(false);
    const handleDeclineTerms = () => setShowTermsModal(false);

    const isCustomSelected = !!customAmount;
    const canContinue = !!(selectedAmount?.amount && selectedAmount.amount > 0);

    return (
        <BaseComponent isBack={true} title="wallet.topUp">
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                extraScrollHeight={40}
                showsVerticalScrollIndicator={false}
            >
                {/* Balance Hero */}
                {/* <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Current Balance</Text>
                    <Text style={styles.balanceAmount}>
                        {userWalletBalance?.currency ?? '$'}{userWalletBalance?.balance ?? '0.00'}
                    </Text>
                    <View style={styles.balancePill}>
                        <Ionicons name="wallet-outline" size={12} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.balancePillText}>EV Wallet</Text>
                    </View>
                </View> */}

                {/* Quick Select */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>{t('wallet.selectAmount')}</Text>
                    <View style={styles.amountGrid}>
                        {AMOUNT_DATA.map((item) => {
                            const isSelected = selectedAmount?.amount === item.amount && !customAmount;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.amountButton, isSelected && styles.amountButtonSelected]}
                                    onPress={() => handleAmountSelect(item)}
                                    activeOpacity={0.75}
                                >
                                    <Text style={[styles.amountText, isSelected && styles.amountTextSelected]}>
                                        ${item.amount}
                                    </Text>
                                    {isSelected && <View style={styles.selectedDot} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Custom Amount */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>{t('wallet.orEnterCustomAmount')}</Text>
                    <View style={[
                        styles.inputWrapper,
                        inputFocused && styles.inputWrapperFocused,
                        isCustomSelected && styles.inputWrapperActive,
                    ]}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.customAmountInput}
                            placeholder="0"
                            placeholderTextColor={Colors.placeholderColor}
                            keyboardType="numeric"
                            value={customAmount}
                            onChangeText={handleCustomAmountChange}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                        />
                        {isCustomSelected && (
                            <TouchableOpacity onPress={() => handleCustomAmountChange('')} activeOpacity={0.7}>
                                <View style={styles.clearButton}>
                                    <Text style={styles.clearButtonText}>✕</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Summary Row */}
                {/* {canContinue && (
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Top-up amount</Text>
                        <Text style={styles.summaryValue}>${selectedAmount.amount}</Text>
                    </View>
                )} */}

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => setShowTermsModal(true)} activeOpacity={0.7}>
                        <Text style={styles.termsLink}>{t('wallet.paymentTermsConditions')}</Text>
                    </TouchableOpacity>
                    <CustomButton
                        buttonTitle={`${t('common.continue')}${canContinue ? `  •  $${selectedAmount.amount}` : ''}`}
                        buttonColor={canContinue ? Colors.mainColor : Colors.disableColor}
                        onPress={handleTopUp}
                        disabled={!canContinue}
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
};

export default TopUpScreen;

const card = {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: 20,
    ...Shadows.card,
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 48,
    },

    // Balance hero card
    balanceCard: {
        ...card,
        marginHorizontal: safePadding,
        marginTop: 20,
        backgroundColor: Colors.mainColor,
        alignItems: 'center',
        paddingVertical: 28,
    },
    balanceLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    balanceAmount: {
        fontSize: 40,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        letterSpacing: -1,
    },
    balancePill: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: Radius.xl,
        paddingHorizontal: 14,
        paddingVertical: 4,
    },
    balancePillText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: 0.5,
    },

    // Generic white card
    card: {
        ...card,
        marginHorizontal: safePadding,
        marginTop: 14,
    },
    cardLabel: {
        fontSize: 11,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.textFaint,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 16,
    },

    // Amount grid
    amountGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    amountButton: {
        width: '30%',
        paddingVertical: 20,
        borderRadius: Radius.lg,
        backgroundColor: Colors.surfaceMuted,
        borderWidth: 1.5,
        borderColor: Colors.borderMuted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountButtonSelected: {
        backgroundColor: Colors.mainColor,
        borderColor: Colors.mainColor,
        ...Shadows.elevated,
    },
    amountText: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    amountTextSelected: {
        color: Colors.white,
    },
    selectedDot: {
        position: 'absolute',
        top: 7,
        right: 7,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: Colors.primaryColor,
    },

    // Custom input
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceMuted,
        borderRadius: Radius.lg,
        borderWidth: 1.5,
        borderColor: Colors.borderMuted,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    inputWrapperFocused: {
        borderColor: Colors.mainColor,
        backgroundColor: Colors.white,
    },
    inputWrapperActive: {
        borderColor: Colors.mainColor,
        backgroundColor: Colors.white,
    },
    currencySymbol: {
        fontSize: FontSize.extraLarge + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginRight: 8,
    },
    customAmountInput: {
        flex: 1,
        fontSize: FontSize.extraLarge + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        padding: 0,
    },
    clearButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.clearButtonBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearButtonText: {
        fontSize: 10,
        color: Colors.textMuted,
        fontFamily: CustomFontConstant.EnBold,
    },

    // Summary
    summaryRow: {
        marginHorizontal: safePadding,
        marginTop: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.surfaceTint,
        borderRadius: Radius.lg,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.borderTint,
    },
    summaryLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    summaryValue: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },

    // Footer
    footer: {
        marginHorizontal: safePadding,
        marginTop: 24,
        gap: 14,
    },
    termsLink: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textFaint,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
});
