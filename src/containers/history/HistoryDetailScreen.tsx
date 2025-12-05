import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BaseComponent from "@/components/BaseComponent";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { History } from "@/types";
import moment from "moment";

const HistoryDetailScreen = ({ route }: any) => {

    const sessionData: History = route?.params?.session;
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return { bg: '#10B98115', color: Colors.secondaryColor, icon: 'checkmark-circle' };
            case 'CHARGING':
                return { bg: '#3B82F615', color: '#3B82F6', icon: 'sync' };
            case 'FAILED':
                return { bg: '#EF444415', color: '#EF4444', icon: 'close-circle' };
            default:
                return { bg: '#9CA3AF15', color: '#6B7280', icon: 'information-circle' };
        }
    };

    const formatDate = (dateString: Date | string) => {
        return moment.utc(dateString).local().format("dddd, MMMM D, YYYY");
    };

    const formatTime = (dateString: Date | string) => {
        return moment.utc(dateString).local().format("hh:mm A");
    };

    const calculateDuration = () => {
        const start = new Date(sessionData?.started_at);
        const end = new Date(sessionData?.last_update_at);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    const statusColors = getStatusColor(sessionData?.status);

    return (
        <BaseComponent isBack={true} title="Charging Details">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.statusCard}>
                    <View style={[styles.statusIconContainer, { backgroundColor: statusColors.bg }]}>
                        <Ionicons name={statusColors.icon as any} size={48} color={statusColors.color} />
                    </View>
                    <Text style={styles.statusTitle}>{sessionData?.status}</Text>
                    <View style={styles.sessionIdContainer}>
                        <Text style={styles.sessionIdLabel}>Session ID</Text>
                        <Text style={styles.sessionIdValue}>#{sessionData?.session_id.slice(0, 8)}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Session Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <Ionicons name="calendar-outline" size={20} color={Colors.mainColor} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Date</Text>
                                <Text style={styles.infoValue}>{formatDate(sessionData?.started_at)}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.timelineContainer}>
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineDot} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineLabel}>Started</Text>
                                    <Text style={styles.timelineValue}>{formatTime(sessionData?.started_at)}</Text>
                                </View>
                            </View>
                            <View style={styles.timelineLine} />
                            <View style={styles.timelineItem}>
                                <View style={[styles.timelineDot, styles.timelineDotEnd]} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineLabel}>Last Update</Text>
                                    <Text style={styles.timelineValue}>{formatTime(sessionData?.last_update_at)}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.mainColor} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Duration</Text>
                                <Text style={styles.infoValue}>{calculateDuration()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Energy & Battery</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.energyHeader}>
                            <MaterialCommunityIcons name="lightning-bolt" size={32} color={Colors.secondaryColor} />
                            <View style={styles.energyInfo}>
                                <Text style={styles.energyLabel}>Energy Charged</Text>
                                <Text style={styles.energyValue}>{sessionData?.energy_kwh.toFixed(2)} kWh</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.batteryContainer}>
                            <View style={styles.batteryItem}>
                                <MaterialCommunityIcons name="battery-charging" size={30} color={Colors.mainColor} />
                                <Text style={styles.batteryLabel}>Current Battery</Text>
                                <Text style={styles.batteryValue}>{sessionData?.current_soc}%</Text>
                            </View>
                        </View>
                        {sessionData?.minutes_remaining && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <View style={styles.infoIconContainer}>
                                        <MaterialCommunityIcons name="timer-outline" size={20} color={Colors.mainColor} />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Time Remaining</Text>
                                        <Text style={styles.infoValue}>{sessionData?.minutes_remaining} minutes</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cost Summary</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>Energy Charged</Text>
                            <Text style={styles.costValue}>{sessionData?.energy_kwh.toFixed(2)} kWh</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.totalCostRow}>
                            <View>
                                <Text style={styles.totalCostLabel}>Total Cost</Text>
                                <Text style={styles.totalCostSubtext}>Amount charged so far</Text>
                            </View>
                            <Text style={styles.totalCostValue}>${sessionData?.price_so_far.toFixed(2)}</Text>
                        </View>
                        {sessionData?.max_amount_cents && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.costRow}>
                                    <Text style={styles.costLabel}>Max Amount</Text>
                                    <Text style={styles.costValue}>${(sessionData?.max_amount_cents / 100).toFixed(2)}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
                <View style={{ height: 40 }} />
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
        marginBottom: 24,
        padding: safePadding,
        borderRadius: 10,
        alignItems: 'center'
    },
    statusIconContainer: {
        width: 60,
        height: 60,
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
        marginBottom: 20
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#F9FAFB',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    batteryItem: {
        alignItems: 'center',
        gap: 8,
    },
    batteryLabel: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        marginTop: 4,
    },
    batteryValue: {
        fontSize: FontSize.large + 4,
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
    totalCostSubtext: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginTop: 2,
    },
    totalCostValue: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 14,
        borderRadius: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.mainColor,
    },
    actionButtonText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
});