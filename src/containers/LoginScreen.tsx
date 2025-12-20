import React, { useCallback, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import CustomButton from '@/components/CustomButton';
import CustomInputText from '@/components/CustomInputText';
import ErrorBanner from '@/components/ErrorBanner';
import LanguageSelectionModal, { LanguageSelectionModalRef } from '@/components/LanguageSelectionModal';
import { navigate } from '@/navigation/NavigationService';
import { useAuth } from '@/hooks/useAuth';
import CustomPhoneInput from '@/components/CustomPhoneInput';
import KhmerIcon from '@/assets/icon/kh.svg';
import EnglishIcon from '@/assets/icon/en.svg';
import ChinaIcon from '@/assets/icon/china.svg';
import AppLogo from '@/assets/logo/logo.svg';
import { cleanPhoneNumber, validatePhoneNumber } from '@/utils';
import { useTranslation } from '@/hooks/useTranslation';
import TextTranslation from '@/components/TextTranslation';

interface LoginFormData {
	phone: string;
	password: string;
}

const loginSchema = yup.object().shape({
	phone: yup.string().required('ត្រូវការលេខទូរស័ព្ទ'),
	password: yup.string().required('ពាក្យសម្ងាត់ត្រូវបានទាមទារ'),
});
  
const LoginScreen = () => {
	const [isShowPassword, setIsShowPassword] = useState(false);
	const [countryCode, setCountryCode] = useState('+855');
	const { currentLanguage, t } = useTranslation();
	const languageModalRef = useRef<LanguageSelectionModalRef>(null);
	const { login,isLoading, error,showError,setShowError } = useAuth();
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<LoginFormData>({
		resolver: yupResolver(loginSchema),
	});

	const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
		const { phone, password } = data;
		const formattedPhone = `${countryCode}${validatePhoneNumber(phone)}`;
		const phone_number = cleanPhoneNumber(formattedPhone);
		Keyboard.dismiss();
		login(phone_number, password);
	};

	const onCountryChange = (country: any) => {
		setCountryCode(country.dial_code);
	}

	const getLanguageIcon = () => {
		switch (currentLanguage) {
			case 'kh':
				return <KhmerIcon width={30} height={30} />;
			case 'zh':
				return <ChinaIcon width={30} height={30} />;
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
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.container}>
					<ErrorBanner
						visible={showError}
						message={error || 'Invalid phone number or password. Please try again.'}
						title="Login Failed"
						onDismiss={() => {
							setShowError(false);
						}}
						autoDismiss={true}
						autoDismissDelay={3000}
					/>
					
					<View style={styles.contentWrapper}>
						<View style={[styles.languageContainer,{top:Platform.OS === 'ios' ? safePadding : 15}]}>
							{renderTranslateIcon()}
						</View>

						<View style={styles.headerSection}>
							<AppLogo width={180} height={180} />
							<TextTranslation textKey="common.welcome" fontSize={32} isBold />
							<TextTranslation textKey="common.signInToContinue" fontSize={FontSize.medium} />
						</View>

						<View style={styles.formContainer}>
							<CustomPhoneInput
								control={control}
								name="phone"
								errors={errors}
                				onCountryChange={onCountryChange}
							/>
							<CustomInputText
								placeHolderText={t('auth.password')}
								labelText={t('password')}
								isRightIcon
								control={control}
								name="password"
								errors={errors}
								isLeftIcon
								isPassword={!isShowPassword}
								renderLeftIcon={
									<Ionicons name="lock-closed" style={styles.inputIcon} size={22}/>
								}
                				renderRightIcon={
									<Ionicons name={isShowPassword ? "eye-off" : "eye"} style={styles.inputIcon} size={22} onPress={()=> setIsShowPassword(!isShowPassword)}/>
								}
							/> 
							
							<TouchableOpacity style={styles.forgotPasswordContainer} onPress={()=>navigate('ForgetPassword')}>
								<Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
							</TouchableOpacity>

							<CustomButton
								buttonTitle={t('auth.login')}
								onPress={handleSubmit(onSubmit)}
								isLoading={isLoading}
								buttonColor={
									!watch('phone') || watch('phone').length < 8 || !watch('password')
									? Colors.disableColor
									: Colors.mainColor
								}
								disabled={!watch('phone') || watch('phone').length < 8 || !watch('password')}
							/>
						</View>
						
						<View style={styles.footer}>
							<View style={styles.dividerContainer}>
								<View style={styles.divider} />
								<Text style={styles.dividerText}>or</Text>
								<View style={styles.divider} />
							</View>

							<View style={styles.signUpContainer}>
								<Text style={styles.signUpText}>{t('auth.dontHaveAccount')}</Text>
								<TouchableOpacity onPress={() => navigate('Register')}>
									<Text style={styles.signUpLink}>{t('auth.signUp')}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				<LanguageSelectionModal ref={languageModalRef} />
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  languageContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: CustomFontConstant.EnRegular,
    fontWeight: '700',
    color: Colors.mainColor,
  },
  welcomeSubtitle: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 20,
  },
  inputIcon: {
    textAlign: 'center',
    color:Colors.mainColor,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: Colors.mainColor,
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnBold,
	textDecorationLine: 'underline'
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: FontSize.medium,
    color: Colors.mainColor,
    fontFamily: CustomFontConstant.EnBold,

  },
  otpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.mainColor,
    marginTop: 16,
  },
  otpButtonText: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.mainColor,
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
  flagIcon: {
    fontSize: 18,
  },
  languageText: {
    color: Colors.mainColor,
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    fontWeight: '600',
  },
});