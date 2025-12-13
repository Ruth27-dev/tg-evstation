import { useLanguageStore } from '@/store/useTranslateStore';
import { translations, Language } from '@/locales';

export const useTranslation = () => {
  const { appLanguage } = useLanguageStore();
  
  const currentLanguage: Language = (appLanguage as Language) || 'en';
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
 
  const tVar = (key: string, params: Record<string, string | number>): string => {
    let translation = t(key);
    
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{{${param}}}`, String(params[param]));
    });
    
    return translation;
  };
  
  return {
    t,
    tVar,
    currentLanguage,
    isRTL: false,
  };
};
