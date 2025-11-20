import { NewAppScreen } from '@react-native/new-app-screen';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import RouteContainer from './src/navigation/RouteContainer';
import { navigationRef } from './src/navigation/NavigationService';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ToastProvider';

function App() {
  if (__DEV__) {
    require("./ReactotronConfig");
  }
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <NavigationContainer ref={navigationRef}>
            <StatusBar barStyle="light-content" />
            <RouteContainer />
          </NavigationContainer>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
