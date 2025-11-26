import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from "@/components/CustomButton";

interface Language {
    code: string;
    name: string;
    nativeName: string;
    icon: string;
}

const languages: Language[] = [
    { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', icon: '🇰🇭' },
    { code: 'en', name: 'English', nativeName: 'English', icon: '🇺🇸' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', icon: '🇨🇳' },
];

const ChangeLanguageScreen = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [tempSelectedLanguage, setTempSelectedLanguage] = useState('en');

    const handleSave = () => {
        setSelectedLanguage(tempSelectedLanguage);
        console.log('Language changed to:', tempSelectedLanguage);
        // Call API or update i18n configuration
        Alert.alert(
            'Success',
            'Language has been changed successfully. App will reload.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Reload app or update language context
                    }
                }
            ]
        );
    };

    const renderLanguageCard = (language: Language) => {
        const isSelected = tempSelectedLanguage === language.code;
        
        return (
            <TouchableOpacity
                key={language.code}
                style={[styles.languageCard, isSelected && styles.languageCardSelected]}
                onPress={() => setTempSelectedLanguage(language.code)}
                activeOpacity={0.7}
            >
                <View style={styles.languageContent}>
                    <View style={styles.languageLeft}>
                        <Text style={styles.languageIcon}>{language.icon}</Text>
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

    const hasChanges = selectedLanguage !== tempSelectedLanguage;

    return (
        <BaseComponent isBack={true} title="Change Language">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="language" size={32} color={Colors.mainColor} />
                    </View>
                    <Text style={styles.title}>Choose Your Language</Text>
                    <Text style={styles.subtitle}>
                        Select your preferred language for the app interface
                    </Text>
                </View>

                {/* Language Cards */}
                <View style={styles.languagesContainer}>
                    {languages.map(language => renderLanguageCard(language))}
                </View>

                {/* Save Button */}
                {hasChanges && (
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            buttonTitle="Save Changes"
                            onPress={handleSave}
                        />
                    </View>
                )}
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
        borderRadius: 16,
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
    languageIcon: {
        fontSize: 40,
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
    selectedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: `${Colors.mainColor}20`,
    },
    selectedBadgeText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    infoCard: {
        backgroundColor: `${Colors.mainColor}08`,
        marginHorizontal: 16,
        marginTop: 24,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: `${Colors.mainColor}20`,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    infoTitle: {
        fontSize: FontSize.medium + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    infoText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        lineHeight: 22,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    currentLanguageInfo: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    currentLanguageLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    currentLanguageValue: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
});
