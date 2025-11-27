import { fetchMeWallet } from "@/services/useApi";
import { useWalletStore } from "@/store/useWallet";
import { useState } from "react";

export const useWallet = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setUserWalletBalance,userWalletBalance } = useWalletStore();

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
    
    return {
        getMeWallet,
        isLoading,
        userWalletBalance,

    };
}

