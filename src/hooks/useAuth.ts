import { navigate, reset } from "@/navigation/NavigationService";
import { fetchUserDetail, postLogout, userLogin } from "@/services/useApi";
import { useAuthStore } from '@/store/useAuthStore';
import { useMeStore } from "@/store/useMeStore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setUserData } = useMeStore();
    const { setIsUserLogin, setLoginAt } = useAuthStore();
   
    const getDeviceName = async () =>{
        const deviceName = await DeviceInfo.getDeviceName();
		const deviceType = Platform.OS;
		return deviceType + "-" + deviceName;
    }

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        const data = {
            s_phone_login: username,
            s_password: password,
            platform_type: await getDeviceName(),
        }
        userLogin(data)
            .then((response) => {
                if(response.status === 200){
		            navigate('ConfirmScreen',{loginPhone:username,loginResponse:response.data});
                } else {
                    Alert.alert("Login Failed", "Your username and password is wrong or inactive account!");
                }
            })
            .catch((error) => {
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
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
            setLoginAt(null);
            reset('LoginScreen');
        }
    }
    return {
        isLoading,
        login,
        fetchUser,
        logout
    };
}