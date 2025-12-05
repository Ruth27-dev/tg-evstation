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

  return (
    <BaseComponent isBack={true}>
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
