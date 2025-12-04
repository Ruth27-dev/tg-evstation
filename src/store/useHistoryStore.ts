import { create } from 'zustand';
import { History, Transaction } from '@/types';

interface HistoryStore {
    chargerHistoryData: History[] | null;
    setChargerHistoryData: (chargerHistoryData: History[] | null) => void;
}

export const useHistoryStore = create<HistoryStore>()((set) => ({
    chargerHistoryData: null,
    setChargerHistoryData: (chargerHistoryData) => set({ chargerHistoryData }),
}));
