import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme';
import { safePadding } from '@/constants/GeneralConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useStation } from '@/hooks/useStation';
import useStoreLocation from '@/store/useStoreLocation';
import useLocationPermission, { FRESH_LOCATION_TTL_MS } from '@/hooks/useLocationPermission';
import { useMapCamera, MIN_ZOOM, MAX_ZOOM } from './hooks/useMapCamera';
import { Content } from '@/types';
import { navigate } from '@/navigation/NavigationService';
import BaseComponent from '@/components/BaseComponent';
import { useTranslation } from '@/hooks/useTranslation';
import { useGlobalToast } from '@/components/ToastProvider';
import EnableLocationModal from '@/components/EnableLocationModal';
import LanguageSelectionModal, { LanguageSelectionModalRef } from '@/components/LanguageSelectionModal';
import StationBottomSheet, { StationBottomSheetRef, StationCategory, PEEK_HEIGHT } from './components/StationBottomSheet';
import { useStationSorting } from './hooks/useStationSorting';
import {
    getStationMarkerColor,
    MARKER_ICON,
    stationHasAvailableConnector,
    stationHasDcFastConnector,
    stationHasAcConnector,
    stationHasFreeParking,
} from './utils/stationMarker';
import KhmerIcon from '@/assets/icon/kh.svg';
import EnglishIcon from '@/assets/icon/en.svg';
import ChinaIcon from '@/assets/icon/china.svg';
import VietnameseIcon from '@/assets/icon/vn.svg';

const isStationAvailable = (station: Content): boolean =>
    station.chargers?.some(charger =>
        charger.connector?.some(conn => conn.status === 'AVAILABLE' || conn.status === 'PREPARING')
    ) ?? false;

