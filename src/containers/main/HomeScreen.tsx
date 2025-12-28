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
import { useSlideShow } from "@/hooks/useSlideShow";

const HomeScreen = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const { getMeWallet, userWalletBalance } = useWallet();
    const { getStation, isLoading } = useStation();
    const { fetchUser } = useAuth();
    const { getSlideShow,slideShowData } = useSlideShow();
    const menuItems = [
        { 
            id: 1, 
            name: 'wallet.topUp', 
            icon: 'logo-usd', 
            color: '#10B981',
            onPress: () => navigate('TopUp') 
        },
        { 
            id: 2, 
            name: 'menu.history', 
            icon: 'battery-charging', 
            color: '#3B82F6',
            onPress: () => navigate('History')
        },
        { 
            id: 3, 
            name: 'station.findStation', 
            icon: 'charging-station', 
            color: '#F59E0B',
            onPress: () => navigate('ListStation')
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
            <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom: 20,flexGrow:1}}>
                <View style={styles.headerGradient}>
                    <View style={{padding:safePadding}}>
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