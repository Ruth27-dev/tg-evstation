import BaseComponent from "@/components/BaseComponent";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, ActivityIndicator } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BalanceCard from "@/components/BalanceCard";
import { navigate } from "@/navigation/NavigationService";
import { useWallet } from "@/hooks/useWallet";
import { useStation } from "@/hooks/useStation";
import { Content } from "@/types";
import useStoreLocation from "@/store/useStoreLocation";
import { calculateDistance } from "@/utils";

const HomeScreen = () => {
    const { getMeWallet,userWalletBalance } = useWallet();
    const { getStation, stationData, isLoading } = useStation();
    const { currentLocation } = useStoreLocation();

    useEffect(()=>{
        getMeWallet();
        getStation();
    },[])

    // Sort stations by distance
    const sortedStations = React.useMemo(() => {
        if (!currentLocation || !stationData.length) return stationData;

        return [...stationData].sort((a, b) => {
            const distanceA = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                parseFloat(a.latitude),
                parseFloat(a.longitude)
            );
            const distanceB = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                parseFloat(b.latitude),
                parseFloat(b.longitude)
            );
            return distanceA - distanceB;
        });
    }, [stationData, currentLocation]);

    const renderStationCard = ({ item }: { item: Content }) => {
        const totalConnectors = item.chargers.reduce((total, charger) => 
            total + (charger.connector?.length || 0), 0
        );
        
        const availableConnectors = item.chargers.reduce((available, charger) => {
            const availableInCharger = charger.connector?.filter(
                conn => conn.status === 'AVAILABLE' || conn.status === 'PREPARING'
            ).length || 0;
            return available + availableInCharger;
        }, 0);

        let distance = 'N/A';
        if (currentLocation) {
            const distanceInKm = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                parseFloat(item.latitude),
                parseFloat(item.longitude)
            );
            distance = distanceInKm < 1 
                ? `${(distanceInKm * 1000).toFixed(0)} m` 
                : `${distanceInKm.toFixed(1)} km`;
        }
        return (
            <TouchableOpacity 
                style={styles.stationCard} 
                activeOpacity={0.8} 
                onPress={() => navigate('StationDetail', { stationId: item.id })}
            >
                <View style={styles.cardShadow}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.image }} style={styles.stationImage} resizeMode="cover" />
                    </View>
                    <View style={styles.stationContent}>
                        <View style={styles.headerRow}>
                            <View style={styles.nameContainer}>
                                <Text style={styles.stationName} numberOfLines={1}>{item.name}</Text>
                                <View style={styles.locationRow}>
                                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                                    <Text style={styles.locationText} numberOfLines={1}>{item.address}</Text>
                                </View>
                            </View>
                            <View style={styles.distanceBadge}>
                                <Ionicons name="navigate-outline" size={12} color={Colors.mainColor} />
                                <Text style={styles.distanceText}>{distance}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="ev-plug-type2" size={20} color={Colors.mainColor} />
                                <Text style={styles.statValueCompact}>
                                    <Text style={styles.statHighlight}>{availableConnectors}</Text>
                                    <Text style={styles.statTotal}>/{totalConnectors}</Text>
                                    <Text style={styles.statLabelInline}> Available</Text>
                                </Text>
                            </View>
                            
                            <TouchableOpacity style={styles.navigateButton}>
                                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    if(isLoading) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Colors.mainColor} />
    </View>

    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                <BalanceCard amount={Number(userWalletBalance?.balanceCents) || 0} currency={userWalletBalance?.currency ?? '$'} />

                <View style={styles.stationsSection}>
                    <Text style={styles.sectionTitle}>Nearby Stations</Text>
                    
                    <TouchableOpacity 
                        style={styles.mapButton} 
                        activeOpacity={0.9} 
                        onPress={() => navigate('MapScreen')}
                    >
                        <Ionicons name="map-outline" size={20} color={Colors.mainColor} />
                        <Text style={styles.mapButtonSimpleText}>View on Map</Text>
                        <Ionicons name="chevron-forward" size={18} color={Colors.mainColor} />
                    </TouchableOpacity>

                    <FlatList
                        data={sortedStations}
                        renderItem={renderStationCard}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.stationsList}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No stations found</Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </BaseComponent>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Quick Actions
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        fontWeight: '600',
    },
    // Stations Section
    stationsSection: {
        flex: 1,
        paddingHorizontal: 20,
    },
    // Section Title
    sectionTitle: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 16,
    },
    // Map Button
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom:30,
        gap: 10,
        shadowRadius: 4,
        elevation: 1,
    },
    mapButtonSimpleText: {
        flex: 1,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    // Station List
    stationsList: {
        paddingBottom: 20,
        paddingRight: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: '#9CA3AF',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#D1D5DB',
        marginTop: 8,
    },
    // Station Card
    stationCard: {
        marginRight: 16,
        width: 320,
    },
    cardShadow: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 1,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 160,
    },
    stationImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
    },
    // Card Content
    stationContent: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    nameContainer: {
        flex: 1,
        marginRight: 12,
    },
    stationName: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        flex: 1,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 4,
    },
    distanceText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 16,
    },
    // Stats Row
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    statValueCompact: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    statHighlight: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
        fontWeight: '700',
    },
    statTotal: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    statLabelInline: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    navigateButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
});