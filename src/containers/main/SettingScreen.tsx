import BaseComponent from "@/components/BaseComponent";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, RefreshControl } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Images } from "@/assets/images";
import { navigate } from '@/navigation/NavigationService';
import { useAuth } from "@/hooks/useAuth";
import { useMeStore } from "@/store/useMeStore";
import Loading from "@/components/Loading";
import { useTranslation } from "@/hooks/useTranslation";
import TextTranslation from "@/components/TextTranslation";

interface SettingItem {
    id: string;
    title: string;
    icon: string;
    iconType: 'ionicons' | 'material' | 'materialCommunity';
    iconBg: string;
    iconColor: string;
    onPress: () => void;
    showArrow?: boolean;
    isDanger?: boolean;
}

const SettingScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { fetchUser, logout, isRequesting } = useAuth();
    const { userData } = useMeStore();
    const { t } = useTranslation();

    useEffect(() => {
        fetchUser();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchUser();
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    }, [fetchUser]);

    const handleProfilePress   = () => navigate('ProfileScreen');
    const handleChangePassword = () => navigate('ChangePasswordScreen');
    const handleChangeLanguage = () => navigate('ChangeLanguageScreen');
    const handleDeleteAccount  = () => navigate('DeleteAccountScreen');
    const handleCustomerSupport = () => navigate('CustomerSupportScreen');
    const handlePrivacy        = () => navigate('PrivacyScreen');
    const handleAboutUs        = () => navigate('AboutUsScreen');

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => logout() }
            ]
        );
    };

    const accountSettings: SettingItem[] = [
        {
            id: '1',
            title: 'profile.profile',
            icon: 'person-outline',
            iconType: 'ionicons',
            iconBg: `${Colors.mainColor}15`,
            iconColor: Colors.mainColor,
            onPress: handleProfilePress,
            showArrow: true,
        },
        // {
        //     id: '2',
        //     title: 'profile.changePassword',
        //     icon: 'lock-closed-outline',
        //     iconType: 'ionicons',
        //     iconBg: '#8B5CF615',
        //     iconColor: '#8B5CF6',
        //     onPress: handleChangePassword,
        //     showArrow: true
        // },
        {
            id: '3',
            title: 'profile.changeLanguage',
            icon: 'language',
            iconType: 'ionicons',
            iconBg: '#3B82F615',
            iconColor: '#3B82F6',
            onPress: handleChangeLanguage,
            showArrow: true,
        },
        {
            id: '4',
            title: 'auth.logout',
            icon: 'log-out-outline',
            iconType: 'ionicons',
            iconBg: '#F59E0B15',
            iconColor: '#F59E0B',
            onPress: handleLogout,
            showArrow: false,
        },
        {
            id: '5',
            title: 'profile.deleteAccount',
            icon: 'trash-outline',
            iconType: 'ionicons',
            iconBg: '#EF444415',
            iconColor: '#EF4444',
            onPress: handleDeleteAccount,
            showArrow: false,
            isDanger: true,
        },
    ];

    const supportSettings: SettingItem[] = [
        {
            id: '1',
            title: 'profile.helpSupport',
            icon: 'headset',
            iconType: 'material',
            iconBg: `${Colors.secondaryColor}15`,
            iconColor: Colors.secondaryColor,
            onPress: handleCustomerSupport,
            showArrow: true,
        },
        {
            id: '2',
            title: 'profile.privacyPolicy',
            icon: 'shield-outline',
            iconType: 'ionicons',
            iconBg: '#6366F115',
            iconColor: '#6366F1',
            onPress: handlePrivacy,
            showArrow: true,
        },
        {
            id: '3',
            title: 'profile.aboutUs',
            icon: 'information-circle-outline',
            iconType: 'ionicons',
            iconBg: `${Colors.mainColor}15`,
            iconColor: Colors.mainColor,
            onPress: handleAboutUs,
            showArrow: true,
        },
    ];

    const renderIcon = (item: SettingItem) => {
        const size = 20;
        switch (item.iconType) {
            case 'ionicons':
                return <Ionicons name={item.icon as any} size={size} color={item.iconColor} />;
            case 'material':
                return <MaterialIcons name={item.icon as any} size={size} color={item.iconColor} />;
            case 'materialCommunity':
                return <MaterialCommunityIcons name={item.icon as any} size={size} color={item.iconColor} />;
            default:
                return <Ionicons name="help-outline" size={size} color={item.iconColor} />;
        }
    };

    const renderSettingItem = (item: SettingItem, isLast: boolean) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.settingItem, isLast && styles.settingItemLast]}
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                {renderIcon(item)}
            </View>
            <TextTranslation
                textKey={item.title}
                fontSize={FontSize.medium}
                color={item.isDanger ? '#EF4444' : Colors.mainColor}
            />
            {item.showArrow && (
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" style={styles.chevron} />
            )}
        </TouchableOpacity>
    );

    if (isRequesting) return <Loading />;

    return (
        <BaseComponent isBack={false}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.mainColor]}
                        tintColor={Colors.mainColor}
                    />
                }
            >
                {/* Profile Card */}
                <TouchableOpacity style={styles.profileCard} onPress={handleProfilePress} activeOpacity={0.9}>
                    <View style={styles.circle1} />
                    <View style={styles.circle2} />

                    <View style={styles.avatarWrapper}>
                        <Image source={Images.user} style={styles.avatar} />
                        <View style={styles.editBadge}>
                            <Ionicons name="pencil" size={10} color={Colors.white} />
                        </View>
                    </View>

                    <Text style={styles.userName}>{userData?.user_name}</Text>

                    <View style={styles.phonePill}>
                        <Ionicons name="call-outline" size={12} color="rgba(255,255,255,0.75)" />
                        <Text style={styles.phoneText}>{userData?.phone_number}</Text>
                    </View>
                </TouchableOpacity>

                {/* Account Settings */}
                <View style={styles.section}>
                    <TextTranslation
                        textKey="profile.accountSettings"
                        fontSize={FontSize.medium}
                        isBold
                        isPaddingBottom
                    />
                    <View style={styles.card}>
                        {accountSettings.map((item, index) =>
                            renderSettingItem(item, index === accountSettings.length - 1)
                        )}
                    </View>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <TextTranslation
                        textKey="profile.support"
                        fontSize={FontSize.medium}
                        isBold
                        isPaddingBottom
                    />
                    <View style={styles.card}>
                        {supportSettings.map((item, index) =>
                            renderSettingItem(item, index === supportSettings.length - 1)
                        )}
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </BaseComponent>
    );
};

export default SettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: safePadding,
    },
    // Profile card
    profileCard: {
        backgroundColor: Colors.mainColor,
        borderRadius: 24,
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginBottom: 28,
        overflow: 'hidden',
        shadowColor: Colors.mainColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    circle1: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.06)',
        top: -50,
        right: -40,
    },
    circle2: {
        position: 'absolute',
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(255,255,255,0.06)',
        bottom: -20,
        left: 20,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    editBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: Colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.mainColor,
    },
    userName: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        marginBottom: 8,
    },
    phonePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 6,
    },
    phoneText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: 'rgba(255,255,255,0.85)',
    },
    // Sections
    section: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    settingItemLast: {
        borderBottomWidth: 0,
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    chevron: {
        marginLeft: 'auto',
    },
    bottomPadding: {
        height: 100,
    },
});
