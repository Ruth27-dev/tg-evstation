import { FAQResponse } from '@/types';
import { create } from 'zustand';

interface FAQStore {
    faqData: FAQResponse[] | null;
    setFAQData: (data: FAQResponse[] | null) => void;
}

export const useFAQStore = create<FAQStore>()((set) => ({
    faqData: null,
    setFAQData: (faqData) => set({ faqData }),
}));