const MapScreen = () => {
    const mapRef = useRef<MapView>(null);
    const sheetRef = useRef<StationBottomSheetRef>(null);
    const justPressedMarkerRef = useRef(false);
    const languageModalRef = useRef<LanguageSelectionModalRef>(null);
    const { getStation, stationData, isLoading } = useStation();
    const { currentLocation } = useStoreLocation();
    const { permissionStatus, isFetchingLocation, refreshLocation } = useLocationPermission();
    const { centerOnUserOnce, animateToCoordinate, zoomIn, zoomOut } = useMapCamera(mapRef);
    const { currentLanguage, t } = useTranslation();
    const { showToast } = useGlobalToast();
    const insets = useSafeAreaInsets();
    const [selectedStation, setSelectedStation] = useState<Content | null>(null);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [activeCategory, setActiveCategory] = useState<StationCategory>('all');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [showEnableLocationModal, setShowEnableLocationModal] = useState(false);
    // Seeds the map's mount-only `initialRegion` — intentionally computed once, since
    // react-native-maps ignores changes to that prop after the first render.
    const region = useMemo<Region>(() => ({
        latitude: currentLocation?.latitude ?? 11.5564,
        longitude: currentLocation?.longitude ?? 104.9282,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    useEffect(() => {
        getStation();
    }, []);

    // Camera never auto-follows currentLocation after this — center once, then let the user explore freely.
    useEffect(() => {
        if (currentLocation) {
            centerOnUserOnce(currentLocation.latitude, currentLocation.longitude);
        }
    }, [currentLocation, centerOnUserOnce]);

    const displayedStations = useMemo(() => {
        return (stationData || []).filter((station) => {
            if (showAvailableOnly && !isStationAvailable(station)) return false;
            return true;
        });
    }, [stationData, showAvailableOnly]);

    const sortedStations = useStationSorting({
        stations: displayedStations,
        currentLocation,
    });

    const finalStations = useMemo(() => {
        switch (activeCategory) {
            case 'available':
                return sortedStations.filter(stationHasAvailableConnector);
            case 'dcFast':
                return sortedStations.filter(stationHasDcFastConnector);
            case 'ac':
                return sortedStations.filter(stationHasAcConnector);
            case 'freeParking':
                return sortedStations.filter(stationHasFreeParking);
            default:
                return sortedStations;
        }
    }, [sortedStations, activeCategory]);

    const handleMarkerPress = (station: Content) => {
        justPressedMarkerRef.current = true;
        setSelectedStation(station);
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: parseFloat(station.latitude),
                longitude: parseFloat(station.longitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 500);
        }
        sheetRef.current?.scrollToStation(station.id);
    };

    const handleLocatePress = (station: Content) => {
        setSelectedStation(station);
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: parseFloat(station.latitude),
                longitude: parseFloat(station.longitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 500);
        }
        sheetRef.current?.collapse();
    };

    const handleMyLocation = async () => {
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
    };

    const handleOpenLocationSettings = () => {
        setShowEnableLocationModal(false);
        Linking.openSettings();
    };

    const handleStationCardPress = (station: Content) => {
        setSelectedStation(station);
        navigate('StationDetail', { stationId: station.id });
    };

    const handleChangeLanguage = () => {
        languageModalRef.current?.showModal();
    };

    const handleCustomerSupport = () => {
        navigate('CustomerSupportScreen');
    };

    const handleNotifications = () => {
        navigate('Notification');
    };

    const getLanguageIcon = () => {
        switch (currentLanguage) {
            case 'kh':
                return <KhmerIcon width={26} height={26} />;
            case 'zh':
                return <ChinaIcon width={26} height={26} />;
            case 'vn':
                return <VietnameseIcon width={26} height={26} />;
            default:
                return <EnglishIcon width={26} height={26} />;
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.mainColor} />
            </View>
        );
    }

    return (
        <BaseComponent isBack={false} hideHeader>
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={region}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    showsCompass={true}
                    toolbarEnabled={false}
                    minZoomLevel={MIN_ZOOM}
                    maxZoomLevel={MAX_ZOOM}
                    onPress={() => {
                        if (justPressedMarkerRef.current) {
                            justPressedMarkerRef.current = false;
                            return;
                        }
                        setSelectedStation(null);
                    }}
                >
                    {finalStations.map((station) => {
                        const isSelected = selectedStation?.id === station.id;
                        const markerColor = getStationMarkerColor(station);
                        return (
                            <Marker
                                key={station.id}
                                coordinate={{
                                    latitude: parseFloat(station.latitude),
                                    longitude: parseFloat(station.longitude),
                                }}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleMarkerPress(station);
                                }}
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

                <View style={[styles.topOverlay, { paddingTop: insets.top + 12 }]}>
                    <View style={styles.searchRow}>
                        <TouchableOpacity style={styles.languageButton} activeOpacity={0.8} onPress={handleChangeLanguage}>
                            {getLanguageIcon()}
                            <Ionicons name="chevron-down" size={18} color={Colors.mainColor} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} activeOpacity={0.8} onPress={handleCustomerSupport}>
                            <MaterialIcons name="support-agent" size={22} color={Colors.secondaryColor} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} activeOpacity={0.8} onPress={handleNotifications}>
                            <Ionicons name="notifications" size={28} color={Colors.secondaryColor} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={styles.filterButton} activeOpacity={0.8} onPress={() => navigate('ListStation')}>
                            <Ionicons name="funnel-outline" size={19} color={Colors.mainColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                <LanguageSelectionModal ref={languageModalRef} />

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
                    activeOpacity={0.8}
                    disabled={isLocating}
                >
                    {isLocating || isFetchingLocation ? (
                        <ActivityIndicator size="small" color={Colors.mainColor} />
                    ) : (
                        <Ionicons name="locate-outline" size={22} color={Colors.mainColor} />
                    )}
                </TouchableOpacity>

                <StationBottomSheet
                    ref={sheetRef}
                    stations={finalStations}
                    selectedStation={selectedStation}
                    currentLocation={currentLocation}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    onStationPress={handleStationCardPress}
                    onLocatePress={handleLocatePress}
                />
            </View>
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
    map: {
        flex: 1,
    },
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: safePadding,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 46,
        paddingHorizontal: 12,
        borderRadius: 40,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    roundButton: {
        width: 46,
        height: 46,
        borderRadius: 40,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    filterButton: {
        width: 46,
        height: 46,
        borderRadius: 40,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    rightActions: {
        position: 'absolute',
        right: safePadding,
        gap: 12,
    },
    roundActionButton: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
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
    myLocationButton: {
        position: 'absolute',
        bottom: PEEK_HEIGHT + 20,
        right: safePadding,
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    zoomControls: {
        position: 'absolute',
        bottom: PEEK_HEIGHT + 80,
        right: safePadding,
        borderRadius: 12,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    zoomButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E5E7EB',
    },
});
