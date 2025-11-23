import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BalanceCard from "@/components/BalanceCard";

interface Transaction {
    id: string;
    type: 'deposit' | 'withdraw' | 'transfer' | 'payment';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
}

const WalletScreen = () => {
    const [walletBalance] = useState(1250.50);
    const [transactions] = useState<Transaction[]>([
        {
            id: '1',
            type: 'deposit',
            amount: 500,
            description: 'Top up via Bank',
            date: '2025-11-20 10:30 AM',
            status: 'completed'
        },
        {
            id: '2',
            type: 'payment',
            amount: -150,
            description: 'Station Payment',
            date: '2025-11-19 03:45 PM',
            status: 'completed'
        },
        {
            id: '3',
            type: 'withdraw',
            amount: -200,
            description: 'Withdrawal to Bank',
            date: '2025-11-18 09:15 AM',
            status: 'completed'
        },
        {
            id: '4',
            type: 'transfer',
            amount: -50,
            description: 'Transfer to +855 12345678',
            date: '2025-11-17 02:20 PM',
            status: 'completed'
        },
        {
            id: '5',
            type: 'deposit',
            amount: 300,
            description: 'Top up via Card',
            date: '2025-11-16 11:00 AM',
            status: 'completed'
        },
    ]);

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'deposit':
                return 'arrow-down-circle';
            case 'withdraw':
                return 'arrow-up-circle';
            default:
                return 'arrow-down-circle';
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'deposit':
                return Colors.secondaryColor;
            case 'withdraw':
            case 'payment':
            case 'transfer':
                return '#EF4444';
            default:
                return Colors.mainColor;
        }
    };

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <TouchableOpacity style={styles.transactionItem} activeOpacity={0.7}>
            <View style={[styles.transactionIcon, { backgroundColor: `${getTransactionColor(item.type)}15` }]}>
                <Ionicons name={getTransactionIcon(item.type)} size={24} color={getTransactionColor(item.type)} />
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>{item.description}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <View style={styles.transactionAmountContainer}>
                <Text style={[styles.transactionAmount, { color: item.amount > 0 ? Colors.secondaryColor : '#EF4444' }]}>
                    {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)} $
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                <BalanceCard amount={walletBalance} />

                <View style={styles.transactionsSection}>
                    <View style={styles.transactionsHeader}>
                        <Text style={styles.transactionsTitle}>Transaction History</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={transactions}
                        renderItem={renderTransaction}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.transactionsList}
                    />
                </View>
            </View>
        </BaseComponent>
    );
}

export default WalletScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    transactionsSection: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    transactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    transactionsTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor
    },
    viewAllText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor
    },
    transactionsList: {
        paddingBottom: 100,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFBFC',
        padding: 16,
        borderRadius: 16,
        marginBottom: 10,
    },
    transactionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionDescription: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        fontWeight: '600',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        fontWeight: '400',
    },
    transactionAmountContainer: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        fontWeight: '700',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    statusText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnRegular,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});