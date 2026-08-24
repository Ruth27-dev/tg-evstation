import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, screenSizes } from '@/constants/GeneralConstants';
import { Content } from '@/types';
import { calculateDistance } from '@/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface StationCardProps {
    station: Content;
    isSelected: boolean;
    currentLocation: { latitude: number; longitude: number } | null;
    onPress: () => void;
}

const StationCard: React.FC<StationCardProps> = ({
    station,
    isSelected,
    currentLocation,
    onPress,
}) => {
    const { t } = useTranslation();

    const totalConnectors = station?.chargers.reduce(
        (total: number, charger: any) => total + (charger.connector?.length || 0), 0
    );

    const availableConnectors = station?.chargers.reduce((available: number, charger: any) => {
        const n = charger?.connector?.filter(
            (c: any) => c.status === 'AVAILABLE' || c.status === 'PREPARING'
        ).length || 0;
        return available + n;
    }, 0);

    let distance = 'N/A';
    if (currentLocation) {
        const km = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            parseFloat(station.latitude),
            parseFloat(station.longitude)
        );
        distance = km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(1)} km`;
    }

    const isAvailable = availableConnectors > 0;

    const handleDirection = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
        Linking.openURL(url);
    };

    return (
        <View style={[styles.card, isSelected && styles.cardSelected]}>
            {/* Left accent bar when selected */}
            {isSelected && <View style={styles.selectedAccent} />}

            <TouchableOpacity
                style={styles.topRow}
                onPress={onPress}
                activeOpacity={0.75}
            >
                <Image
                    source={{ uri: station?.image }}
                    style={styles.image}
                    resizeMode="cover"
                />

                <View style={styles.info}>
                    {/* Name + availability badge */}
                    <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={1}>{station.name}</Text>
                        <View style={[styles.availBadge, { backgroundColor: isAvailable ? '#DCFCE7' : '#FEE2E2' }]}>
                            <View style={[styles.availDot, { backgroundColor: isAvailable ? Colors.secondaryColor : '#EF4444' }]} />
                            <Text style={[styles.availText, { color: isAvailable ? Colors.secondaryColor : '#EF4444' }]}>
                                {isAvailable ? t('station.available') : t('station.occupied')}
                            </Text>
                        </View>
                    </View>

                    {/* Address */}
                    <View style={styles.addressRow}>
                        <Ionicons name="location-outline" size={13} color="#9CA3AF" />
                        <Text style={styles.addressText} numberOfLines={1}>{station.address}</Text>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.chip}>
                            <MaterialCommunityIcons name="ev-plug-type2" size={14} color={Colors.mainColor} />
                            <Text style={styles.chipText}>
                                {availableConnectors}/{totalConnectors}
                            </Text>
                        </View>
                        <View style={styles.chip}>
                            <Ionicons name="navigate-outline" size={14} color={Colors.secondaryColor} />
                            <Text style={styles.chipText}>{distance}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Book / Direction actions */}
            {/* <View style={styles.actionRow}>
                <TouchableOpacity style={styles.bookButton} onPress={onPress} activeOpacity={0.8}>
                    <Text style={styles.bookButtonText}>{t('station.book')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.directionButton} onPress={handleDirection} activeOpacity={0.8}>
                    <Ionicons name="navigate" size={15} color={Colors.white} />
                    <Text style={styles.directionButtonText}>{t('station.getDirections')}</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
};

export default StationCard;

const styles = StyleSheet.create({
    card: {
        width: screenSizes.width * 0.9,
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 1,
        overflow: 'hidden',
    },
    cardSelected: {
        borderWidth: 1.5,
        borderColor: Colors.secondaryColor,
        shadowColor: Colors.secondaryColor,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    selectedAccent: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: Colors.secondaryColor,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    topRow: {
        flexDirection: 'row',
    },
    image: {
        width: 86,
        height: 86,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        marginBottom: 4,
    },
    name: {
        flex: 1,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    availBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        gap: 4,
        flexShrink: 0,
    },
    availDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
    },
    availText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnBold,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 10,
    },
    addressText: {
        flex: 1,
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 4,
    },
    chipText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
    },
    bookButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 9,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.mainColor,
    },
    bookButtonText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    directionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 9,
        borderRadius: 10,
        backgroundColor: Colors.secondaryColor,
    },
    directionButtonText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
});
