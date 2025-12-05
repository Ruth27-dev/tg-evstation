import { fetchMeWallet, fetchMeWalletTransactions } from "@/services/useApi";
import { useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";

export const useWallet = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);
    const { setUserWalletBalance,userWalletBalance,setMeTransaction, meTransaction } = useWalletStore();

    const getMeWallet = async () => {
        try {
            setIsLoading(true);
            const response = await fetchMeWallet();
            if (response?.data?.code === '000') {
                setUserWalletBalance(response?.data?.data || null);
            } else {
                setUserWalletBalance(null);
            }
        } catch (error: any) {
            setUserWalletBalance(null);
        } finally {
            setIsLoading(false);
        }
    }

    const getMeTransactions = async (page: number = 1) => {
        try {
            if (page === 1) {
                setIsLoading(true);
            } else {
                setIsLoadMoreLoading(true);
            }

            const response = await fetchMeWalletTransactions(page - 1);
            if (response?.data?.code === '000') {
                const newContent = response?.data?.data.content || [];
                const isLastPage = response?.data?.data.last || false;
                
                if (page === 1) {
                    setMeTransaction(newContent);
                } else {
                    const currentTransactions = meTransaction || [];
                    const existingIds = new Set(currentTransactions.map((t: any) => t.id));
                    const uniqueNewContent = newContent.filter((t: any) => !existingIds.has(t.id));
                    setMeTransaction([...currentTransactions, ...uniqueNewContent]);
                }
                
                return {
                    content: newContent,
                    isLastPage,
                    totalPages: response?.data?.data.total_pages || 0,
                    totalElements: response?.data?.data.total_elements || 0
                };
            } else {
                if (page === 1) {
                    setMeTransaction([]);
                }
                return { content: [], isLastPage: true, totalPages: 0, totalElements: 0 };
            }
        } catch (error: any) {
            if (page === 1) {
                setMeTransaction([]);
            }
            return { content: [], isLastPage: true, totalPages: 0, totalElements: 0 };
        } finally {
            setIsLoading(false);
            setIsLoadMoreLoading(false);
        }
    }

    return {
        getMeWallet,
        isLoading,
        isLoadMoreLoading,
        userWalletBalance,
        getMeTransactions,
        meTransaction
    };
}

