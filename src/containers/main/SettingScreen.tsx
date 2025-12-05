import BaseComponent from "@/components/BaseComponent";
import React, { use, useCallback, useEffect, useState } from "react";
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

interface SettingItem {
    id: string;
    title: string;
    icon: string;
    iconType: 'ionicons' | 'material' | 'materialCommunity';
    onPress: () => void;
    showArrow?: boolean;
    isDanger?: boolean;
}

const SettingScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { fetchUser,logout, isRequesting } = useAuth();
    const { userData } = useMeStore();

    useEffect(() => { 
        fetchUser();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                fetchUser(),
            ]);
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    }, [fetchUser]);
        
    const handleProfilePress = () => {
        navigate('ProfileScreen');
    };

    const handleChangePassword = () => {
        navigate('ChangePasswordScreen');
    };

    const handleChangeLanguage = () => {
        navigate('ChangeLanguageScreen');
    };

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

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => logout() }
            ]
        );
    };

    const handleCustomerSupport = () => {
        navigate('CustomerSupportScreen');
    };

    const handlePrivacy = () => {
        navigate('PrivacyScreen');
    };

    const handleAboutUs = () => {
        navigate('AboutUsScreen');
    };

    const accountSettings: SettingItem[] = [
        {
            id: '1',
            title: 'Profile',
            icon: 'person-outline',
            iconType: 'ionicons',
            onPress: handleProfilePress,
            showArrow: true
        },
        {
            id: '2',
            title: 'Change Password',
            icon: 'lock-closed-outline',
            iconType: 'ionicons',
            onPress: handleChangePassword,
            showArrow: true
        },
        {
            id: '3',
            title: 'Change Language',
            icon: 'language',
            iconType: 'ionicons',
            onPress: handleChangeLanguage,
            showArrow: true
        },
        {
            id: '4',
            title: 'Logout',
            icon: 'log-out-outline',
            iconType: 'ionicons',
            onPress: handleLogout,
            showArrow: false
        },
        {
            id: '5',
            title: 'Delete Account',
            icon: 'trash-outline',
            iconType: 'ionicons',
            onPress: handleDeleteAccount,
            showArrow: false,
            isDanger: true
        }
    ];

    const supportSettings: SettingItem[] = [
        {
            id: '1',
            title: 'Customer Support',
            icon: 'headset',
            iconType: 'material',
            onPress: handleCustomerSupport,
            showArrow: true
        },
        {
            id: '2',
            title: 'Privacy',
            icon: 'shield-outline',
            iconType: 'ionicons',
            onPress: handlePrivacy,
            showArrow: true
        },
        {
            id: '3',
            title: 'About Us',
            icon: 'information-circle-outline',
            iconType: 'ionicons',
            onPress: handleAboutUs,
            showArrow: true
        }
    ];

    const renderIcon = (item: SettingItem) => {
        const iconColor = item.isDanger ? '#EF4444' : Colors.mainColor;
        const iconSize = 22;

        switch (item.iconType) {
            case 'ionicons':
                return <Ionicons name={item.icon as any} size={iconSize} color={iconColor} />;
            case 'material':
                return <MaterialIcons name={item.icon as any} size={iconSize} color={iconColor} />;
            case 'materialCommunity':
                return <MaterialCommunityIcons name={item.icon as any} size={iconSize} color={iconColor} />;
            default:
                return <Ionicons name="help-outline" size={iconSize} color={iconColor} />;
        }
    };

    const renderSettingItem = (item: SettingItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            <View style={styles.settingItemLeft}>
                <View style={[
                    styles.settingIconContainer,
                    { backgroundColor: item.isDanger ? '#EF444415' : `${Colors.mainColor}15` }
                ]}>
                    {renderIcon(item)}
                </View>
                <Text style={[
                    styles.settingItemText,
                    item.isDanger && { color: '#EF4444' }
                ]}>
                    {item.title}
                </Text>
            </View>
            {item.showArrow && (
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            )}
        </TouchableOpacity>
    );
    if(isRequesting) return <Loading/>
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
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Image source={Images.user} style={styles.avatar} />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{userData?.user_name}</Text>
                            <Text style={styles.userPhone}>{userData?.phone_number}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.settingsCard}>
                        {accountSettings.map(renderSettingItem)}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support & Information</Text>
                    <View style={styles.settingsCard}>
                        {supportSettings.map(renderSettingItem)}
                    </View>
                </View>
                <View style={styles.versionContainer}/>
            </ScrollView>
        </BaseComponent>
    );
}

export default SettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:safePadding
    },
    profileCard: {
        backgroundColor: Colors.mainColor,
        marginBottom: 24,
        padding: safePadding,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.mainColor,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.white,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500',
        marginBottom: 2,
    },
    userPhone: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500',
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    memberText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.white,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 12,
    },
    settingsCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingItemText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    versionContainer: {
        alignItems: 'center',
        paddingBottom: 100,
    },
   
});