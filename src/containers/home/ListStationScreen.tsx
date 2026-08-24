import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Text, TextInput, ActivityIndicator, Linking } from "react-native";
import MapView from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import BaseComponent from "@/components/BaseComponent";
import { Content } from "@/types";
import useStoreLocation from "@/store/useStoreLocation";
import useLocationPermission, { FRESH_LOCATION_TTL_MS } from "@/hooks/useLocationPermission";
import { useStation } from "@/hooks/useStation";
import { useStationSorting } from "../main/hooks/useStationSorting";
import { useMapCamera } from "../main/hooks/useMapCamera";
import StationMap from "../main/components/StationMap";
import StationList from "../main/components/StationList";
import StationCard from "../main/components/StationCard";
import { navigate } from "@/navigation/NavigationService";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalToast } from "@/components/ToastProvider";
import EnableLocationModal from "@/components/EnableLocationModal";
import { useStationStore } from "@/store/useStationStore";

const ListStationScreen = () => {
    const mapRef = useRef<MapView>(null!);
    const { currentLocation } = useStoreLocation();
    const { permissionStatus, isFetchingLocation, refreshLocation } = useLocationPermission();
    const { centerOnUserOnce, animateToCoordinate, zoomIn, zoomOut } = useMapCamera(mapRef);
    const { getStation, stationData, isLoading } = useStation();
    const { setSelectedStation, selectedStation } = useStationStore();
    const { t } = useTranslation();
    const { showToast } = useGlobalToast();
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [showEnableLocationModal, setShowEnableLocationModal] = useState(false);

    useEffect(() => {
        getStation();
    }, []);

    // Center on the user once when the map view first has a location — never fight the user's own panning/zooming afterwards.
    useEffect(() => {
        if (viewMode === 'map' && currentLocation) {
            centerOnUserOnce(currentLocation.latitude, currentLocation.longitude);
        }
    }, [viewMode, currentLocation, centerOnUserOnce]);

    const sortedStations = useStationSorting({
        stations: stationData || [],
        currentLocation,
    });

    const filteredStations = useMemo(() => {
        if (!searchQuery.trim()) return sortedStations;
        const q = searchQuery.toLowerCase();
        return sortedStations.filter(
            s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
        );
    }, [sortedStations, searchQuery]);

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

    const handleMyLocation = useCallback(async () => {
        if (isLocating) return; // guard rapid repeated taps

        if (permissionStatus === 'blocked') {
            setShowEnableLocationModal(true);
            return;
        }

        const isReliable = !!currentLocation?.timestamp &&
            Date.now() - currentLocation.timestamp < FRESH_LOCATION_TTL_MS;

        if (isReliable && currentLocation) {
            animateToCoordinate(currentLocation.latitude, currentLocation.longitude);
            return;
        }

        setIsLocating(true);
        try {
            await refreshLocation();
            const { currentLocation: updated, locationError: freshError } = useStoreLocation.getState();
            if (updated) {
                animateToCoordinate(updated.latitude, updated.longitude);
            }
            if (freshError) {
                showToast(t('location.unableToRetrieve'), 'error');
            }
        } finally {
            setIsLocating(false);
        }
    }, [currentLocation, isLocating, permissionStatus, refreshLocation, animateToCoordinate, showToast, t]);

    const handleOpenLocationSettings = useCallback(() => {
        setShowEnableLocationModal(false);
        Linking.openSettings();
    }, []);

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

    if (isLoading) {
        return (
            <BaseComponent isBack={true} title={t('common.findStation')}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.mainColor} />
                </View>
            </BaseComponent>
        );
    }

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
                        <EnableLocationModal
                            visible={showEnableLocationModal}
                            onCancel={() => setShowEnableLocationModal(false)}
                            onEnable={handleOpenLocationSettings}
                        />
                        <View style={styles.zoomControls}>
                            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn} activeOpacity={0.8}>
                                <Ionicons name="add" size={22} color={Colors.mainColor} />
                            </TouchableOpacity>
                            <View style={styles.zoomDivider} />
                            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut} activeOpacity={0.8}>
                                <Ionicons name="remove" size={22} color={Colors.mainColor} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.myLocationButton}
                            onPress={handleMyLocation}
                            disabled={isLocating}
                        >
                            {isLocating || isFetchingLocation ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <Ionicons name="locate" size={22} color={Colors.white} />
                            )}
                        </TouchableOpacity>
                        <StationList
                            stations={sortedStations}
                            selectedStation={selectedStation}
                            currentLocation={currentLocation}
                            onStationPress={handleStationPress}
                        />
                        <View style={[styles.toggle, styles.toggleFloating]}>
                            <TouchableOpacity style={styles.toggleBtn} onPress={() => setViewMode('list')}>
                                <Ionicons name="list" size={16} color={Colors.mainColor} />
                                <Text style={styles.toggleBtnText}>{t('common.listView')}</Text>
                            </TouchableOpacity>
                            <View style={[styles.toggleBtn, styles.toggleBtnActive]}>
                                <Ionicons name="map-outline" size={16} color={Colors.white} />
                                <Text style={[styles.toggleBtnText, styles.toggleBtnTextActive]}>{t('common.mapView')}</Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Search bar */}
                        <View style={styles.searchBar}>
                            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder={t('common.searchStation')}
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                returnKeyType="search"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Count + toggle row */}
                        <View style={styles.countRow}>
                            <Text style={styles.countText}>
                                {filteredStations.length}{' '}
                                <Text style={styles.countLabel}>
                                    {t('common.stationsFound')}
                                </Text>
                            </Text>
                            <View style={styles.toggle}>
                                <TouchableOpacity style={[styles.toggleBtn, styles.toggleBtnActive]}>
                                    <Ionicons name="list" size={15} color={Colors.white} />
                                    <Text style={[styles.toggleBtnText, styles.toggleBtnTextActive]}>{t('common.listView')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.toggleBtn} onPress={() => setViewMode('map')}>
                                    <Ionicons name="map-outline" size={15} color="#6B7280" />
                                    <Text style={styles.toggleBtnText}>{t('common.mapView')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={filteredStations}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.listContent}
                            renderItem={renderListItem}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                )}
            </View>
        </BaseComponent>
    );
};

export default ListStationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginHorizontal: safePadding,
        marginTop: 14,
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        padding: 0,
        height: 30,
    },
    countRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: safePadding,
        marginBottom: 14,
    },
    countText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    countLabel: {
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    toggle: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 999,
        padding: 3,
        gap: 2,
    },
    toggleFloating: {
        position: 'absolute',
        top: 12,
        alignSelf: 'center',
        zIndex: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },
    toggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
        gap: 5,
    },
    toggleBtnActive: {
        backgroundColor: Colors.mainColor,
    },
    toggleBtnText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    toggleBtnTextActive: {
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
    listContent: {
        paddingHorizontal: safePadding,
        paddingBottom: 100,
    },
    myLocationButton: {
        position: 'absolute',
        bottom: 310,
        right: safePadding,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    zoomControls: {
        position: 'absolute',
        bottom: 370,
        right: safePadding,
        borderRadius: 12,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        overflow: 'hidden',
    },
    zoomButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E5E7EB',
    },
});
