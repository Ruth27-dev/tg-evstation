import { fetchMeWallet, fetchStation } from "@/services/useApi";
import { useStationStore } from "@/store/useStationStore";
import { useState } from "react";

export const useStation = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setStationData,stationData } = useStationStore();

    const getStation = async (page: number = 1, size: number = 10) => {
        setIsLoading(true);
        try {
            const response = await fetchStation({ page, size });
            setStationData(response?.data?.data?.content);
            return response;
        } catch (error) {
            console.error("Error fetching station:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    
    return {
        getStation,
        isLoading,
        stationData,

    };
}

