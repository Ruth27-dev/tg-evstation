import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BaseComponent from "@/components/BaseComponent";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HistoryDetailScreen = () => {
    // Mock data - replace with actual data from navigation params or API
    const sessionData = {
        id: 'CH-20251120-001',
        status: 'completed' as 'completed' | 'failed',
        stationName: 'Central Station Plaza',
        stationAddress: 'Street 51, Phnom Penh',
        chargerType: 'CCS Type 2',
        chargerPower: '150 kW',
        date: 'November 20, 2025',
        startTime: '14:30',
        endTime: '15:45',
        duration: '1h 15m',
        energyCharged: '45.5 kWh',
        startBattery: '15%',
        endBattery: '85%',
        pricePerKwh: '$0.25',
        totalCost: '$11.38',
        paymentMethod: 'Credit Card •••• 4242',
        transactionId: 'TXN-2025112014301234',
    };

    return (
        <BaseComponent isBack={true} title="Charging Details">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* Station Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Station Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <MaterialCommunityIcons name="ev-station" size={20} color={Colors.mainColor} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Station</Text>
                                <Text style={styles.infoValue}>{sessionData.stationName}</Text>
                                <Text style={styles.infoSubvalue}>{sessionData.stationAddress}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Charger Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Charger Details</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <MaterialCommunityIcons name="ev-plug-type2" size={20} color={Colors.mainColor} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Charger Type</Text>
                                <Text style={styles.infoValue}>{sessionData.chargerType}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.mainColor} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Power Output</Text>
                                <Text style={styles.infoValue}>{sessionData.chargerPower}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Time & Duration */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Time & Duration</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <Ionicons name="calendar-outline" size={20} color={Colors.mainColor} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Date</Text>
                                <Text style={styles.infoValue}>{sessionData.date}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.timelineContainer}>
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineDot} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineLabel}>Start Time</Text>
                                    <Text style={styles.timelineValue}>{sessionData.startTime}</Text>
                                </View>
                            </View>
                            <View style={styles.timelineLine} />
                            <View style={styles.timelineItem}>
                                <View style={[styles.timelineDot, styles.timelineDotEnd]} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineLabel}>End Time</Text>
                                    <Text style={styles.timelineValue}>{sessionData.endTime}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Energy & Battery */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Energy & Battery</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.energyHeader}>
                            <MaterialCommunityIcons name="battery-charging" size={32} color={Colors.secondaryColor} />
                            <View style={styles.energyInfo}>
                                <Text style={styles.energyLabel}>Energy Charged</Text>
                                <Text style={styles.energyValue}>{sessionData.energyCharged}</Text>
                            </View>
                        </View>
                        <View style={styles.batteryContainer}>
                            <View style={styles.batteryItem}>
                                <Text style={styles.batteryLabel}>Start</Text>
                                <Text style={styles.batteryValue}>{sessionData.startBattery}</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />
                            <View style={styles.batteryItem}>
                                <Text style={styles.batteryLabel}>End</Text>
                                <Text style={styles.batteryValue}>{sessionData.endBattery}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>Price per kWh</Text>
                            <Text style={styles.costValue}>{sessionData.pricePerKwh}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>Energy Charged</Text>
                            <Text style={styles.costValue}>{sessionData.energyCharged}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.totalCostRow}>
                            <Text style={styles.totalCostLabel}>Total Cost</Text>
                            <Text style={styles.totalCostValue}>{sessionData.totalCost}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </BaseComponent>
    )
};

export default HistoryDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:safePadding
    },
    statusCard: {
        backgroundColor: Colors.white,
        marginTop: 20,
        marginBottom: 24,
        padding: 24,
        borderRadius: 10,
        alignItems: 'center'
    },
    statusIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusTitle: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 6,
    },
    statusSubtitle: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    sessionIdContainer: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sessionIdLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    sessionIdValue: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    section: {
        marginBottom: 35
    },
    sectionTitle: {
        fontSize: FontSize.medium + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 10
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: `${Colors.mainColor}10`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 2,
    },
    infoSubvalue: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
    },
    timelineContainer: {
        paddingLeft: 20,
        paddingVertical: 8,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.mainColor,
        borderWidth: 2,
        borderColor: `${Colors.mainColor}40`,
    },
    timelineDotEnd: {
        backgroundColor: Colors.secondaryColor,
        borderColor: `${Colors.secondaryColor}40`,
    },
    timelineLine: {
        width: 2,
        height: 30,
        backgroundColor: '#E5E7EB',
        marginLeft: 5,
        marginVertical: 4,
    },
    timelineContent: {
        flex: 1,
    },
    timelineLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    timelineValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 16,
    },
    durationText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    energyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    energyInfo: {
        flex: 1,
    },
    energyLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    energyValue: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    batteryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#F9FAFB',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    batteryItem: {
        alignItems: 'center',
    },
    batteryLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginBottom: 6,
    },
    batteryValue: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    costLabel: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    costValue: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    totalCostRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    totalCostLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    totalCostValue: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
});