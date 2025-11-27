import { Content } from '@/types';
import { create } from 'zustand';

interface StationStore {
    stationData: Content[];
    setStationData: (stationData: Content[]) => void;
}

export const useStationStore = create<StationStore>()((set) => ({
    stationData: [],
    setStationData: (stationData) => set({ stationData }),
}));
