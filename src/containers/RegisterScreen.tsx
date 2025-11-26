import React, { useRef } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePaddingAndroid } from '@/constants/GeneralConstants';
import CustomButton from '@/components/CustomButton';
import { navigate } from '@/navigation/NavigationService';
import { useAuth } from '@/hooks/useAuth';
import CustomPhoneInput from '@/components/CustomPhoneInput';
import AppLogo from '@/assets/logo/logo.svg';
import BaseComponent from '@/components/BaseComponent';
import { cleanPhoneNumber, validatePhoneNumber } from '@/utils';
import ErrorBanner from '@/components/ErrorBanner';

interface LoginFormData {
  phone: string;
}

const loginSchema = yup.object().shape({
	phone: yup.string().required('ត្រូវការលេខទូរស័ព្ទ'),
});
  
const RegisterScreen = () => {
	const [countryCode, setCountryCode] = React.useState('+855');

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<LoginFormData>({
		resolver: yupResolver(loginSchema),
	});
	
  	const { login,isLoading, error,showError,setShowError,checkPhoneNumber } = useAuth();

	const onSubmit: SubmitHandler<LoginFormData> = (data) => {
		const { phone } = data;
		Keyboard.dismiss();
		const formattedPhone = `${countryCode}${validatePhoneNumber(phone)}`;
		const phone_number = cleanPhoneNumber(formattedPhone);
		checkPhoneNumber(phone_number,formattedPhone);
	};

	const onCountryChange = (country: any) => {
		setCountryCode(country.dial_code);
	}

	return (
        <BaseComponent isBack={true} title="Sign Up">
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
					
                            {/* Logo Section */}
                            <View style={styles.headerSection}>
                                <AppLogo width={180} height={180} />
                                <Text style={styles.welcomeTitle}>Create your new account</Text>
                            </View>

                            {/* Form Section */}
                            <View style={styles.formContainer}>
                                <CustomPhoneInput
                                    control={control}
                                    name="phone"
                                    errors={errors}
									onCountryChange={onCountryChange}
                                />
                                <View style={{ height: 5 }} />
                                <CustomButton
                                    buttonTitle="Continue"
                                    onPress={handleSubmit(onSubmit)}
                                    isLoading={isLoading}
                                    buttonColor={
                                        !watch('phone') || watch('phone').length < 8
                                        ? Colors.disableColor
                                        : Colors.mainColor
                                    }
                                    disabled={!watch('phone') || watch('phone').length < 8}
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
                                    <Text style={styles.signUpText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => navigate('Login')}>
                                        <Text style={styles.signUpLink}>Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </BaseComponent>	
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: CustomFontConstant.EnRegular,
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
    marginTop:safePaddingAndroid
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