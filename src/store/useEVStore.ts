import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '@/constants/GeneralConstants';
import { EVStartResponse, SessionDetail } from '@/types';

interface EVStore {
    evConnect: EVStartResponse | null;
    setEvConnect: (data: any) => void;
    clearEvConnect: () => void
}

export const useEVStore = create<EVStore>()(
  persist(
    (set) => ({
        evConnect: null,
        setEvConnect: (evConnect: EVStartResponse | null) => set({ evConnect }),
        clearEvConnect: () => set({ evConnect: null })
    }),
    {
      name: StorageKey.ev,
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
