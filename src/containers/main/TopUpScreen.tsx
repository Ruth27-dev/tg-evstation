import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { goBack } from "@/navigation/NavigationService";

interface PaymentMethod {
    id: string;
    name: string;
    icon: string;
    type: 'card' | 'bank' | 'ewallet';
}

const TopUpScreen = () => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const [currentBalance] = useState(1250.50);

    const quickAmounts = [10, 20, 50, 100, 200, 500];

    const paymentMethods: PaymentMethod[] = [
        { id: '1', name: 'Credit/Debit Card', icon: 'credit-card', type: 'card' },
        { id: '2', name: 'Bank Transfer', icon: 'bank', type: 'bank' },
        { id: '3', name: 'ABA Bank', icon: 'wallet', type: 'ewallet' },
        { id: '4', name: 'Wing Money', icon: 'cash', type: 'ewallet' },
    ];

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (text: string) => {
        // Only allow numbers
        const numericValue = text.replace(/[^0-9]/g, '');
        setCustomAmount(numericValue);
        if (numericValue) {
            setSelectedAmount(parseInt(numericValue));
        } else {
            setSelectedAmount(null);
        }
    };

    const handleTopUp = () => {
        if (!selectedAmount || selectedAmount <= 0) {
            Alert.alert('Error', 'Please select or enter an amount');
            return;
        }
        if (!selectedPayment) {
            Alert.alert('Error', 'Please select a payment method');
            return;
        }
        
        Alert.alert(
            'Confirm Top Up',
            `Top up $${selectedAmount.toFixed(2)} using ${paymentMethods.find(p => p.id === selectedPayment)?.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        // Handle top up logic here
                        Alert.alert('Success', 'Top up successful!', [
                            { text: 'OK', onPress: () => goBack() }
                        ]);
                    }
                }
            ]
        );
    };

    const getTotalAmount = () => {
        return selectedAmount ? currentBalance + selectedAmount : currentBalance;
    };

    return (
        <BaseComponent isBack={true} title="Top Up Wallet">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Current Balance Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <View style={styles.balanceIconContainer}>
                            <MaterialCommunityIcons name="wallet" size={24} color={Colors.white} />
                        </View>
                        <View style={styles.balanceInfo}>
                            <Text style={styles.balanceLabel}>Current Balance</Text>
                            <Text style={styles.balanceAmount}>${currentBalance.toFixed(2)}</Text>
                        </View>
                    </View>
                    
                    {selectedAmount && selectedAmount > 0 && (
                        <>
                            <View style={styles.dividerLine} />
                            <View style={styles.newBalanceRow}>
                                <Text style={styles.newBalanceLabel}>New Balance</Text>
                                <Text style={styles.newBalanceAmount}>
                                    ${getTotalAmount().toFixed(2)}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Select Amount Section */}
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
                                    ${amount}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Custom Amount Section */}
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
                    <View style={styles.amountLimits}>
                        <View style={styles.limitItem}>
                            <Ionicons name="information-circle" size={16} color="#6B7280" />
                            <Text style={styles.limitText}>Min: $10</Text>
                        </View>
                        <View style={styles.limitItem}>
                            <Ionicons name="information-circle" size={16} color="#6B7280" />
                            <Text style={styles.limitText}>Max: $10,000</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Method Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.paymentMethodsContainer}>
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.paymentMethodCard,
                                    selectedPayment === method.id && styles.paymentMethodCardSelected
                                ]}
                                onPress={() => setSelectedPayment(method.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.paymentMethodContent}>
                                    <View style={[
                                        styles.paymentIconContainer,
                                        selectedPayment === method.id && styles.paymentIconContainerSelected
                                    ]}>
                                        <MaterialCommunityIcons 
                                            name={method.icon as any} 
                                            size={24} 
                                            color={selectedPayment === method.id ? Colors.white : Colors.mainColor}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.paymentMethodName,
                                        selectedPayment === method.id && styles.paymentMethodNameSelected
                                    ]}>
                                        {method.name}
                                    </Text>
                                </View>
                                {selectedPayment === method.id && (
                                    <View style={styles.checkIconContainer}>
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.secondaryColor} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Summary Section */}
                {selectedAmount && selectedAmount > 0 && selectedPayment && (
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Transaction Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Top Up Amount</Text>
                            <Text style={styles.summaryValue}>${selectedAmount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Processing Fee</Text>
                            <Text style={styles.summaryValue}>$0.00</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                            <Text style={styles.summaryTotalValue}>${selectedAmount.toFixed(2)}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Action Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[
                        styles.topUpButton,
                        (!selectedAmount || selectedAmount <= 0 || !selectedPayment) && styles.topUpButtonDisabled
                    ]}
                    onPress={handleTopUp}
                    activeOpacity={0.8}
                    disabled={!selectedAmount || selectedAmount <= 0 || !selectedPayment}
                >
                    <Text style={styles.topUpButtonText}>
                        Top Up {selectedAmount && selectedAmount > 0 ? `$${selectedAmount.toFixed(2)}` : 'Wallet'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </BaseComponent>
    );
}

export default TopUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    // Balance Card
    balanceCard: {
        backgroundColor: Colors.mainColor,
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
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
        fontWeight: '700',
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
        fontWeight: '700',
    },
    // Section
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
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
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
        fontWeight: '700',
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
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    currencySymbol: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
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
    // Payment Methods
    paymentMethodsContainer: {
        gap: 12,
    },
    paymentMethodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    paymentMethodCardSelected: {
        borderColor: Colors.secondaryColor,
        backgroundColor: '#F0FDF4',
        shadowColor: Colors.secondaryColor,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    paymentMethodContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    paymentIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    paymentIconContainerSelected: {
        backgroundColor: Colors.mainColor,
    },
    paymentMethodName: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        fontWeight: '600',
    },
    paymentMethodNameSelected: {
        fontFamily: CustomFontConstant.EnBold,
        fontWeight: '700',
    },
    checkIconContainer: {
        marginLeft: 8,
    },
    // Summary Card
    summaryCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 100,
    },
    summaryTitle: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        fontWeight: '600',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    summaryTotalLabel: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    summaryTotalValue: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
        fontWeight: '700',
    },
    // Bottom Action
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
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
        shadowColor: Colors.mainColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    topUpButtonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    topUpButtonText: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        fontWeight: '700',
    },
});
