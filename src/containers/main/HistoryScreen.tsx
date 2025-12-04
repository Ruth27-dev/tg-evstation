import BaseComponent from "@/components/BaseComponent";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate } from "@/navigation/NavigationService";
import { useHistory } from "@/hooks/useHistory";
import { History } from "@/types";


const HistoryScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'failed'>('all');
    const { getChargerHistory , chargerHistoryData,isLoading,isLoadMoreLoading} = useHistory();

    useEffect(() => {
        getChargerHistory(1);
    },[])

    const filteredData = chargerHistoryData?.filter(item => {
        if (selectedFilter === 'all') return true;
        return item.status === selectedFilter;
    });

    // Calculate totals
    // const calculateTotals = () => {
    //     const completedSessions = chargerHistoryData?.filter(item => item.status === 'completed');
        
    //     const totalEnergy = completedSessions?.reduce((sum, item) => {
    //         return sum + parseFloat(item.energyCharged.replace(' kWh', ''));
    //     }, 0);

    //     const totalCost = completedSessions?.reduce((sum, item) => {
    //         return sum + parseFloat(item.cost.replace('$', ''));
    //     }, 0);

    //     const totalMinutes = completedSessions?.reduce((sum, item) => {
    //         const duration = item.duration;
    //         const hours = duration.includes('h') ? parseInt(duration.split('h')[0]) : 0;
    //         const minutes = duration.includes('m') ? parseInt(duration.split('h')[1]?.replace('m', '') || duration.replace('m', '')) : 0;
    //         return sum + (hours * 60) + minutes;
    //     }, 0);

    //     const totalHours = Math.floor(totalMinutes / 60);
    //     const remainingMinutes = totalMinutes % 60;

    //     return {
    //         totalEnergy: totalEnergy.toFixed(1),
    //         totalCost: totalCost.toFixed(2),
    //         totalDuration: `${totalHours}h ${remainingMinutes}m`,
    //         chargingSessions: completedSessions.length
    //     };
    // };

    // const totals = calculateTotals();

    const renderHistoryCard = ({ item }: { item: History }) => (
        <TouchableOpacity style={styles.historyCard} activeOpacity={0.7} onPress={()=>navigate('HistoryDetail')}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <View style={[
                        styles.iconContainer, 
                        { backgroundColor: item.chargerType === 'fast' ? '#10B98115' : '#3B82F615' }
                    ]}>
                        <MaterialCommunityIcons 
                            name={item.chargerType === 'fast' ? 'lightning-bolt' : 'ev-station'} 
                            size={20} 
                            color={item.chargerType === 'fast' ? Colors.secondaryColor : '#3B82F6'} 
                        />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.stationName}>{item.stationName}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                            <Text style={styles.address}>{item.address}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Date & Time */}
            <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeRow}>
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text style={styles.dateTimeText}>{item.started_at}</Text>
                </View>
                <View style={styles.dateTimeRow}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.dateTimeText}>{item.startTime} - {item.endTime}</Text>
                </View>
                <View style={styles.dateTimeRow}>
                    <MaterialCommunityIcons name="timer-outline" size={14} color="#6B7280" />
                    <Text style={styles.dateTimeText}>{item.duration}</Text>
                </View>
            </View>

            {/* Charging Details */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="lightning-bolt" size={18} color={Colors.mainColor} />
                    <View>
                        <Text style={styles.detailLabel}>Energy Charged</Text>
                        <Text style={styles.detailValue}>{item.energyCharged}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="cash" size={18} color={Colors.mainColor} />
                    <View>
                        <Text style={styles.detailLabel}>Total Cost</Text>
                        <Text style={styles.detailValue}>{item.cost}</Text>
                    </View>
                </View>
            </View>

            {/* Receipt Button */}
            <View style={styles.receiptButton}>
                <Ionicons name="receipt-outline" size={16} color={Colors.mainColor} />
                <Text style={styles.receiptText}>View Receipt</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                {/* <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <View style={[styles.summaryCard, styles.summaryCardPrimary]}>
                            <View style={styles.summaryIconContainer}>
                                <MaterialCommunityIcons name="lightning-bolt" size={24} color={Colors.white} />
                            </View>
                            <Text style={styles.summaryLabel}>Total Energy</Text>
                            <Text style={styles.summaryValue}>{totals.totalEnergy} kWh</Text>
                        </View>
                        <View style={[styles.summaryCard, styles.summaryCardSecondary]}>
                            <View style={styles.summaryIconContainer}>
                                <MaterialCommunityIcons name="cash-multiple" size={24} color={Colors.white} />
                            </View>
                            <Text style={styles.summaryLabel}>Total Cost</Text>
                            <Text style={styles.summaryValue}>${totals.totalCost}</Text>
                        </View>
                    </View>
                    <View style={styles.summaryRow}>
                        <View style={[styles.summaryCard, styles.summaryCardTertiary]}>
                            <View style={styles.summaryIconContainer}>
                                <MaterialCommunityIcons name="clock-outline" size={24} color={Colors.white} />
                            </View>
                            <Text style={styles.summaryLabel}>Total Duration</Text>
                            <Text style={styles.summaryValue}>{totals.totalDuration}</Text>
                        </View>
                        <View style={[styles.summaryCard, styles.summaryCardQuaternary]}>
                            <View style={styles.summaryIconContainer}>
                                <MaterialCommunityIcons name="ev-station" size={24} color={Colors.white} />
                            </View>
                            <Text style={styles.summaryLabel}>Charging Times</Text>
                            <Text style={styles.summaryValue}>{totals.chargingSessions}x</Text>
                        </View>
                    </View>
                </View> */}

                <FlatList
                    data={chargerHistoryData ?? []}
                    renderItem={renderHistoryCard}
                    keyExtractor={(item:any) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="history" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No charging history</Text>
                            <Text style={styles.emptySubtext}>Your charging sessions will appear here</Text>
                        </View>
                    }
                />
            </View>
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
        paddingBottom: 70,
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
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    address: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 12,
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#D1D5DB',
        fontWeight: '500',
    },
});