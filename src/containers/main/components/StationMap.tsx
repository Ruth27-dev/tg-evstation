import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '@/theme';
import { Content } from '@/types';

const isStationAvailable = (station: Content): boolean => {
    const availableConnectors = station?.chargers?.reduce((available: number, charger: any) => {
        const n = charger?.connector?.filter(
            (c: any) => c.status === 'AVAILABLE' || c.status === 'PREPARING'
        ).length || 0;
        return available + n;
    }, 0) || 0;
    return availableConnectors > 0;
};

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
        >
            {stations?.map((station) => {
                const isSelected = selectedStation?.id === station.id;
                const isAvailable = isStationAvailable(station);

                return (
                    <Marker
                        key={station.id}
                        coordinate={{
                            latitude: parseFloat(station.latitude),
                            longitude: parseFloat(station.longitude),
                        }}
                        onPress={() => onMarkerPress(station)}
                    >
                        <View style={[
                            styles.stationMarker,
                            { backgroundColor: isAvailable ? Colors.secondaryColor : Colors.dangerColor },
                            isSelected && styles.stationMarkerSelected
                        ]}>
                            <MaterialCommunityIcons
                                name="ev-station"
                                size={isSelected ? 24 : 18}
                                color={Colors.white}
                            />
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
    stationMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.white,
    },
    stationMarkerSelected: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
    },
});
