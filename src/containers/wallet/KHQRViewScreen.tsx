import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, AppState, BackHandler, Linking, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import { Colors } from '@/theme';
import BaseComponent from '@/components/BaseComponent';


const KHQRViewScreen = (props: any) => {
  const {source, setIsPay} = props.route.params;
  const isFocused = useIsFocused();

  const handledSuccessRef = useRef(false);           // persist across renders
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const sub = AppState.addEventListener('change', (state) => {
    });
    return () => {
      mountedRef.current = false;
      sub.remove();
    };
  }, [isFocused]); // ok if it re-subscribes when coming back to this screen

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        try { setIsPay?.(true); } catch {}
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [setIsPay])
  );


  const isSuccessUrl = (url: string) =>{
  }
    // !!url && (url === SUCCESS_URL || url.startsWith(SUCCESS_URL) || url.includes('status=success'));

  // Intercept navigations BEFORE they happen (more stable than relying solely on onNavigationStateChange)
  const onShouldStartLoadWithRequest = useCallback((req:any) => {
    const url = req?.url ?? '';
    if (!url) return true;

    // Success callback
    if (!handledSuccessRef.current && isSuccessUrl(url)) {
      handledSuccessRef.current = true;
      try { setIsPay?.(true); } catch {}
      return false;
    }

    // Allow our http(s) pages
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('about:blank')) {
      return true;
    }

    Linking.openURL(url).catch(() => {});
    return false;
  }, [setIsPay]);

  const onNavigationStateChange = useCallback((navState:any) => {
    const url = navState?.url ?? '';
    if (!url) return;
    if (!handledSuccessRef.current && isSuccessUrl(url)) {
      handledSuccessRef.current = true;
      try { setIsPay?.(true); } catch {}
    }
  }, [setIsPay]);
  return (
    <BaseComponent isBack={true}>
        <WebView
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            setSupportMultipleWindows={false}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            startInLoadingState
            renderLoading={() => (
                <View style={{flex: 1, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color={Colors.mainColor} />
                </View>
            )}
            source={{ uri: source }}
            mixedContentMode="always"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        onNavigationStateChange={onNavigationStateChange}
        />
    </BaseComponent>
  );
};

export default KHQRViewScreen;
