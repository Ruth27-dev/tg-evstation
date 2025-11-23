import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
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

    const renderStationCard = ({ item }: { item: EVStation }) => (
        <TouchableOpacity style={styles.stationCard} activeOpacity={0.7} onPress={()=> navigate('StationDetail')}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.stationImage} resizeMode="cover" />
            </View>
            
            <View style={styles.stationContent}>
                <Text style={styles.stationName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="#9CA3AF" />
                    <Text style={styles.locationText} numberOfLines={1}>{item.address}</Text>
                    <View style={styles.distanceBadge}>
                        <Text style={styles.distanceText}>{item.distance}</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="ev-plug-type2" size={16} color={Colors.mainColor} />
                        <Text style={styles.statText}>
                            <Text style={styles.statHighlight}>{item.availableChargers}</Text>/{item.totalChargers}
                        </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="cash" size={16} color={Colors.mainColor} />
                        <Text style={styles.statPrice}>{item.price}</Text>
                    </View>
                    <TouchableOpacity style={styles.navigateButton}>
                        <Ionicons name="navigate" size={16} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <BaseComponent isBack={false}>
            <View style={styles.container}>
                <BalanceCard amount={balance} />
                <View style={styles.stationsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>TG EV Stations</Text>
                    </View>

                    <FlatList
                        data={stations}
                        renderItem={renderStationCard}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.stationsList}
                    />
                </View>
            </View>
        </BaseComponent>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    stationsSection: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor
    },
    viewAllText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor
    },
    stationsList: {
        paddingBottom: 80,
    },
    stationCard: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
    },
    stationImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4
    },
    typeText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        fontWeight: '700',
    },
    stationContent: {
        padding: 16,
    },
    stationName: {
        fontSize: FontSize.medium + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
        marginBottom: 10,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 6,
    },
    locationText: {
        flex: 1,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        fontWeight: '500',
    },
    distanceBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    distanceText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        gap: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        fontWeight: '600',
    },
    statHighlight: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
        fontWeight: '700',
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#E5E7EB',
    },
    statPrice: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    navigateButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
});