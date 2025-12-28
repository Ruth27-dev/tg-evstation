import { fetchSlideShow } from "@/services/useApi";
import { useSlideShowStore } from "@/store/useSlideShowStore";
import { useState } from "react";

export const useSlideShow = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);
    const {slideShowData, setSlideShowData } = useSlideShowStore();

    const getSlideShow = async (page: number = 1) => {
        try {
            if (page === 1) {
                setIsLoading(true);
            } else {
                setIsLoadMoreLoading(true);
            }
            const data = {
                "page":page,
                "size": 50,
                "search":""
            }
            const response = await fetchSlideShow(data);
            if (response?.data?.code === '000') {
                const newContent = (response?.data?.data.content || []).filter((item: any) => item?.status === 'ACTIVE');
                const isLastPage = response?.data?.data.last || false;
                
                if (page === 1) {
                    setSlideShowData(newContent);
                } else {
                    const currentTransactions = slideShowData || [];
                    const existingIds = new Set(currentTransactions.map((t: any) => t.id));
                    const uniqueNewContent = newContent.filter((t: any) => !existingIds.has(t.id));
                    setSlideShowData([...currentTransactions, ...uniqueNewContent]);
                }
                
                return {
                    content: newContent,
                    isLastPage,
                    totalPages: response?.data?.data.total_pages || 0,
                    totalElements: response?.data?.data.total_elements || 0
                };
            } else {
                if (page === 1) {
                    setSlideShowData([]);
                }
                return { content: [], isLastPage: true, totalPages: 0, totalElements: 0 };
            }
        } catch (error: any) {
            if (page === 1) {
                setSlideShowData([]);
            }
            return { content: [], isLastPage: true, totalPages: 0, totalElements: 0 };
        } finally {
            setIsLoading(false);
            setIsLoadMoreLoading(false);
        }
    }

    return {
        isLoading,
        isLoadMoreLoading,
        getSlideShow,
        slideShowData
    };
}
