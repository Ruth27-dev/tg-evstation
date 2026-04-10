import React, { useCallback, useEffect, useRef } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AuthChoiceScreen = () => {
  const { currentLanguage, t } = useTranslation();
  const languageModalRef = useRef<LanguageSelectionModalRef>(null);

  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(80);
  const cardOpacity = useSharedValue(0);
  const langOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    cardTranslateY.value = withDelay(200, withSpring(0, { damping: 18, stiffness: 90 }));
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    langOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const langStyle = useAnimatedStyle(() => ({
    opacity: langOpacity.value,
  }));

  const getLanguageIcon = () => {
    switch (currentLanguage) {
      case 'kh':
        return <KhmerIcon width={26} height={26} />;
      case 'zh':
        return <ChinaIcon width={26} height={26} />;
      case 'vn':
        return <VietnameseIcon width={26} height={26} />;
      default:
        return <EnglishIcon width={26} height={26} />;
    }
  };

  const renderTranslateIcon = useCallback(() => {
    return (
      <Animated.View style={[langStyle]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => languageModalRef?.current?.showModal()}
          style={styles.languageButton}
        >
          {getLanguageIcon()}
          <Ionicons name="chevron-down" size={16} color={Colors.white} />
        </TouchableOpacity>
      </Animated.View>
    );
  }, [currentLanguage, langStyle]);

  return (
    <View style={styles.container}>
      {/* Gradient background */}
      <LinearGradient
        colors={[Colors.darkColor, Colors.mainColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientFill}
      />

      {/* Decorative circles */}
      <View style={styles.circleTopRight} />
      <View style={styles.circleBottomLeft} />
      <View style={styles.circleCenter} />

      {/* Language selector */}
      <View style={[styles.languageContainer, { top: Platform.OS === 'ios' ? safePadding : 15 }]}>
        {renderTranslateIcon()}
      </View>

      {/* Logo area */}
      <View style={styles.logoArea}>
        <Animated.View style={[logoStyle]}>
          <AppLogo width={160} height={160} />
        </Animated.View>
      </View>

      {/* Bottom card */}
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.cardHandle} />

        <Text style={styles.title}>{t('common.authChoiceTitle')}</Text>
        <Text style={styles.subtitle}>{t('common.authChoiceSubtitle')}</Text>

        <View style={styles.buttonsContainer}>
          <CustomButton
            buttonTitle={t('auth.login')}
            onPress={() => navigate('Login')}
            buttonColor={Colors.mainColor}
          />
          <CustomButton
            buttonTitle={t('auth.signUp')}
            onPress={() => navigate('Register')}
            buttonColor={'transparent'}
            textColor={Colors.mainColor}
            borderWidth={1}
          />
        </View>
      </Animated.View>
      <LanguageSelectionModal ref={languageModalRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkColor,
  },
  languageContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    gap: 6,
  },
  circleTopRight: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -80,
    right: -80,
  },
  circleBottomLeft: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: SCREEN_HEIGHT * 0.35,
    left: -60,
  },
  circleCenter: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.03)',
    top: SCREEN_HEIGHT * 0.05,
    alignSelf: 'center',
  },
  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logoGlow: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: Colors.primaryColor,
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 100,
  },
  cardHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.darkColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  buttonsContainer: {
    gap: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#9CA3AF',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  guestText: {
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    color: Colors.mainColor,
  },
  gradientFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default AuthChoiceScreen;
