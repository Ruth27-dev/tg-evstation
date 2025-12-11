import { useEVConnector } from '@/hooks/useEVConnector';
import { useWallet } from '@/hooks/useWallet';
import { navigate } from '@/navigation/NavigationService';
import { useEVStore } from '@/store/useEVStore';
import { isEmpty } from 'lodash';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as Keychain from 'react-native-keychain';

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
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const { getMeWallet, getMeTransactions } = useWallet();
  const { clearEvConnect, setSessionDetail, clearSessionDetail,sessionDetail,evConnect } = useEVStore();
  const { getSessionDetail } = useEVConnector();
  
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setAccessToken(token);
    };

    fetchToken();
  }, []);

  const connect = () => {
    if (!accessToken) return;

    const url = `wss://tgevstation.com/ws/mobile?token=${accessToken}`; 
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setConnected(true);
      
      // Check if there's an active charging session when reconnecting
      if (!isEmpty(evConnect) && evConnect?.session_id) {
        const sessionId = evConnect.session_id;
        getSessionDetail(sessionId);
      }
    };
    ws.current.onmessage = (event) => {
		// console.log("RAW MESSAGE:", event.data);

		try {
			const data: WSMessage = JSON.parse(event.data);
			// console.log("PARSED:", data);

			setLastMessage(data);

			if (data.event_type === "WALLET_TOPUP_SUCCESS") {
        getMeWallet();
        getMeTransactions(1);
        navigate("PaymentSuccess", {
          amount: data.data?.amount,
          transactionId: data.data?.id,
          date: data.data?.created_at,
        });
			}else if (data.event_type === "START_CHARGING") {
        navigate("ChargingDetail");
      }else if (data.event_type === "STOP_CHARGING") {
        navigate("ChargingSuccess");
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
      setTimeout(connect, 2000); // Attempt to reconnect after 2 seconds
    };
  };

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
      ws.current?.close(); // Cleanup WebSocket on unmount
    };
  }, [accessToken]); // Reconnect when token or URL changes

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
