import React, { useEffect } from 'react';
import { Alert, StyleSheet, View, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackHeader from '@/components/BackHeader';
import { StorageKey } from '@/constants/GeneralConstants';
import { useMeStore } from '@/store/useMeStore';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/theme';

const BaseViewScreen = (props: any) => {
    const { title, url } = props.route.params;
    const { userData } = useMeStore();
    const { logout } = useAuth();

    const runFirst = `
        (function() {
        const el = document.getElementsByClassName('bg-info-custom')[0];
        if (el) el.style.display = 'none';
        const header = document.getElementById('header');
        if (header) header.style.display = 'none';
        })();
        true;
    `;

    useEffect(() => {
        getStoreTime();
    }, []);

    const getStoreTime = async () => {
        const credentials: any = await AsyncStorage.getItem(StorageKey.userInfo);
        const parsedCredentials = JSON.parse(credentials);
        if (parsedCredentials) {
            const isAlreadyLogin = parsedCredentials?.state?.loginAt;
            if(isAlreadyLogin){
                if (isAlreadyLogin !== userData?.login_at) {
                Alert.alert('អ្នកប្រើប្រាស់នេះកំពុងប្រើ', 'គណនីរបស់អ្នកត្រូវបានប្រើនូវលើ ទូរស័ព្ទផ្សេងទៀត', [
                    { text: 'យល់ព្រម', onPress: () => onLgout() },
                ]);
                }
            }
        }
    }
    const onLgout = () => {
        logout(userData?.s_phone_login, userData?.s_id);
    };
  
    return (
        <>
        <BackHeader textTitle={title} />
        <WebView
            source={{ uri: url }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
            startInLoadingState
            renderLoading={() => (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.mainColor}/>
            </View>
            )}
            cacheEnabled={false}
            incognito
            injectedJavaScript={runFirst}
            onMessage={(event) => {
                console.log('Message from WebView:', event.nativeEvent.data);
            }}
        />
        </>
    );
};

export default BaseViewScreen;

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    marginBottom: 30,
  },
  loader: {
    flex: 1,
  },
});
