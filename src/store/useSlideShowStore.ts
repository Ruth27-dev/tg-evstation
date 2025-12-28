import { create } from 'zustand';
import { SlideShow } from '@/types';

interface SlideShowStore {
    slideShowData: SlideShow[] | null;
    setSlideShowData: (slideShowData: SlideShow[] | null) => void;
}

export const useSlideShowStore = create<SlideShowStore>()((set) => ({
    slideShowData: null,
    setSlideShowData: (slideShowData) => set({ slideShowData }),
}));
