import { Content } from '@/types';
import { create } from 'zustand';

interface StationStore {
    stationData: Content[];
    setStationData: (stationData: Content[]) => void;
    selectedStation: Content | null;
    setSelectedStation: (data: Content) => void;
    clearStation: () => void;
}

export const useStationStore = create<StationStore>()((set) => ({
    stationData: [],
    setStationData: (stationData) => set({ stationData }),
    selectedStation: null,
    setSelectedStation: (data) => set({ selectedStation: data }),
    clearStation: () => set({ selectedStation: null }),
}));
