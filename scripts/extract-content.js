const fs = require('fs');
const path = require('path');
const ContentParser = require('./content-parser');

/**
 * Content extraction system for SALi website translation
 */
class ContentExtractor {
  constructor() {
    this.parser = new ContentParser();
    this.srcDir = path.join(__dirname, '../src');
    this.pagesDir = path.join(this.srcDir, 'pages');
    this.outputDir = path.join(__dirname, '../.cache/extracted-content');
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Extract content from all Astro pages
   */
  async extractAllContent() {
    console.log('🔍 Extracting content from all pages...');
    
    const extractedContent = {
      staticPages: {},
      dynamicPages: {},
      metadata: {
        extractedAt: new Date().toISOString(),
        totalPages: 0,
        totalDynamicSlugs: 0
      }
    };

    // Extract static pages
    await this.extractStaticPages(extractedContent);
    
    // Extract dynamic pages (blog, media)
    await this.extractDynamicPages(extractedContent);
    
    // Save extracted content
    await this.saveExtractedContent(extractedContent);
    
    console.log(`✅ Extracted content from ${extractedContent.metadata.totalPages} pages and ${extractedContent.metadata.totalDynamicSlugs} dynamic slugs`);
    
    return extractedContent;
  }

  /**
   * Extract content from static pages
   */
  async extractStaticPages(extractedContent) {
    const pages = this.findAstroFiles(this.pagesDir);
    
    for (const pagePath of pages) {
      try {
        const relativePath = path.relative(this.srcDir, pagePath);
        const pageKey = this.getPageKey(relativePath);
        
        console.log(`📄 Extracting: ${relativePath}`);
        
        const parsedContent = this.parser.parseAstroFile(pagePath);
        extractedContent.staticPages[pageKey] = {
          filePath: relativePath,
          frontmatter: parsedContent.frontmatter,
          extractedContent: parsedContent.extractedContent,
          lastModified: fs.statSync(pagePath).mtime
        };
        
        extractedContent.metadata.totalPages++;
        
      } catch (error) {
        console.error(`❌ Error extracting ${pagePath}:`, error.message);
      }
    }
  }

  /**
   * Extract content from dynamic pages (blog, media)
   */
  async extractDynamicPages(extractedContent) {
    const dynamicPageTypes = ['blog', 'media'];
    
    for (const pageType of dynamicPageTypes) {
      const dynamicPagePath = path.join(this.pagesDir, pageType, '[slug].astro');
      
      if (fs.existsSync(dynamicPagePath)) {
        try {
          console.log(`📄 Extracting dynamic content: ${pageType}/[slug].astro`);
          
          const parsedContent = this.parser.parseDynamicContent(dynamicPagePath);
          if (parsedContent) {
            extractedContent.dynamicPages[pageType] = {
              filePath: `pages/${pageType}/[slug].astro`,
              slugs: parsedContent.slugs,
              contentObjects: parsedContent.contentObjects,
              extractedContent: parsedContent.extractedContent,
              lastModified: fs.statSync(dynamicPagePath).mtime
            };
            
            extractedContent.metadata.totalDynamicSlugs += parsedContent.slugs.length;
          }
          
        } catch (error) {
          console.error(`❌ Error extracting dynamic content from ${pageType}:`, error.message);
        }
      }
    }
  }

  /**
   * Find all Astro files in a directory
   */
  findAstroFiles(dir) {
    const files = [];
    
    const scanDirectory = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (!['node_modules', '.git', 'dist', '.cache'].includes(item)) {
            scanDirectory(itemPath);
          }
        } else if (item.endsWith('.astro') && !item.startsWith('[')) {
          // Skip dynamic route files (they start with [)
          files.push(itemPath);
        }
      }
    };
    
    scanDirectory(dir);
    return files;
  }

  /**
   * Generate a page key from file path
   */
  getPageKey(filePath) {
    // Remove 'pages/' prefix and '.astro' suffix
    let key = filePath.replace(/^pages\//, '').replace(/\.astro$/, '');
    
    // Convert to URL path format
    key = key.replace(/\\/g, '/');
    
    // Handle index pages
    if (key.endsWith('/index')) {
      key = key.replace('/index', '');
    }
    
    return key || 'index';
  }

  /**
   * Save extracted content to cache
   */
  async saveExtractedContent(extractedContent) {
    const outputPath = path.join(this.outputDir, 'extracted-content.json');
    
    try {
      fs.writeFileSync(outputPath, JSON.stringify(extractedContent, null, 2));
      console.log(`💾 Saved extracted content to: ${outputPath}`);
    } catch (error) {
      console.error('❌ Error saving extracted content:', error.message);
    }
  }

  /**
   * Load previously extracted content
   */
  loadExtractedContent() {
    const outputPath = path.join(this.outputDir, 'extracted-content.json');
    
    if (fs.existsSync(outputPath)) {
      try {
        const content = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        console.log(`📂 Loaded cached content from: ${outputPath}`);
        return content;
      } catch (error) {
        console.error('❌ Error loading cached content:', error.message);
      }
    }
    
    return null;
  }

  /**
   * Check if content needs to be re-extracted
   */
  needsReExtraction() {
    const outputPath = path.join(this.outputDir, 'extracted-content.json');
    
    if (!fs.existsSync(outputPath)) {
      return true;
    }
    
    const cacheStat = fs.statSync(outputPath);
    const cacheTime = cacheStat.mtime;
    
    // Check if any source files are newer than cache
    const sourceFiles = this.findAstroFiles(this.pagesDir);
    
    for (const filePath of sourceFiles) {
      const fileStat = fs.statSync(filePath);
      if (fileStat.mtime > cacheTime) {
        console.log(`🔄 Source file ${filePath} is newer than cache, re-extraction needed`);
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get content for a specific page
   */
  getPageContent(pageKey, extractedContent) {
    // Check static pages first
    if (extractedContent.staticPages[pageKey]) {
      return extractedContent.staticPages[pageKey];
    }
    
    // Check dynamic pages
    for (const [pageType, dynamicContent] of Object.entries(extractedContent.dynamicPages)) {
      if (pageKey.startsWith(pageType)) {
        return dynamicContent;
      }
    }
    
    return null;
  }

  /**
   * Get all available page keys
   */
  getAllPageKeys(extractedContent) {
    const keys = new Set();
    
    // Add static page keys
    Object.keys(extractedContent.staticPages).forEach(key => keys.add(key));
    
    // Add dynamic page keys
    Object.entries(extractedContent.dynamicPages).forEach(([pageType, content]) => {
      content.slugs.forEach(slug => {
        keys.add(`${pageType}/${slug}`);
      });
    });
    
    return Array.from(keys);
  }
}

// CLI usage
if (require.main === module) {
  const extractor = new ContentExtractor();
  
  extractor.extractAllContent()
    .then(() => {
      console.log('✅ Content extraction completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Content extraction failed:', error);
      process.exit(1);
    });
}

module.exports = ContentExtractor;
