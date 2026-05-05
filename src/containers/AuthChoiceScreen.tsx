import React, { useCallback, useEffect, useRef } from 'react';
import {
  Dimensions,
  Image,
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
import { CustomFontConstant, FontSize, Images, safePadding } from '@/constants/GeneralConstants';
import CustomButton from '@/components/CustomButton';
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
  const accentOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    cardTranslateY.value = withDelay(200, withSpring(0, { damping: 18, stiffness: 90 }));
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    langOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
    accentOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
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

  const accentStyle = useAnimatedStyle(() => ({
    opacity: accentOpacity.value,
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
      <Animated.View style={langStyle}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => languageModalRef?.current?.showModal()}
          style={styles.languageButton}
        >
          {getLanguageIcon()}
          <Ionicons name="chevron-down" size={14} color={Colors.white} />
        </TouchableOpacity>
      </Animated.View>
    );
  }, [currentLanguage, langStyle]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.darkColor, Colors.mainColor]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative background rings */}
      <View style={styles.ringTopRight} />
      <View style={styles.ringTopRightInner} />
      <View style={styles.ringBottomLeft} />

      {/* Golden glow ring behind logo */}
      <Animated.View style={[styles.glowRing, accentStyle]} />

      {/* Language selector */}
      <View style={[styles.languageContainer, { top: Platform.OS === 'ios' ? safePadding : 15 }]}>
        {renderTranslateIcon()}
      </View>

      {/* Logo area */}
      <View style={styles.logoArea}>
        <Animated.View style={[logoStyle, styles.logoWrapper]}>
          <View style={styles.logoCircle}>
            <Image source={Images.logo} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Animated.View style={[styles.brandRow, accentStyle]}>
            <View style={styles.accentLine} />
            <Text style={styles.brandName}>TAN EV Station</Text>
            <View style={styles.accentLine} />
          </Animated.View>
          <Text style={styles.brandTagline}>Smart Charging Solutions</Text>
        </Animated.View>
      </View>

      {/* Bottom card */}
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Handle */}
        <View style={styles.cardHandleRow}>
          <View style={[styles.cardHandleDot, { opacity: 0.3 }]} />
          <View style={styles.cardHandle} />
          <View style={[styles.cardHandleDot, { opacity: 0.3 }]} />
        </View>

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
            buttonColor="transparent"
            textColor={Colors.mainColor}
            borderWidth={1.5}
            borderColor={Colors.mainColor}
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
    paddingVertical: 7,
    paddingHorizontal: 13,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    gap: 6,
  },
  ringTopRight: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'transparent',
    top: -120,
    right: -100,
  },
  ringTopRightInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    top: -50,
    right: -40,
  },
  ringBottomLeft: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    bottom: SCREEN_HEIGHT * 0.32,
    left: -80,
  },
  glowRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1.5,
    borderColor: 'rgba(241,177,29,0.18)',
    backgroundColor: 'rgba(241,177,29,0.03)',
    alignSelf: 'center',
    top: SCREEN_HEIGHT * 0.1,
  },
  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryColor,
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  logoImage: {
    width: 136,
    height: 136,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 22,
    marginBottom: 6,
  },
  accentLine: {
    width: 28,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: Colors.primaryColor,
    opacity: 0.7,
  },
  brandName: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.white,
    letterSpacing: 1.2,
  },
  brandTagline: {
    fontSize: 12,
    fontFamily: CustomFontConstant.EnRegular,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.6,
  },
  card: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 48 : 36,
    shadowColor: Colors.darkColor,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
  cardHandleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 26,
  },
  cardHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryColor,
    opacity: 0.7,
  },
  cardHandleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryColor,
  },
  title: {
    fontSize: 24,
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
    marginBottom: 28,
  },
  buttonsContainer: {
    gap: 12,
  },
});

export default AuthChoiceScreen;
