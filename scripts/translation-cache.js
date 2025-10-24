const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Translation cache system for managing translation storage and retrieval
 */
class TranslationCache {
  constructor() {
    this.cacheDir = path.join(__dirname, '../.cache/translations');
    this.overridesDir = path.join(__dirname, '../translations');
    
    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    
    // Ensure overrides directory exists
    if (!fs.existsSync(this.overridesDir)) {
      fs.mkdirSync(this.overridesDir, { recursive: true });
    }
  }

  /**
   * Generate cache key for content
   */
  generateCacheKey(content, sourceLanguage, targetLanguage) {
    const contentHash = crypto.createHash('md5').update(JSON.stringify(content)).digest('hex');
    return `${sourceLanguage}-${targetLanguage}-${contentHash}`;
  }

  /**
   * Get cached translation
   */
  getCachedTranslation(content, sourceLanguage, targetLanguage) {
    const cacheKey = this.generateCacheKey(content, sourceLanguage, targetLanguage);
    const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);
    
    if (fs.existsSync(cachePath)) {
      try {
        const cachedData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        
        // Check if cache is still valid (not expired)
        const cacheAge = Date.now() - cachedData.timestamp;
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (cacheAge < maxAge) {
          console.log(`📋 Using cached translation for ${sourceLanguage} -> ${targetLanguage}`);
          return cachedData.translation;
        } else {
          console.log(`⏰ Cache expired for ${sourceLanguage} -> ${targetLanguage}, removing`);
          fs.unlinkSync(cachePath);
        }
      } catch (error) {
        console.error(`❌ Error reading cache file ${cachePath}:`, error.message);
      }
    }
    
    return null;
  }

  /**
   * Save translation to cache
   */
  saveCachedTranslation(content, sourceLanguage, targetLanguage, translation) {
    const cacheKey = this.generateCacheKey(content, sourceLanguage, targetLanguage);
    const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);
    
    const cacheData = {
      sourceLanguage,
      targetLanguage,
      content,
      translation,
      timestamp: Date.now()
    };
    
    try {
      fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
      console.log(`💾 Cached translation for ${sourceLanguage} -> ${targetLanguage}`);
    } catch (error) {
      console.error(`❌ Error saving cache file ${cachePath}:`, error.message);
    }
  }

  /**
   * Get manual override for a specific page and language
   */
  getManualOverride(pageKey, language) {
    const overridePath = this.getOverridePath(pageKey, language);
    
    if (fs.existsSync(overridePath)) {
      try {
        const overrideData = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
        console.log(`📝 Using manual override for ${pageKey} in ${language}`);
        return overrideData;
      } catch (error) {
        console.error(`❌ Error reading override file ${overridePath}:`, error.message);
      }
    }
    
    return null;
  }

  /**
   * Save manual override
   */
  saveManualOverride(pageKey, language, overrideData) {
    const overridePath = this.getOverridePath(pageKey, language);
    const overrideDir = path.dirname(overridePath);
    
    // Ensure override directory exists
    if (!fs.existsSync(overrideDir)) {
      fs.mkdirSync(overrideDir, { recursive: true });
    }
    
    try {
      fs.writeFileSync(overridePath, JSON.stringify(overrideData, null, 2));
      console.log(`💾 Saved manual override for ${pageKey} in ${language}`);
    } catch (error) {
      console.error(`❌ Error saving override file ${overridePath}:`, error.message);
    }
  }

  /**
   * Get override file path for a page and language
   */
  getOverridePath(pageKey, language) {
    // Convert page key to file path
    let filePath = pageKey;
    
    // Handle index pages
    if (filePath === 'index' || filePath === '') {
      filePath = 'index';
    }
    
    // Handle dynamic pages
    if (filePath.includes('/')) {
      filePath = filePath.replace('/', '/');
    }
    
    return path.join(this.overridesDir, language, `${filePath}.json`);
  }

  /**
   * Check if manual override exists
   */
  hasManualOverride(pageKey, language) {
    const overridePath = this.getOverridePath(pageKey, language);
    return fs.existsSync(overridePath);
  }

  /**
   * Get all available overrides for a language
   */
  getAvailableOverrides(language) {
    const languageDir = path.join(this.overridesDir, language);
    const overrides = [];
    
    if (fs.existsSync(languageDir)) {
      this.scanDirectoryForOverrides(languageDir, overrides, '');
    }
    
    return overrides;
  }

  /**
   * Recursively scan directory for override files
   */
  scanDirectoryForOverrides(dir, overrides, relativePath) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.scanDirectoryForOverrides(itemPath, overrides, path.join(relativePath, item));
      } else if (item.endsWith('.json')) {
        const pageKey = path.join(relativePath, item.replace('.json', ''));
        overrides.push({
          pageKey,
          filePath: itemPath,
          lastModified: stat.mtime
        });
      }
    }
  }

  /**
   * Clear cache for a specific language
   */
  clearCacheForLanguage(language) {
    const languageCacheDir = path.join(this.cacheDir, language);
    
    if (fs.existsSync(languageCacheDir)) {
      try {
        fs.rmSync(languageCacheDir, { recursive: true, force: true });
        console.log(`🗑️  Cleared cache for language: ${language}`);
      } catch (error) {
        console.error(`❌ Error clearing cache for ${language}:`, error.message);
      }
    }
  }

  /**
   * Clear all cache
   */
  clearAllCache() {
    try {
      fs.rmSync(this.cacheDir, { recursive: true, force: true });
      fs.mkdirSync(this.cacheDir, { recursive: true });
      console.log(`🗑️  Cleared all translation cache`);
    } catch (error) {
      console.error(`❌ Error clearing all cache:`, error.message);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      languages: {},
      oldestFile: null,
      newestFile: null
    };
    
    if (fs.existsSync(this.cacheDir)) {
      this.scanCacheDirectory(this.cacheDir, stats);
    }
    
    return stats;
  }

  /**
   * Scan cache directory for statistics
   */
  scanCacheDirectory(dir, stats) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.scanCacheDirectory(itemPath, stats);
      } else if (item.endsWith('.json')) {
        stats.totalFiles++;
        stats.totalSize += stat.size;
        
        if (!stats.oldestFile || stat.mtime < stats.oldestFile.mtime) {
          stats.oldestFile = { file: itemPath, mtime: stat.mtime };
        }
        
        if (!stats.newestFile || stat.mtime > stats.newestFile.mtime) {
          stats.newestFile = { file: itemPath, mtime: stat.mtime };
        }
      }
    }
  }

  /**
   * Clean up expired cache files
   */
  cleanupExpiredCache(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const cutoffTime = Date.now() - maxAge;
    let cleanedCount = 0;
    
    if (fs.existsSync(this.cacheDir)) {
      this.cleanupDirectory(this.cacheDir, cutoffTime, cleanedCount);
    }
    
    console.log(`🧹 Cleaned up ${cleanedCount} expired cache files`);
    return cleanedCount;
  }

  /**
   * Recursively clean up directory
   */
  cleanupDirectory(dir, cutoffTime, cleanedCount) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.cleanupDirectory(itemPath, cutoffTime, cleanedCount);
      } else if (item.endsWith('.json') && stat.mtime < cutoffTime) {
        try {
          fs.unlinkSync(itemPath);
          cleanedCount++;
        } catch (error) {
          console.error(`❌ Error removing expired cache file ${itemPath}:`, error.message);
        }
      }
    }
  }
}

module.exports = TranslationCache;
