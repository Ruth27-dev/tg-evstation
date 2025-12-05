import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '@/constants/GeneralConstants';

interface EVStore {
    evConnect: boolean;
    setEvConnect: (data: any) => void;
}

export const useEVStore = create<EVStore>()(
  persist(
    (set) => ({
        evConnect: false,
        setEvConnect: (evConnect:boolean) => set({ evConnect }),
    }),
    {
      name: StorageKey.ev,
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
