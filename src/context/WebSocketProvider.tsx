import { useEVConnector } from '@/hooks/useEVConnector';
import { useWallet } from '@/hooks/useWallet';
import { navigate } from '@/navigation/NavigationService';
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import * as Keychain from 'react-native-keychain';
import { isEmpty } from 'lodash';

interface WSMessage {
  type: string;
  [key: string]: any;
}

interface WSContextType {
  connected: boolean;
  send: (data: WSMessage) => void;
  lastMessage: WSMessage | null;
}

const WSContext = createContext<WSContextType | undefined>(undefined);

const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const { getMeWallet, getMeTransactions } = useWallet();
  const { getSessionDetail, evConnect, clearEvConnect, clearSessionDetail } = useEVConnector();
  const evConnectRef = useRef(evConnect);
  const getSessionDetailRef = useRef(getSessionDetail);
  const clearEvConnectRef = useRef(clearEvConnect);
  const clearSessionDetailRef = useRef(clearSessionDetail);
  const getMeWalletRef = useRef(getMeWallet);
  const getMeTransactionsRef = useRef(getMeTransactions);

  useEffect(() => {
    evConnectRef.current = evConnect;
  }, [evConnect]);

  useEffect(() => {
    getSessionDetailRef.current = getSessionDetail;
  }, [getSessionDetail]);

  useEffect(() => {
    clearEvConnectRef.current = clearEvConnect;
  }, [clearEvConnect]);

  useEffect(() => {
    clearSessionDetailRef.current = clearSessionDetail;
  }, [clearSessionDetail]);

  useEffect(() => {
    getMeWalletRef.current = getMeWallet;
  }, [getMeWallet]);

  useEffect(() => {
    getMeTransactionsRef.current = getMeTransactions;
  }, [getMeTransactions]);
  
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setAccessToken(token);
    };

    fetchToken();
  }, []);

  const matchesActiveChargeEvent = (message: WSMessage) => {
    const activeSession = evConnectRef.current;
    if (!activeSession) return false;

    const payload = message?.data;
    const payloadSessionId =
      payload?.session_id ??
      payload?.charging_session_id ??
      payload?.id ??
      (typeof payload === 'string' ? payload : null);
    const payloadConnectorId = payload?.connector_id;
    const payloadConnectorNumber = payload?.connector_number;
    const payloadChargerPointId = payload?.charger_point_id;

    if (payloadSessionId && String(payloadSessionId) === String(activeSession.session_id)) {
      return true;
    }

    if (payloadConnectorId && String(payloadConnectorId) === String(activeSession.connector_id)) {
      return true;
    }

    if (
      payloadConnectorNumber !== undefined &&
      payloadChargerPointId &&
      Number(payloadConnectorNumber) === Number(activeSession.connector_number) &&
      String(payloadChargerPointId) === String(activeSession.charger_point_id)
    ) {
      return true;
    }

    return false;
  };

  const connect = useCallback(() => {
    if (!accessToken) return;
    if (
      ws.current &&
      (ws.current.readyState === WebSocket.OPEN ||
        ws.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const url = `wss://tgevstation.com/ws/mobile?token=${accessToken}`; 
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setConnected(true);
      
      // Check if there's an active charging session when reconnecting
      if (!isEmpty(evConnectRef.current) && evConnectRef.current?.session_id) {
        const sessionId = evConnectRef.current.session_id;
        getSessionDetailRef.current(sessionId);
      }
    };
    ws.current.onmessage = (event) => {
		// console.log("RAW MESSAGE:", event.data);

		try {
			const data: WSMessage = JSON.parse(event.data);
			// console.log("PARSED:", data);

			setLastMessage(data);

			if (data.event_type === "WALLET_TOPUP_SUCCESS") {
        getMeWalletRef.current();
        getMeTransactionsRef.current(1);
        navigate("PaymentSuccess", {
          amount: data.data?.amount,
          transactionId: data.data?.id,
          date: data.data?.created_at,
        });
      }else if (data.event_type === "START_CHARGING") {
        if (!matchesActiveChargeEvent(data)) {
          return;
        }
        navigate("ChargingDetail");
      }else if (data.event_type === "STOP_CHARGING") {
        if (!matchesActiveChargeEvent(data)) {
          return;
        }
        const sessionId =
          data.data?.session_id ??
          data.data?.charging_session_id ??
          data.data;
        clearEvConnectRef.current();
        clearSessionDetailRef.current();
        navigate("ChargingSuccess", { sessionId: sessionId });
      }
      // else if( data.event_type === "METER_CHANGE") {
      //   if(!isEmpty(evConnect?.session_id)){
      //     const sessionId = evConnect?.session_id ?? '';
      //     getSessionDetail(sessionId);
      //   }
      // }
		} catch (e) {
			console.log("JSON PARSE ERROR:", e);
		}
	};

    ws.current.onerror = (e) => {
		if (e && typeof e === "object") {
			console.error("WebSocket Error:", JSON.stringify(e, null, 2));
		}
	};

    ws.current.onclose = () => {
      setConnected(false);
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connect();
        }, 2000);
      }
    };
  }, [accessToken]);

  const send = (data: WSMessage) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    console.log('Sending data:', data);
    ws.current.send(JSON.stringify(data)); // Send data as JSON
  };

  useEffect(() => {
    if (accessToken) {
      connect(); // Connect once the token is retrieved
    }
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      ws.current?.close(); // Cleanup WebSocket on unmount
    };
  }, [accessToken, connect]); // Reconnect when token or URL changes

  return (
    <WSContext.Provider value={{ connected, send, lastMessage }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWebSocket = (): WSContextType => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error('useWebSocket must be used inside WebSocketProvider');
  }
  return context;
};
