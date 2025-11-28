import { evtStart, fetchMeWallet, fetchStation } from "@/services/useApi";
import { useStationStore } from "@/store/useStation";
import { useState } from "react";

export const useEVConnector = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const postStart = async (connector_id: string, id_tag:string) => {
        setIsLoading(true);
        try {
            const data = {
                "connector_id": connector_id,
                "id_tag": id_tag
            }
            const response = await evtStart(data);

            return response;
        } catch (error) {
            console.error("Error fetching station:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    
    return {
        postStart,
        isLoading,

    };
}

