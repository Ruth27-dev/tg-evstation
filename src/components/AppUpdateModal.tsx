import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';

interface AppUpdateModalProps {
  visible: boolean;
  latestVersion: string;
  message?: string;
  force?: boolean;
  onUpdate: () => void;
  onLater?: () => void;
}

const AppUpdateModal = ({
  visible,
  latestVersion,
  message,
  force = false,
  onUpdate,
  onLater,
}: AppUpdateModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.subtitle}>
            {message || `A new version (${latestVersion}) is available.`}
          </Text>
          <View style={styles.actions}>
            {!force && (
              <TouchableOpacity onPress={onLater} style={styles.laterButton}>
                <Text style={styles.laterText}>Later</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onUpdate} style={styles.updateButton}>
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppUpdateModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: FontSize.large + 2,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.mainColor,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  laterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  laterText: {
    fontSize: FontSize.small + 1,
    fontFamily: CustomFontConstant.EnBold,
    color: '#374151',
  },
  updateButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.mainColor,
  },
  updateText: {
    fontSize: FontSize.small + 1,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.white,
  },
});

