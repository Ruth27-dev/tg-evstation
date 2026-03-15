import { navigate } from "@/navigation/NavigationService";
import {  topUp } from "@/services/useApi";
import { useState } from "react";
import { Alert, Linking, Platform } from "react-native";
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
                const redirectUrl = response.data.data?.redirectUrl;
                const deepLink = response.data.data?.abapay_deeplink;
                const checkoutQrUrl = response.data.data?.checkout_qr_url;
                
                if (transactionId) {
                    startPolling(transactionId);
                }
                if(redirectUrl){
                    navigate('KHQRView', {source: redirectUrl, setIsPay: false});
                }else if(checkoutQrUrl){
                    navigate('KHQRView', {source: checkoutQrUrl, setIsPay: false});

                    if (deepLink) {
                        try {
                            if (Platform.OS === "android") {
                                setTimeout(() => {
                                    Linking.openURL(deepLink).catch((err) => {
                                        console.warn("Failed to open ABA deep link:", err);
                                    });
                                }, 200);
                            } else {
                                await Linking.openURL(deepLink);
                            }
                        } catch (err) {
                            console.warn("Failed to open ABA deep link:", err);
                        }
                    }
                }else{
                    Alert.alert('Top up failed', 'No payment URL received. Please try again.');
                }
            }else{
                Alert.alert('Top up failed', response?.data?.message || 'Please try again.');
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
