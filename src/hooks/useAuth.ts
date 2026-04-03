import { goBack, navigate, replace, reset } from "@/navigation/NavigationService";
import { changePassword, checkPhone, fetchUserDetail, postDeleteUser, postLogout, postRegister, requestOTP, resendOTP, updateMe, userLogin, userRegister } from "@/services/useApi";
import { useAuthStore } from '@/store/useAuthStore';
import { useMeStore } from "@/store/useMeStore";
import { useCallback, useState } from "react";
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

    const normalizePhoneForOtp = (phone: string): string => {
        const trimmed = phone.replace(/\s/g, '');
        return trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
    };

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
        } catch (err: any) {
            setIsLoading(false);
            setShowError(true);
            setError(err?.message || 'Login failed. Please check your credentials and try again.');
        }
    }, [setIsUserLogin]);

    const checkPhoneNumber = async (phoneNumber: string, formattedPhone: string,_isForget: boolean = false) => {
        setIsLoading(true); // Start loading
        const data = {
            phone_number: phoneNumber,
        };

        try {
            const response = await requestOTP(data);
            if (response?.data?.code === '000') {
                navigate('Verify', {
                    phoneNumber: normalizePhoneForOtp(formattedPhone),
                    isForget: false,
                    sessionToken: response?.data?.data?.session_token || null,
                    expires_in: response?.data?.data?.expires_in || null,
                });
            } else {
                setShowError(true);
                setError(response?.data?.message || 'Unknown error');
            }
        } catch (err: any) {
            setShowError(true);
            setError(err?.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const checkPhoneNumberAlreadyExist = async (phoneNumber: string, formattedPhone: string,isForget: boolean) => {
        setIsLoading(true); // Start loading
        const data = {
            phone_number: phoneNumber,
        };

        try {
            const response = await checkPhone(data);
            if (response?.data?.code !== '000') {
                const otp = await requestOTP({phone_number: phoneNumber});
                console.log('OTP Response:', otp);
                // navigate('Verify', {
                //     phoneNumber: normalizePhoneForOtp(formattedPhone),
                //     isForget,
                // });
            } else {
                setShowError(true);
                setError(response?.data?.message || 'Unknown error');
            }
        } catch (err: any) {
            setShowError(true);
            setError(err?.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (register_token: string, name:string ,password: string) => {
        setIsLoading(true);
        const data = {
            user_name: name,
            password: password,
            register_token: register_token
        }
        try {
            const response = await postRegister(data);
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
        } catch (err: any) {
            setIsLoading(false);
            setShowError(true);
            setError(err?.message || 'Registration failed. Please try again.');
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
      } catch (err) {
        console.error('Error retrieving token:', err);
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

    const deleteAccount = async () => {
        setIsRequesting(true);
        const response = await postDeleteUser();
        if(response.data?.code === '000'){
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

    const onChangePassword = async (data:any): Promise<boolean> => {
        setIsRequesting(true);
        const response = await changePassword(data);
        if(response.data?.code === '000'){
            await Keychain.setGenericPassword('access_token', response?.data?.data?.access_token || '');
            setIsRequesting(false);
            return true;
        }else{
            setIsRequesting(false);
            setShowError(true);
            setError(response?.data?.message || 'Change password failed. Please try again.');
            return false;
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
        updateProfile,
        checkPhoneNumberAlreadyExist,
        deleteAccount,
        onChangePassword
    };
}
