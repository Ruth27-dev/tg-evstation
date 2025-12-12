import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TransactionCancelAlertProps {
  visible: boolean;
  onDismiss: () => void;
}

const TransactionCancelAlert: React.FC<TransactionCancelAlertProps> = ({
  visible,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="close-circle" size={60} color="#EF4444" />
          </View>

          <Text style={styles.title}>Transaction Cancelled</Text>
          
          <Text style={styles.message}>
            Your transaction has been cancelled. You can initiate a new payment anytime.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onDismiss}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: FontSize.large,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.mainColor,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#EF4444',
  },
  cancelButtonText: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.mainColor,
  },
  confirmButtonText: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.white,
  },
});

export default TransactionCancelAlert;
