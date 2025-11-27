import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStation } from '@/hooks/useStation';
import useStoreLocation from '@/store/useStoreLocation';
import { Content } from '@/types';
import { navigate, goBack } from '@/navigation/NavigationService';
import BaseComponent from '@/components/BaseComponent';

const MapScreen = () => {
    const mapRef = useRef<MapView>(null);
    const { getStation, stationData, isLoading } = useStation();
    const { currentLocation } = useStoreLocation();
    const [selectedStation, setSelectedStation] = useState<Content | null>(null);
    const [region, setRegion] = useState<Region>({
        latitude: 11.5564,
        longitude: 104.9282,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });

    useEffect(() => {
        getStation();
    }, []);

    useEffect(() => {
        if (currentLocation) {
            setRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: currentLocation.latitudeDelta || 0.1,
                longitudeDelta: currentLocation.longitudeDelta || 0.1,
            });
        }
    }, [currentLocation]);

    const handleMarkerPress = (station: Content) => {
        setSelectedStation(station);
        // Animate to the selected marker
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: parseFloat(station.latitude),
                longitude: parseFloat(station.longitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 500);
        }
    };

    const handleMyLocation = () => {
        if (currentLocation && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 500);
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`;
    };

    const renderStationCard = () => {
        if (!selectedStation) return null;

        const totalConnectors = selectedStation.chargers.reduce((total, charger) => 
            total + (charger.connector?.length || 0), 0
        );
        
        const availableConnectors = selectedStation.chargers.reduce((available, charger) => {
            const availableInCharger = charger.connector?.filter(
                conn => conn.status === 'AVAILABLE' || conn.status === 'PREPARING'
            ).length || 0;
            return available + availableInCharger;
        }, 0);

        let distance = 'N/A';
        if (currentLocation) {
            distance = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                parseFloat(selectedStation.latitude),
                parseFloat(selectedStation.longitude)
            );
        }

        return (
            <View style={styles.stationCard}>
                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setSelectedStation(null)}
                >
                    <Ionicons name="close" size={20} color={Colors.mainColor} />
                </TouchableOpacity>

                <View style={styles.cardContent}>
                    <Image 
                        source={{ uri: selectedStation.image }} 
                        style={styles.stationImage} 
                        resizeMode="cover"
                    />
                    
                    <View style={styles.stationInfo}>
                        <Text style={styles.stationName} numberOfLines={1}>
                            {selectedStation.name}
                        </Text>
                        
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={14} color="#6B7280" />
                            <Text style={styles.locationText} numberOfLines={1}>
                                {selectedStation.address}
                            </Text>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statBadge}>
                                <MaterialCommunityIcons name="ev-plug-type2" size={16} color={Colors.mainColor} />
                                <Text style={styles.statText}>
                                    {availableConnectors}/{totalConnectors}
                                </Text>
                            </View>
                            
                            <View style={styles.statBadge}>
                                <Ionicons name="navigate-outline" size={16} color={Colors.secondaryColor} />
                                <Text style={styles.statText}>{distance}</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.detailButton}
                            onPress={() => navigate('StationDetail', { stationId: selectedStation.id })}
                        >
                            <Text style={styles.detailButtonText}>View Details</Text>
                            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.mainColor} />
            </View>
        );
    }

    return (
        <BaseComponent isBack={true} title="">
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={true}
                toolbarEnabled={false}
            >
                {stationData.map((station) => (
                    <Marker
                        key={station.id}
                        coordinate={{
                            latitude: parseFloat(station.latitude),
                            longitude: parseFloat(station.longitude),
                        }}
                        onPress={() => handleMarkerPress(station)}
                    >
                        <View style={[
                            styles.markerContainer,
                            selectedStation?.id === station.id && styles.markerContainerSelected
                        ]}>
                            <MaterialCommunityIcons 
                                name="ev-station" 
                                size={24} 
                                color={selectedStation?.id === station.id ? Colors.secondaryColor : Colors.white} 
                            />
                        </View>
                    </Marker>
                ))}
            </MapView>
            {renderStationCard()}
        </BaseComponent>
    );
};

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    map: {
        flex: 1,
    },
    markerContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    markerContainerSelected: {
        backgroundColor: Colors.primaryColor,
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 4,
    },
    myLocationButton: {
        position: 'absolute',
        bottom: 180,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    stationCard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: Colors.white,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
    },
    stationImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
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
        fontWeight: '700',
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
        gap: 8,
        marginBottom: 8,
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
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 6,
    },
    detailButtonText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        fontWeight: '700',
    },
});
