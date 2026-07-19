import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '@/theme';

type CardProps = {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'tinted';
};

function Card({ children, style, variant = 'default' }: CardProps) {
    return (
        <View style={[styles.base, variant === 'tinted' ? styles.tinted : styles.default, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        ...Shadows.card,
    },
    default: {
        backgroundColor: Colors.white,
    },
    tinted: {
        backgroundColor: Colors.mainColor,
    },
});

export default React.memo(Card);
