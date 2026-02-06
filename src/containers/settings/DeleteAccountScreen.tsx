import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from "@/components/CustomButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useMeStore } from "@/store/useMeStore";
import Loading from "@/components/Loading";

const DeleteAccountScreen = () => {
    const [confirmationText, setConfirmationText] = useState('');
    const { t } = useTranslation();
    const { logout, isRequesting,deleteAccount } = useAuth();
    const { userData } = useMeStore();

    const handleDeleteAccount = () => {
        if (confirmationText.toLowerCase() !== 'delete') {
            Alert.alert(
                t('deleteAccount.error'),
                t('deleteAccount.confirmationError')
            );
            return;
        }

        Alert.alert(
            t('deleteAccount.finalConfirmTitle'),
            t('deleteAccount.finalConfirmMessage'),
            [
                { 
                    text: t('deleteAccount.cancel'), 
                    style: 'cancel' 
                },
                {
                    text: t('deleteAccount.deleteButton'),
                    style: 'destructive',
                    onPress: async () => {
                        deleteAccount();
                        await logout();
                    }
                }
            ]
        );
    };

    if (isRequesting) return <Loading />;

    return (
        <BaseComponent isBack={true} title="deleteAccount.title">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Warning Banner */}
                <View style={styles.warningBanner}>
                    <MaterialIcons name="warning" size={24} color={Colors.red} />
                    <View style={styles.warningTextContainer}>
                        <Text style={styles.warningTitle}>{t('deleteAccount.warningTitle')}</Text>
                        <Text style={styles.warningText}>{t('deleteAccount.warningMessage')}</Text>
                    </View>
                </View>

                {/* Account Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('deleteAccount.accountInfo')}</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="person-outline" size={20} color={Colors.mainColor} />
                            <Text style={styles.infoLabel}>{t('deleteAccount.userName')}:</Text>
                            <Text style={styles.infoValue}>{userData?.user_name}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={20} color={Colors.mainColor} />
                            <Text style={styles.infoLabel}>{t('deleteAccount.phoneNumber')}:</Text>
                            <Text style={styles.infoValue}>{userData?.phone_number}</Text>
                        </View>
                    </View>
                </View>

                {/* What will be deleted */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('deleteAccount.whatDeleted')}</Text>
                    <View style={styles.deletionCard}>
                        <DeletionItem icon="person" text={t('deleteAccount.items.personalInfo')} />
                        <DeletionItem icon="history" text={t('deleteAccount.items.chargingHistory')} />
                        <DeletionItem icon="wallet" text={t('deleteAccount.items.walletBalance')} />
                        <DeletionItem icon="notifications" text={t('deleteAccount.items.notifications')} />
                        <DeletionItem icon="settings" text={t('deleteAccount.items.preferences')} />
                    </View>
                </View>

                {/* Confirmation */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('deleteAccount.confirmTitle')}</Text>
                    <Text style={styles.confirmInstructions}>{t('deleteAccount.confirmInstructions')}</Text>
                    <TextInput
                        style={styles.confirmInput}
                        placeholder={t('deleteAccount.confirmPlaceholder')}
                        placeholderTextColor={Colors.gray}
                        value={confirmationText}
                        onChangeText={setConfirmationText}
                        autoCapitalize="none"
                    />
                </View>

                {/* Delete Button */}
                <View style={styles.buttonContainer}>
                    <CustomButton
                        buttonTitle={t('deleteAccount.deleteButton')}
                        onPress={handleDeleteAccount}
                        buttonColor={Colors.red}
                        disabled={confirmationText.toLowerCase() !== 'delete'}
                    />
                </View>
            </ScrollView>
        </BaseComponent>
    );
};

// Helper Components
const DeletionItem = ({ icon, text }: { icon: string; text: string }) => (
    <View style={styles.deletionItem}>
        <Ionicons name={icon as any} size={18} color={Colors.red} />
        <Text style={styles.deletionText}>{text}</Text>
    </View>
);

const ReasonCheckbox = ({ 
    label, 
    isSelected, 
    onPress 
}: { 
    label: string; 
    isSelected: boolean; 
    onPress: () => void;
}) => (
    <View style={styles.checkboxContainer}>
        <Ionicons
            name={isSelected ? "checkbox" : "square-outline"}
            size={24}
            color={isSelected ? Colors.mainColor : Colors.gray}
            onPress={onPress}
        />
        <Text style={styles.checkboxLabel} onPress={onPress}>
            {label}
        </Text>
    </View>
);

export default DeleteAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: safePadding,
    },
    warningBanner: {
        flexDirection: 'row',
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.red,
    },
    warningTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    warningTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.red,
        marginBottom: 4,
    },
    warningText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.black,
        lineHeight: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.black,
        marginBottom: 12,
    },
    sectionSubtitle: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.gray,
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dividerColor,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.gray,
        marginLeft: 8,
        marginRight: 8,
    },
    infoValue: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.black,
        flex: 1,
    },
    deletionCard: {
        backgroundColor: '#FFEBEE',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.red,
    },
    deletionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    deletionText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.black,
        marginLeft: 12,
    },
    reasonsContainer: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dividerColor,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkboxLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.black,
        marginLeft: 12,
        flex: 1,
    },
    feedbackInput: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.dividerColor,
        borderRadius: 12,
        padding: 12,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.black,
        minHeight: 100,
    },
    confirmInstructions: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.gray,
        marginBottom: 12,
        lineHeight: 20,
    },
    confirmInput: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.dividerColor,
        borderRadius: 12,
        padding: 12,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.black,
    },
    buttonContainer: {
        marginTop: 8,
        marginBottom: 40,
    },
    helpSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    helpText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.black,
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
});
