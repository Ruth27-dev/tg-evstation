import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, AppState, BackHandler, Linking, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {useFocusEffect } from '@react-navigation/native';
import { Colors } from '@/theme';
import BaseComponent from '@/components/BaseComponent';
import { useTransactionPolling } from '@/context/TransactionPollingProvider';


const KHQRViewScreen = (props: any) => {
  const {source, setIsPay} = props.route.params;
  const { stopPolling, checkTransactionNow } = useTransactionPolling();
  const appStateRef = useRef(AppState.currentState);

  // Listen to app state changes (when user returns from banking app)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkTransactionNow();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      // Stop polling when user leaves the screen
      console.log('Leaving KHQR screen, stopping transaction polling');
      stopPolling();
    };
  }, []); // Empty dependency array - only run on mount/unmount

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        try { 
          setIsPay?.(true); 
          stopPolling();

        } catch {}
        return false;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [setIsPay])
  );

  return (
    <BaseComponent 
      isBack={true}
    >
        <WebView
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            setSupportMultipleWindows={false}
            startInLoadingState
            renderLoading={() => (
                <View style={{flex: 1, backgroundColor: Colors.white}}>
                    <ActivityIndicator size="large" color={Colors.mainColor} />
                </View>
            )}
            source={{ uri: source }}
            mixedContentMode="always"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />
       
    </BaseComponent>
  );
};

export default KHQRViewScreen;
