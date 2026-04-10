import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseComponent from '@/components/BaseComponent';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';

const ComingSoonScreen  = ({ route }:any) => {
    const { title, icon } = route.params;

    return (
        <BaseComponent isBack={true} title={title}>
            <View style={styles.container}>
                <View style={styles.iconWrapper}>
                    <FontAwesome5 name={icon} size={60} color={Colors.mainColor} />
                </View>
                <Text style={styles.title}>Coming Soon</Text>
                <Text style={styles.subtitle}>
                    We're working hard to bring you this feature.{'\n'}Stay tuned!
                </Text>
            </View>
        </BaseComponent>
    );
};

export default ComingSoonScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: `${Colors.mainColor}12`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        borderWidth: 2,
        borderColor: `${Colors.mainColor}30`,
    },
    title: {
        fontSize: FontSize.large + 6,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
});
