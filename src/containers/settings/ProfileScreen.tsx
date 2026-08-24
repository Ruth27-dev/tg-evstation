import BaseComponent from "@/components/BaseComponent";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator, TextInput, Platform } from "react-native";
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Colors, Radius } from "@/theme";
import { CustomFontConstant, FontSize, Images, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from "@/components/CustomButton";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMeStore } from "@/store/useMeStore";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobalToast } from "@/components/ToastProvider";
import Loading from "@/components/Loading";

interface ProfileFormData {
    name: string;
    email: string;
}

const profileSchema = yup.object().shape({
    name: yup.string().trim().required('Full name is required'),
    email: yup.string().trim().default('').defined().test(
        'is-valid-email',
        'Please enter a valid email address',
        (value) => !value || yup.string().email().isValidSync(value)
    ),
});

// The manifest declares android.permission.CAMERA for the QR-scanner screen
// (react-native-vision-camera). Once a manifest declares it, Android requires
// it to be explicitly granted before ANY camera intent works — including the
// plain system-camera intent react-native-image-picker uses here — otherwise
// it throws a SecurityException that the picker surfaces as a generic
// "permission" error.
const cameraPermission = Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
    default: null,
});

const ProfileScreen = () => {
    const { userData } = useMeStore();
    const { updateProfile, uploadProfileImage, fetchUser, isRequesting } = useAuth();
    const { t } = useTranslation();
    const { showToast } = useGlobalToast();
    const [showPhotoSourceModal, setShowPhotoSourceModal] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            name: userData?.user_name || '',
            email: userData?.email || '',
        },
    });

    useEffect(() => {
        // Home/Settings/this screen all call fetchUser() on mount — if one of those
        // resolves late while the user is mid-edit here, don't let it stomp on
        // unsaved changes with stale server values.
        if (isDirty) return;
        reset({
            name: userData?.user_name || '',
            email: userData?.email || '',
        });
    }, [userData, reset, isDirty]);

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSave = async (data: ProfileFormData) => {
        const result = await updateProfile({
            user_name: data.name,
            email: data.email || null,
            phone_number: userData?.phone_number,
        });
        if (!result.success) {
            showToast(result.message || t('profile.updateFailed'), 'error');
        }
    };

    const handlePickedAsset = async (asset?: Asset) => {
        if (!asset?.uri) return;
        setIsUploadingPhoto(true);
        const { success, message } = await uploadProfileImage({
            uri: asset.uri,
            type: asset.type,
            fileName: asset.fileName,
        });
        setIsUploadingPhoto(false);
        showToast(
            success ? t('profile.photoUpdated') : (message || t('profile.photoUpdateFailed')),
            success ? 'success' : 'error'
        );
    };

    const handleChoosePhoto = async (source: 'camera' | 'library') => {
        setShowPhotoSourceModal(false);

        if (source === 'camera' && cameraPermission) {
            let status = await check(cameraPermission);
            if (status === RESULTS.DENIED) {
                status = await request(cameraPermission);
            }
            if (status !== RESULTS.GRANTED && status !== RESULTS.LIMITED) {
                showToast(
                    status === RESULTS.BLOCKED
                        ? t('profile.cameraPermissionBlocked')
                        : t('profile.cameraPermissionDenied'),
                    'error'
                );
                return;
            }
        }

        const options = { mediaType: 'photo' as const, quality: 0.8 as const, includeBase64: false };
        const response = source === 'camera'
            ? await launchCamera(options)
            : await launchImageLibrary(options);

        if (response.didCancel) return;
        if (response.errorCode) {
            showToast(response.errorMessage || t('profile.photoUpdateFailed'), 'error');
            return;
        }
        await handlePickedAsset(response.assets?.[0]);
    };

    if (isRequesting) return <Loading />;

    return (
        <BaseComponent isBack={true} title="profile.myProfile">
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarSection}>
                    <TouchableOpacity
                        style={styles.avatarWrapper}
                        activeOpacity={0.8}
                        disabled={isUploadingPhoto}
                        onPress={() => setShowPhotoSourceModal(true)}
                    >
                        <Image
                            source={userData?.image ? { uri: userData.image } : Images.user}
                            style={styles.avatar}
                        />
                        {isUploadingPhoto ? (
                            <View style={styles.avatarUploadingOverlay}>
                                <ActivityIndicator size="small" color={Colors.white} />
                            </View>
                        ) : (
                            <View style={styles.editBadge}>
                                <Ionicons name="camera" size={14} color={Colors.white} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>{t('profile.fullName')}</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.inputBox}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder={t('profile.enterFullName')}
                                placeholderTextColor={Colors.textFaint}
                            />
                        )}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>{t('profile.phoneNumber')}</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputText}>{userData?.phone_number || t('profile.notSet')}</Text>
                    </View>
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>{t('profile.email')}</Text>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.inputBox}
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder={t('profile.enterEmail')}
                                placeholderTextColor={Colors.textFaint}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>

                <CustomButton
                    buttonTitle={t('profile.update')}
                    onPress={handleSubmit(handleSave)}
                    buttonColor={isDirty ? Colors.secondaryColor : Colors.disableColor}
                    disabled={!isDirty}
                />
            </ScrollView>

            <Modal
                visible={showPhotoSourceModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPhotoSourceModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowPhotoSourceModal(false)}
                >
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>{t('profile.updatePhoto')}</Text>

                        <TouchableOpacity style={styles.modalOption} onPress={() => handleChoosePhoto('camera')}>
                            <Ionicons name="camera-outline" size={20} color={Colors.mainColor} />
                            <Text style={styles.modalOptionText}>{t('profile.takePhoto')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={() => handleChoosePhoto('library')}>
                            <Ionicons name="images-outline" size={20} color={Colors.mainColor} />
                            <Text style={styles.modalOptionText}>{t('profile.chooseFromLibrary')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhotoSourceModal(false)}>
                            <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </BaseComponent>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backGroundColor,
    },
    scrollContent: {
        paddingHorizontal: safePadding,
        paddingTop: 28,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    avatarWrapper: {
        width: 96,
        height: 96,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.surfaceMuted,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.backGroundColor,
    },
    avatarUploadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 48,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fieldGroup: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 8,
    },
    inputBox: {
        height: 52,
        borderRadius: 10,
        backgroundColor: Colors.surfaceMuted,
        paddingHorizontal: 14,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.borderMuted,
    },
    inputText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    errorText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.red,
        marginTop: 6,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalSheet: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        paddingHorizontal: safePadding,
        paddingTop: 12,
        paddingBottom: 32,
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.borderMuted,
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        textAlign: 'center',
        marginBottom: 16,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderMuted,
    },
    modalOptionText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    modalCancel: {
        marginTop: 12,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: Colors.surfaceMuted,
        borderRadius: Radius.md,
    },
    modalCancelText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.textMuted,
    },
});
