import BaseComponent from "@/components/BaseComponent";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import { navigate } from "@/navigation/NavigationService";
import { useWallet } from "@/hooks/useWallet";
import CustomButton from "@/components/CustomButton";
import PaymentTermsModal from "@/components/PaymentTermsModal";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import { useTranslation } from "@/hooks/useTranslation";
import { useAmount } from "@/hooks/useAmount";
import Loading from "@/components/Loading";
import { Amount } from "@/types";

const TopUpScreen = () => {
    const [selectedAmount, setSelectedAmount] = useState<any>(null);
    const [customAmount, setCustomAmount] = useState('');
    const { userWalletBalance } = useWallet();
    const [showTermsModal, setShowTermsModal] = useState(false);
    const { isLoading ,amountData,getAmount } = useAmount();
    const { t } = useTranslation(); 

    useEffect(()=>{
        getAmount();
    },[])
    const handleAmountSelect = (amount: Amount) => {
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


    const handleAcceptTerms = () => {
        setShowTermsModal(false);
    };
    
    const handleDeclineTerms = () => {
        setShowTermsModal(false);
    };

    if(isLoading) return <Loading/>

    return (
        <BaseComponent isBack={true} title="wallet.topUp">
            <KeyboardAwareScrollView
                style={{flex:1}}
                extraScrollHeight={40}
            >

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('wallet.selectAmount')}</Text>
                    <View style={styles.amountGrid}>
                        {amountData?.map((item) => (
                            <TouchableOpacity
                                key={item?.id}
                                style={[
                                    styles.amountButton,
                                    selectedAmount?.amount === item.amount && !customAmount && styles.amountButtonSelected
                                ]}
                                onPress={() => handleAmountSelect(item)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.amountText,
                                    selectedAmount?.amount === item?.amount && !customAmount && styles.amountTextSelected
                                ]}>
                                    ${item?.amount}
                                </Text>
                                {item?.bonus_value ? (
                                    <Text style={[
                                        styles.bonusBadge,
                                        selectedAmount?.amount === item?.amount && !customAmount && styles.bonusBadgeSelected
                                    ]}>
                                        +${item?.bonus_value}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('wallet.orEnterCustomAmount')}</Text>
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
                            {t('wallet.paymentTermsConditions')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                    <CustomButton
                        buttonTitle={`${t('common.continue')} ${selectedAmount?.amount && selectedAmount.amount > 0 ? `$${selectedAmount.amount}` : ''}`}
                        buttonColor={selectedAmount?.amount && selectedAmount.amount > 0  ? Colors.mainColor : Colors.gray}
                        onPress={handleTopUp}
                        disabled={!selectedAmount?.amount || selectedAmount.amount <= 0}
                    />``

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
        width: '30%',
        paddingVertical: 15,
        borderRadius: 5,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
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
    amountTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bonusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 6,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        color: Colors.mainColor,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
    },
    bonusBadgeSelected: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: Colors.white,
    },
});
