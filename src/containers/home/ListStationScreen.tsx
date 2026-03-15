import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from "react-native";
import MapView from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import BaseComponent from "@/components/BaseComponent";
import { useWallet } from "@/hooks/useWallet";
import { useStation } from "@/hooks/useStation";
import { Content } from "@/types";
import useStoreLocation from "@/store/useStoreLocation";
import { useStationStore } from "@/store/useStationStore";
import { useStationSorting } from "../main/hooks/useStationSorting";
import StationMap from "../main/components/StationMap";
import StationList from "../main/components/StationList";
import Loading from "@/components/Loading";
import StationCard from "../main/components/StationCard";
import { navigate } from "@/navigation/NavigationService";
import { useTranslation } from "@/hooks/useTranslation";

const ListStationScreen = () => {
    const mapRef = useRef<MapView>(null!);
    const didInitRef = useRef(false);
    const { getMeWallet } = useWallet();
    const { getStation, stationData, isLoading } = useStation();
    const { currentLocation } = useStoreLocation();
    const { setSelectedStation,selectedStation } = useStationStore();
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    useEffect(() => {
        if (didInitRef.current) return;
        didInitRef.current = true;
        getMeWallet();
        getStation();
    }, [getMeWallet, getStation]);

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
    }, [setSelectedStation]);

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
    }, [setSelectedStation]);

    const renderListItem = useCallback(({ item }: { item: Content }) => (
        <StationCard
            station={item}
            isSelected={selectedStation?.id === item.id}
            currentLocation={currentLocation}
            onPress={() => {
                handleStationPress(item);
                navigate('StationDetail', { stationId: item.id });
            }}
        />
    ), [currentLocation, handleStationPress, selectedStation]);

    const renderSeparator = useCallback(() => <View style={styles.listSeparator} />, []);

    const handleRefresh = useCallback(async () => {
        await Promise.all([
            getMeWallet(),
            getStation()
        ]);
    }, [getMeWallet, getStation]);

    if(isLoading) return <Loading/>

    return (
       <BaseComponent isBack={true} title={t('common.findStation')}>
            <View style={styles.container}>
                {viewMode === 'map' ? (
                    <>
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
                        <View style={[styles.toggleContainer, styles.toggleContainerMap]}>
                            <TouchableOpacity
                                style={[styles.toggleButton, styles.toggleButtonActive]}
                                onPress={() => setViewMode('list')}
                            >
                                <Text style={[styles.toggleText, styles.toggleTextActive]}>
                                    {t('common.listView')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
                                onPress={() => setViewMode('map')}
                            >
                                <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
                                    {t('common.mapView')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleButton, styles.toggleButtonActive]}
                                onPress={() => setViewMode('list')}
                            >
                                <Text style={[styles.toggleText, styles.toggleTextActive]}>
                                    {t('common.listView')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.toggleButton}
                                onPress={() => setViewMode('map')}
                            >
                                <Text style={styles.toggleText}>
                                    {t('common.mapView')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={sortedStations}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.listContent}
                            ItemSeparatorComponent={renderSeparator}
                            renderItem={renderListItem}
                        />
                    </>
                )}
            </View>
       </BaseComponent>
    );
}

export default ListStationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    toggleContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: Colors.white,
        borderRadius: 999,
        padding: 4,
        marginTop: 20,
        marginBottom: 20,
        gap: 6,
    },
    toggleContainerMap: {
        position: 'absolute',
        top: 10,
        alignSelf: 'center',
        zIndex: 20,
    },
    toggleButton: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 999,
    },
    toggleButtonActive: {
        backgroundColor: Colors.backGroundColor,
    },
    toggleText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.gray,
    },
    toggleTextActive: {
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    listContent: {
        paddingHorizontal: safePadding,
        paddingBottom: 24,
    },
    listSeparator: {
        height: 12,
    },
});
