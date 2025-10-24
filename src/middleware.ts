import type { MiddlewareHandler } from 'astro';
import { translationConfig, isLanguageSupported, getLanguageCodeFromPath } from './i18n/config';

/**
 * Middleware for handling language detection and routing
 */
export const onRequest: MiddlewareHandler = (context, next) => {
  const { url, request } = context;
  const pathname = url.pathname;
  
  // Extract language from path
  const language = getLanguageCodeFromPath(pathname);
  
  // Add language to context for use in pages
  context.locals.language = language;
  context.locals.isLocalized = language !== translationConfig.defaultLanguage;
  
  // Handle language-specific logic
  if (isLanguageSupported(language)) {
    // Set language-specific attributes
    context.locals.languageDirection = language === 'ar' ? 'rtl' : 'ltr';
    context.locals.languageName = translationConfig.supportedLanguages.find(lang => lang.code === language)?.name || language;
  }
  
  return next();
};
