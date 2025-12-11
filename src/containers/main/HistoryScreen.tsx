import React, { useCallback, useEffect, useState } from "react";
import BaseComponent from "@/components/BaseComponent";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, Images, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate } from "@/navigation/NavigationService";
import { useHistory } from "@/hooks/useHistory";
import { History } from "@/types";
import NoData from "@/components/NoData";
import moment from "moment";
import Loading from "@/components/Loading";

const HistoryScreen = () => {
    const { getChargerHistory , chargerHistoryData,isLoading,isLoadMoreLoading} = useHistory();
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    useEffect(() => {
        getChargerHistory(1);
    },[])
    
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                getChargerHistory(1),
            ]);
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    }, [getChargerHistory]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return { bg: '#10B98115', color: Colors.secondaryColor };
            case 'CHARGING':
                return { bg: '#3B82F615', color: '#3B82F6' };
            case 'FAILED':
                return { bg: '#EF444415', color: '#EF4444' };
            default:
                return { bg: '#9CA3AF15', color: '#6B7280' };
        }
    };

    const formatDate = (dateString: Date | string) => {
        return moment.utc(dateString).local().format("MMM D, YYYY");
    };

    const formatTime = (dateString: Date | string) => {
        return moment.utc(dateString).local().format("hh:mm A");
    };
     const loadMore = useCallback(async () => {
            if (isLoadMoreLoading || !hasMore) return;
            const nextPage = currentPage + 1;
            try {
                const result = await getChargerHistory(nextPage);
                if (result.isLastPage || result.content.length === 0) {
                    setHasMore(false);
                } else {
                    setCurrentPage(nextPage);
                }
            } catch (error) {
                console.error('Load more error:', error);
                setHasMore(false);
            }
        }, [isLoadMoreLoading, hasMore, currentPage, getChargerHistory]);
    
        const renderFooter = () => {
            if (!isLoadMoreLoading) return null;
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color={Colors.mainColor} />
                    <Text style={styles.loadingText}>Loading more...</Text>
                </View>
            );
        };

    const renderHistoryCard = ({ item }: { item: History }) => {
        const statusColors = getStatusColor(item.status);
        return (
            <TouchableOpacity 
                style={styles.historyCard} 
                activeOpacity={0.7} 
                onPress={() => navigate('HistoryDetail', { session: item })}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: statusColors.bg }]}>
                            <Image source={Images.no_data} style={{width:24,height:24}}/>
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={styles.sessionId}>Session #{item.session_id.slice(0, 8)}</Text>
                            <View style={styles.dateRow}>
                                <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                                <Text style={styles.dateText}>{formatDate(item.started_at)}</Text>
                                <Text style={styles.timeText}>{formatTime(item.started_at)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                        <Text style={[styles.statusText, { color: statusColors.color }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.mainColor} />
                            <View>
                                <Text style={styles.detailLabel}>Energy</Text>
                                <Text style={styles.detailValue}>{item.energy_kwh.toFixed(2)} kWh</Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <MaterialCommunityIcons name="battery-charging" size={20} color={Colors.mainColor} />
                            <View>
                                <Text style={styles.detailLabel}>Battery</Text>
                                <Text style={styles.detailValue}>{item.current_soc}%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <MaterialCommunityIcons name="cash" size={20} color={Colors.mainColor} />
                            <View>
                                <Text style={styles.detailLabel}>Total Cost</Text>
                                <Text style={styles.detailValue}>${item.price_so_far.toFixed(2)}</Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.mainColor} />
                            <View>
                                <Text style={styles.detailLabel}>Last Update</Text>
                                <Text style={styles.detailValue}>{formatTime(item.last_update_at)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.receiptButton}>
                    <Ionicons name="receipt-outline" size={16} color={Colors.mainColor} />
                    <Text style={styles.receiptText}>View Details</Text>
                </View>
            </TouchableOpacity>
        );
    };
    if(isLoading) return <Loading />
    return (
        <BaseComponent isBack={false}>
            <FlatList
                data={chargerHistoryData ?? []}
                renderItem={renderHistoryCard}
                keyExtractor={(item, index) => `${item.session_id}-${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.mainColor]}
                        tintColor={Colors.mainColor}
                    />
                }
                ListEmptyComponent={<NoData/>}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </BaseComponent>
    );
}

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:safePadding
    },
    headerSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    summaryContainer: {
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    summaryCard: {
        flex: 1,
        padding: 10,
        borderRadius: 10
    },
    summaryCardPrimary: {
        backgroundColor: Colors.mainColor,
    },
    summaryCardSecondary: {
        backgroundColor: Colors.secondaryColor,
    },
    summaryCardTertiary: {
        backgroundColor: '#3B82F6',
    },
    summaryCardQuaternary: {
        backgroundColor: '#8B5CF6',
    },
    summaryIconContainer: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.white,
    },
    filterTextActive: {
        color: Colors.white,
    },
    listContainer: {
        paddingBottom: 90,
        paddingHorizontal: safePadding,
        paddingTop: safePadding,
    },
    historyCard: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 10,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    stationName: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    sessionId: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    timeText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    address: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
        textTransform: 'uppercase',
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 12,
    },
    dateTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateTimeText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    detailsContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    detailLabel: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    receiptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.mainColor,
        gap: 6,
    },
    receiptText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        fontWeight: '700',
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