/**
 * @format
 */

import { AppRegistry,LogBox } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-get-random-values';
import 'react-native-quick-crypto';
LogBox.ignoreAllLogs(true);

const PENDING_NOTIFICATION_DEEP_LINK_KEY = '@pending_notification_deep_link';

// Keeps the charging-session foreground service notification alive on Android;
// the promise intentionally never resolves while the service is running.
notifee.registerForegroundService(() => new Promise(() => {}));

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.PRESS) {
    return;
  }

  const deepLink = detail.notification?.data?.deepLink;
  if (typeof deepLink === 'string') {
    await AsyncStorage.setItem(PENDING_NOTIFICATION_DEEP_LINK_KEY, deepLink);
  }
});

AppRegistry.registerComponent(appName, () => App);
