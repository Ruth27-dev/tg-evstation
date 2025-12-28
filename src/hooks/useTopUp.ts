import { navigate } from "@/navigation/NavigationService";
import {  topUp } from "@/services/useApi";
import { useState } from "react";
import { Linking } from "react-native";
import { useTransactionPolling } from "@/context/TransactionPollingProvider";

export const useTopUp = () => {
    const { startPolling } = useTransactionPolling();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const postTopUp = async (amount: string, type: string,promotionId?: string | null) => {
        setIsLoading(true);
        try {
            const data = {
                "amount": amount,
                "payment_option": type,
                "promotion_id": promotionId
            }
            const response = await topUp(data);
            if(response?.data?.code === '000'){
                const transactionId = response.data.data?.id || response.data.data?.transaction_id;
                
                // Start polling for transaction status
                if (transactionId) {
                    console.log('Transaction initiated, starting polling for ID:', transactionId);
                    startPolling(transactionId);
                }

                if(response.data.data.redirectUrl){
                    navigate('KHQRView', {source: response.data.data.redirectUrl, setIsPay: false});
                }else{
                    Linking.openURL(response.data.data.abapay_deeplink);
                    navigate('KHQRView', {source: response.data.data.checkout_qr_url, setIsPay: false});
                }
                
            }
            return response;
        } catch (error) {
            console.error("Error fetching station:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    
    return {
        postTopUp,
        isLoading,
    };
}

