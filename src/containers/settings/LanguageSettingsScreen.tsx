import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BaseComponent from '@/components/BaseComponent';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import { useLanguageStore } from '@/store/useTranslateStore';
import { languages } from '@/locales';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '@/hooks/useTranslation';

const LanguageSettingsScreen = () => {
  const { appLanguage, setAppLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const handleLanguageSelect = (languageCode: string) => {
    setAppLanguage(languageCode);
  };

  return (
    <BaseComponent isBack={true} title={t('profile.language')}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.description}>
            {t('profile.selectLanguage')}
          </Text>

          <View style={styles.languageList}>
            {languages.map((language) => {
              const isSelected = appLanguage === language.code;
              
              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    isSelected && styles.languageItemSelected,
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{language.name}</Text>
                    <Text style={styles.languageNative}>{language.nativeName}</Text>
                  </View>
                  
                  {isSelected && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={24} 
                      color={Colors.mainColor} 
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </BaseComponent>
  );
};

export default LanguageSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor,
  },
  content: {
    padding: safePadding,
  },
  description: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    color: Colors.mainColor,
    marginBottom: 20,
    textAlign: 'center',
  },
  languageList: {
    gap: 12,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageItemSelected: {
    borderColor: Colors.mainColor,
    backgroundColor: Colors.backGroundColor,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnBold,
    color: Colors.mainColor,
    marginBottom: 4,
  },
  languageNative: {
    fontSize: FontSize.small,
    fontFamily: CustomFontConstant.EnRegular,
    color: '#64748b',
  },
});
