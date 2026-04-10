import { navigate } from "@/navigation/NavigationService";
import { chargingSessions, evtStart, evtStop } from "@/services/useApi";
import { useEVStore } from "@/store/useEVStore";
import { useSessionDetailStore } from "@/store/useSessionDetailStore";
import { useState, useCallback } from "react";
import Toast from 'react-native-toast-message';

const SESSION_DETAIL_DEBOUNCE_MS = 1200;
const inflightSessionRequests = new Map<string, Promise<void>>();
const lastSessionFetchAt = new Map<string, number>();

export const useEVConnector = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setEvConnect, clearEvConnect, evConnect } = useEVStore();
    const { sessionDetail, setSessionDetail, clearSessionDetail } = useSessionDetailStore();

    const postStart = async (connector_id: string, id_tag:string): Promise<boolean> => {
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
                    return true;
                }
            } else if(response?.data?.code === '023' || response?.data?.code === '022'){ 
                Toast.show({
                    type: 'error',
                    text1: 'Charging Error',
                    text2: response?.data?.message || 'Charging cannot start due to an invalid connector.',
                    position: 'bottom',
                });
                return false;
            }
            return false;
        } catch (error) {
            console.error("Error fetching station:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    const postStop = async (sessionId?: string | null) => {
        setIsLoading(true);
        try {
            const resolvedSessionId =
                sessionId ??
                sessionDetail?.session_id ??
                evConnect?.session_id ??
                null;

            if (!evConnect || !resolvedSessionId) {
                throw new Error("No active connection");
            }

            let ocppTransactionId = sessionDetail?.ocpp_transaction_id;
            if (!ocppTransactionId) {
                const sessionResp = await chargingSessions(String(resolvedSessionId));
                if (sessionResp?.data?.code === '000') {
                    const latestDetail = sessionResp?.data?.data;
                    if (latestDetail) {
                        setSessionDetail(latestDetail);
                        ocppTransactionId = latestDetail?.ocpp_transaction_id;
                    }
                }
            }

            if (!ocppTransactionId) {
                throw new Error("Missing ocpp_transaction_id");
            }

            const data = {
                "ocpp_transaction_id": ocppTransactionId,
                "charger_point_id": evConnect.charger_point_id,
                "connector_id": evConnect.connector_id,
                "connector_number": evConnect.connector_number
            }
            const response = await evtStop(data);
            if(response?.data?.code === '000'){
                clearEvConnect();
                clearSessionDetail();
                return response;
            }
            throw new Error(response?.data?.message || 'Stop request failed');
        } catch (error) {
            console.error("Error fetching station:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    
    const getSessionDetail = useCallback(async (session_id: string) => {
        if (!session_id) {
            return;
        }

        const now = Date.now();
        const lastFetch = lastSessionFetchAt.get(session_id) ?? 0;
        if (now - lastFetch < SESSION_DETAIL_DEBOUNCE_MS) {
            return;
        }

        const existingRequest = inflightSessionRequests.get(session_id);
        if (existingRequest) {
            await existingRequest;
            return;
        }

        lastSessionFetchAt.set(session_id, now);
        const request = (async () => {
            const response = await chargingSessions(session_id);
            if(response?.data?.code === '000'){
                setSessionDetail(response?.data?.data);
            }
        })();

        inflightSessionRequests.set(session_id, request);
        try {
            await request;
        } finally {
            inflightSessionRequests.delete(session_id);
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
