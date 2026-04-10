import BaseComponent from "@/components/BaseComponent";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BalanceCard from "@/components/BalanceCard";
import TransactionDetailModal from "@/components/TransactionDetailModal";
import { useWallet } from "@/hooks/useWallet";
import { Transaction } from "@/types";
import moment from "moment";
import Loading from "@/components/Loading";
import TextTranslation from "@/components/TextTranslation";
import { useTranslation } from "@/hooks/useTranslation";

const WalletScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { getMeWallet, userWalletBalance, meTransaction, getMeTransactions, isLoadMoreLoading,isLoading } = useWallet();
    const { t } = useTranslation();
    useEffect(() => {
        const loadInitialData = async () => {
            await getMeWallet();
            await getMeTransactions(1);
            setIsInitialLoad(false);
        };
        loadInitialData();
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
        // Prevent load more during initial load or if already loading
        if (isInitialLoad || isLoadMoreLoading || !hasMore) return;
        
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
    }, [isInitialLoad, isLoadMoreLoading, hasMore, currentPage, getMeTransactions]);

    const renderFooter = () => {
        if (!isLoadMoreLoading) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.mainColor} />
                <Text style={styles.loadingText}>{t('wallet.loadingMore')}</Text>
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

    const getSymbolForTransaction = (type: string) => {
        switch (type) {
            case 'TOPUP':
                return '+';
            case 'CHARGE':
                return '-';
            default:
                return '';
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

    const textStatus = (status:string) =>{
        switch (status) {
        case 'PENDING':
            return t('status.pending');
        case 'COMPLETED':
            return t('status.completed');
        default:
            return '';
        }
    }
      const textType = (status:string) =>{
        switch (status) {
        case 'TOPUP':
            return t('status.topUp');
        case 'CHARGE':
            return t('status.charge');
        default:
            return '';
        }
    }
    const handleTransactionPress = useCallback((transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalVisible(false);
        setTimeout(() => setSelectedTransaction(null), 300);
    }, []);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
                <Ionicons name="receipt-outline" size={48} color={`${Colors.mainColor}50`} />
            </View>
            <Text style={styles.emptyTitle}>{t('wallet.transactionHistory')}</Text>
            <Text style={styles.emptySubtitle}>No transactions yet</Text>
        </View>
    );

    const renderSeparator = () => <View style={styles.separator} />;

    const renderItem = useCallback(({ item }: { item: Transaction }) => {
        const color = getTransactionColor(item.type);
        return (
            <TouchableOpacity
                style={styles.transactionItem}
                activeOpacity={0.75}
                onPress={() => handleTransactionPress(item)}
            >
                {/* Icon */}
                <View style={[styles.transactionIcon, { backgroundColor: `${color}18` }]}>
                    <Ionicons name={getTransactionIcon(item.type)} size={22} color={color} />
                </View>

                {/* Details */}
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>
                        {textType(item.type) || t('wallet.noDescription')}
                    </Text>
                    <Text style={styles.transactionDate}>
                        {item.created_at
                            ? moment.utc(item.created_at).local().format('MMM DD, YYYY • hh:mm A')
                            : ''}
                    </Text>
                </View>

                {/* Amount + Status */}
                <View style={styles.transactionAmountContainer}>
                    <Text style={[styles.transactionAmount, { color }]}>
                        {`${getSymbolForTransaction(item.type)}${item.amount.toFixed(2)} $`}
                    </Text>
                    {item.type !== 'CHARGE' && (
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: item.status === 'PENDING' ? '#FEF3C7' : `${Colors.secondaryColor}20` }
                        ]}>
                            <View style={[
                                styles.statusDot,
                                { backgroundColor: item.status === 'PENDING' ? '#F59E0B' : Colors.secondaryColor }
                            ]} />
                            <Text style={[
                                styles.statusText,
                                { color: item.status === 'PENDING' ? '#F59E0B' : Colors.secondaryColor }
                            ]}>
                                {textStatus(item.status)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Right chevron */}
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
        );
    }, [handleTransactionPress, t])

    if(isLoading) return <Loading />
    
    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                <BalanceCard amount={Number(userWalletBalance?.balance) || 0} currency={userWalletBalance?.currency ?? '$'} />
                <View style={styles.transactionsSection}>
                    <View style={styles.transactionsHeader}>
                        <TextTranslation textKey="wallet.transactionHistory" fontSize={FontSize.large} isBold={true}/>
                    </View>

                    <FlatList
                        data={meTransaction ?? []}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.transactionsList}
                        ItemSeparatorComponent={renderSeparator}
                        ListEmptyComponent={renderEmpty}
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
        flexGrow: 1,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 14,
        paddingHorizontal: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIconWrapper: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: `${Colors.mainColor}0D`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
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
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    transactionAmountContainer: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        marginBottom: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnRegular,
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
