import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Linking, Platform } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

const ANDROID_CHANNEL_ID = 'tg-evstation';
const CHARGING_DETAIL_ROUTE = 'ChargingDetail';
const PENDING_NOTIFICATION_DEEP_LINK_KEY = '@pending_notification_deep_link';

const openNotificationTarget = (data?: Record<string, unknown>) => {
  const deepLink = typeof data?.deepLink === 'string' ? data.deepLink : undefined;
  const screen = typeof data?.screen === 'string' ? data.screen : undefined;

  if (deepLink) {
    Linking.openURL(deepLink).catch((error) => {
      console.warn('Failed to open notification deep link:', error);
    });
    return;
  }

  if (screen === CHARGING_DETAIL_ROUTE) {
    Linking.openURL('tanevcharger://charging-detail').catch((error) => {
      console.warn('Failed to open charging detail deep link:', error);
    });
  }
};

const consumePendingNotificationTarget = async () => {
  const deepLink = await AsyncStorage.getItem(PENDING_NOTIFICATION_DEEP_LINK_KEY);
  if (!deepLink) {
    return;
  }

  await AsyncStorage.removeItem(PENDING_NOTIFICATION_DEEP_LINK_KEY);
  openNotificationTarget({ deepLink });
};

export async function setupNotifications() {
  // Request runtime permissions: iOS alert/badge/sound + Android 13+
  await messaging().requestPermission();
  await notifee.requestPermission();

  // Create a HIGH-importance channel so heads-up banners appear on Android
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: ANDROID_CHANNEL_ID,
      name: 'Default',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  }

  // Foreground messages → show a local notification yourself
  messaging().onMessage(async (rm) => {
    if (isOtpMessage(rm)) {
      return;
    }
    if (Platform.OS === 'ios') {
      // Do not show foreground alerts on iOS (can interfere with OTP UX)
      return;
    }
    console.log(rm);
    await displayFromRemoteMessage(rm);
  });

  // Optional: handle taps while app is open
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      openNotificationTarget(detail.notification?.data);
    }
  });

  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification?.pressAction && initialNotification.notification) {
    openNotificationTarget(initialNotification.notification.data);
  }

  await consumePendingNotificationTarget();

  const appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      consumePendingNotificationTarget();
    }
  });

  return () => appStateSubscription.remove();
}

export async function displayFromRemoteMessage(rm: FirebaseMessagingTypes.RemoteMessage) {
  if (isOtpMessage(rm)) {
    return;
  }
  if (Platform.OS === 'ios') {
    return;
  }
  const title:any = rm.notification?.title ?? rm.data?.title ?? 'Notification';
  const body:any  = rm.notification?.body  ?? rm.data?.body  ?? '';

  await notifee.displayNotification({
    title,
    body,
    data: rm.data,
    android: {
      channelId: ANDROID_CHANNEL_ID,
    //   smallIcon: 'ic_stat_notification', // must exist in res/drawable*
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default' },
    },
    ios: {
      // This line is what makes iOS show an alert while app is in foreground
      foregroundPresentationOptions: { banner: true, list: true, sound: true, badge: true },
      sound: 'default',
    },
  });
}

function isOtpMessage(rm: FirebaseMessagingTypes.RemoteMessage): boolean {
  const title = (rm.notification?.title ?? rm.data?.title ?? '').toString().toLowerCase();
  const body = (rm.notification?.body ?? rm.data?.body ?? '').toString().toLowerCase();
  const dataType = (rm.data?.type ?? rm.data?.notification_type ?? rm.data?.category ?? '').toString().toLowerCase();

  return (
    title.includes('otp') ||
    body.includes('otp') ||
    title.includes('verification') ||
    body.includes('verification') ||
    dataType.includes('otp') ||
    dataType.includes('verification') ||
    dataType.includes('auth')
  );
}

// Quick local test to ensure Notifee is wired correctly
export async function debugLocalNotification() {
  await notifee.displayNotification({
    title: 'Test while foreground',
    body: 'If you see this, Notifee is working.',
    android: { channelId: ANDROID_CHANNEL_ID, importance: AndroidImportance.HIGH },
    ios: { foregroundPresentationOptions: { banner: true, list: true, sound: true, badge: true } },
  });
}
