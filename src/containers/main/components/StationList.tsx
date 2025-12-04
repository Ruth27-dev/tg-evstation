import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Colors } from '@/theme';
import { safePadding, screenSizes } from '@/constants/GeneralConstants';
import { Content } from '@/types';
import StationCard from './StationCard';
import { navigate } from '@/navigation/NavigationService';

interface StationListProps {
    stations: Content[];
    selectedStation: Content | null;
    currentLocation: { latitude: number; longitude: number } | null;
    onStationPress: (station: Content) => void;
}

const StationList: React.FC<StationListProps> = ({ 
    stations, 
    selectedStation, 
    currentLocation,
    onStationPress
}) => {
    const renderItem = ({ item }: { item: Content }) => (
        <StationCard
            station={item}
            isSelected={selectedStation?.id === item.id}
            currentLocation={currentLocation}
            onPress={() => {
                onStationPress(item);
                navigate('StationDetail', { stationId: item.id });
            }}
        />
    );

    const renderSeparator = () => <View style={{ width: 12 }} />;

    const getItemLayout = (_: any, index: number) => ({
        length: screenSizes.width * 0.9 + 12,
        offset: (screenSizes.width * 0.9 + 12) * index,
        index,
    });

    return (
        <View style={styles.container}>
            <FlatList
                data={stations}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={renderSeparator}
                removeClippedSubviews={true}
                maxToRenderPerBatch={3}
                windowSize={5}
                initialNumToRender={2}
                getItemLayout={getItemLayout}
            />
        </View>
    );
};

export default StationList;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 100,
    },
    listContent: {
        paddingHorizontal: safePadding,
    },
});
