import { fetchContact } from "@/services/useApi";
import { useState } from "react";
import { useContactStore } from "@/store/useContactStore";

export const useContact = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setContactData,contactData } = useContactStore();
    
    const getContact = async () => {
        setIsLoading(true);
        try {
            const response = await fetchContact();
            setContactData(response?.data?.data);
            return response;
        } catch (error) {
            console.error("Error fetching station:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    
    return {
        getContact,
        isLoading,
        contactData
    };
}

