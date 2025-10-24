import { translationConfig, getLanguageCodeFromPath, getLocalizedPath, getDefaultPath } from '../i18n/config';

/**
 * Generate localized path for a given path and language
 */
export function generateLocalizedPath(originalPath: string, language: string): string {
  return getLocalizedPath(originalPath, language);
}

/**
 * Get the default (English) path from a localized path
 */
export function getDefaultPathFromLocalized(localizedPath: string): string {
  return getDefaultPath(localizedPath);
}

/**
 * Extract language code from a path
 */
export function extractLanguageFromPath(path: string): string {
  return getLanguageCodeFromPath(path);
}

/**
 * Check if a path is localized (has language prefix)
 */
export function isLocalizedPath(path: string): boolean {
  const languageCode = extractLanguageFromPath(path);
  return languageCode !== translationConfig.defaultLanguage;
}

/**
 * Generate all localized paths for a given path
 */
export function generateAllLocalizedPaths(originalPath: string): Record<string, string> {
  const localizedPaths: Record<string, string> = {};
  
  for (const language of translationConfig.supportedLanguages) {
    if (language.enabled) {
      localizedPaths[language.code] = generateLocalizedPath(originalPath, language.code);
    }
  }
  
  return localizedPaths;
}

/**
 * Generate hreflang links for SEO
 */
export function generateHreflangLinks(originalPath: string, baseUrl: string = 'https://southasianliverinstitute.netlify.app'): Array<{ hreflang: string; href: string }> {
  const hreflangLinks: Array<{ hreflang: string; href: string }> = [];
  
  for (const language of translationConfig.supportedLanguages) {
    if (language.enabled) {
      const localizedPath = generateLocalizedPath(originalPath, language.code);
      const fullUrl = `${baseUrl}${localizedPath}`;
      
      hreflangLinks.push({
        hreflang: language.code,
        href: fullUrl
      });
    }
  }
  
  // Add x-default for the default language
  const defaultPath = generateLocalizedPath(originalPath, translationConfig.defaultLanguage);
  hreflangLinks.push({
    hreflang: 'x-default',
    href: `${baseUrl}${defaultPath}`
  });
  
  return hreflangLinks;
}

/**
 * Get the canonical URL for a localized path
 */
export function getCanonicalUrl(localizedPath: string, baseUrl: string = 'https://southasianliverinstitute.netlify.app'): string {
  const defaultPath = getDefaultPathFromLocalized(localizedPath);
  return `${baseUrl}${defaultPath}`;
}

/**
 * Generate language switcher data
 */
export function generateLanguageSwitcherData(currentPath: string): Array<{ code: string; name: string; nativeName: string; flag: string; url: string }> {
  const languageData: Array<{ code: string; name: string; nativeName: string; flag: string; url: string }> = [];
  
  for (const language of translationConfig.supportedLanguages) {
    if (language.enabled) {
      const localizedPath = generateLocalizedPath(currentPath, language.code);
      
      languageData.push({
        code: language.code,
        name: language.name,
        nativeName: language.nativeName,
        flag: language.flag,
        url: localizedPath
      });
    }
  }
  
  return languageData;
}

/**
 * Get the current language from a path
 */
export function getCurrentLanguage(path: string): string {
  return extractLanguageFromPath(path);
}

/**
 * Check if a language is available for a specific path
 */
export function isLanguageAvailableForPath(path: string, language: string): boolean {
  // This would need to check if translations exist for this path and language
  // For now, return true for all enabled languages
  return translationConfig.supportedLanguages.some(lang => 
    lang.code === language && lang.enabled
  );
}
