import { create } from 'zustand';
import { Amount } from '@/types';

interface AmountStore {
    amountData: Amount[] | null;
    setAmountData: (amountData: Amount[] | null) => void;
}

export const useAmountStore = create<AmountStore>()((set) => ({
    amountData: null,
    setAmountData: (amountData) => set({ amountData }),
}));
