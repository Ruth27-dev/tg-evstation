import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

class NotificationService {

  static async requestFCMPermission() {
    try {
      if (Platform.OS === 'ios') {
        const hasPermission = await messaging().hasPermission();
        if (hasPermission === messaging.AuthorizationStatus.AUTHORIZED) {
          console.log('Notification permission already granted.');
          return await this.getFCMToken();
        }
      }

      const authStatus = await messaging().requestPermission();
      const isAuthorized =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isAuthorized) {
        console.log('Notification permission granted.');
        return await this.getFCMToken();
      } else {
        Alert.alert('Permission Denied', 'Enable notifications in settings.');
        return null;
      }
    } catch (error) {
      console.error('Error requesting FCM permission:', error);
      return null;
    }
  }

  static async getFCMToken() {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Error fetching FCM token:', error);
      return null;
    }
  }

  static registerNotificationListeners() {
    messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage?.notification) {
        console.log('Foreground Notification:', remoteMessage);
        // Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
      }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background Notification:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification opened from quit state:', remoteMessage);
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background:', remoteMessage);
    });
  }
}

export default NotificationService;
