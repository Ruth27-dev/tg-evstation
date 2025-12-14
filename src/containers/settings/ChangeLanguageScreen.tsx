import BaseComponent from "@/components/BaseComponent";
import React, { JSX, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from "@/components/CustomButton";
import KhmerIcon from '@/assets/icon/kh.svg';
import EnglishIcon from '@/assets/icon/en.svg';
import ChinaIcon from '@/assets/icon/china.svg';
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageStore } from "@/store/useTranslateStore";
import TextTranslation from "@/components/TextTranslation";

interface Language {
    code: string;
    name: string;
    nativeName: string;
    icon: JSX.Element;
}

const languages: Language[] = [
    { code: 'kh', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', icon: <KhmerIcon width={40} height={40} /> },
    { code: 'en', name: 'English', nativeName: 'English', icon: <EnglishIcon width={40} height={40} /> },
    { code: 'zh', name: 'Chinese', nativeName: '中文', icon: <ChinaIcon width={40} height={40} /> },
];

const ChangeLanguageScreen = () => {
    const { t, currentLanguage } = useTranslation();
    const { setAppLanguage } = useLanguageStore();
      
    const handleChangeLanguage = (languageCode: string) => {
        setAppLanguage(languageCode);
    }
    
    const renderLanguageCard = (language: Language) => {
        const isSelected = currentLanguage === language.code;
        
        return (
            <TouchableOpacity
                key={language.code}
                style={[styles.languageCard, isSelected && styles.languageCardSelected]}
                onPress={() => handleChangeLanguage(language.code)}
                activeOpacity={0.7}
            >
                <View style={styles.languageContent}>
                    <View style={styles.languageLeft}>
                        {language.icon}
                        <View style={styles.languageText}>
                            <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
                                {language.name}
                            </Text>
                            <Text style={[styles.languageNative, isSelected && styles.languageNativeSelected]}>
                                {language.nativeName}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
                        {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <BaseComponent isBack={true} title="header.changeLanguage">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="language" size={32} color={Colors.mainColor} />
                    </View>
                    <TextTranslation fontSize={FontSize.large} textKey={'common.chooseYourLanguage'} isBold/>
                    <TextTranslation fontSize={FontSize.small} textKey={'common.selectYourPreferredLanguage'}/>
                </View>
                <View style={styles.languagesContainer}>
                    {languages.map(language => renderLanguageCard(language))}
                </View>
            </ScrollView>
        </BaseComponent>
    );
}

export default ChangeLanguageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: `${Colors.mainColor}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        textAlign: 'center',
    },
    languagesContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    languageCard: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 10,
    },
    languageCardSelected: {
        borderColor: Colors.mainColor,
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    languageContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    languageLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 16,
    },
    languageText: {
        flex: 1,
    },
    languageName: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    languageNameSelected: {
        color: Colors.mainColor,
    },
    languageNative: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    languageNativeSelected: {
        color: Colors.mainColor,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: Colors.mainColor,
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.mainColor,
    },
});
