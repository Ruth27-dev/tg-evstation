import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Animated, PanResponder, Dimensions, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import { Content } from '@/types';
import { calculateDistance } from '@/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { getConnectorBadges, getStationPrice, isNewStation, ConnectorBadge } from '../utils/stationMarker';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.90;
export const PEEK_HEIGHT = 210;
const COLLAPSED_TRANSLATE_Y = EXPANDED_HEIGHT - PEEK_HEIGHT;
const ROW_HEIGHT = 128;

export type StationCategory = 'all' | 'available' | 'dcFast' | 'ac' | 'freeParking';

const CATEGORY_TABS: { key: StationCategory; labelKey: string; icon?: string }[] = [
    { key: 'all', labelKey: 'common.all', icon: 'sparkles-outline' },
    { key: 'available', labelKey: 'station.available', icon: 'checkmark-circle-outline' },
    { key: 'dcFast', labelKey: 'station.dcFast', icon: 'flash-outline' },
    { key: 'ac', labelKey: 'station.ac', icon: 'battery-charging-outline' },
    // { key: 'freeParking', labelKey: 'station.freeParking' },
];

const BADGE_COLORS: Record<ConnectorBadge['label'], string> = {
    DC: Colors.scanAccent,
    AC: Colors.secondaryColor,
};

export interface StationBottomSheetRef {
    expand: () => void;
    collapse: () => void;
    scrollToStation: (stationId: string) => void;
}

interface StationBottomSheetProps {
    stations: Content[];
    selectedStation: Content | null;
    currentLocation: { latitude: number; longitude: number } | null;
    activeCategory: StationCategory;
    onCategoryChange: (category: StationCategory) => void;
    onStationPress: (station: Content) => void;
    onLocatePress: (station: Content) => void;
}

