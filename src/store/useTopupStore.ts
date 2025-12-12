import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '@/constants/GeneralConstants';

interface TopupStore {
    orderId: string | null;
    setOrderId: (data: any) => void;
    clearOrderId: () => void;
}

export const useTopupStore = create<TopupStore>()(
  persist(
    (set) => ({
        orderId: null,
        setOrderId: (orderId: string | null) => set({ orderId }),
        clearOrderId: () => set({ orderId: null }),
    }),
    {
      name: StorageKey.transactionId,
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
