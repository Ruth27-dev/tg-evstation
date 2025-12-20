import { navigate } from "@/navigation/NavigationService";
import { chargingSessions, evtStart, evtStop } from "@/services/useApi";
import { useEVStore } from "@/store/useEVStore";
import { useSessionDetailStore } from "@/store/useSessionDetailStore";
import { useState, useCallback } from "react";
import Toast from 'react-native-toast-message';

export const useEVConnector = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setEvConnect, clearEvConnect, evConnect } = useEVStore();
    const { sessionDetail, setSessionDetail, clearSessionDetail } = useSessionDetailStore();

    const postStart = async (connector_id: string, id_tag:string) => {
        setIsLoading(true);
        try {
            const data = {
                "connector_id": connector_id,
                "id_tag": id_tag
            }
            const response = await evtStart(data);
            if(response?.data?.code === '000'){
                if(response?.data?.data?.status === "SENT"){
                    setEvConnect(response?.data?.data);
                    navigate('PreparingCharging')
                }
            } else if(response?.data?.code === '023' || response?.data?.code === '022'){ 
                Toast.show({
                    type: 'error',
                    text1: 'Charging Error',
                    text2: response?.data?.message || 'Charging cannot start due to an invalid connector.',
                    position: 'bottom',
                });
                return;
            }
        } catch (error) {
            console.error("Error fetching station:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const postStop = async () => {
        setIsLoading(true);
        try {
            if (!evConnect) {
                throw new Error("No active connection");
            }
            const data = {
                "ocpp_transaction_id": sessionDetail?.ocpp_transaction_id,
                "charger_point_id": evConnect.charger_point_id,
                "connector_id": evConnect.connector_id,
                "connector_number": evConnect.connector_number
            }
            const response = await evtStop(data);
            if(response?.data?.code === '000'){
                clearEvConnect();
                clearSessionDetail();
            }
            return response;
        } catch (error) {
            console.error("Error fetching station:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    
    const getSessionDetail = useCallback(async (session_id: string) => {
        const response = await chargingSessions(session_id);
        if(response?.data?.code === '000'){
            setSessionDetail(response?.data?.data);
        }
    }, [setSessionDetail]);

    return {
        postStart,
        isLoading,
        postStop,
        getSessionDetail,
        evConnect,
        clearEvConnect,
        sessionDetail,
        clearSessionDetail
    };
}
