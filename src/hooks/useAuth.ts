import { goBack, navigate, reset } from "@/navigation/NavigationService";
import { checkPhone, fetchUserDetail, postLogout, updateMe, userLogin, userRegister } from "@/services/useApi";
import { useAuthStore } from '@/store/useAuthStore';
import { useMeStore } from "@/store/useMeStore";
import { useCallback, useState } from "react";
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { useEVStore } from "@/store/useEVStore";
import { useEVConnector } from "./useEVConnector";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const  [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const { setUserData } = useMeStore();
    const { setIsUserLogin } = useAuthStore();
    const { clearEvConnect } = useEVStore();
    const { clearSessionDetail } = useEVConnector();

    const login = useCallback(async (phoneNumber: string, password: string) => {
        setIsLoading(true);
        const data = {
            phone_number: phoneNumber,
            password: password,
        }
        try {
            const response = await userLogin(data);
            if(response?.data?.code === '000'){
                await Keychain.setGenericPassword('access_token', response?.data?.data?.access_token || '');
                setIsUserLogin(true);
                navigate("Main");
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
                   const confirmation = await signInWithPhoneNumber(getAuth(), formattedPhone);

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

    const register = async (phoneNumber: string, name:string ,password: string) => {
        setIsLoading(true);
        const data = {
            phone_number: phoneNumber,
            user_name: name,
            password: password,
        }
        try {
            const response = await userRegister(data);
            if(response?.data?.code === '000'){
                setIsLoading(false);
                await Keychain.setGenericPassword('access_token', response?.data?.data?.access_token || '');
                setIsUserLogin(true);
                navigate("Main");
                return response;
            } else {
                setIsLoading(false);
                setShowError(true);
                const errorData = response?.data?.data;
                const errorMessage = errorData 
                    ? Object.values(errorData).flat().join(', ') 
                    : 'Registration failed. Please try again.';
                setError(errorMessage);}
        } catch (error: any) {
            setIsLoading(false);
            setShowError(true);
            setError(error?.message || 'Registration failed. Please try again.');
        }
    }

    const fetchUser = async () =>{
        setIsLoading(true);
        const res = await fetchUserDetail();
        if(res.status === 200){
            setUserData(res?.data?.data);
        }
        setIsLoading(false);
    }


    const getToken = async (): Promise<string | null> => {
      try {
        const credentials = await Keychain.getGenericPassword();
        return credentials ? credentials.password : null;
      } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
      }
    };
    

    const logout = async () => {
        setIsRequesting(true);
        const data = {
            refreshToken: await getToken(),
        }
        const res = await postLogout(data);
        if(res?.data?.code === '000'){
            setUserData(null);
            setIsUserLogin(false);
            clearEvConnect();
            clearSessionDetail();
            await Keychain.resetGenericPassword();
            await AsyncStorage.clear();
            reset('Login');
        }
        setIsRequesting(false);
    }

    const updateProfile = async (data:any) =>{
        setIsRequesting(true);
        const fcmToken = await AsyncStorage.getItem('@fcm_token');
        const deviceId = await DeviceInfo.getUniqueId();
        if (deviceId) {
            data.device_id = deviceId;
        }
        if (fcmToken) {
            data.fcm_token = fcmToken;
        }

        const response = await updateMe(data)
        if(response.data?.code === '000'){
            setIsRequesting(false);
            fetchUser();
            goBack()
        }else{
            setIsRequesting(false);
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
        checkPhoneNumber,
        register,
        isRequesting,
        updateProfile
    };
}