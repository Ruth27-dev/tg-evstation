import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import CustomButton from '@/components/CustomButton';
import CustomInputText from '@/components/CustomInputText';
import { navigate } from '@/navigation/NavigationService';
import { useAuth } from '@/hooks/useAuth';
import BaseComponent from '@/components/BaseComponent';
import { cleanPhoneNumber, formatPhoneNumber } from '@/utils';
import ErrorBanner from '@/components/ErrorBanner';
import { useTranslation } from '@/hooks/useTranslation';

interface CreateAccountFormData {
  phone: string;
  fullName: string;
  password: string;
}

const createAccountSchema = yup.object().shape({
	phone: yup.string().required('Phone number is required').min(12, 'Phone must be at least 8 digits'),
	fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
	password: yup
		.string()
		.required('Password is required')
});
  
const CreateAccountScreen = ({ route }: { route?: { params?: { phoneNumber?: string } } }) => {
  const phoneNumberFromRoute = route?.params?.phoneNumber || '';
	const [showPassword, setShowPassword] = useState(false);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const { t } = useTranslation();
  
  const { login,isLoading, error,showError,setShowError,checkPhoneNumber, register } = useAuth();
  
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<CreateAccountFormData>({
		resolver: yupResolver(createAccountSchema),
		defaultValues: {
			phone: phoneNumberFromRoute,
			fullName: '',
			password: '',
		},
	});

	const onSubmit: SubmitHandler<CreateAccountFormData> = (data) => {
		if (!acceptTerms) {
			return;
		}
		const { phone, fullName, password } = data;
		Keyboard.dismiss();
		register(cleanPhoneNumber(phone), fullName, password);
	};

	const isFormValid = watch('phone') && watch('fullName') && watch('password') && acceptTerms;

	return (
        <BaseComponent isBack={true} title="">
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
                                <Text style={styles.welcomeTitle}>{t('auth.createAccountTitle')}</Text>
                                <Text style={styles.welcomeSubtitle}>
						{t('auth.createAccountSubtitle')}
					</Text>
                            </View>
						<ErrorBanner
							visible={showError}
							message={error || t('auth.invalidCredentials')}
							title={t('auth.createAccountErrorTitle')}
							onDismiss={() => {
								setShowError(false);
							}}
								autoDismiss={true}
								autoDismissDelay={3000}
							/>
					
                            {/* Form Card */}
                            <View style={styles.formCard}>
                              {/* Phone Number */}
                              <CustomInputText
                                labelText={t('auth.phoneNumberLabel')}
                                placeHolderText={t('auth.enterPhoneNumber')}
                                control={control}
                                name="phone"
                                errors={errors}
                                isLeftIcon
                                editable={false}
                                keyboardType="phone-pad"
                                renderLeftIcon={
                                  <Ionicons name="call" size={20} color={Colors.mainColor} />
                                }
                              />

                              {/* Full Name */}
                              <CustomInputText
                                labelText={t('profile.fullName')}
                                placeHolderText={t('profile.enterFullName')}
                                control={control}
                                name="fullName"
                                errors={errors}
                                isLeftIcon
                                renderLeftIcon={
                                  <Ionicons name="person" size={20} color={Colors.mainColor} />
                                }
                              />

                              {/* Password */}
                              <View>
                                <CustomInputText
                                  labelText={t('auth.passwordLabel')}
                                  placeHolderText={t('auth.createPasswordPlaceholder')}
                                  control={control}
                                  name="password"
                                  errors={errors}
                                  isLeftIcon
                                  isRightIcon
                                  isPassword={!showPassword}
                                  renderLeftIcon={
                                    <Ionicons name="lock-closed" size={20} color={Colors.mainColor} />
                                  }
                                  renderRightIcon={
                                    <Ionicons 
                                      name={showPassword ? "eye-off" : "eye"} 
                                      size={20} 
                                      color="#9CA3AF"
                                      onPress={() => setShowPassword(!showPassword)}
                                    />
                                  }
                                />
                              </View>

                              {/* Terms Checkbox */}
                              <TouchableOpacity 
                                style={styles.checkboxContainer}
                                onPress={() => setAcceptTerms(!acceptTerms)}
                                activeOpacity={0.7}
                              >
                                <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                                  {acceptTerms && <Ionicons name="checkmark" size={16} color={Colors.white} />}
                                </View>
                                <Text style={styles.checkboxText}>
                                  {t('auth.agreeTermsPrefix')}
                                  <Text style={styles.checkboxLink}>{t('profile.termsConditions')}</Text>
                                  {t('auth.agreeTermsConnector')}
                                  <Text style={styles.checkboxLink}>{t('profile.privacyPolicy')}</Text>
                                </Text>
                              </TouchableOpacity>

                              {/* Submit Button */}
                              <CustomButton
                                buttonTitle={t('auth.createAccountButton')}
                                onPress={handleSubmit(onSubmit)}
                                isLoading={isLoading}
                                buttonColor={isFormValid ? Colors.mainColor : Colors.disableColor}
                                disabled={!isFormValid}
                              />
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <View style={styles.signInContainer}>
                                    <Text style={styles.signInText}>{t('auth.alreadyHaveAccount')} </Text>
                                    <TouchableOpacity onPress={() => navigate('Login')}>
                                        <Text style={styles.signInLink}>{t('auth.signIn')}</Text>
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
    backgroundColor: '#F9FAFB',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
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
    backgroundColor: `${Colors.mainColor}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: FontSize.large + 2,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.mainColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 10,
    gap: 20,
  },
  requirementsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#9CA3AF',
  },
  requirementMet: {
    color: '#10B981',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.mainColor,
    borderColor: Colors.mainColor,
  },
  checkboxText: {
    flex: 1,
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
    lineHeight: 20,
  },
  checkboxLink: {
    color: Colors.mainColor,
    fontFamily: CustomFontConstant.EnBold,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#6B7280',
  },
  signInLink: {
    fontSize: FontSize.medium,
    color: Colors.mainColor,
    fontFamily: CustomFontConstant.EnBold,
  },
});
