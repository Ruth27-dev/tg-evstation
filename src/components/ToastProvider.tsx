// src/components/ToastProvider.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type ToastType = 'success' | 'error' | 'info';
interface ToastContextProps {
  showToast: (msg: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps>({ showToast: () => {} });

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current; // start below screen

  const showToast = (msg: string, t: ToastType = 'info') => {
    setMessage(msg);
    setType(t);
    setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 50, duration: 250, useNativeDriver: true }),
          ]).start(() => setVisible(false));
        }, 2000);
      });
    }
  }, [visible]);

  const bgColor =
    type === 'success'
      ? '#22c55e'
      : type === 'error'
      ? '#ef4444'
      : '#3b82f6';

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.container,
            { opacity, transform: [{ translateY }] },
          ]}
        >
          <View style={[styles.toast, { backgroundColor: bgColor }]}>
            <Text style={styles.text}>{message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useGlobalToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // 👈 Show near bottom of screen
    alignSelf: 'center',
    zIndex: 9999,
    width: '100%',
  },
  toast: {
    alignSelf: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: '#fff',
    fontSize: 15,
  },
});
