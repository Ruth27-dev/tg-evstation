import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Text, TextInput } from "react-native";
import MapView from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import BaseComponent from "@/components/BaseComponent";
import { Content } from "@/types";
import useStoreLocation from "@/store/useStoreLocation";
import { useStationStore } from "@/store/useStationStore";
import { useStationSorting } from "../main/hooks/useStationSorting";
import StationMap from "../main/components/StationMap";
import StationList from "../main/components/StationList";
import StationCard from "../main/components/StationCard";
import { navigate } from "@/navigation/NavigationService";
import { useTranslation } from "@/hooks/useTranslation";

const makeConnector = (id: string, chargerId: string, status: string, num: number) => ({
    id,
    connector_number: num,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    status,
    charger_id: chargerId,
    max_kw: null,
    type: null,
});

const makeCharger = (id: string, locationId: string, connectors: { id: string; status: string }[]) => ({
    id,
    charge_point_id: `CP-${id}`,
    created_at: new Date('2024-01-01'),
    firmware_version: '2.1.0',
    ip_address: null,
    last_heartbeat: new Date(),
    model: 'DC Fast Charger',
    serial_number: null,
    status: 'AVAILABLE',
    vendor: 'TGEVStation',
    location: '',
    location_id: locationId,
    connector: connectors.map((c, i) => makeConnector(c.id, id, c.status, i + 1)),
});

const STATIC_STATIONS: Content[] = [
    {
        id: '1',
        name: 'EV Fast Charge — City Center',
        address: '123 Norodom Blvd, Phnom Penh',
        country_code: 'KH',
        latitude: '11.5564',
        longitude: '104.9282',
        status: 'AVAILABLE',
        image: 'https://picsum.photos/seed/station1/400/300',
        restrooms: true, wifi: true, playground: false,
        parking_fee: true, cafe: true, shopping: false,
        phone_number: '+855 23 123 456',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        chargers: [
            makeCharger('c1-1', '1', [
                { id: 'con1', status: 'AVAILABLE' },
                { id: 'con2', status: 'AVAILABLE' },
            ]),
            makeCharger('c1-2', '1', [
                { id: 'con3', status: 'CHARGING' },
                { id: 'con4', status: 'AVAILABLE' },
            ]),
        ],
    },
    {
        id: '2',
        name: 'Green Power Station — BKK1',
        address: '45 Street 278, Boeung Keng Kang',
        country_code: 'KH',
        latitude: '11.5480',
        longitude: '104.9220',
        status: 'AVAILABLE',
        image: 'https://picsum.photos/seed/station2/400/300',
        restrooms: true, wifi: true, playground: true,
        parking_fee: false, cafe: false, shopping: false,
        phone_number: '+855 23 234 567',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        chargers: [
            makeCharger('c2-1', '2', [
                { id: 'con5', status: 'CHARGING' },
                { id: 'con6', status: 'CHARGING' },
            ]),
            makeCharger('c2-2', '2', [
                { id: 'con7', status: 'FAULTED' },
                { id: 'con8', status: 'CHARGING' },
            ]),
        ],
    },
    {
        id: '3',
        name: 'Mall EV Hub — Aeon 1',
        address: 'AEON Mall, Sihanouk Blvd, Phnom Penh',
        country_code: 'KH',
        latitude: '11.5530',
        longitude: '104.9140',
        status: 'AVAILABLE',
        image: 'https://picsum.photos/seed/station3/400/300',
        restrooms: true, wifi: true, playground: true,
        parking_fee: true, cafe: true, shopping: true,
        phone_number: '+855 23 345 678',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        chargers: [
            makeCharger('c3-1', '3', [
                { id: 'con9', status: 'AVAILABLE' },
                { id: 'con10', status: 'PREPARING' },
            ]),
            makeCharger('c3-2', '3', [
                { id: 'con11', status: 'AVAILABLE' },
                { id: 'con12', status: 'AVAILABLE' },
            ]),
        ],
    },
    {
        id: '4',
        name: 'Riverside Quick Charge',
        address: 'Sisowath Quay, Riverside, Phnom Penh',
        country_code: 'KH',
        latitude: '11.5680',
        longitude: '104.9310',
        status: 'AVAILABLE',
        image: 'https://picsum.photos/seed/station4/400/300',
        restrooms: false, wifi: true, playground: false,
        parking_fee: false, cafe: true, shopping: false,
        phone_number: '+855 23 456 789',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        chargers: [
            makeCharger('c4-1', '4', [
                { id: 'con13', status: 'AVAILABLE' },
                { id: 'con14', status: 'AVAILABLE' },
            ]),
        ],
    },
    {
        id: '5',
        name: 'Airport EV Station',
        address: 'Phnom Penh International Airport',
        country_code: 'KH',
        latitude: '11.5466',
        longitude: '104.8441',
        status: 'AVAILABLE',
        image: 'https://picsum.photos/seed/station5/400/300',
        restrooms: true, wifi: true, playground: false,
        parking_fee: true, cafe: true, shopping: true,
        phone_number: '+855 23 567 890',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        chargers: [
            makeCharger('c5-1', '5', [
                { id: 'con15', status: 'CHARGING' },
                { id: 'con16', status: 'CHARGING' },
            ]),
            makeCharger('c5-2', '5', [
                { id: 'con17', status: 'AVAILABLE' },
                { id: 'con18', status: 'FAULTED' },
            ]),
        ],
    },
    {
        id: '6',
        name: 'Sen Sok Supercharge',
        address: 'AEON Mall 2, Sen Sok, Phnom Penh',
        country_code: 'KH',
        latitude: '11.5900',
        longitude: '104.8960',
        status: 'AVAILABLE',
        image: 'https://picsum.photos/seed/station6/400/300',
        restrooms: true, wifi: true, playground: true,
        parking_fee: true, cafe: true, shopping: true,
        phone_number: '+855 23 678 901',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        chargers: [
            makeCharger('c6-1', '6', [
                { id: 'con19', status: 'AVAILABLE' },
                { id: 'con20', status: 'AVAILABLE' },
            ]),
            makeCharger('c6-2', '6', [
                { id: 'con21', status: 'PREPARING' },
                { id: 'con22', status: 'AVAILABLE' },
            ]),
        ],
    },
];

const ListStationScreen = () => {
    const mapRef = useRef<MapView>(null!);
    const { currentLocation } = useStoreLocation();
    const { setSelectedStation, selectedStation } = useStationStore();
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchQuery, setSearchQuery] = useState('');

    const sortedStations = useStationSorting({
        stations: STATIC_STATIONS,
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
                        <TouchableOpacity style={styles.myLocationButton} onPress={handleMyLocation}>
                            <Ionicons name="locate" size={22} color={Colors.white} />
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
});
