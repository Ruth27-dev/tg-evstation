import React, { createContext, useContext, useRef, useEffect } from 'react';
import { verifyTransaction } from '@/services/useApi';
import { useWallet } from '@/hooks/useWallet';
import { navigate } from '@/navigation/NavigationService';
import { useWebSocket } from './WebSocketProvider';
import { useTopupStore } from '@/store/useTopupStore';

interface TransactionPollingContextType {
  startPolling: (transactionId: string) => void;
  stopPolling: () => void;
  checkTransactionNow: () => void;
}

const TransactionPollingContext = createContext<TransactionPollingContextType | undefined>(undefined);

interface TransactionPollingProviderProps {
  children: React.ReactNode;
}

export const TransactionPollingProvider: React.FC<TransactionPollingProviderProps> = ({ children }) => {
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transactionIdRef = useRef<string | null>(null);
  const { getMeWallet, getMeTransactions } = useWallet();
  const { lastMessage } = useWebSocket();
  const { clearOrderId } = useTopupStore()

  // Stop polling function
  const stopPolling = () => {
    console.log('Stopping transaction polling');
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
    transactionIdRef.current = null;
    clearOrderId();
  };

  // Check transaction status
  const checkTransactionStatus = async () => {
    if (!transactionIdRef.current) return;

    try {
      console.log('Checking transaction status for:', transactionIdRef.current);
      const response = await verifyTransaction({ 
        transaction_id: transactionIdRef.current 
      });

      if (response?.data?.code === '000') {
        const data = response.data.data;
        console.log('Transaction status:', data?.status);

        // Check if payment is approved
        if (data?.status === 'APPROVED') {
          console.log('Transaction APPROVED via polling, stopping');
          stopPolling();
          getMeWallet();
          getMeTransactions(1);
          navigate("PaymentSuccess", {
            amount: data?.amount,
            transactionId: data?.id,
            date: data?.created_at,
          });
        }
      }
    } catch (error) {
      console.error('Transaction polling error:', error);
    }
  };

  // Start polling function
  const startPolling = (transactionId: string) => {
    if (!transactionId) {
      console.warn('Cannot start polling: transactionId is null');
      return;
    }

    console.log('Starting transaction polling for:', transactionId);
    
    // Stop any existing polling first
    stopPolling();

    // Set transaction ID
    transactionIdRef.current = transactionId;

    // Immediate first check
    checkTransactionStatus();

    // Poll every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      checkTransactionStatus();
    }, 3000);

    // Stop after 5 minutes (300000ms)
    pollingTimeoutRef.current = setTimeout(() => {
      console.log('Transaction polling timeout after 5 minutes');
      stopPolling();
    }, 300000);
  };

  // Listen to WebSocket messages
  useEffect(() => {
    if (lastMessage && lastMessage.event_type === 'WALLET_TOPUP_SUCCESS') {
      console.log('WALLET_TOPUP_SUCCESS received via WebSocket, stopping polling');
      stopPolling();
    }
  }, [lastMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  // Expose checkTransactionStatus for manual checks
  const checkTransactionNow = () => {
    if (transactionIdRef.current) {
      console.log('Manual transaction check triggered');
      checkTransactionStatus();
    }
  };

  return (
    <TransactionPollingContext.Provider value={{ startPolling, stopPolling, checkTransactionNow }}>
      {children}
    </TransactionPollingContext.Provider>
  );
};

export const useTransactionPolling = (): TransactionPollingContextType => {
  const context = useContext(TransactionPollingContext);
  if (!context) {
    throw new Error('useTransactionPolling must be used inside TransactionPollingProvider');
  }
  return context;
};
