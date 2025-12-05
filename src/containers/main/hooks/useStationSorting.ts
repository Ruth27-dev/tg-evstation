import { useMemo } from 'react';
import { Content } from '@/types';
import { calculateDistance } from '@/utils';

interface UseStationSortingProps {
    stations: Content[];
    currentLocation: { latitude: number; longitude: number } | null;
}

export const useStationSorting = ({ stations, currentLocation }: UseStationSortingProps) => {
    const sortedStations = useMemo(() => {
        if (!currentLocation || !stations?.length) {
            return stations;
        }

        return [...stations].sort((a, b) => {
            const distanceA = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                parseFloat(a?.latitude),
                parseFloat(a?.longitude)
            );
            const distanceB = calculateDistance(
                currentLocation?.latitude,
                currentLocation?.longitude,
                parseFloat(b?.latitude),
                parseFloat(b?.longitude)
            );
            return distanceA - distanceB;
        });
    }, [stations, currentLocation]);

    return sortedStations;
};
