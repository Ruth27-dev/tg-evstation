import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Images from '@/assets/images';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding, safePaddingAndroid } from '@/constants/GeneralConstants';
import CustomButton from '@/components/CustomButton';
import CustomInputText from '@/components/CustomInputText';
import CustomModal from '@/components/CustomModal';
import { navigate } from '@/navigation/NavigationService';
import DeviceInfo from 'react-native-device-info';
import { useAuth } from '@/hooks/useAuth';
import CustomPhoneInput from '@/components/CustomPhoneInput';
import KhmerIcon from '@/assets/icon/kh.svg';
import EnglishIcon from '@/assets/icon/en.svg';
import ChinaIcon from '@/assets/icon/china.svg';
import AppLogo from '@/assets/logo/logo.svg';
import BaseComponent from '@/components/BaseComponent';

interface CreateAccountFormData {
  phone: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

const createAccountSchema = yup.object().shape({
	phone: yup.string().required('Phone number is required').min(8, 'Phone must be at least 8 digits'),
	fullName: yup.string().required('Full name is required').min(3, 'Name must be at least 3 characters'),
	password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
	confirmPassword: yup.string().required('Please confirm your password').oneOf([yup.ref('password')], 'Passwords must match'),
});
  
const CreateAccountScreen = () => {
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
	} = useForm<CreateAccountFormData>({
		resolver: yupResolver(createAccountSchema),
		defaultValues: {
			phone: '',
			fullName: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit: SubmitHandler<CreateAccountFormData> = (data) => {
		const { phone, fullName, password } = data;
		Keyboard.dismiss();
		// Handle account creation
		console.log('Creating account:', { phone, fullName });
	};

	const isFormValid = watch('phone') && watch('fullName') && watch('password') && watch('confirmPassword');

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

                            {/* Header Section */}
                            <View style={styles.headerSection}>
                                <Text style={styles.welcomeTitle}>Create Account</Text>
                                <Text style={styles.welcomeSubtitle}>Complete your profile to get started</Text>
                            </View>

                            {/* Form Section */}
                            <View style={styles.formContainer}>
                                {/* Phone Input */}
                                <CustomPhoneInput
                                    control={control}
                                    name="phone"
                                    errors={errors}
                                />
                                <View style={{height:10}}/>
                                {/* Full Name Input */}
                                <CustomInputText
                                    placeHolderText="Enter your full name"
                                    labelText="Full Name"
                                    control={control}
                                    name="fullName"
                                    errors={errors}
                                    isLeftIcon
                                    renderLeftIcon={
                                        <Ionicons name="person-outline" style={styles.inputIcon} size={22}/>
                                    }
                                />
                                <View style={{height:10}}/>
                                {/* Password Input */}
                                <CustomInputText
                                    placeHolderText="Create a password"
                                    labelText="Password"
                                    isRightIcon
                                    control={control}
                                    name="password"
                                    errors={errors}
                                    isLeftIcon
                                    isPassword
                                    renderLeftIcon={
                                        <Ionicons name="lock-closed-outline" style={styles.inputIcon} size={22}/>
                                    }
                                />
                                <View style={{height:10}}/>
                                <CustomInputText
                                    placeHolderText="Confirm your password"
                                    labelText="Confirm Password"
                                    isRightIcon
                                    control={control}
                                    name="confirmPassword"
                                    errors={errors}
                                    isLeftIcon
                                    isPassword
                                    renderLeftIcon={
                                        <Ionicons name="lock-closed-outline" style={styles.inputIcon} size={22}/>
                                    }
                                />
                                {/* Terms & Conditions */}
                                <View style={styles.termsContainer}>
                                    <Text style={styles.termsText}>By creating an account, you agree to our </Text>
                                    <TouchableOpacity>
                                        <Text style={styles.termsLink}>Terms & Conditions</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Submit Button */}
                                <CustomButton
                                    buttonTitle="Create Account"
                                    onPress={handleSubmit(onSubmit)}
                                    isLoading={isLoading}
                                    buttonColor={isFormValid ? Colors.mainColor : Colors.disableColor}
                                    disabled={!isFormValid}
                                />
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
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

export default CreateAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: CustomFontConstant.EnRegular,
    fontWeight: '700',
    color: Colors.mainColor,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  formContainer: {
    width: '100%',
    gap: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: FontSize.small + 1,
    fontFamily: CustomFontConstant.EnRegular,
    fontWeight: '600',
    color: Colors.mainColor,
    marginBottom: 8,
    marginLeft: 2,
  },
  inputIcon: {
    textAlign: 'center',
    color: '#9CA3AF',
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  termsText: {
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
    textAlign: 'center',
  },
  termsLink: {
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    color: Colors.mainColor,
    fontWeight: '700',
    textDecorationLine: 'underline',
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
    marginTop: 24,
    alignItems: 'center',
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
    fontFamily: CustomFontConstant.EnRegular,
    fontWeight: '700',
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