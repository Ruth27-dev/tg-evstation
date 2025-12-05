import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface NetworkState {
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    type: string | null;
}

export const useNetworkConnection = () => {
    const [networkState, setNetworkState] = useState<NetworkState>({
        isConnected: null,
        isInternetReachable: null,
        type: null,
    });

    useEffect(() => {
        const getInitialState = async () => {
            const state = await NetInfo.fetch();
            setNetworkState({
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
            });
        };

        getInitialState();

        const unsubscribe = NetInfo.addEventListener((state) => {
            setNetworkState({
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
            });
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return {
        isConnected: networkState.isConnected,
        isInternetReachable: networkState.isInternetReachable,
        connectionType: networkState.type,
        isOffline: networkState.isConnected === false,
    };
};
