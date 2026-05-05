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
            case 'TOPUP':  return 'arrow-down-circle';
            case 'CHARGE': return 'flash';
            default:       return 'arrow-down-circle';
        }
    };

    const getSymbolForTransaction = (type: string) => {
        switch (type) {
            case 'TOPUP':  return '+';
            case 'CHARGE': return '-';
            default:       return '';
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'TOPUP':  return Colors.secondaryColor;
            case 'CHARGE': return '#EF4444';
            default:       return Colors.mainColor;
        }
    };

    const textStatus = (status: string) => {
        switch (status) {
            case 'PENDING':   return t('status.pending');
            case 'COMPLETED': return t('status.completed');
            default:          return '';
        }
    };

    const textType = (type: string) => {
        switch (type) {
            case 'TOPUP':  return t('status.topUp');
            case 'CHARGE': return t('status.charge');
            default:       return '';
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

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
                <Ionicons name="receipt-outline" size={40} color={`${Colors.mainColor}60`} />
            </View>
            <Text style={styles.emptyTitle}>{t('wallet.transactionHistory')}</Text>
            <Text style={styles.emptySubtitle}>No transactions yet</Text>
        </View>
    );

    const renderItem = useCallback(({ item }: { item: Transaction }) => {
        const color = getTransactionColor(item.type);
        const isTopUp = item.type === 'TOPUP';
        const isPending = item.status === 'PENDING';
        return (
            <TouchableOpacity
                style={styles.transactionCard}
                activeOpacity={0.75}
                onPress={() => handleTransactionPress(item)}
            >
                {/* Icon */}
                <View style={[styles.iconWrapper, { backgroundColor: `${color}18` }]}>
                    <Ionicons name={getTransactionIcon(item.type)} size={20} color={color} />
                </View>

                {/* Details */}
                <View style={styles.details}>
                    <Text style={styles.typeLabel}>{textType(item.type)}</Text>
                    <Text style={styles.dateText}>
                        {item.created_at
                            ? moment.utc(item.created_at).local().format('MMM DD, YYYY • hh:mm A')
                            : ''}
                    </Text>
                </View>

                {/* Right side */}
                <View style={styles.rightSide}>
                    <Text style={[styles.amountText, { color }]}>
                        {`${getSymbolForTransaction(item.type)}$${item.amount.toFixed(2)}`}
                    </Text>
                    {isTopUp && (
                        <View style={[
                            styles.statusPill,
                            { backgroundColor: isPending ? '#FEF3C7' : `${Colors.secondaryColor}20` }
                        ]}>
                            <View style={[
                                styles.statusDot,
                                { backgroundColor: isPending ? '#F59E0B' : Colors.secondaryColor }
                            ]} />
                            <Text style={[
                                styles.statusText,
                                { color: isPending ? '#F59E0B' : Colors.secondaryColor }
                            ]}>
                                {textStatus(item.status)}
                            </Text>
                        </View>
                    )}
                </View>

                <Ionicons name="chevron-forward" size={14} color="#D1D5DB" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
        );
    }, [handleTransactionPress, t]);

    if (isLoading) return <Loading />;

    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                <BalanceCard amount={Number(userWalletBalance?.balance) || 0} currency={userWalletBalance?.currency ?? '$'} />

                <View style={styles.listSection}>
                    <View style={styles.listHeader}>
                        <TextTranslation textKey="wallet.transactionHistory" fontSize={FontSize.medium} isBold />
                    </View>

                    <FlatList
                        data={meTransaction ?? []}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
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
};

export default WalletScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    listSection: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    listHeader: {
        marginBottom: 14,
    },
    listContent: {
        paddingBottom: 100,
        flexGrow: 1,
    },
    // Transaction card
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    details: {
        flex: 1,
    },
    typeLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    dateText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    rightSide: {
        alignItems: 'flex-end',
        gap: 4,
    },
    amountText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        gap: 4,
    },
    statusDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
    },
    statusText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnRegular,
        textTransform: 'capitalize',
    },
    // Empty state
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
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
    // Footer loader
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
