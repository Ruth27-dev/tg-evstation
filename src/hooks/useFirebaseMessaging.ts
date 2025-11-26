import { useEffect, useState } from 'react';
import FirebaseMessagingService from '@/services/FirebaseMessagingService';

interface UseFirebaseMessaging {
  fcmToken: string | null;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  deleteToken: () => Promise<void>;
  subscribeToTopic: (topic: string) => Promise<void>;
  unsubscribeFromTopic: (topic: string) => Promise<void>;
}

export const useFirebaseMessaging = (): UseFirebaseMessaging => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeMessaging();

    return () => {
      FirebaseMessagingService.cleanup();
    };
  }, []);

  const initializeMessaging = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize Firebase Messaging
      await FirebaseMessagingService.initialize();

      // Get FCM token
      const token = await FirebaseMessagingService.getFCMToken();
      setFcmToken(token);
    } catch (err: any) {
      console.error('Error initializing Firebase Messaging:', err);
      setError(err.message || 'Failed to initialize messaging');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await FirebaseMessagingService.getFCMToken();
      setFcmToken(token);
    } catch (err: any) {
      console.error('Error refreshing token:', err);
      setError(err.message || 'Failed to refresh token');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteToken = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await FirebaseMessagingService.deleteToken();
      setFcmToken(null);
    } catch (err: any) {
      console.error('Error deleting token:', err);
      setError(err.message || 'Failed to delete token');
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToTopic = async (topic: string) => {
    try {
      await FirebaseMessagingService.subscribeToTopic(topic);
    } catch (err: any) {
      console.error(`Error subscribing to topic ${topic}:`, err);
      setError(err.message || 'Failed to subscribe to topic');
    }
  };

  const unsubscribeFromTopic = async (topic: string) => {
    try {
      await FirebaseMessagingService.unsubscribeFromTopic(topic);
    } catch (err: any) {
      console.error(`Error unsubscribing from topic ${topic}:`, err);
      setError(err.message || 'Failed to unsubscribe from topic');
    }
  };

  return {
    fcmToken,
    isLoading,
    error,
    refreshToken,
    deleteToken,
    subscribeToTopic,
    unsubscribeFromTopic,
  };
};
