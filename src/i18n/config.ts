export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  enabled: boolean;
}

export interface TranslationConfig {
  defaultLanguage: string;
  supportedLanguages: LanguageConfig[];
  fallbackLanguage: string;
  translationCacheDir: string;
  manualOverridesDir: string;
  openaiApiKey: string;
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
}

export const translationConfig: TranslationConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  translationCacheDir: '.cache/translations',
  manualOverridesDir: 'translations',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  batchSize: 10,
  retryAttempts: 3,
  retryDelay: 1000,
  supportedLanguages: [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false,
      enabled: true
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳',
      rtl: false,
      enabled: true
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳',
      rtl: false,
      enabled: true
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳',
      rtl: false,
      enabled: true
    },
    {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇮🇳',
      rtl: false,
      enabled: true
    },
    {
      code: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      flag: '🇮🇳',
      rtl: false,
      enabled: true
    }
  ]
};

export const getLanguageByCode = (code: string): LanguageConfig | undefined => {
  return translationConfig.supportedLanguages.find(lang => lang.code === code);
};

export const getEnabledLanguages = (): LanguageConfig[] => {
  return translationConfig.supportedLanguages.filter(lang => lang.enabled);
};

export const isLanguageSupported = (code: string): boolean => {
  return translationConfig.supportedLanguages.some(lang => lang.code === code && lang.enabled);
};

export const getLanguageCodeFromPath = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (isLanguageSupported(firstSegment)) {
    return firstSegment;
  }
  
  return translationConfig.defaultLanguage;
};

export const getLocalizedPath = (path: string, language: string): string => {
  if (language === translationConfig.defaultLanguage) {
    return path;
  }
  
  // Remove existing language prefix if present
  const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
  return `/${language}${cleanPath}`;
};

export const getDefaultPath = (path: string): string => {
  return path.replace(/^\/[a-z]{2}(\/|$)/, '/');
};
