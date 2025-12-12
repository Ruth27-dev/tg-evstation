import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TransactionCancelToastProps {
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const TransactionCancelToast: React.FC<TransactionCancelToastProps> = ({
  visible,
  onHide,
  duration = 3000,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide down and fade in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.toast}>
        <View style={styles.iconContainer}>
          <Ionicons name="close-circle" size={24} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Transaction Cancelled</Text>
          <Text style={styles.message}>Your payment has been cancelled</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 50,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnBold,
    color: '#fff',
    marginBottom: 2,
  },
  message: {
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#fff',
    opacity: 0.9,
  },
});

export default TransactionCancelToast;
