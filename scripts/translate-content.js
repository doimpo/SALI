const fs = require('fs');
const path = require('path');
const OpenAITranslator = require('./openai-translator');
const TranslationCache = require('./translation-cache');
const ContentExtractor = require('./extract-content');
const DynamicContentExtractor = require('./extract-dynamic-content');
require('dotenv').config();

// Load i18n config
const translationConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  translationCacheDir: '.cache/translations',
  manualOverridesDir: 'translations',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  batchSize: 10,
  retryAttempts: 3,
  retryDelay: 1000,
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false, enabled: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', rtl: false, enabled: true },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', rtl: false, enabled: true },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', rtl: false, enabled: true },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', rtl: false, enabled: true },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', rtl: false, enabled: true }
  ]
};

function getEnabledLanguages() {
  return translationConfig.supportedLanguages.filter(lang => lang.enabled);
}

/**
 * Main translation orchestrator for SALi website
 */
class TranslationOrchestrator {
  constructor() {
    this.cache = new TranslationCache();
    this.contentExtractor = new ContentExtractor();
    this.dynamicExtractor = new DynamicContentExtractor();
    this.enabledLanguages = getEnabledLanguages();
    this.translator = new OpenAITranslator(translationConfig.openaiApiKey);
  }

  /**
   * Translate all content for all languages
   */
  async translateAllContent() {
    console.log('🌍 Starting translation process for all content...');
    
    // Extract content if needed
    const extractedContent = await this.ensureContentExtracted();
    const dynamicContent = await this.ensureDynamicContentExtracted();
    
    // Get all page keys
    const allPageKeys = this.getAllPageKeys(extractedContent, dynamicContent);
    
    console.log(`📄 Found ${allPageKeys.length} pages to translate`);
    
    // Translate for each enabled language
    for (const language of this.enabledLanguages) {
      if (language.code === translationConfig.defaultLanguage) {
        console.log(`⏭️  Skipping default language: ${language.code}`);
        continue;
      }
      
      console.log(`🌐 Translating to ${language.name} (${language.code})...`);
      await this.translateForLanguage(language.code, allPageKeys, extractedContent, dynamicContent);
    }
    
    console.log('✅ Translation process completed for all languages');
  }

  /**
   * Translate content for a specific language
   */
  async translateForLanguage(targetLanguage, pageKeys, extractedContent, dynamicContent) {
    const translations = {};
    
    for (const pageKey of pageKeys) {
      try {
        console.log(`📝 Translating page: ${pageKey}`);
        
        // Get content for this page
        const pageContent = this.getPageContent(pageKey, extractedContent, dynamicContent);
        if (!pageContent) {
          console.log(`⚠️  No content found for page: ${pageKey}`);
          continue;
        }
        
        // Check for manual override first
        const manualOverride = this.cache.getManualOverride(pageKey, targetLanguage);
        if (manualOverride) {
          translations[pageKey] = manualOverride;
          continue;
        }
        
        // Check cache for existing translation
        const cachedTranslation = this.cache.getCachedTranslation(
          pageContent, 
          translationConfig.defaultLanguage, 
          targetLanguage
        );
        
        if (cachedTranslation) {
          translations[pageKey] = cachedTranslation;
          continue;
        }
        
        // Translate content
        const translatedContent = await this.translatePageContent(
          pageContent, 
          translationConfig.defaultLanguage, 
          targetLanguage
        );
        
        if (translatedContent) {
          // Save to cache
          this.cache.saveCachedTranslation(
            pageContent,
            translationConfig.defaultLanguage,
            targetLanguage,
            translatedContent
          );
          
          translations[pageKey] = translatedContent;
        }
        
      } catch (error) {
        console.error(`❌ Error translating page ${pageKey}:`, error.message);
      }
    }
    
    // Save translations for this language
    await this.saveTranslationsForLanguage(targetLanguage, translations);
  }

  /**
   * Translate content for a single page
   */
  async translatePageContent(pageContent, sourceLanguage, targetLanguage) {
    const translationRequests = [];
    
    // Extract translatable text from page content
    const translatableTexts = this.extractTranslatableTexts(pageContent);
    
    for (const [key, textData] of Object.entries(translatableTexts)) {
      if (typeof textData === 'string' && textData.trim().length > 0) {
        translationRequests.push({
          text: textData,
          sourceLanguage,
          targetLanguage,
          context: 'medical website content'
        });
      } else if (textData && typeof textData === 'object' && textData.text) {
        translationRequests.push({
          text: textData.text,
          sourceLanguage,
          targetLanguage,
          context: 'medical website content'
        });
      }
    }
    
    if (translationRequests.length === 0) {
      console.log('⚠️  No translatable content found');
      return null;
    }
    
    try {
      // Translate in batches
      const batchSize = translationConfig.batchSize;
      const translations = {};
      
      for (let i = 0; i < translationRequests.length; i += batchSize) {
        const batch = translationRequests.slice(i, i + batchSize);
        console.log(`🔄 Translating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(translationRequests.length / batchSize)}`);
        
        const batchResults = await this.translator.translateBatch({
          items: batch,
          sourceLanguage,
          targetLanguage,
          batchSize: translationConfig.batchSize
        });
        
        // Map results back to original keys
        batch.forEach((request, index) => {
          const result = batchResults[index];
          if (result && result.translatedText) {
            const originalKey = Object.keys(translatableTexts)[i + index];
            translations[originalKey] = result.translatedText;
          }
        });
      }
      
      return {
        meta: this.translateMetaContent(pageContent, translations),
        content: translations,
        translatedAt: new Date().toISOString(),
        sourceLanguage,
        targetLanguage
      };
      
    } catch (error) {
      console.error(`❌ Translation error for ${sourceLanguage} -> ${targetLanguage}:`, error.message);
      return null;
    }
  }

