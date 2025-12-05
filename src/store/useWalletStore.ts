import { create } from 'zustand';
import { UserBalance } from '@/types/wallet';
import { Transaction } from '@/types';

interface WalletStore {
    userWalletBalance: UserBalance | null;
    setUserWalletBalance: (userWalletBalance: UserBalance | null) => void;
    meTransaction: Transaction[] | null;
    setMeTransaction: (meTransaction: Transaction[] | null) => void;
}

export const useWalletStore = create<WalletStore>()((set) => ({
    userWalletBalance: null,
    setUserWalletBalance: (userWalletBalance) => set({ userWalletBalance }),
    meTransaction: null,
    setMeTransaction: (meTransaction) => set({ meTransaction })
}));
