import React, { useCallback, useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import BaseComponent from "@/components/BaseComponent";
import { useWallet } from "@/hooks/useWallet";
import { useStation } from "@/hooks/useStation";
import { navigate } from "@/navigation/NavigationService";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import BalanceSection from "./components/BalanceSection";
import PromotionSlider from "./components/PromotionSlider";
import MenuGrid from "./components/MenuGrid";
import { useSlideShow } from "@/hooks/useSlideShow";
import DeviceInfo from "react-native-device-info";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "@/theme";

const HomeScreen = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const { getMeWallet, userWalletBalance } = useWallet();
    const { getStation, isLoading } = useStation();
    const { fetchUser } = useAuth();
    const { getSlideShow, slideShowData } = useSlideShow();
    const isTablet = DeviceInfo.isTablet();
    const isIPad = Platform.OS === 'ios' && DeviceInfo.getModel().toLowerCase().includes('ipad');

    const menuItems = [
        {
            id: 1,
            name: 'station.findStation',
            subtitle: 'station.nearbyStations',
            icon: 'charging-station',
            iconLib: 'fontawesome5' as const,
            color: Colors.mainColor,
            onPress: () => navigate('ListStation'),
        },
        {
            id: 2,
            name: 'wallet.topUp',
            icon: 'add-circle',
            iconLib: 'ionicons' as const,
            color: Colors.primaryColor,
            onPress: () => navigate('TopUp'),
        },
        {
            id: 3,
            name: 'menu.history',
            icon: 'battery-charging',
            iconLib: 'ionicons' as const,
            color: Colors.secondaryColor,
            onPress: () => navigate('History'),
        },
    ];

    useEffect(() => {
        getMeWallet();
        getStation();
        fetchUser();
        getSlideShow();
    }, []);

    const handleRefresh = useCallback(async () => {
        await Promise.all([
            getMeWallet(),
            getStation(),
            getSlideShow(),
        ]);
    }, [getMeWallet, getStation, getSlideShow]);

    if (isLoading) return <Loading />;

    return (
        <BaseComponent isBack={false}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: isIPad || isTablet ? 70 : 24, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={[Colors.darkColor, Colors.mainColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerBand}
                />

                <View style={styles.content}>
                    <BalanceSection
                        balance={Number(userWalletBalance?.balance) || 0}
                        currency={userWalletBalance?.currency ?? '$'}
                        onRefresh={handleRefresh}
                        onTopUp={() => navigate('TopUp')}
                    />

                    <PromotionSlider
                        promotions={slideShowData ?? []}
                        activeSlide={activeSlide}
                        onSlideChange={setActiveSlide}
                    />

                    <Text style={styles.sectionLabel}>Quick Actions</Text>
                    <MenuGrid menuItems={menuItems} />
                </View>
            </ScrollView>
        </BaseComponent>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    headerBand: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 190,
    },
    content: {
        padding: safePadding as any,
        paddingTop: 16,
    },
    sectionLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.darkColor,
        marginBottom: 12,
        marginTop: 4,
    },
});
