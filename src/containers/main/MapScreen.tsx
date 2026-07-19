import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding, screenSizes } from '@/constants/GeneralConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useStation } from '@/hooks/useStation';
import useStoreLocation from '@/store/useStoreLocation';
import { Content } from '@/types';
import { navigate } from '@/navigation/NavigationService';
import BaseComponent from '@/components/BaseComponent';
import { useTranslation } from '@/hooks/useTranslation';
import StationCard from './components/StationCard';
import LanguageSelectionModal, { LanguageSelectionModalRef } from '@/components/LanguageSelectionModal';
import KhmerIcon from '@/assets/icon/kh.svg';
import EnglishIcon from '@/assets/icon/en.svg';
import ChinaIcon from '@/assets/icon/china.svg';
import VietnameseIcon from '@/assets/icon/vn.svg';

const LIST_ITEM_WIDTH = screenSizes.width * 0.9 + 12;

const isStationAvailable = (station: Content): boolean =>
    station.chargers?.some(charger =>
        charger.connector?.some(conn => conn.status === 'AVAILABLE' || conn.status === 'PREPARING')
    ) ?? false;

const MapScreen = () => {
    const mapRef = useRef<MapView>(null);
    const listRef = useRef<FlatList>(null);
    const justPressedMarkerRef = useRef(false);
    const languageModalRef = useRef<LanguageSelectionModalRef>(null);
    const { getStation, stationData, isLoading } = useStation();
    const { currentLocation } = useStoreLocation();
    const { currentLanguage } = useTranslation();
    const insets = useSafeAreaInsets();
    const [selectedStation, setSelectedStation] = useState<Content | null>(null);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
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

    const displayedStations = useMemo(() => {
        return (stationData || []).filter((station) => {
            if (showAvailableOnly && !isStationAvailable(station)) return false;
            return true;
        });
    }, [stationData, showAvailableOnly]);

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
        const index = displayedStations.findIndex((s) => s.id === station.id);
        if (index >= 0 && listRef.current) {
            listRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
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

    const getItemLayout = (_: ArrayLike<Content> | null | undefined, index: number) => ({
        length: LIST_ITEM_WIDTH,
        offset: LIST_ITEM_WIDTH * index,
        index,
    });

    const renderStationItem = ({ item }: { item: Content }) => (
        <StationCard
            station={item}
            isSelected={selectedStation?.id === item.id}
            currentLocation={currentLocation}
            onPress={() => handleStationCardPress(item)}
        />
    );

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
                    onPress={() => {
                        if (justPressedMarkerRef.current) {
                            justPressedMarkerRef.current = false;
                            return;
                        }
                        setSelectedStation(null);
                    }}
                >
                    {displayedStations.map((station) => (
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
                            <Ionicons name="options-outline" size={20} color={Colors.mainColor} />
                            <View style={styles.filterDot} />
                        </TouchableOpacity>
                    </View>
                </View>

                <LanguageSelectionModal ref={languageModalRef} />

                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={handleMyLocation}
                    activeOpacity={0.8}
                >
                    <Ionicons name="locate" size={22} color={Colors.white} />
                </TouchableOpacity>

                {displayedStations?.length > 0 && (
                    <View style={styles.stationListContainer}>
                        <FlatList
                            ref={listRef}
                            data={displayedStations}
                            horizontal
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderStationItem}
                            getItemLayout={getItemLayout}
                            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                            contentContainerStyle={styles.stationListContent}
                            showsHorizontalScrollIndicator={false}
                            onScrollToIndexFailed={({ index }) => {
                                setTimeout(() => {
                                    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
                                }, 100);
                            }}
                        />
                    </View>
                )}
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
    filterDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: Colors.scanAccent,
    },
    availableChip: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: Colors.white,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    availableChipActive: {
        backgroundColor: Colors.scanAccent,
    },
    availableChipText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.scanAccent,
    },
    availableChipTextActive: {
        color: Colors.white,
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
        bottom: 260,
        right: safePadding,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    stationListContainer: {
        position: 'absolute',
        bottom: 130,
        left: 0,
        right: 0,
    },
    stationListContent: {
        paddingHorizontal: safePadding,
    },
});
