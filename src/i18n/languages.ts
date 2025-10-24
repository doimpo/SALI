import { LanguageConfig } from './config';

export const languageMetadata: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    enabled: true
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    rtl: false,
    enabled: true
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    rtl: false,
    enabled: true
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    rtl: false,
    enabled: true
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    rtl: false,
    enabled: true
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    rtl: false,
    enabled: true
  }
};

export const getLanguageName = (code: string): string => {
  return languageMetadata[code]?.name || code;
};

export const getNativeLanguageName = (code: string): string => {
  return languageMetadata[code]?.nativeName || code;
};

export const getLanguageFlag = (code: string): string => {
  return languageMetadata[code]?.flag || '🌐';
};

export const isRTL = (code: string): boolean => {
  return languageMetadata[code]?.rtl || false;
};

export const getLanguageDirection = (code: string): 'ltr' | 'rtl' => {
  return isRTL(code) ? 'rtl' : 'ltr';
};
