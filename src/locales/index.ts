import en from './en.json';
import kh from './kh.json';
import zh from './zh.json';
import vn from './vn.json';
export const translations = {
  kh,
  en,
  zh,
  vn,
};

export type Language = keyof typeof translations;

export const languages = [
  { code: 'kh', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'vn', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
] as const;
