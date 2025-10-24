import fs from 'fs';
import path from 'path';
import { translationConfig, isLanguageSupported } from '../i18n/config';

export interface TranslationData {
  meta?: Record<string, string>;
  content?: Record<string, string>;
  translatedAt?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export interface PageTranslation {
  [key: string]: TranslationData;
}

/**
 * Load translations for a specific page and language
 */
export function getTranslations(pageKey: string, language: string): TranslationData | null {
  if (!isLanguageSupported(language)) {
    console.warn(`Language ${language} is not supported`);
    return null;
  }

  // Skip loading translations for default language
  if (language === translationConfig.defaultLanguage) {
    return null;
  }

  try {
    // Try to load from cache first
    const cachePath = path.join(process.cwd(), '.cache', 'translations', language, `${pageKey.replace(/\//g, '-')}.json`);
    
    if (fs.existsSync(cachePath)) {
      const translationData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return translationData;
    }

    // Fallback: look up the page inside the combined all-translations.json file
    const combinedPath = path.join(process.cwd(), '.cache', 'translations', language, 'all-translations.json');
    if (fs.existsSync(combinedPath)) {
      const allTranslations = JSON.parse(fs.readFileSync(combinedPath, 'utf8')) as PageTranslation;
      const pageFromCombined = allTranslations[pageKey];
      if (pageFromCombined) {
        return pageFromCombined as TranslationData;
      }
    }

    // Try to load from manual overrides
    const overridePath = path.join(process.cwd(), 'translations', language, `${pageKey}.json`);
    
    if (fs.existsSync(overridePath)) {
      const overrideData = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
      return overrideData;
    }

    console.warn(`No translations found for page ${pageKey} in language ${language}`);
    return null;

  } catch (error) {
    console.error(`Error loading translations for ${pageKey} in ${language}:`, error);
    return null;
  }
}

/**
 * Load all translations for a specific language
 */
export function getAllTranslations(language: string): PageTranslation | null {
  if (!isLanguageSupported(language)) {
    console.warn(`Language ${language} is not supported`);
    return null;
  }

  if (language === translationConfig.defaultLanguage) {
    return null;
  }

  try {
    const cachePath = path.join(process.cwd(), '.cache', 'translations', language, 'all-translations.json');
    
    if (fs.existsSync(cachePath)) {
      const allTranslations = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return allTranslations;
    }

    console.warn(`No translations found for language ${language}`);
    return null;

  } catch (error) {
    console.error(`Error loading all translations for ${language}:`, error);
    return null;
  }
}

/**
 * Get translated text for a specific key
 */
export function getTranslatedText(
  pageKey: string, 
  language: string, 
  key: string, 
  fallbackText?: string
): string {
  const translations = getTranslations(pageKey, language);
  
  if (!translations) {
    return fallbackText || '';
  }

  // Try to get from content first, then meta
  const translatedText = translations.content?.[key] || translations.meta?.[key];
  
  if (translatedText) {
    return translatedText;
  }

  return fallbackText || '';
}

/**
 * Get translated meta information
 */
export function getTranslatedMeta(pageKey: string, language: string): Record<string, string> {
  const translations = getTranslations(pageKey, language);
  
  if (!translations || !translations.meta) {
    return {};
  }

  return translations.meta;
}

/**
 * Check if translations exist for a page and language
 */
export function hasTranslations(pageKey: string, language: string): boolean {
  if (language === translationConfig.defaultLanguage) {
    return true; // Default language doesn't need translations
  }

  const translations = getTranslations(pageKey, language);
  return translations !== null;
}

/**
 * Get available languages for a specific page
 */
export function getAvailableLanguages(pageKey: string): string[] {
  const availableLanguages = [translationConfig.defaultLanguage];
  
  for (const language of translationConfig.supportedLanguages) {
    if (language.enabled && language.code !== translationConfig.defaultLanguage) {
      if (hasTranslations(pageKey, language.code)) {
        availableLanguages.push(language.code);
      }
    }
  }
  
  return availableLanguages;
}

/**
 * Get translation status for all pages
 */
export function getTranslationStatus(): Record<string, string[]> {
  const status: Record<string, string[]> = {};
  
  // This would need to be implemented based on your specific needs
  // For now, return empty object
  return status;
}

/**
 * Load translations at build time for static generation
 */
export function loadTranslationsForBuild(): Record<string, Record<string, TranslationData>> {
  const allTranslations: Record<string, Record<string, TranslationData>> = {};
  
  for (const language of translationConfig.supportedLanguages) {
    if (language.enabled && language.code !== translationConfig.defaultLanguage) {
      const translations = getAllTranslations(language.code);
      if (translations) {
        allTranslations[language.code] = translations;
      }
    }
  }
  
  return allTranslations;
}
