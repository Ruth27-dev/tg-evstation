import { navigate, reset } from "@/navigation/NavigationService";
import { checkPhone, fetchUserDetail, postLogout, userLogin } from "@/services/useApi";
import { useAuthStore } from '@/store/useAuthStore';
import { useMeStore } from "@/store/useMeStore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import auth from '@react-native-firebase/auth';


export const useAuth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const  [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    
    const { setUserData } = useMeStore();
    const { setIsUserLogin } = useAuthStore();
   
    const login = useCallback(async (phoneNumber: string, password: string) => {
        setIsLoading(true);
        const data = {
            phone_number: phoneNumber,
            password: password,
        }
        try {
            const response = await userLogin(data);
            if(response?.data?.code === '000'){
                // navigate('ConfirmScreen',{loginPhone:phoneNumber,loginResponse:response.data});
                setIsLoading(false);
                return response;
            } else {
                setIsLoading(false);
                setShowError(true);
                setError(response?.data?.message || 'Login failed. Please check your credentials and try again.');}
        } catch (error: any) {
            setIsLoading(false);
            setShowError(true);
            setError(error?.message || 'Login failed. Please check your credentials and try again.');
        }
    }, []);

    const checkPhoneNumber = async (phoneNumber: string, formattedPhone: string) => {
        setIsLoading(true); // Start loading
        const data = {
            phone_number: phoneNumber,
        };

        try {
            const response = await checkPhone(data);
            if (response?.data?.code === '000') {
                try {
                    const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
                    navigate('Verify', { 
                        phoneNumber: formattedPhone,
                        confirmation: confirmation,
                    });
                } catch (error: any) {
                    console.error('Error during phone sign-in:', error);
                    let errorMessage = 'Failed to send OTP. Please try again.';
                    if (error.code === 'auth/invalid-phone-number') {
                        errorMessage = 'Invalid phone number format.';
                    } else if (error.code === 'auth/too-many-requests') {
                        errorMessage = 'Too many requests. Please try again later.';
                    } else if (error.code === 'auth/network-request-failed') {
                        errorMessage = 'Network error. Please check your connection.';
                    } else {
                        errorMessage = error?.message || 'An unexpected error occurred.';
                    }

                    setShowError(true);
                    setError(errorMessage);
                }
            } else {
                setShowError(true);
                setError(response?.data?.message || 'Unknown error');
            }
        } catch (error: any) {
            setShowError(true);
            setError(error?.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };


    const fetchUser = async () =>{
        const res = await fetchUserDetail();
        if(res.status === 200){
            setUserData(res?.data?.data);
        }
    }

    const logout = async (username: any, s_id: any) => {
        const data = {
            s_phone_login: username,
            s_id: s_id,
        }
        const res = await postLogout(data);
        if(res.status === 200){
            setUserData(null);
            setIsUserLogin(false);
            reset('LoginScreen');
        }
    }
    return {
        isLoading,
        login,
        fetchUser,
        logout,
        error,
        showError,
        setShowError,
        checkPhoneNumber
    };
}