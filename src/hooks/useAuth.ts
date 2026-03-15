import { goBack, navigate, reset } from "@/navigation/NavigationService";
import { changePassword, checkPhone, fetchUserDetail, postDeleteUser, postLogout, updateMe, userLogin, userRegister } from "@/services/useApi";
import { useAuthStore } from '@/store/useAuthStore';
import { useMeStore } from "@/store/useMeStore";
import { useCallback, useState } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { useEVStore } from "@/store/useEVStore";
import { useEVConnector } from "./useEVConnector";

export const useAuth = () => {
    const SKIP_OTP = true; // Temporary bypass for all environments
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

    const getOtpErrorMessage = (err: any): string => {
        switch (err?.code) {
            case 'auth/invalid-phone-number':
                return 'Invalid phone number format.';
            case 'auth/too-many-requests':
                return 'Too many requests. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            case 'auth/captcha-check-failed':
                return 'Verification check failed. Please try again.';
            case 'auth/invalid-app-credential':
                return 'App verification failed. Please restart and try again.';
            default:
                return err?.message || 'Failed to send OTP. Please try again.';
        }
    };

    const sendOtp = async (phone: string): Promise<FirebaseAuthTypes.ConfirmationResult | null> => {
        try {
            const normalizedPhone = normalizePhoneForOtp(phone);
            console.log('Attempting to send OTP to:', normalizedPhone);
            return await auth().signInWithPhoneNumber(normalizedPhone);
        } catch (err: any) {
            console.error('Error during phone sign-in:', err);
            setShowError(true);
            setError(getOtpErrorMessage(err));
            return null;
        }
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
            const response = await checkPhone(data);
            if (response?.data?.code === '000') {
                if (SKIP_OTP) {
                    navigate('CreateAccount', { phoneNumber: normalizePhoneForOtp(formattedPhone) });
                    return;
                }
                const confirmation = await sendOtp(formattedPhone);
                if (confirmation) {
                    navigate('Verify', { 
                        phoneNumber: normalizePhoneForOtp(formattedPhone),
                        confirmation,
                    });
                }
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
                if (SKIP_OTP) {
                    if (isForget) {
                        navigate('ChangePasswordScreen');
                    } else {
                        navigate('CreateAccount', { phoneNumber: normalizePhoneForOtp(formattedPhone) });
                    }
                    return;
                }
                const confirmation = await sendOtp(formattedPhone);
                if (confirmation) {
                    navigate('Verify', { 
                        phoneNumber: normalizePhoneForOtp(formattedPhone),
                        confirmation,
                        isForget,
                    });
                }
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
