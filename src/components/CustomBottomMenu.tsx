import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Keyboard, Animated, Image } from 'react-native';
import HOMEICON from '@/assets/icons/home.svg';
import ANALYTICSICON from '@/assets/icons/chart.svg';
import MANAGEICON from '@/assets/icons/file.svg';
import ORDERICON from '@/assets/icons/order.svg';
import ConnectorIcon from '@/assets/logo/logo_nobg.svg';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@/theme';
import { CustomFontConstant, Images } from '@/constants/GeneralConstants';

const CustomBottomMenu: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    
    // Remove useMemo and directly create menuData to ensure fresh translations
    const menuData = [
        { id: 1, name: "Home", icon: <Feather name="home" size={25}/> },
        { id: 2, name: "History", icon: <FontAwesome5 name="file-invoice" size={25} /> },
        { id: 3, name: '', icon: <ConnectorIcon /> },
        { id: 4, name: "Wallet", icon: <FontAwesome5 name="wallet" size={25}/> },
        { id: 5, name: "Settings", icon: <FontAwesome5 name="user-cog" size={25} /> },
    ];

    const renderButtonScan = useCallback((onPress: () => void, onLongPress: () => void, index: number, isFocused: boolean) => {
        return (
            <TouchableOpacity 
                activeOpacity={0.7}
                style={{
                    width: 65,
                    height: 65,
                    backgroundColor: Colors.white,
                    borderRadius: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: 25,
                    borderColor: Colors.secondaryColor,
                    borderWidth: 2,
                }}
                onLongPress={onLongPress}
                onPress={onPress}
            >
                <Image source={Images.logoNoBg} style={{ width: 55, height: 55 }} />
            </TouchableOpacity>
        );
    }, []); 

    const translateY = useRef(new Animated.Value(0)).current;

    return (
        <Animated.View 
            style={[styles.container, { transform: [{ translateY }] }]}
        >
            {state?.routes?.map((route: any, index: any) => {
                const { options } = descriptors[route.key];
                const label = options?.tabBarLabel ?? options.title ?? route.name;
                const isFocused = state?.index === index;
                
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented)
                        navigation.navigate({ name: route.name, params: undefined, merge: true });
                };
                
                const onLongPress = () => {
                    navigation.emit({ type: 'tabLongPress', target: route.key });
                };
                
                return (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.iconViews}
                    >
                        {index === 2 ? renderButtonScan(onPress, onLongPress, index, isFocused) :
                            <View style={styles.iconButton}>
                                {React.cloneElement(menuData[index].icon, { 
                                    color: isFocused ? Colors.secondaryColor : Colors.dividerColor, 
                                })}
                                <Text style={[styles.optionText, { color: isFocused ? Colors.secondaryColor : Colors.dividerColor }]}>
                                    {menuData[index].name}
                                </Text>
                            </View>
                        }
                    </TouchableOpacity>
                );
            })}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconViews: {
        flex: 1,
        height: Platform.OS === 'ios' ? 80 : 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: 12,
        color: Colors.gray,
        textAlign: 'center',
        paddingTop: 5,
        fontFamily: CustomFontConstant.EnBold,
    },
    iconButton: {
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default React.memo(CustomBottomMenu);