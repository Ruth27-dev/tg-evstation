import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from "react-native";
import { Colors } from "@/theme";
import { Images } from "@/assets/images";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BalanceCard from "@/components/BalanceCard";
import { navigate } from "@/navigation/NavigationService";

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
    const [balance] = useState(1250.50);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'fast' | 'standard'>('all');
    const [stations] = useState<EVStation[]>([
        {
            id: '1',
            name: 'Central Station Plaza',
            address: 'Street 51, Phnom Penh',
            distance: '0.5 km',
            availableChargers: 3,
            totalChargers: 5,
            price: '$0.25/kWh',
            rating: 4.8,
            type: 'fast',
            imageUrl: "https://www.khmertimeskh.com/wp-content/uploads/2025/08/IMG_7566-750x440.jpg"
        },
        {
            id: '2',
            name: 'Riverside EV Hub',
            address: 'Sisowath Quay, Phnom Penh',
            distance: '1.2 km',
            availableChargers: 2,
            totalChargers: 4,
            price: '$0.20/kWh',
            rating: 4.6,
            type: 'standard',
            imageUrl: "https://www.khmertimeskh.com/wp-content/uploads/2025/08/IMG_7566-750x440.jpg"
        },
        {
            id: '3',
            name: 'Mall Charging Point',
            address: 'Aeon Mall, Phnom Penh',
            distance: '2.3 km',
            availableChargers: 5,
            totalChargers: 8,
            price: '$0.22/kWh',
            rating: 4.9,
            type: 'fast',
            imageUrl: "https://www.khmertimeskh.com/wp-content/uploads/2025/08/IMG_7566-750x440.jpg"
        },
        {
            id: '4',
            name: 'Airport Express Charge',
            address: 'National Road 4, Phnom Penh',
            distance: '3.8 km',
            availableChargers: 1,
            totalChargers: 3,
            price: '$0.28/kWh',
            rating: 4.5,
            type: 'fast',
            imageUrl: "https://www.khmertimeskh.com/wp-content/uploads/2025/08/IMG_7566-750x440.jpg"
        },
    ]);

    const filteredStations = stations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            station.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || station.type === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    const getAvailabilityStatus = (available: number, total: number) => {
        const percentage = (available / total) * 100;
        if (percentage >= 50) return { color: '#10B981', label: 'Available' };
        if (percentage > 0) return { color: '#F59E0B', label: 'Limited' };
        return { color: '#EF4444', label: 'Full' };
    };

    const renderStationCard = ({ item }: { item: EVStation }) => {
        const availability = getAvailabilityStatus(item.availableChargers, item.totalChargers);
        
        return (
            <TouchableOpacity 
                style={styles.stationCard} 
                activeOpacity={0.8} 
                onPress={() => navigate('StationDetail')}
            >
                <View style={styles.cardShadow}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.imageUrl }} style={styles.stationImage} resizeMode="cover" />
                        <View style={styles.imageOverlay}>
                            <View style={[styles.typeBadge, { backgroundColor: item.type === 'fast' ? Colors.secondaryColor : Colors.mainColor }]}>
                                <MaterialCommunityIcons 
                                    name={item.type === 'fast' ? "lightning-bolt" : "ev-station"} 
                                    size={14} 
                                    color={Colors.white} 
                                />
                                <Text style={styles.typeText}>
                                    {item.type === 'fast' ? 'Fast Charge' : 'Standard'}
                                </Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: availability.color }]}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>{availability.label}</Text>
                            </View>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FCD34D" />
                            <Text style={styles.ratingText}>{item.rating}</Text>
                        </View>
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
                                <Text style={styles.distanceText}>{item.distance}</Text>
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
                                        <Text style={styles.statHighlight}>{item.availableChargers}</Text>
                                        <Text style={styles.statTotal}>/{item.totalChargers}</Text>
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
                                    <Text style={styles.statPrice}>{item.price}</Text>
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

    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                <BalanceCard amount={balance} />
                <View style={styles.stationsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {filteredStations.length} {filteredStations.length === 1 ? 'Station' : 'Stations'} Nearby
                        </Text>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Text style={styles.viewAllText}>View Map</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={filteredStations}
                        renderItem={renderStationCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.stationsList}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="search" size={64} color="#D1D5DB" />
                                <Text style={styles.emptyText}>No stations found</Text>
                                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
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