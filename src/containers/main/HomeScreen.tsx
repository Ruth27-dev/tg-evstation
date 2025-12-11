import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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

const HomeScreen = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const { getMeWallet, userWalletBalance } = useWallet();
    const { getStation, isLoading } = useStation();
    const { fetchUser } = useAuth();

    const promotions = [
        {
            id: 1,
            title: "50% OFF First Charge",
            subtitle: "New users only",
            color: "#C9A961"
        },
        {
            id: 2,
            title: "Free Charging",
            subtitle: "Top up $100 or more",
            color: "#FFA500"
        },
        {
            id: 3,
            title: "Loyalty Rewards",
            subtitle: "Earn points on every charge",
            color: "#FF6B6B"
        },
    ];

    const menuItems = [
        { 
            id: 1, 
            name: 'Top Up', 
            icon: 'logo-usd', 
            color: '#10B981',
            onPress: () => navigate('TopUp') 
        },
        { 
            id: 2, 
            name: 'History', 
            icon: 'battery-charging', 
            color: '#3B82F6',
            onPress: () => navigate('History')
        },
        { 
            id: 3, 
            name: 'Find Station', 
            icon: 'charging-station', 
            color: '#F59E0B',
            onPress: () => navigate('ListStation')
        },
    ];

    useEffect(() => {
        getMeWallet();
        getStation();
        fetchUser();
    }, []);

    const handleRefresh = useCallback(async () => {
        await Promise.all([
            getMeWallet(),
            getStation()
        ]);
    }, [getMeWallet, getStation]);

    if(isLoading) return <Loading/>

    return (
       <BaseComponent isBack={false}>
            <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom: 20,flexGrow:1}}>
                <View style={styles.headerGradient}>
                    <View style={{padding:safePadding}}>
                        <BalanceSection 
                            balance={Number(userWalletBalance?.balance) || 0}
                            currency={userWalletBalance?.currency ?? '$'}
                            onRefresh={handleRefresh}
                        />

                        <PromotionSlider 
                            promotions={promotions}
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