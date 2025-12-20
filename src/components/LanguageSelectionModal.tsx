import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal from '@/components/CustomModal';
import KhmerIcon from '@/assets/icon/kh.svg';
import EnglishIcon from '@/assets/icon/en.svg';
import ChinaIcon from '@/assets/icon/china.svg';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageStore } from '@/store/useTranslateStore';

export interface LanguageSelectionModalRef {
  showModal: () => void;
  hideModal: () => void;
}

const LanguageSelectionModal = forwardRef<LanguageSelectionModalRef>((props, ref) => {
  const { t, currentLanguage } = useTranslation();
  const { setAppLanguage } = useLanguageStore();
  
  const languageModalRef = useRef<{
    showModal: () => void;
    hideModal: () => void;
  } | null>(null);

  useImperativeHandle(ref, () => ({
    showModal: () => languageModalRef?.current?.showModal(),
    hideModal: () => languageModalRef?.current?.hideModal(),
  }));

  const handleLanguageChange = (langCode: string) => {
    setAppLanguage(langCode);
    languageModalRef?.current?.hideModal();
  };

  return (
    <CustomModal
      ref={languageModalRef}
      animationType="fade"
      children={
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => languageModalRef?.current?.hideModal()}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('profile.selectLanguage')}</Text>
              <TouchableOpacity 
                onPress={() => languageModalRef?.current?.hideModal()}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'kh' && styles.languageOptionActive]}
              onPress={() => handleLanguageChange('kh')}
            >
              <View style={styles.languageOptionLeft}>
                <KhmerIcon width={30} height={30} />
                <Text style={styles.languageOptionText}>ភាសាខ្មែរ (Khmer)</Text>
              </View>
              {currentLanguage === 'kh' ? (
                <Ionicons name="checkmark-circle" size={24} color={Colors.mainColor} />
              ) : (
                <View style={styles.checkmarkPlaceholder} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'en' && styles.languageOptionActive]}
              onPress={() => handleLanguageChange('en')}
            >
              <View style={styles.languageOptionLeft}>
                <EnglishIcon width={30} height={30}/>
                <Text style={[styles.languageOptionText, styles.englishText]}>English</Text>
              </View>
              {currentLanguage === 'en' ? (
                <Ionicons name="checkmark-circle" size={24} color={Colors.mainColor} />
              ) : (
                <View style={styles.checkmarkPlaceholder} />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'zh' && styles.languageOptionActive]}
              onPress={() => handleLanguageChange('zh')}
            >
              <View style={styles.languageOptionLeft}>
                <ChinaIcon width={30} height={30} />
                <Text style={[styles.languageOptionText, styles.englishText]}>中文 (Chinese)</Text>
              </View>
              {currentLanguage === 'zh' ? (
                <Ionicons name="checkmark-circle" size={24} color={Colors.mainColor} />
              ) : (
                <View style={styles.checkmarkPlaceholder} />
              )}
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      }
    />
  );
});

LanguageSelectionModal.displayName = 'LanguageSelectionModal';

export default LanguageSelectionModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '90%',
    padding: 28,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: FontSize.large,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.mainColor,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  languageOption: {
    padding: 5,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  languageOptionActive: {
    borderColor: Colors.mainColor,
    backgroundColor: '#EBF5F8',
  },
  languageOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  languageOptionText: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: Colors.mainColor,
  },
  englishText: {
    fontFamily: CustomFontConstant.EnRegular,
  },
  checkmarkPlaceholder: {
    width: 24,
    height: 24,
  },
});
