import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Images from '@/assets/images';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import CustomButton from '@/components/CustomButton';
import CustomInputText from '@/components/CustomInputText';
import CustomModal from '@/components/CustomModal';
import { navigate } from '@/navigation/NavigationService';
import DeviceInfo from 'react-native-device-info';
import { useAuth } from '@/hooks/useAuth';
import CustomPhoneInput from '@/components/CustomPhoneInput';
import auth from '@react-native-firebase/auth';
import KhmerIcon from '@/assets/icon/kh.svg';
import EnglishIcon from '@/assets/icon/en.svg';
import ChinaIcon from '@/assets/icon/china.svg';
import AppLogo from '@/assets/logo/logo.svg';
import { validatePhoneNumber } from '@/utils';

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
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+855');

	const languageModalRef = useRef<{
		showModal: () => void;
		hideModal: () => void;
	} | null>(null);
	const { login,isLoading } = useAuth();
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<LoginFormData>({
		resolver: yupResolver(loginSchema),
	});

	const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    console.log(data)
		const { phone, password } = data;
		Keyboard.dismiss();
    	try {
			setIsOTPLoading(true);
			Keyboard.dismiss();
			const formattedPhone = `${countryCode}${validatePhoneNumber(phone)}`;
			const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
			navigate('Verify', { 
				phoneNumber: formattedPhone,
				confirmation: confirmation 
			});
		} catch (error: any) {
			console.error('OTP Error:', error);
			let errorMessage = 'Failed to send OTP. Please try again.';
			
			if (error.code === 'auth/invalid-phone-number') {
				errorMessage = 'Invalid phone number format.';
			} else if (error.code === 'auth/too-many-requests') {
				errorMessage = 'Too many requests. Please try again later.';
			} else if (error.code === 'auth/network-request-failed') {
				errorMessage = 'Network error. Please check your connection.';
			}
			
			// You can show a toast or alert here
			console.warn(errorMessage);
		} finally {
			setIsOTPLoading(false);
		}
    // navigate('Main');
	};

	const handleSignInWithOTP = async () => {
		const phone = watch('phone');
		if (!phone || phone.length < 8) {
			return;
		}

		try {
			setIsOTPLoading(true);
			Keyboard.dismiss();
			
			// Format phone number (assuming it needs country code)
			const formattedPhone = phone.startsWith('+') ? phone : `${countryCode}${phone}`;
			
			const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
			
			// Navigate to verify screen with confirmation object
			navigate('Verify', { 
				phoneNumber: formattedPhone,
				confirmation: confirmation 
			});
		} catch (error: any) {
			console.error('OTP Error:', error);
			let errorMessage = 'Failed to send OTP. Please try again.';
			
			if (error.code === 'auth/invalid-phone-number') {
				errorMessage = 'Invalid phone number format.';
			} else if (error.code === 'auth/too-many-requests') {
				errorMessage = 'Too many requests. Please try again later.';
			} else if (error.code === 'auth/network-request-failed') {
				errorMessage = 'Network error. Please check your connection.';
			}
			
			// You can show a toast or alert here
			console.warn(errorMessage);
		} finally {
			setIsOTPLoading(false);
		}
	};
  const onCountryChange = (country: any) => {
    setCountryCode(country.dial_code);
  }

	const renderTranslateIcon = useCallback(() => {
		return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={() => languageModalRef?.current?.showModal()}
			style={styles.languageButton}
		>
			<KhmerIcon width={30} height={30}/>
			<Ionicons name="chevron-down" size={20} color={Colors.mainColor} />
		</TouchableOpacity>
		);
	}, []);

	const renderLang = useMemo(
		() => (
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
					<Text style={styles.modalTitle}>Select Language</Text>
					<TouchableOpacity 
						onPress={() => languageModalRef?.current?.hideModal()}
						style={styles.closeButton}
					>
						<Ionicons name="close" size={28} color={Colors.gray} />
					</TouchableOpacity>
				</View>
				
				<TouchableOpacity style={[styles.languageOption, styles.languageOptionActive]}>
					<View style={styles.languageOptionLeft}>
						<KhmerIcon width={30} height={30} />
						<Text style={styles.languageOptionText}>ភាសាខ្មែរ (Khmer)</Text>
					</View>
					<Ionicons name="checkmark-circle" size={24} color={Colors.mainColor} />
				</TouchableOpacity>
				
				<TouchableOpacity style={styles.languageOption}>
					<View style={styles.languageOptionLeft}>
						<EnglishIcon width={30} height={30}/>
						<Text style={[styles.languageOptionText, styles.englishText]}>English</Text>
					</View>
					<View style={styles.checkmarkPlaceholder} />
				</TouchableOpacity>

				<TouchableOpacity style={styles.languageOption}>
					<View style={styles.languageOptionLeft}>
						<ChinaIcon width={30} height={30} />
						<Text style={[styles.languageOptionText, styles.englishText]}>Chinese</Text>
					</View>
					<View style={styles.checkmarkPlaceholder} />
				</TouchableOpacity>

				</TouchableOpacity>
			</TouchableOpacity>
			}
		/>
		),[]
	);
	

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
					<View style={styles.contentWrapper}>
						<View style={[styles.languageContainer,{top:Platform.OS === 'ios' ? safePadding : 15}]}>
							{renderTranslateIcon()}
						</View>

						{/* Logo Section */}
						<View style={styles.headerSection}>
							<AppLogo width={180} height={180} />
							<Text style={styles.welcomeTitle}>Welcome Back</Text>
							<Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
						</View>

						{/* Form Section */}
						<View style={styles.formContainer}>
							<CustomPhoneInput
								control={control}
								name="phone"
								errors={errors}
                onCountryChange={onCountryChange}
							/>
							<CustomInputText
								placeHolderText="Enter password"
								labelText="Enter password"
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
								<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
							</TouchableOpacity>

						<CustomButton
							buttonTitle="Login"
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

						{/* Footer */}
						<View style={styles.footer}>
							<View style={styles.dividerContainer}>
								<View style={styles.divider} />
								<Text style={styles.dividerText}>or</Text>
								<View style={styles.divider} />
							</View>

							<View style={styles.signUpContainer}>
								<Text style={styles.signUpText}>Don't have an account? </Text>
								<TouchableOpacity onPress={() => navigate('Register')}>
									<Text style={styles.signUpLink}>Sign Up</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				{renderLang}
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
  flagIconLarge: {
    fontSize: 32,
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