import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from "react-native";
import BaseComponent from "@/components/BaseComponent";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Content, Charger, Connector } from "@/types";
import { useStationStore } from "@/store/useStationStore";


const StationDetailScreen = ({ route }: any) => {
    const { selectedStation, clearStation } = useStationStore();

    // Clear station when component unmounts
    useEffect(() => {
        return () => {
            clearStation();
        };
    }, []);

    const isStationOpen = selectedStation?.status === 'ACTIVE';

    // Process chargers data
    const processedChargers: any= selectedStation?.chargers.map((charger: Charger) => {
        const availableConnectors = charger.connector.filter(
            (conn: Connector) => conn.status === 'AVAILABLE' || conn.status === 'PREPARING'
        );
        
        return {
            id: charger.id,
            model: charger.model,
            vendor: charger.vendor,
            status: charger.status,
            connectors: charger.connector,
            availableCount: availableConnectors.length,
            totalCount: charger.connector.length
        };
    });

    // Get amenities list
    const amenitiesList = [
        { key: 'wifi', label: 'WiFi', icon: 'wifi', value: selectedStation?.wifi },
        { key: 'cafe', label: 'Cafe', icon: 'cafe', value: selectedStation?.cafe },
        { key: 'restrooms', label: 'Restroom', icon: 'man', value: selectedStation?.restrooms },
        { key: 'parking_fee', label: 'Parking', icon: 'car', value: selectedStation?.parking_fee },
        { key: 'shopping', label: 'Shopping', icon: 'storefront', value: selectedStation?.shopping },
        { key: 'playground', label: 'Playground', icon: 'game-controller', value: selectedStation?.playground },
    ].filter(amenity => amenity.value);

    const handleNavigate = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedStation?.latitude},${selectedStation?.longitude}`;
        Linking.openURL(url);
    };

    const handleCall = () => {
        if (selectedStation?.phone_number) {
            Linking.openURL(`tel:${selectedStation.phone_number}`);
        }
    };

    const renderChargerType = (charger: any) => {
        const maxKw = charger.connectors.find((c:any) => c.max_kw)?.max_kw || 0;
        const chargerType = charger.connectors.find((c:any) => c.type)?.type || 'Unknown';
        
        return (
            <View key={charger.id} style={styles.chargerCard}>
                <View style={styles.chargerHeader}>
                    <View style={styles.chargerLeft}>
                        <MaterialCommunityIcons name="ev-plug-type2" size={24} color={Colors.mainColor} />
                        <View style={styles.chargerInfo}>
                            <Text style={styles.chargerType}>{charger.model}</Text>
                            <Text style={styles.chargerPower}>
                                {maxKw > 0 ? `${maxKw} kW` : chargerType} • {charger.vendor}
                            </Text>
                            <View style={[
                                styles.statusChip,
                                { backgroundColor: charger.status === 'ONLINE' ? '#10B98115' : '#9CA3AF15' }
                            ]}>
                                <Text style={[
                                    styles.statusChipText,
                                    { color: charger.status === 'ONLINE' ? Colors.secondaryColor : '#6B7280' }
                                ]}>
                                    {charger.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.chargerRight}>
                        <View style={[
                            styles.availabilityBadge,
                            { backgroundColor: charger.availableCount > 0 ? '#10B98115' : '#EF444415' }
                        ]}>
                            <Text style={[
                                styles.availabilityText,
                                { color: charger.availableCount > 0 ? Colors.secondaryColor : '#EF4444' }
                            ]}>
                                {charger.availableCount}/{charger.totalCount} Available
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <BaseComponent isBack={true} title="Station Details">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Station Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: selectedStation?.image }} style={styles.stationImage} resizeMode="cover" />
                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, { backgroundColor: isStationOpen ? Colors.secondaryColor : '#EF4444' }]} />
                        <Text style={styles.statusText}>{isStationOpen ? 'Open' : 'Closed'} • 24/7</Text>
                    </View>
                </View>

                {/* Station Info */}
                <View style={styles.content}>
                    <View style={styles.headerSection}>
                        <Text style={styles.stationName}>{selectedStation?.name}</Text>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            activeOpacity={0.7}
                            onPress={handleNavigate}
                        >
                            <View style={styles.actionIconContainer}>
                                <Ionicons name="navigate" size={20} color={Colors.mainColor} />
                            </View>
                            <Text style={styles.actionText}>Navigate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            activeOpacity={0.7}
                            onPress={handleCall}
                            disabled={!selectedStation?.phone_number}
                        >
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
                            <Text style={styles.addressText}>{selectedStation?.address}</Text>
                        </View>
                    </View>

                    {/* Amenities */}
                    {amenitiesList.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Amenities</Text>
                            <View style={styles.amenitiesContainer}>
                                {amenitiesList.map((amenity) => (
                                    <View key={amenity.key} style={styles.amenityChip}>
                                        <Ionicons name={amenity.icon as any} size={16} color={Colors.mainColor} />
                                        <Text style={styles.amenityText}>{amenity.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Charger Types */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Available Chargers</Text>
                        {processedChargers.map(renderChargerType)}
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
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusChip: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    statusChipText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnBold,
        textTransform: 'uppercase',
    },
});