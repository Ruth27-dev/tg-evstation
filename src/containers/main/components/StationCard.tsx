import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, screenSizes } from '@/constants/GeneralConstants';
import { Content } from '@/types';
import { calculateDistance } from '@/utils';

interface StationCardProps {
    station: Content;
    isSelected: boolean;
    currentLocation: { latitude: number; longitude: number } | null;
    onPress: () => void;
}

const StationCard: React.FC<StationCardProps> = ({ 
    station, 
    isSelected, 
    currentLocation, 
    onPress 
}) => {
    // Calculate total connectors
    const totalConnectors = station.chargers.reduce((total: number, charger: any) => 
        total + (charger.connector?.length || 0), 0
    );
    
    // Calculate available connectors
    const availableConnectors = station.chargers.reduce((available: number, charger: any) => {
        const availableInCharger = charger.connector?.filter(
            (conn: any) => conn.status === 'AVAILABLE' || conn.status === 'PREPARING'
        ).length || 0;
        return available + availableInCharger;
    }, 0);

    // Calculate distance
    let distance = 'N/A';
    if (currentLocation) {
        const distanceInKm = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            parseFloat(station.latitude),
            parseFloat(station.longitude)
        );
        distance = distanceInKm < 1 
            ? `${(distanceInKm * 1000).toFixed(0)} m` 
            : `${distanceInKm.toFixed(1)} km`;
    }

    return (
        <TouchableOpacity 
            style={[
                styles.stationCard,
                isSelected && styles.stationCardSelected
            ]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <Image 
                    source={{ uri: station.image }} 
                    style={styles.stationImage} 
                    resizeMode="cover"
                />
                
                <View style={styles.stationInfo}>
                    <Text style={styles.stationName} numberOfLines={1}>
                        {station.name}
                    </Text>
                    
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                        <Text style={styles.locationText} numberOfLines={1}>
                            {station.address}
                        </Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statBadge}>
                            <MaterialCommunityIcons 
                                name="ev-plug-type2" 
                                size={16} 
                                color={Colors.mainColor} 
                            />
                            <Text style={styles.statText}>
                                {availableConnectors}/{totalConnectors}
                            </Text>
                        </View>
                        
                        <View style={styles.statBadge}>
                            <Ionicons 
                                name="navigate-outline" 
                                size={16} 
                                color={Colors.secondaryColor} 
                            />
                            <Text style={styles.statText}>{distance}</Text>
                        </View>
                    </View>

                    <View style={styles.detailButton}>
                        <Text style={styles.detailButtonText}>View Details</Text>
                        <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default StationCard;

const styles = StyleSheet.create({
    stationCard: {
        justifyContent: 'center',
        alignItems: 'center',
        width: screenSizes.width * 0.9,
        backgroundColor: Colors.white,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    stationCardSelected: {
        borderWidth: 2,
        borderColor: Colors.secondaryColor,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    cardContent: {
        flexDirection: 'row',
        padding: 10,
    },
    stationImage: {
        width: screenSizes.width * 0.25,
        height: screenSizes.width * 0.25,
        borderRadius: 10,
    },
    stationInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    stationName: {
        fontSize: FontSize.medium + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    locationText: {
        flex: 1,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    statText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '600',
    },
    detailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.mainColor,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginTop: 10,
        gap: 6,
    },
    detailButtonText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        fontWeight: '700',
    },
});
