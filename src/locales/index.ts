import en from './en.json';
import kh from './kh.json';
import zh from './zh.json';

export const translations = {
  en,
  kh,
  zh,
};

export type Language = keyof typeof translations;

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'kh', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
] as const;
