import { navigate } from "@/navigation/NavigationService";
import { evtStart, topUp } from "@/services/useApi";
import { useState } from "react";
import { Linking } from "react-native";

export const useTopUp = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const postTopUp = async (amount: string) => {
        setIsLoading(true);
        try {
            const data = {
                "amount": amount,
            }
            const response = await topUp(data);
            if(response?.data?.code === '000'){
                try{
                    navigate('KHQRView', {source: response.data.data.checkout_qr_url, setIsPay: false});
                    // await Linking.openURL(response.data.data.abapay_deeplink);
                }catch(err){
                    // navigate('KHQRView', {source: response.data.data.checkout_qr_url, setIsPay: false});
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

