import { goBack, navigate, reset } from "@/navigation/NavigationService";
import { completeLogin, fetchUserDetail, postDeleteUser, postLogout, postRegister, requestOTP, updateMe, uploadProfileImage as uploadProfileImageApi, userLogin } from "@/services/useApi";
import { useAuthStore } from '@/store/useAuthStore';
import { useMeStore } from "@/store/useMeStore";
import { useCallback, useState } from "react";
import * as Keychain from 'react-native-keychain';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { useEVStore } from "@/store/useEVStore";
import { useEVConnector } from "./useEVConnector";
import { StorageKey } from "@/constants/GeneralConstants";

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

    // A login attempt on a phone with no account should fail without sending
    // any OTP — only THEN do we try signup, so at most one OTP ever goes out
    // per submission (calling both endpoints back-to-back would text the
    // user twice for the same attempt).
    const isPhoneNotRegisteredError = (response: any): boolean => {
        const message = String(response?.data?.message || '').toLowerCase();
        return message.includes('not') && (message.includes('found') || message.includes('exist') || message.includes('regist'));
    };

    // Single entry point for the phone number screen: try login first (the
    // common, returning-user case resolves in one call); only a "no account
    // for this number" response falls through to signup — the user never has
    // to pick "log in" vs "sign up" themselves.
    const continueWithPhone = useCallback(async (phoneNumber: string, formattedPhone: string) => {
        setIsLoading(true);
        try {
            const loginResponse = await userLogin({ phone_number: phoneNumber });
            if (loginResponse?.data?.code === '000') {
                navigate('Verify', {
                    phoneNumber: normalizePhoneForOtp(formattedPhone),
                    isForget: true,
                    sessionToken: loginResponse?.data?.data?.session_token || null,
                    expires_in: loginResponse?.data?.data?.expires_in || null,
                });
                return;
            }

            if (!isPhoneNotRegisteredError(loginResponse)) {
                setShowError(true);
                setError(loginResponse?.data?.message || 'Unknown error');
                return;
            }

            const registerResponse = await requestOTP({ phone_number: phoneNumber });
            if (registerResponse?.data?.code === '000') {
                navigate('Verify', {
                    phoneNumber: normalizePhoneForOtp(formattedPhone),
                    isForget: false,
                    sessionToken: registerResponse?.data?.data?.session_token || null,
                    expires_in: registerResponse?.data?.data?.expires_in || null,
                });
            } else {
                setShowError(true);
                setError(registerResponse?.data?.message || 'Unknown error');
            }
        } catch (err: any) {
            setShowError(true);
            setError(err?.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCompleteLogin = useCallback(async (registerToken: string, phoneNumber: string) => {
        setIsLoading(true);
        const data = {
            register_token: registerToken,
        }
        try {
            const response = await completeLogin(data);
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

    const register = async (register_token: string, name:string,password:string ) => {
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
        try {
            const res = await fetchUserDetail();
            if(res?.status === 200){
                setUserData(res?.data?.data);
            }
        } catch (err: any) {
            console.error('fetchUser error:', err);
        } finally {
            setIsLoading(false);
        }
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


    // Clears local session state but keeps the last-used phone number around,
    // so the Auth screen can still pre-fill it on the next login.
    const clearSessionStorage = async () => {
        const lastPhoneNumber = await AsyncStorage.getItem(StorageKey.lastPhoneNumber);
        await AsyncStorage.clear();
        if (lastPhoneNumber) {
            await AsyncStorage.setItem(StorageKey.lastPhoneNumber, lastPhoneNumber);
        }
    };

    const logout = async () => {
        setIsRequesting(true);
        const data = {
            refreshToken: await getToken(),
        }
        const res = await postLogout(data);
        // if(res?.data?.code === '000'){
            setUserData(null);
            setIsUserLogin(false);
            clearEvConnect();
            clearSessionDetail();
            await Keychain.resetGenericPassword();
            await clearSessionStorage();
            reset('Auth');
        // }
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
            await clearSessionStorage();
            reset('Auth');
        }
        setIsRequesting(false);
    }

    const updateProfile = async (data: any): Promise<{ success: boolean; message?: string }> => {
        setIsRequesting(true);
        try {
            const fcmToken = await AsyncStorage.getItem('@fcm_token');
            const deviceId = await DeviceInfo.getUniqueId();
            if (deviceId) {
                data.device_id = deviceId;
            }
            if (fcmToken) {
                data.fcm_token = fcmToken;
            }

            const response = await updateMe(data);
            if (response?.data?.code === '000') {
                await fetchUser();
                goBack();
                return { success: true };
            }
            return { success: false, message: response?.data?.message || 'Failed to update profile' };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Failed to update profile' };
        } finally {
            setIsRequesting(false);
        }
    }

    // Deliberately doesn't touch isLoading/isRequesting: a screen swapping its
    // full body for <Loading /> during a quick avatar change is jarring, so the
    // caller (ProfileScreen) tracks its own localized "uploading" state instead.
    const uploadProfileImage = async (file: { uri: string; type?: string; fileName?: string }): Promise<{ success: boolean; message?: string }> => {
        const formData = new FormData();
        formData.append('file', {
            uri: file.uri,
            type: file.type || 'image/jpeg',
            name: file.fileName || `profile-${Date.now()}.jpg`,
        } as any);

        const response = await uploadProfileImageApi(formData);
        if (response?.data?.code === '000') {
            await fetchUser();
            return { success: true };
        }
        return { success: false, message: response?.data?.message || 'Failed to update profile photo. Please try again.' };
    }

    return {
        isLoading,
        continueWithPhone,
        fetchUser,
        logout,
        error,
        showError,
        setShowError,
        register,
        isRequesting,
        updateProfile,
        uploadProfileImage,
        deleteAccount,
        handleCompleteLogin
    };
}
