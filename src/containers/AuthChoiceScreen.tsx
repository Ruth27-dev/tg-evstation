import React, { useCallback, useRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { navigate } from '@/navigation/NavigationService';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import CustomButton from '@/components/CustomButton';
import AppLogo from '@/assets/logo/logo.svg';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelectionModal, { LanguageSelectionModalRef } from '@/components/LanguageSelectionModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KhmerIcon from '@/assets/icon/kh.svg';
import EnglishIcon from '@/assets/icon/en.svg';
import ChinaIcon from '@/assets/icon/china.svg';
import VietnameseIcon from '@/assets/icon/vn.svg';

const AuthChoiceScreen = () => {
  const { currentLanguage, t } = useTranslation();
  const languageModalRef = useRef<LanguageSelectionModalRef>(null);

  const getLanguageIcon = () => {
    switch (currentLanguage) {
      case 'kh':
        return <KhmerIcon width={30} height={30} />;
      case 'zh':
        return <ChinaIcon width={30} height={30} />;
      case 'vn':
        return <VietnameseIcon width={30} height={30} />;
      default:
        return <EnglishIcon width={30} height={30} />;
    }
  };

  const renderTranslateIcon = useCallback(() => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => languageModalRef?.current?.showModal()}
        style={styles.languageButton}
      >
        {getLanguageIcon()}
        <Ionicons name="chevron-down" size={20} color={Colors.mainColor} />
      </TouchableOpacity>
    );
  }, [currentLanguage]);

  return (
    <View style={styles.container}>
      <View style={[styles.languageContainer, { top: Platform.OS === 'ios' ? safePadding : 15 }]}>
        {renderTranslateIcon()}
      </View>

      <View style={styles.logoContainer}>
        <AppLogo width={190} height={190} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{t('common.authChoiceTitle')}</Text>
        <Text style={styles.subtitle}>{t('common.authChoiceSubtitle')}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <CustomButton
          buttonTitle={t('auth.login')}
          onPress={() => navigate('Login')}
          buttonColor={Colors.mainColor}
        />
        <CustomButton
          buttonTitle={t('auth.signUp')}
          onPress={() => navigate('Register')}
          buttonColor={'#EAF2F6'}
          textColor={Colors.mainColor}
        />
      </View>
      <LanguageSelectionModal ref={languageModalRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  languageContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.mainColor,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 14,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
});

export default AuthChoiceScreen;
