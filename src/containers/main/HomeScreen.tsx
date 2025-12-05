import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from "@/theme";
import { safePadding } from "@/constants/GeneralConstants";
import BaseComponent from "@/components/BaseComponent";
import BalanceCard from "@/components/BalanceCard";
import { useWallet } from "@/hooks/useWallet";
import { useStation } from "@/hooks/useStation";
import { Content } from "@/types";
import useStoreLocation from "@/store/useStoreLocation";
import StationMap from "./components/StationMap";
import StationList from "./components/StationList";
import { useStationSorting } from "./hooks/useStationSorting";
import { useStationStore } from "@/store/useStationStore";

const HomeScreen = () => {
    const mapRef = useRef<MapView>(null!);
    const { getMeWallet, userWalletBalance } = useWallet();
    const { getStation, stationData, isLoading } = useStation();
    const { currentLocation } = useStoreLocation();
    const { setSelectedStation,selectedStation } = useStationStore();

    useEffect(() => {
        getMeWallet();
        getStation();
    }, []);

    const sortedStations = useStationSorting({ 
        stations: stationData, 
        currentLocation 
    });

    const handleMarkerPress = useCallback((station: Content) => {
        setSelectedStation(station);
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: parseFloat(station.latitude),
                longitude: parseFloat(station.longitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 500);
        }
    }, []);

    const handleMyLocation = useCallback(() => {
        if (currentLocation && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 500);
        }
    }, [currentLocation]);

    const handleStationPress = useCallback((station: Content) => {
        setSelectedStation(station);
    }, [handleMarkerPress]);

    const handleRefresh = useCallback(async () => {
        await Promise.all([
            getMeWallet(),
            getStation()
        ]);
    }, [getMeWallet, getStation]);

    if(isLoading) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Colors.mainColor} />
    </View>

    return (
       <BaseComponent isBack={false}>
            <View style={styles.topCardContainer}>
                <BalanceCard 
                    amount={Number(userWalletBalance?.balance) || 0} 
                    currency={userWalletBalance?.currency ?? '$'} 
                />
            </View>
            <StationMap
                mapRef={mapRef}
                currentLocation={currentLocation}
                stations={sortedStations}
                selectedStation={selectedStation}
                onMarkerPress={handleMarkerPress}
            />
            <TouchableOpacity 
                style={styles.myLocationButton}
                onPress={handleMyLocation}
            >
                <Ionicons name="locate" size={24} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.refreshButton}
                onPress={handleRefresh}
            >
                <Ionicons name="refresh" size={24} color={Colors.white} />
            </TouchableOpacity>
            <StationList
                stations={sortedStations}
                selectedStation={selectedStation}
                currentLocation={currentLocation}
                onStationPress={handleStationPress}
            />
       </BaseComponent>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    topCardContainer: {
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 10,
        zIndex: 1,
    },
    myLocationButton: {
        position: 'absolute',
        bottom: 310,
        right: safePadding,
        width: 40,
        height: 40,
        borderRadius: 28,
        backgroundColor: Colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    refreshButton: {
        position: 'absolute',
        bottom: 250,
        right: safePadding,
        width: 40,
        height: 40,
        borderRadius: 28,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
});