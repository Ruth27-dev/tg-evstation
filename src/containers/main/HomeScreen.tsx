import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Platform, ScrollView, StyleSheet, View } from "react-native";
import { safePadding } from "@/constants/GeneralConstants";
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
const HomeScreen = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const { getMeWallet, userWalletBalance } = useWallet();
    const { getStation, isLoading } = useStation();
    const { fetchUser } = useAuth();
    const { getSlideShow,slideShowData } = useSlideShow();
    const isTablet = DeviceInfo.isTablet();
    const isIPad = Platform.OS === 'ios' && DeviceInfo.getModel().toLowerCase().includes('ipad');

    const menuItems = [
        {
            id: 1,
            name: 'wallet.topUp',
            icon: 'logo-usd',
            iconLib: 'ionicons' as const,
            onPress: () => navigate('TopUp')
        },
        {
            id: 2,
            name: 'menu.history',
            icon: 'battery-charging',
            iconLib: 'ionicons' as const,
            onPress: () => navigate('History')
        },
        {
            id: 3,
            name: 'station.findStation',
            icon: 'charging-station',
            iconLib: 'fontawesome5' as const,
            onPress: () => navigate('ListStation')
        },
        {
            id: 4,
            name: 'menu.vehicleRental',
            icon: 'car',
            iconLib: 'fontawesome5' as const,
            onPress: () => navigate('VehicleRental', { title: 'menu.vehicleRental', icon: 'car' })
        },
        {
            id: 5,
            name: 'menu.hotelBooking',
            icon: 'hotel',
            iconLib: 'fontawesome5' as const,
            onPress: () => navigate('HotelBooking', { title: 'menu.hotelBooking', icon: 'hotel' })
        },
        {
            id: 6,
            name: 'menu.restaurantBooking',
            icon: 'utensils',
            iconLib: 'fontawesome5' as const,
            onPress: () => navigate('RestaurantBooking', { title: 'menu.restaurantBooking', icon: 'utensils' })
        },
        {
            id: 7,
            name: 'menu.martShop',
            icon: 'store',
            iconLib: 'fontawesome5' as const,
            onPress: () => navigate('MartShop', { title: 'menu.martShop', icon: 'store' })
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

    if(isLoading) return <Loading/>

    return (
       <BaseComponent isBack={false}>
            <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:isIPad || isTablet ? 70 : 20,flexGrow:1}}>
                <View style={styles.headerGradient}>
                    <View style={{padding:safePadding,marginBottom: 50}}>
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

                        <MenuGrid menuItems={menuItems} />
                    </View>
                </View>
            </ScrollView>   
       </BaseComponent>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    headerGradient: {
        flex: 1,
    },
});