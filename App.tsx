import { NavigationContainer } from '@react-navigation/native';
import { Linking, StatusBar, Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RouteContainer from './src/navigation/RouteContainer';
import { navigationRef } from './src/navigation/NavigationService';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ToastProvider';
import { useEffect, useState } from 'react';
import FirebaseMessagingService from '@/services/FirebaseMessagingService';
import DeviceRegistrationService from '@/services/DeviceRegistrationService';
import { WebSocketProvider } from '@/context/WebSocketProvider';
import { TransactionPollingProvider } from '@/context/TransactionPollingProvider';
import { useNetworkConnection } from '@/hooks/useNetworkConnection';
import NoInternet from '@/components/NoInternet';
import Toast from 'react-native-toast-message';
import { setupNotifications } from '@/services/notifications';
import AppUpdateModal from '@/components/AppUpdateModal';
import { checkForAppUpdate, AppUpdateInfo } from '@/services/appUpdate';
import { ChargingPresenceManager } from '@/services/chargingPresence/ChargingPresenceManager';

if ((Text as any).defaultProps?.allowFontScaling !== false) {
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.allowFontScaling = false;
}

if ((TextInput as any).defaultProps?.allowFontScaling !== false) {
  (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
  (TextInput as any).defaultProps.allowFontScaling = false;
}

function App() {
  const { isConnected } = useNetworkConnection();
  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  if (__DEV__) {
    require("./ReactotronConfig");
  }

  useEffect(() => {
    const initializeApp = async () => {
      DeviceRegistrationService.setApiBaseUrl('http://evcharger.it.com');
      await FirebaseMessagingService.initialize();
      // Subscribe all installed users to announcement topic
      await FirebaseMessagingService.subscribeToTopic('announcement');
    };

    initializeApp();

    return () => {
      FirebaseMessagingService.cleanup();
    };
  }, []);
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    setupNotifications().then((unsubscribe) => {
      cleanup = unsubscribe;
    });

    return () => {
      cleanup?.();
    };
  }, []);
  useEffect(() => {
    const runUpdateCheck = async () => {
      const info = await checkForAppUpdate();
      if (info?.shouldUpdate) {
        setUpdateInfo(info);
        setShowUpdateModal(true);
      }
    };
    runUpdateCheck();
  }, []);
  const linking = {
    prefixes: [
      "tanevcharger://",
    ],
    config: {
      screens: {
        Main: "main",
        ChargingDetail: "charging-detail",
        PaymentSuccess: "payment-success",
      },
    },
  };

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <WebSocketProvider>
            <TransactionPollingProvider>
              <NavigationContainer ref={navigationRef} linking={linking}>
                <StatusBar barStyle="dark-content" />
                <RouteContainer />
              </NavigationContainer>
              <ChargingPresenceManager />
            </TransactionPollingProvider>
          </WebSocketProvider>
          {/* {updateInfo && (
            <AppUpdateModal
              visible={showUpdateModal}
              latestVersion={updateInfo.latestVersion}
              message={updateInfo.message}
              force={updateInfo.force}
              onLater={() => setShowUpdateModal(false)}
              onUpdate={() => {
                if (updateInfo.storeUrl) {
                  Linking.openURL(updateInfo.storeUrl);
                }
              }}
            />
          )} */}
          {!isConnected && (<NoInternet/>)}
          <Toast />
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
