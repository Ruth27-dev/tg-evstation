import { fetchFAQ } from "@/services/useApi";
import { useState } from "react";
import { useFAQStore } from "@/store/useFAQStore";

export const useFAQ = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setFAQData, faqData } = useFAQStore();
    
    const getFAQ = async () => {
        setIsLoading(true);
        try {
            const response = await fetchFAQ();
            setFAQData(response?.data?.data);
            return response;
        } catch (error) {
            console.error("Error fetching station:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    
    return {
        getFAQ,
        isLoading,
        faqData
    };
}

