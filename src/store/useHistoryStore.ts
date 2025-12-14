import { create } from 'zustand';
import { History } from '@/types';

interface HistoryStore {
    chargerHistoryData: History[] | null;
    setChargerHistoryData: (chargerHistoryData: History[] | null) => void;
    chargingHistoryDetails?: History | null;
    setChargingHistoryDetails: (chargingHistoryDetails: History) => void;
}

export const useHistoryStore = create<HistoryStore>()((set) => ({
    chargerHistoryData: null,
    setChargerHistoryData: (chargerHistoryData) => set({ chargerHistoryData }),
    chargingHistoryDetails: null,
    setChargingHistoryDetails: (chargingHistoryDetails) => set({ chargingHistoryDetails }),
}));
