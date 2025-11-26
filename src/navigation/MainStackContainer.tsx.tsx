import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashScreen from '@/containers/SplashScreen';
import LoginScreen from '@/containers/LoginScreen';
import BaseViewScreen from '@/containers/BaseViewScreen';
import ForgetPasswordScreen from '@/containers/ForgetPasswordScreen';
import VerifyScreen from '@/containers/VerifyScreen';
import RegisterScreen from '@/containers/RegisterScreen';
import CreateAccountScreen from '@/containers/CreateAccountScreen';
import HistoryScreen from '@/containers/main/HistoryScreen';
import ConnectorScreen from '@/containers/main/ConnectorScreen';
import WalletScreen from '@/containers/main/WalletScreen';
import SettingScreen from '@/containers/main/SettingScreen';
import CustomBottomMenu from '@/components/CustomBottomMenu';
import HomeScreen from '@/containers/main/HomeScreen';
import StationDetailScreen from '@/containers/home/StationDetailScreen';
import HistoryDetailScreen from '@/containers/history/HistoryDetailScreen';
import ProfileScreen from '@/containers/settings/ProfileScreen';
import ChangePasswordScreen from '@/containers/settings/ChangePasswordScreen';
import ChangeLanguageScreen from '@/containers/settings/ChangeLanguageScreen';
import CustomerSupportScreen from '@/containers/settings/CustomerSupportScreen';
import PrivacyScreen from '@/containers/settings/PrivacyScreen';
import AboutUsScreen from '@/containers/settings/AboutUsScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MainStackContainer = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
          animation: 'ios_from_right',
        }}>
        <Stack.Screen
          name={'SplashScreen'}
          component={SplashScreen}
          options={{gestureEnabled: false, animation: 'fade'}}
        />
        <Stack.Screen name={'Login'} component={LoginScreen} />
        <Stack.Screen name={'ForgetPassword'} component={ForgetPasswordScreen} />
        <Stack.Screen name={'Verify'} component={VerifyScreen} />
        <Stack.Screen name={'Register'} component={RegisterScreen} />
        <Stack.Screen name={'CreateAccount'} component={CreateAccountScreen} />
        <Stack.Screen name={'Main'} component={BottomTabContainer} />
        <Stack.Screen name={'BaseViewScreen'} component={BaseViewScreen} />
        <Stack.Screen name={'StationDetail'} component={StationDetailScreen} />
        <Stack.Screen name={'HistoryDetail'} component={HistoryDetailScreen} />
        <Stack.Screen name={'ProfileScreen'} component={ProfileScreen} />
        <Stack.Screen name={'ChangePasswordScreen'} component={ChangePasswordScreen} />
        <Stack.Screen name={'ChangeLanguageScreen'} component={ChangeLanguageScreen} />
        <Stack.Screen name={'CustomerSupportScreen'} component={CustomerSupportScreen} />
        <Stack.Screen name={'PrivacyScreen'} component={PrivacyScreen} />
        <Stack.Screen name={'AboutUsScreen'} component={AboutUsScreen} />
      </Stack.Navigator>
    </>
  );
};

const BottomTabContainer = () => {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      tabBar={(props: any) => <CustomBottomMenu {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name={'Home'} component={HomeScreen}/>
      <Tab.Screen name={'History'} component={HistoryScreen} />
      <Tab.Screen name={'Connector'} component={ConnectorScreen} />
      <Tab.Screen name={'Wallet'} component={WalletScreen} />
      <Tab.Screen name={'Setting'} component={SettingScreen} />
    </Tab.Navigator>
  );
};


export default MainStackContainer;
