import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import BaseComponent from "@/components/BaseComponent";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface ChargerType {
    id: string;
    type: string;
    power: string;
    available: number;
    total: number;
    price: string;
}

const StationDetailScreen = () => {
    const [isFavorite, setIsFavorite] = useState(false);
    
    // Mock data - replace with actual data from navigation params or API
    const stationData = {
        name: 'Central Station Plaza',
        image: 'https://www.khmertimeskh.com/wp-content/uploads/2025/08/IMG_7566-750x440.jpg',
        rating: 4.8,
        reviews: 124,
        address: 'Street 51, Sangkat Srah Chork, Khan Daun Penh, Phnom Penh',
        distance: '0.5 km',
        isOpen: true,
        openTime: '24/7',
        phone: '+855 12 345 678',
        chargerTypes: [
            { id: '1', type: 'CCS Type 2', power: '150 kW', available: 3, total: 5, price: '$0.25/kWh' },
            { id: '2', type: 'CHAdeMO', power: '100 kW', available: 1, total: 2, price: '$0.22/kWh' },
            { id: '3', type: 'Type 2 AC', power: '22 kW', available: 4, total: 6, price: '$0.18/kWh' },
        ],
        amenities: ['WiFi', 'Cafe', 'Restroom', 'Parking', 'ATM', 'Shopping'],
        description: 'Modern EV charging station located in the heart of Phnom Penh. Features fast charging capabilities and comfortable waiting area with amenities.',
    };

    const renderChargerType = (charger: ChargerType) => (
        <View key={charger.id} style={styles.chargerCard}>
            <View style={styles.chargerHeader}>
                <View style={styles.chargerLeft}>
                    <MaterialCommunityIcons name="ev-plug-type2" size={24} color={Colors.mainColor} />
                    <View style={styles.chargerInfo}>
                        <Text style={styles.chargerType}>{charger.type}</Text>
                        <Text style={styles.chargerPower}>{charger.power}</Text>
                    </View>
                </View>
                <View style={styles.chargerRight}>
                    <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: charger.available > 0 ? '#10B98115' : '#EF444415' }
                    ]}>
                        <Text style={[
                            styles.availabilityText,
                            { color: charger.available > 0 ? Colors.secondaryColor : '#EF4444' }
                        ]}>
                            {charger.available}/{charger.total} Available
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <BaseComponent isBack={true} title="Station Details">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Station Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: stationData.image }} style={styles.stationImage} resizeMode="cover" />
                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, { backgroundColor: stationData.isOpen ? Colors.secondaryColor : '#EF4444' }]} />
                        <Text style={styles.statusText}>{stationData.isOpen ? 'Open' : 'Closed'} • {stationData.openTime}</Text>
                    </View>
                </View>

                {/* Station Info */}
                <View style={styles.content}>
                    <View style={styles.headerSection}>
                        <Text style={styles.stationName}>{stationData.name}</Text>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                            <View style={styles.actionIconContainer}>
                                <Ionicons name="navigate" size={20} color={Colors.mainColor} />
                            </View>
                            <Text style={styles.actionText}>Navigate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                            <View style={styles.actionIconContainer}>
                                <Ionicons name="call" size={20} color={Colors.mainColor} />
                            </View>
                            <Text style={styles.actionText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                            <View style={styles.actionIconContainer}>
                                <MaterialIcons name="report" size={20} color={Colors.mainColor} />
                            </View>
                            <Text style={styles.actionText}>Report</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Location Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <View style={[styles.locationCard,{alignItems:'center'}]}>
                            <Ionicons name="location" size={20} color={Colors.mainColor} />
                            <Text style={styles.addressText}>{stationData.address}</Text>
                        </View>
                    </View>

                    {/* Charger Types */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Available Chargers</Text>
                        {stationData.chargerTypes.map(renderChargerType)}
                    </View>

                    {/* Start Charging Button */}
                    <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="lightning-bolt" size={24} color={Colors.white} />
                        <Text style={styles.startButtonText}>Start Charging</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </BaseComponent>
    )
}

export default StationDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 250,
    },
    stationImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    content: {
        padding: safePadding,
    },
    headerSection: {
        marginBottom: safePadding,
    },
    stationName: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ratingText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    reviewsText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    distanceText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
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
        borderRadius: 28,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 12,
    },
    locationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 10,
        gap: 12,
    },
    addressText: {
        flex: 1,
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        lineHeight: 22,
    },
    chargerCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
    },
    chargerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chargerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    chargerInfo: {
        flex: 1,
    },
    chargerType: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 2,
    },
    chargerPower: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    chargerRight: {
        alignItems: 'flex-end',
        gap: 6,
    },
    availabilityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    availabilityText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
    },
    chargerPrice: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    amenityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6
    },
    amenityText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    descriptionText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        lineHeight: 22,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    contactText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.mainColor,
        paddingVertical: 18,
        borderRadius: 10,
        gap: 12,
        marginTop: 8,
        marginBottom: 40
    },
    startButtonText: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white
    },
});