  /**
   * Extract translatable texts from page content
   */
  extractTranslatableTexts(pageContent) {
    const texts = {};
    
    // Extract from frontmatter
    if (pageContent.frontmatter) {
      Object.entries(pageContent.frontmatter).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim().length > 0) {
          texts[`meta.${key}`] = value;
        }
      });
    }
    
    // Extract from extracted content
    if (pageContent.extractedContent) {
      if (pageContent.extractedContent.meta) {
        Object.entries(pageContent.extractedContent.meta).forEach(([key, value]) => {
          if (typeof value === 'string' && value.trim().length > 0) {
            texts[`meta.${key}`] = value;
          }
        });
      }
      
      if (pageContent.extractedContent.content) {
        Object.entries(pageContent.extractedContent.content).forEach(([key, value]) => {
          if (typeof value === 'string' && value.trim().length > 0) {
            texts[`content.${key}`] = value;
          } else if (value && typeof value === 'object' && value.text) {
            texts[`content.${key}`] = value.text;
          }
        });
      }
    }
    
    return texts;
  }

  /**
   * Translate meta content
   */
  translateMetaContent(pageContent, translations) {
    const meta = {};
    
    if (pageContent.frontmatter) {
      Object.keys(pageContent.frontmatter).forEach(key => {
        const translationKey = `meta.${key}`;
        if (translations[translationKey]) {
          meta[key] = translations[translationKey];
        }
      });
    }
    
    return meta;
  }

  /**
   * Get all page keys from extracted content
   */
  getAllPageKeys(extractedContent, dynamicContent) {
    const pageKeys = new Set();
    
    // Add static page keys
    Object.keys(extractedContent.staticPages || {}).forEach(key => pageKeys.add(key));
    
    // Add dynamic page keys
    Object.entries(dynamicContent || {}).forEach(([contentType, content]) => {
      if (contentType !== 'metadata') {
        Object.keys(content).forEach(slug => {
          pageKeys.add(`${contentType}/${slug}`);
        });
      }
    });
    
    return Array.from(pageKeys);
  }

  /**
   * Get content for a specific page
   */
  getPageContent(pageKey, extractedContent, dynamicContent) {
    // Check static pages first
    if (extractedContent.staticPages && extractedContent.staticPages[pageKey]) {
      return extractedContent.staticPages[pageKey];
    }
    
    // Check dynamic pages
    if (dynamicContent) {
      const [contentType, slug] = pageKey.split('/');
      if (dynamicContent[contentType] && dynamicContent[contentType][slug]) {
        return dynamicContent[contentType][slug];
      }
    }
    
    return null;
  }

  /**
   * Save translations for a specific language
   */
  async saveTranslationsForLanguage(language, translations) {
    const outputDir = path.join(__dirname, '../.cache/translations', language);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save individual page translations
    for (const [pageKey, translation] of Object.entries(translations)) {
      const filePath = path.join(outputDir, `${pageKey.replace(/\//g, '-')}.json`);
      
      try {
        fs.writeFileSync(filePath, JSON.stringify(translation, null, 2));
      } catch (error) {
        console.error(`❌ Error saving translation for ${pageKey}:`, error.message);
      }
    }
    
    // Save combined translations file
    const combinedPath = path.join(outputDir, 'all-translations.json');
    try {
      fs.writeFileSync(combinedPath, JSON.stringify(translations, null, 2));
      console.log(`💾 Saved ${Object.keys(translations).length} translations for ${language}`);
    } catch (error) {
      console.error(`❌ Error saving combined translations for ${language}:`, error.message);
    }
  }

  /**
   * Ensure content is extracted
   */
  async ensureContentExtracted() {
    if (this.contentExtractor.needsReExtraction()) {
      console.log('🔄 Re-extracting content...');
      return await this.contentExtractor.extractAllContent();
    } else {
      const cachedContent = this.contentExtractor.loadExtractedContent();
      if (cachedContent) {
        console.log('📂 Using cached extracted content');
        return cachedContent;
      } else {
        console.log('🔄 Extracting content...');
        return await this.contentExtractor.extractAllContent();
      }
    }
  }

  /**
   * Ensure dynamic content is extracted
   */
  async ensureDynamicContentExtracted() {
    if (this.dynamicExtractor.needsReExtraction()) {
      console.log('🔄 Re-extracting dynamic content...');
      return await this.dynamicExtractor.extractAllDynamicContent();
    } else {
      const cachedContent = this.dynamicExtractor.loadDynamicContent();
      if (cachedContent) {
        console.log('📂 Using cached dynamic content');
        return cachedContent;
      } else {
        console.log('🔄 Extracting dynamic content...');
        return await this.dynamicExtractor.extractAllDynamicContent();
      }
    }
  }

  /**
   * Clean up old cache files
   */
  async cleanupCache() {
    console.log('🧹 Cleaning up old cache files...');
    const cleanedCount = this.cache.cleanupExpiredCache();
    console.log(`✅ Cleaned up ${cleanedCount} expired cache files`);
  }
}

// CLI usage
if (require.main === module) {
  const orchestrator = new TranslationOrchestrator();
  
  orchestrator.translateAllContent()
    .then(() => {
      console.log('✅ Translation process completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Translation process failed:', error);
      process.exit(1);
    });
}

module.exports = TranslationOrchestrator;
