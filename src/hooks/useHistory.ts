import { fetchHistory, fetchMeWalletTransactions } from "@/services/useApi";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useState } from "react";

export const useHistory = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);
    const { chargerHistoryData, setChargerHistoryData } = useHistoryStore();

    const getChargerHistory = async (page: number = 1) => {
        try {
            if (page === 1) {
                setIsLoading(true);
            } else {
                setIsLoadMoreLoading(true);
            }
            const data = {
                page: page,
                size: 10,
                search:''
            }
            const response = await fetchHistory(data);
            if (response?.data?.code === '000') {
                const newContent = response?.data?.data.content || [];
                const isLastPage = response?.data?.data.last || false;
                
                if (page === 1) {
                    setChargerHistoryData(newContent);
                } else {
                    const currentTransactions = chargerHistoryData || [];
                    const existingIds = new Set(currentTransactions.map((t: any) => t.id));
                    const uniqueNewContent = newContent.filter((t: any) => !existingIds.has(t.id));
                    setChargerHistoryData([...currentTransactions, ...uniqueNewContent]);
                }
                
                return {
                    content: newContent,
                    isLastPage,
                    totalPages: response?.data?.data.total_pages || 0,
                    totalElements: response?.data?.data.total_elements || 0
                };
            } else {
                if (page === 1) {
                    setChargerHistoryData([]);
                }
                return { content: [], isLastPage: true, totalPages: 0, totalElements: 0 };
            }
        } catch (error: any) {
            if (page === 1) {
                setChargerHistoryData([]);
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
        chargerHistoryData,
        getChargerHistory
    };
}