const StationBottomSheet = forwardRef<StationBottomSheetRef, StationBottomSheetProps>(({
    stations,
    selectedStation,
    currentLocation,
    activeCategory,
    onCategoryChange,
    onStationPress,
    onLocatePress,
}, ref) => {
    const { t } = useTranslation();
    const listRef = useRef<FlatList>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const translateY = useRef(new Animated.Value(COLLAPSED_TRANSLATE_Y)).current;
    const lastTranslateY = useRef(COLLAPSED_TRANSLATE_Y);

    const animateTo = useCallback((value: number) => {
        lastTranslateY.current = value;
        Animated.spring(translateY, {
            toValue: value,
            useNativeDriver: true,
            bounciness: 0,
        }).start();
    }, [translateY]);

    const searchedStations = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return stations;
        return stations.filter((s) =>
            s.name?.toLowerCase().includes(query) || s.address?.toLowerCase().includes(query)
        );
    }, [stations, searchQuery]);

    useImperativeHandle(ref, () => ({
        expand: () => animateTo(0),
        collapse: () => animateTo(COLLAPSED_TRANSLATE_Y),
        scrollToStation: (stationId: string) => {
            const index = searchedStations.findIndex((s) => s.id === stationId);
            if (index >= 0) {
                animateTo(0);
                listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
            }
        },
    }), [searchedStations, animateTo]);

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
        onPanResponderMove: (_, gesture) => {
            const next = Math.min(
                Math.max(lastTranslateY.current + gesture.dy, 0),
                COLLAPSED_TRANSLATE_Y
            );
            translateY.setValue(next);
        },
        onPanResponderRelease: (_, gesture) => {
            const projected = lastTranslateY.current + gesture.dy;
            const midpoint = COLLAPSED_TRANSLATE_Y / 2;
            const shouldExpand = gesture.vy < -0.5 || (gesture.vy <= 0.5 && projected < midpoint);
            animateTo(shouldExpand ? 0 : COLLAPSED_TRANSLATE_Y);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    const toggleSheet = () => {
        const isCollapsed = lastTranslateY.current >= COLLAPSED_TRANSLATE_Y - 1;
        animateTo(isCollapsed ? 0 : COLLAPSED_TRANSLATE_Y);
    };

    // Tapping a badge filters the whole list/map to that power type; tapping the
    // same badge again clears back to "all" instead of getting stuck.
    const handleBadgePress = useCallback((category: StationCategory) => {
        onCategoryChange(activeCategory === category ? 'all' : category);
    }, [activeCategory, onCategoryChange]);

    const getItemLayout = (_: ArrayLike<Content> | null | undefined, index: number) => ({
        length: ROW_HEIGHT,
        offset: (ROW_HEIGHT + 12) * index,
        index,
    });

    return (
        <Animated.View
            style={[
                styles.sheet,
                { height: EXPANDED_HEIGHT, transform: [{ translateY }] },
            ]}
        >
            <View {...panResponder.panHandlers}>
                <TouchableOpacity activeOpacity={0.8} onPress={toggleSheet} style={styles.handleArea}>
                    <View style={styles.handle} />
                </TouchableOpacity>

                {/* <View style={styles.searchRow}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={18} color={Colors.textFaint} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t('common.searchStation')}
                            placeholderTextColor={Colors.textFaint}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={18} color={Colors.textFaint} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View> */}

                <View style={styles.tabRow}>
                    {CATEGORY_TABS.map((tab) => {
                        const isActive = activeCategory === tab.key;
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={styles.tabItem}
                                activeOpacity={0.7}
                                onPress={() => onCategoryChange(tab.key)}
                            >
                                {tab.icon ? (
                                    <Ionicons
                                        name={tab.icon}
                                        size={18}
                                        color={isActive ? Colors.secondaryColor : Colors.textMuted}
                                    />
                                ) : (
                                    <Text style={[styles.tabP, isActive && styles.tabLabelActive]}>P</Text>
                                )}
                                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                                    {t(tab.labelKey)}
                                </Text>
                                {isActive && <View style={styles.tabUnderline} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <FlatList
                ref={listRef}
                style={styles.list}
                data={searchedStations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <StationRow
                        station={item}
                        isSelected={selectedStation?.id === item.id}
                        currentLocation={currentLocation}
                        onPress={() => onStationPress(item)}
                        onLocatePress={() => onLocatePress(item)}
                        onBadgePress={handleBadgePress}
                    />
                )}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                onScrollToIndexFailed={({ index }) => {
                    setTimeout(() => {
                        listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
                    }, 100);
                }}
            />
        </Animated.View>
    );
});

interface StationRowProps {
    station: Content;
    isSelected: boolean;
    currentLocation: { latitude: number; longitude: number } | null;
    onPress: () => void;
    onLocatePress: () => void;
    onBadgePress: (category: StationCategory) => void;
}

const BADGE_CATEGORY: Record<ConnectorBadge['label'], StationCategory> = {
    DC: 'dcFast',
    AC: 'ac',
};

const StationRow = React.memo(({ station, isSelected, currentLocation, onPress, onLocatePress, onBadgePress }: StationRowProps) => {
    const badges = useMemo(() => getConnectorBadges(station), [station]);
    const isNew = useMemo(() => isNewStation(station), [station]);
    const price = useMemo(() => getStationPrice(station), [station]);

    let distanceLabel = '';
    if (currentLocation) {
        const km = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            parseFloat(station.latitude),
            parseFloat(station.longitude)
        );
        distanceLabel = km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(1)} km`;
    }

    const handleDirection = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
        Linking.openURL(url);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            style={[styles.row, isSelected && styles.rowSelected]}
        >
            {isNew && (
                <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                </View>
            )}

            <Text style={styles.rowName} numberOfLines={1}>{station.name}</Text>
            <Text style={styles.rowAddress} numberOfLines={1}>
                {station.address}{distanceLabel ? `  •  ${distanceLabel}` : ''}
            </Text>

            <View style={styles.rowBottom}>
                <View style={styles.badgeRow}>
                    {price != null && (
                        <View style={styles.priceChip}>
                            <Text style={styles.priceChipText}>{`$${price.toFixed(2)}/kWh`}</Text>
                        </View>
                    )}
                    {badges.map((badge) => {
                        const color = badge.available > 0 ? BADGE_COLORS[badge.label] : Colors.textFaint;
                        return (
                            <TouchableOpacity
                                key={badge.label}
                                activeOpacity={0.7}
                                onPress={() => onBadgePress(BADGE_CATEGORY[badge.label])}
                                style={[styles.connectorBadge, { borderColor: color }]}
                            >
                                <Text style={[styles.connectorBadgeLabel, { color }]}>{badge.label}</Text>
                                <View style={[styles.connectorBadgeCount, { backgroundColor: `${color}20` }]}>
                                    <Text style={[styles.connectorBadgeCountText, { color }]}>
                                        {badge.available}/{badge.total}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.locateButton} onPress={onLocatePress} activeOpacity={0.7}>
                        <Ionicons name="location-outline" size={16} color={Colors.mainColor} />
                    </TouchableOpacity>
                    <View style={styles.directionButtonWrapper}>
                        <TouchableOpacity style={styles.directionButton} onPress={handleDirection} activeOpacity={0.7}>
                            <Ionicons name="navigate" size={14} color={Colors.white} style={styles.directionIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
});

export default StationBottomSheet;

const styles = StyleSheet.create({
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 12,
    },
    list: {
        flex: 1,
    },
    handleArea: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 6,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#E2E8F0',
    },
    searchRow: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceMuted,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 46,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        padding: 0,
        height: 30,
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.surfaceMuted,
        paddingBottom: 10,
    },
    tabItem: {
        alignItems: 'center',
        gap: 4,
        paddingBottom: 4,
    },
    tabP: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.textMuted,
        lineHeight: 18,
    },
    tabLabel: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
    },
    tabLabelActive: {
        color: Colors.secondaryColor,
        fontFamily: CustomFontConstant.EnBold,
    },
    tabUnderline: {
        position: 'absolute',
        bottom: -10,
        height: 2,
        width: '100%',
        backgroundColor: Colors.secondaryColor,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 130,
        paddingTop: 4,
    },
    row: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderMuted,
        paddingBottom: 14,
    },
    rowSelected: {
        opacity: 0.85,
    },
    newBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.secondaryColor,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginBottom: 6,
    },
    newBadgeText: {
        fontSize: FontSize.small - 3,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
    rowName: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 2,
    },
    rowAddress: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.textMuted,
        marginBottom: 10,
    },
    rowBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        flex: 1,
    },
    priceChip: {
        borderWidth: 1.5,
        borderColor: Colors.primaryColor,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        justifyContent: 'center',
    },
    priceChipText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.primaryColor,
    },
    connectorBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingLeft: 8,
        paddingVertical: 3,
        gap: 6,
    },
    connectorBadgeLabel: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
    },
    connectorBadgeCount: {
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 3,
    },
    connectorBadgeCountText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnBold,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    locateButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionButtonWrapper: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionButton: {
        width: 22,
        height: 22,
        borderRadius: 5,
        backgroundColor: Colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '45deg' }],
    },
    directionIcon: {
        transform: [{ rotate: '-45deg' }],
    },
});
