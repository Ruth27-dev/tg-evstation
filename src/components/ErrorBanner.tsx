import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';

interface ErrorBannerProps {
    visible: boolean;
    message: string;
    title?: string;
    onDismiss: () => void;
    autoDismiss?: boolean;
    autoDismissDelay?: number;
    topOffset?: number;
    iconName?: string;
    iconColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    titleColor?: string;
    messageColor?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
    visible,
    message,
    title = 'Error',
    onDismiss,
    autoDismiss = true,
    autoDismissDelay = 4000,
    topOffset = 20,
    iconName = 'alert-circle',
    iconColor = '#DC2626',
    backgroundColor = '#FEE2E2',
    borderColor = '#DC2626',
    titleColor = '#DC2626',
    messageColor = '#991B1B',
}) => {
    const errorAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Animate in
            Animated.sequence([
                Animated.spring(errorAnimation, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 8,
                    tension: 40,
                }),
                // Auto dismiss after delay if enabled
                ...(autoDismiss ? [
                    Animated.delay(autoDismissDelay),
                    Animated.timing(errorAnimation, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ] : []),
            ]).start(() => {
                if (autoDismiss) {
                    onDismiss();
                }
            });
        } else {
            // Reset animation when not visible
            errorAnimation.setValue(0);
        }
    }, [visible, autoDismiss, autoDismissDelay]);

    const handleClose = () => {
        Animated.timing(errorAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            onDismiss();
        });
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.errorBanner,
                {
                    top: topOffset,
                    backgroundColor,
                    borderLeftColor: borderColor,
                    opacity: errorAnimation,
                    transform: [{
                        translateY: errorAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0],
                        }),
                    }],
                },
            ]}
        >
            <View style={styles.errorIconContainer}>
                <Ionicons name={iconName as any} size={24} color={iconColor} />
            </View>
            <View style={styles.errorContent}>
                <Text style={[styles.errorTitle, { color: titleColor }]}>{title}</Text>
                <Text style={[styles.errorMessage, { color: messageColor }]}>{message}</Text>
            </View>
            <TouchableOpacity
                onPress={handleClose}
                style={styles.closeErrorButton}
            >
                <Ionicons name="close" size={20} color={iconColor} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default ErrorBanner;

const styles = StyleSheet.create({
    errorBanner: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        zIndex: 1000,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    errorIconContainer: {
        marginRight: 12,
    },
    errorContent: {
        flex: 1,
    },
    errorTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        fontWeight: '700',
        marginBottom: 4,
    },
    errorMessage: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        lineHeight: 18,
    },
    closeErrorButton: {
        padding: 4,
        marginLeft: 8,
    },
});
