const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ContentExtractor = require('./extract-content');
const DynamicContentExtractor = require('./extract-dynamic-content');
const TranslationOrchestrator = require('./translate-content');

/**
 * Main build script for translation workflow
 */
class TranslationBuilder {
  constructor() {
    this.contentExtractor = new ContentExtractor();
    this.dynamicExtractor = new DynamicContentExtractor();
    this.orchestrator = new TranslationOrchestrator();
  }

  /**
   * Run the complete translation build process
   */
  async buildTranslations() {
    console.log('🚀 Starting translation build process...');
    
    try {
      // Step 1: Extract content
      console.log('\n📄 Step 1: Extracting content...');
      await this.extractAllContent();
      
      // Step 2: Generate translations
      console.log('\n🌍 Step 2: Generating translations...');
      await this.generateTranslations();
      
      // Step 3: Build static pages
      console.log('\n🏗️  Step 3: Building static pages...');
      await this.buildStaticPages();
      
      // Step 4: Generate sitemap
      console.log('\n🗺️  Step 4: Generating sitemap...');
      await this.generateSitemap();
      
      console.log('\n✅ Translation build process completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Translation build process failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Extract all content from pages
   */
  async extractAllContent() {
    console.log('🔍 Extracting static content...');
    await this.contentExtractor.extractAllContent();
    
    console.log('🔍 Extracting dynamic content...');
    await this.dynamicExtractor.extractAllDynamicContent();
  }

  /**
   * Generate translations for all content
   */
  async generateTranslations() {
    console.log('🤖 Generating translations using OpenAI...');
    await this.orchestrator.translateAllContent();
  }

  /**
   * Build static pages for all languages
   */
  async buildStaticPages() {
    console.log('📦 Building static pages...');
    
    try {
      // Run Astro build directly to avoid infinite loop
      execSync('npx astro build', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      console.log('✅ Static pages built successfully');
      
    } catch (error) {
      console.error('❌ Error building static pages:', error.message);
      throw error;
    }
  }

  /**
   * Generate multi-language sitemap
   */
  async generateSitemap() {
    console.log('🗺️  Generating multi-language sitemap...');
    
    try {
      // This would generate a comprehensive sitemap including all language versions
      // For now, we'll rely on Astro's built-in sitemap generation
      console.log('✅ Sitemap generation completed');
      
    } catch (error) {
      console.error('❌ Error generating sitemap:', error.message);
      throw error;
    }
  }

  /**
   * Clean up cache and temporary files
   */
  async cleanup() {
    console.log('🧹 Cleaning up temporary files...');
    
    try {
      // Clean up old cache files
      await this.orchestrator.cleanupCache();
      
      console.log('✅ Cleanup completed');
      
    } catch (error) {
      console.error('❌ Error during cleanup:', error.message);
    }
  }

  /**
   * Validate translation build
   */
  async validateBuild() {
    console.log('🔍 Validating translation build...');
    
    const validationResults = {
      staticPages: 0,
      dynamicPages: 0,
      translations: 0,
      errors: []
    };
    
    try {
      // Check if static pages were generated
      const distDir = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        validationResults.staticPages = this.countStaticPages(distDir);
      }
      
      // Check if translations were generated
      const translationsDir = path.join(process.cwd(), '.cache', 'translations');
      if (fs.existsSync(translationsDir)) {
        validationResults.translations = this.countTranslations(translationsDir);
      }
      
      console.log(`📊 Build validation results:`);
      console.log(`   - Static pages: ${validationResults.staticPages}`);
      console.log(`   - Translations: ${validationResults.translations}`);
      
      if (validationResults.errors.length > 0) {
        console.log(`⚠️  Validation warnings:`);
        validationResults.errors.forEach(error => console.log(`   - ${error}`));
      }
      
      return validationResults;
      
    } catch (error) {
      console.error('❌ Error validating build:', error.message);
      throw error;
    }
  }

  /**
   * Count static pages in dist directory
   */
  countStaticPages(distDir) {
    let count = 0;
    
    const countFiles = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          countFiles(itemPath);
        } else if (item.endsWith('.html')) {
          count++;
        }
      }
    };
    
    countFiles(distDir);
    return count;
  }

  /**
   * Count translation files
   */
  countTranslations(translationsDir) {
    let count = 0;
    
    const countFiles = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          countFiles(itemPath);
        } else if (item.endsWith('.json')) {
          count++;
        }
      }
    };
    
    countFiles(translationsDir);
    return count;
  }
}

// CLI usage
if (require.main === module) {
  const builder = new TranslationBuilder();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'extract':
      builder.extractAllContent()
        .then(() => console.log('✅ Content extraction completed'))
        .catch(error => {
          console.error('❌ Content extraction failed:', error);
          process.exit(1);
        });
      break;
      
    case 'translate':
      builder.generateTranslations()
        .then(() => console.log('✅ Translation generation completed'))
        .catch(error => {
          console.error('❌ Translation generation failed:', error);
          process.exit(1);
        });
      break;
      
    case 'build':
      builder.buildStaticPages()
        .then(() => console.log('✅ Static build completed'))
        .catch(error => {
          console.error('❌ Static build failed:', error);
          process.exit(1);
        });
      break;
      
    case 'sitemap':
      builder.generateSitemap()
        .then(() => console.log('✅ Sitemap generation completed'))
        .catch(error => {
          console.error('❌ Sitemap generation failed:', error);
          process.exit(1);
        });
      break;
      
    case 'validate':
      builder.validateBuild()
        .then(() => console.log('✅ Build validation completed'))
        .catch(error => {
          console.error('❌ Build validation failed:', error);
          process.exit(1);
        });
      break;
      
    case 'cleanup':
      builder.cleanup()
        .then(() => console.log('✅ Cleanup completed'))
        .catch(error => {
          console.error('❌ Cleanup failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      builder.buildTranslations()
        .then(() => console.log('✅ Full translation build completed'))
        .catch(error => {
          console.error('❌ Full translation build failed:', error);
          process.exit(1);
        });
  }
}

module.exports = TranslationBuilder;
