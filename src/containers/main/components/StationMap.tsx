import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Content } from '@/types';
import { MIN_ZOOM, MAX_ZOOM } from '../hooks/useMapCamera';
import { getStationMarkerColor, MARKER_ICON } from '../utils/stationMarker';
import { Colors } from '@/theme';

interface StationMapProps {
    mapRef: React.RefObject<MapView | null>;
    currentLocation: { latitude: number; longitude: number } | null;
    stations: Content[];
    selectedStation: Content | null;
    onMarkerPress: (station: Content) => void;
}

const StationMap: React.FC<StationMapProps> = ({ 
    mapRef,
    currentLocation, 
    stations, 
    selectedStation, 
    onMarkerPress 
}) => {
    if (!currentLocation) {
        return <View style={styles.mapPlaceholder} />;
    }

    const initialRegion: Region = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
    };

    return (
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass={true}
            minZoomLevel={MIN_ZOOM}
            maxZoomLevel={MAX_ZOOM}
        >
            {stations?.map((station) => {
                const isSelected = selectedStation?.id === station.id;
                const markerColor = getStationMarkerColor(station);

                return (
                    <Marker
                        key={station.id}
                        coordinate={{
                            latitude: parseFloat(station.latitude),
                            longitude: parseFloat(station.longitude),
                        }}
                        onPress={() => onMarkerPress(station)}
                    >
                        <View style={[styles.markerHalo, { backgroundColor: `${markerColor}26` }]}>
                            <View style={[
                                styles.markerDot,
                                { backgroundColor: markerColor },
                                isSelected && styles.markerDotSelected,
                            ]}>
                                <Ionicons name={MARKER_ICON} size={isSelected ? 18 : 15} color={Colors.white} />
                            </View>
                        </View>
                    </Marker>
                );
            })}
        </MapView>
    );
};

export default StationMap;

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    mapPlaceholder: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerHalo: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerDot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    markerDotSelected: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: Colors.white,
    },
});
