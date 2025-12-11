import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, Images } from '@/constants/GeneralConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEVStore } from '@/store/useEVStore';
import { isEmpty } from 'lodash';
import { navigate } from '@/navigation/NavigationService';
import { useNavigationState } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ChargingMiniPlayer = () => {
    const { evConnect } = useEVStore();
    const slideAnim = useRef(new Animated.Value(100)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    
    // Get current route name
    const currentRouteName = useNavigationState(state => {
        const route = state?.routes[state.index];
        return route?.name;
    });
    const hasActiveCharging = !isEmpty(evConnect);
    const isOnChargingScreens = currentRouteName === 'ChargingDetail' || currentRouteName === 'PreparingCharging' || currentRouteName === 'Connector';
    
    // Only show mini player if there's active charging AND user is NOT on charging-related screens
    const shouldShowPlayer = hasActiveCharging && !isOnChargingScreens;

    useEffect(() => {
        if (shouldShowPlayer) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            }).start();

            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulseAnimation.start();

            return () => {
                pulseAnimation.stop();
            };
        } else {
            // Slide down animation
            Animated.spring(slideAnim, {
                toValue: 100,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            }).start();
        }
    }, [shouldShowPlayer]);

    if (!shouldShowPlayer) {
        return null;
    }

    const handlePress = () => {
        navigate('ChargingDetail');
    };

    return (
        <Animated.View 
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                }
            ]}
        >
            <TouchableOpacity 
                style={styles.content}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <View style={styles.mainContent}>
                    <View style={styles.leftSection}>
                        <View style={styles.iconContainer}>
                            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                <MaterialCommunityIcons 
                                    name="ev-station" 
                                    size={24} 
                                    color={Colors.secondaryColor} 
                                />
                            </Animated.View>
                        </View>
                        
                        <View style={styles.infoContainer}>
                            <Text style={styles.title} numberOfLines={1}>
                                Charging in Progress
                            </Text>
                            <Text style={styles.subtitle} numberOfLines={1}>
                                Connector {(evConnect as any)?.connector_number || '--'} • Station
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.playButton}
                        onPress={handlePress}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name="chevron-forward" 
                            size={24} 
                            color={Colors.mainColor} 
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 70, 
        left: 0,
        right: 0,
        backgroundColor: Colors.secondaryColor,
        zIndex: 1,
    },
    content: {
        width: '100%',
    },
    progressBarContainer: {
        height: 3,
        backgroundColor: '#333',
        width: '100%',
    },
    progressBar: {
        height: '100%',
        width: '30%', // This should be dynamic based on charging progress
        backgroundColor: Colors.secondaryColor,
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 15,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: '#fff',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#999',
    },
    playButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChargingMiniPlayer;
