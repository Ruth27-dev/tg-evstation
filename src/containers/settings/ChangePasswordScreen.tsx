import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from "@/components/CustomButton";
import CustomInputText from "@/components/CustomInputText";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup
        .string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .test('not-same', 'New password must be different from current password', function(value) {
            return value !== this.parent.currentPassword;
        }),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});

const ChangePasswordScreen = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<PasswordFormData>({
        resolver: yupResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    });

    const newPassword = watch('newPassword');

    const handleChangePassword = (data: PasswordFormData) => {
        console.log('Change password:', data);
        // Call API to change password
        Alert.alert(
            'Success',
            'Your password has been changed successfully',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        reset();
                        // Navigate back
                    }
                }
            ]
        );
    };

    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: '', color: '#E5E7EB' };
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) {
            return { strength: 33, label: 'Weak', color: '#EF4444' };
        } else if (strength <= 4) {
            return { strength: 66, label: 'Medium', color: '#F59E0B' };
        } else {
            return { strength: 100, label: 'Strong', color: '#10B981' };
        }
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <BaseComponent isBack={true} title="Change Password">
            <View style={styles.container}>
                <View style={styles.card}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="lock-closed" size={28} color={Colors.mainColor} />
                        </View>
                        <Text style={styles.title}>Update Your Password</Text>
                        <Text style={styles.subtitle}>
                            Choose a strong password to protect your account
                        </Text>
                    </View>

                    {/* Current Password */}
                    <CustomInputText
                        labelText="Current Password"
                        placeHolderText="Enter current password"
                        control={control}
                        name="currentPassword"
                        errors={errors}
                        isLeftIcon
                        isRightIcon
                        isPassword={!showCurrentPassword}
                        renderLeftIcon={
                            <Ionicons name="lock-closed-outline" size={20} color={Colors.mainColor} />
                        }
                        renderRightIcon={
                            <Ionicons 
                                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                                size={20} 
                                color="#9CA3AF"
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                        }
                    />

                    {/* New Password */}
                    <View>
                        <CustomInputText
                            labelText="New Password"
                            placeHolderText="Enter new password"
                            control={control}
                            name="newPassword"
                            errors={errors}
                            isLeftIcon
                            isRightIcon
                            isPassword={!showNewPassword}
                            renderLeftIcon={
                                <Ionicons name="lock-open-outline" size={20} color={Colors.mainColor} />
                            }
                            renderRightIcon={
                                <Ionicons 
                                    name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#9CA3AF"
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                />
                            }
                        />
                        
                        {/* Password Strength Indicator */}
                        {newPassword.length > 0 && (
                            <View style={styles.strengthContainer}>
                                <View style={styles.strengthBar}>
                                    <View 
                                        style={[
                                            styles.strengthFill, 
                                            { width: `${passwordStrength.strength}%`, backgroundColor: passwordStrength.color }
                                        ]} 
                                    />
                                </View>
                                <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                                    {passwordStrength.label}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Confirm Password */}
                    <CustomInputText
                        labelText="Confirm New Password"
                        placeHolderText="Re-enter new password"
                        control={control}
                        name="confirmPassword"
                        errors={errors}
                        isLeftIcon
                        isRightIcon
                        isPassword={!showConfirmPassword}
                        renderLeftIcon={
                            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.mainColor} />
                        }
                        renderRightIcon={
                            <Ionicons 
                                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                                size={20} 
                                color="#9CA3AF"
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        }
                    />

                    {/* Submit Button */}
                    <CustomButton
                        buttonTitle="Change Password"
                        onPress={handleSubmit(handleChangePassword)}
                    />
                </View>
            </View>
        </BaseComponent>
    );
}

export default ChangePasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        backgroundColor: Colors.white,
        padding: 24,
        borderRadius: 16
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: `${Colors.mainColor}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        textAlign: 'center',
    },
    strengthContainer: {
        marginTop: 12,
    },
    strengthBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
    },
    strengthFill: {
        height: '100%',
        borderRadius: 3,
    },
    strengthLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        marginTop: 6,
    },
    requirementsContainer: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    requirementsTitle: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: '#374151',
        marginBottom: 12,
    },
    requirement: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    requirementText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    requirementMet: {
        color: '#10B981',
    },
});
