import BaseComponent from "@/components/BaseComponent";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BalanceCard from "@/components/BalanceCard";
import TransactionDetailModal from "@/components/TransactionDetailModal";
import { useWallet } from "@/hooks/useWallet";
import { Transaction } from "@/types";
import moment from "moment";
import Loading from "@/components/Loading";

const WalletScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { getMeWallet, userWalletBalance, meTransaction, getMeTransactions, isLoadMoreLoading,isLoading } = useWallet();
    
    useEffect(() => {
        getMeWallet();
        getMeTransactions(1);
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setCurrentPage(1);
        setHasMore(true);
        try {
            await Promise.all([
                getMeWallet(),
                getMeTransactions(1)
            ]);
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    }, [getMeWallet, getMeTransactions]);

    const loadMore = useCallback(async () => {
        if (isLoadMoreLoading || !hasMore) return;
        const nextPage = currentPage + 1;
        try {
            const result = await getMeTransactions(nextPage);
            if (result.isLastPage || result.content.length === 0) {
                setHasMore(false);
            } else {
                setCurrentPage(nextPage);
            }
        } catch (error) {
            console.error('Load more error:', error);
            setHasMore(false);
        }
    }, [isLoadMoreLoading, hasMore, currentPage, getMeTransactions]);

    const renderFooter = () => {
        if (!isLoadMoreLoading) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.mainColor} />
                <Text style={styles.loadingText}>Loading more...</Text>
            </View>
        );
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'TOPUP':
                return 'arrow-down-circle';
            case 'CHARGE':
                return 'arrow-up-circle';
            default:
                return 'arrow-down-circle';
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'TOPUP':
                return Colors.secondaryColor;
            case 'CHARGE':
                return '#EF4444';
            default:
                return Colors.mainColor;
        }
    };
    const handleTransactionPress = useCallback((transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalVisible(false);
        setTimeout(() => setSelectedTransaction(null), 300);
    }, []);

    const renderItem = useCallback(({ item }: { item: Transaction }) => {
        return (
            <TouchableOpacity 
                style={styles.transactionItem} 
                activeOpacity={0.7}
                onPress={() => handleTransactionPress(item)}
            >
                <View style={[styles.transactionIcon, { backgroundColor: `${getTransactionColor(item.type)}15` }]}>
                    <Ionicons name={getTransactionIcon(item.type)} size={24} color={getTransactionColor(item.type)} />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>{item.type || 'No description'}</Text>
                    <Text style={styles.transactionDate}>
                        {item.created_at 
                        ? moment.utc(item.created_at).local().format('MMM DD, YYYY hh:mm A')
                        : ''}
                    </Text>

                </View>
                <View style={styles.transactionAmountContainer}>
                    <Text style={[styles.transactionAmount, { color: item.amount > 0 ? Colors.secondaryColor : '#EF4444' }]}>
                        {`${item.amount > 0 ? '+' : ''}${item.amount.toFixed(2)} $`}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'PENDING' ? '#FEF3C7' : Colors.secondaryColor }]}>
                        <Text style={[styles.statusText, { color: item.status === 'PENDING' ? '#F59E0B' :Colors.white  }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }, [handleTransactionPress])

    if(isLoading) return <Loading />
    
    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                <BalanceCard amount={Number(userWalletBalance?.balance) || 0} currency={userWalletBalance?.currency ?? '$'} />
                <View style={styles.transactionsSection}>
                    <View style={styles.transactionsHeader}>
                        <Text style={styles.transactionsTitle}>Transaction History</Text>
                    </View>

                    <FlatList
                        data={meTransaction ?? []}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.transactionsList}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[Colors.mainColor]}
                                tintColor={Colors.mainColor}
                            />
                        }
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                    />
                </View>
            </View>
            <TransactionDetailModal
                visible={modalVisible}
                transaction={selectedTransaction}
                onClose={closeModal}
            />
        </BaseComponent>
    );
}

export default WalletScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:10,
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
        fontFamily: CustomFontConstant.EnBold,
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
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    loadingText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
});