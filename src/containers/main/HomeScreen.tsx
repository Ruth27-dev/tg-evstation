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

interface EVStation {
    id: string;
    name: string;
    address: string;
    distance: string;
    availableChargers: number;
    totalChargers: number;
    price: string;
    rating: number;
    type: 'fast' | 'standard';
    imageUrl: any;
}

const HomeScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'fast' | 'standard'>('all');
    const { getMeWallet,userWalletBalance } = useWallet();
    const { getStation, stationData, isLoading } = useStation();
    const { currentLocation } = useStoreLocation();

    useEffect(()=>{
        getMeWallet();
        getStation();
    },[])

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    };

    const sortedStationData = React.useMemo(() => {
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
        
        const price = item.price || '$0.25/kWh';
        
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
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons name="ev-plug-type2" size={18} color={Colors.mainColor} />
                                </View>
                                <View>
                                    <Text style={styles.statLabel}>Chargers</Text>
                                    <Text style={styles.statValue}>
                                        <Text style={styles.statHighlight}>{availableConnectors}</Text>
                                        <Text style={styles.statTotal}>/{totalConnectors}</Text>
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={styles.statDivider} />
                            
                            <View style={styles.statItem}>
                                <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                                    <MaterialCommunityIcons name="cash" size={18} color={Colors.primaryColor} />
                                </View>
                                <View>
                                    <Text style={styles.statLabel}>Price</Text>
                                    <Text style={styles.statPrice}>{price}</Text>
                                </View>
                            </View>
                            
                            <TouchableOpacity style={styles.navigateButton}>
                                <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    if(isLoading) return <ActivityIndicator color={Colors.mainColor}/>

    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                <BalanceCard amount={Number(userWalletBalance?.balance) || 0} currency={userWalletBalance?.currency ?? '$'} />

                <View style={styles.stationsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {sortedStationData.length} {sortedStationData.length === 1 ? 'Station' : 'Stations'} Nearby
                        </Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('MapScreen')}>
                            <Text style={styles.viewAllText}>View Map</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={sortedStationData}
                        renderItem={renderStationCard}
                        showsVerticalScrollIndicator={false}
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
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
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
    // Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        padding: 0,
    },
    // Filter Tabs
    filterContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        gap: 6,
    },
    filterTabActive: {
        backgroundColor: Colors.mainColor,
        borderColor: Colors.mainColor,
    },
    filterText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        fontWeight: '600',
    },
    filterTextActive: {
        color: Colors.white,
    },
    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    viewAllText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.secondaryColor,
        fontWeight: '600',
    },
    // Station List
    stationsList: {
        paddingBottom: 80,
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
        marginBottom: 20,
    },
    cardShadow: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden'
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    stationImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
    },
    imageOverlay: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4
    },
    typeText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        fontWeight: '700',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.white,
    },
    statusText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        fontWeight: '700',
    },
    ratingContainer: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    ratingText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        fontWeight: '700',
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
        gap: 10,
        flex: 1,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    statValue: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    statHighlight: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
        fontWeight: '700',
    },
    statTotal: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
    },
    statPrice: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.primaryColor,
        fontWeight: '700',
    },
    navigateButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
});