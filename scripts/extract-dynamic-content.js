const fs = require('fs');
const path = require('path');
const ContentParser = require('./content-parser');

/**
 * Specialized extractor for dynamic content (blog posts, media articles)
 */
class DynamicContentExtractor {
  constructor() {
    this.parser = new ContentParser();
    this.srcDir = path.join(__dirname, '../src');
    this.pagesDir = path.join(this.srcDir, 'pages');
    this.outputDir = path.join(__dirname, '../.cache/dynamic-content');
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Extract all dynamic content from blog and media pages
   */
  async extractAllDynamicContent() {
    console.log('🔍 Extracting dynamic content from blog and media pages...');
    
    const extractedContent = {
      blog: {},
      media: {},
      metadata: {
        extractedAt: new Date().toISOString(),
        totalBlogPosts: 0,
        totalMediaArticles: 0
      }
    };

    // Extract blog content
    await this.extractBlogContent(extractedContent);
    
    // Extract media content
    await this.extractMediaContent(extractedContent);
    
    // Save extracted content
    await this.saveDynamicContent(extractedContent);
    
    console.log(`✅ Extracted ${extractedContent.metadata.totalBlogPosts} blog posts and ${extractedContent.metadata.totalMediaArticles} media articles`);
    
    return extractedContent;
  }

  /**
   * Extract blog content
   */
  async extractBlogContent(extractedContent) {
    const blogPagePath = path.join(this.pagesDir, 'blog', '[slug].astro');
    
    if (!fs.existsSync(blogPagePath)) {
      console.log('⚠️  Blog page not found, skipping blog content extraction');
      return;
    }

    try {
      console.log('📝 Extracting blog content...');
      
      const parsedContent = this.parser.parseDynamicContent(blogPagePath);
      if (parsedContent && parsedContent.slugs) {
        
        for (const slug of parsedContent.slugs) {
          const postContent = parsedContent.contentObjects[slug];
          if (postContent) {
            extractedContent.blog[slug] = {
              slug,
              title: postContent.title || '',
              excerpt: postContent.excerpt || '',
              category: postContent.category || '',
              author: postContent.author || '',
              date: postContent.date || '',
              readTime: postContent.readTime || '',
              image: postContent.image || '',
              content: postContent.content || '',
              extractedContent: this.extractTranslatableFromPost(postContent),
              lastModified: fs.statSync(blogPagePath).mtime
            };
            
            extractedContent.metadata.totalBlogPosts++;
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Error extracting blog content:', error.message);
    }
  }

  /**
   * Extract media content
   */
  async extractMediaContent(extractedContent) {
    const mediaPagePath = path.join(this.pagesDir, 'media', '[slug].astro');
    
    if (!fs.existsSync(mediaPagePath)) {
      console.log('⚠️  Media page not found, skipping media content extraction');
      return;
    }

    try {
      console.log('📰 Extracting media content...');
      
      const parsedContent = this.parser.parseDynamicContent(mediaPagePath);
      if (parsedContent && parsedContent.slugs) {
        
        for (const slug of parsedContent.slugs) {
          const articleContent = parsedContent.contentObjects[slug];
          if (articleContent) {
            extractedContent.media[slug] = {
              slug,
              title: articleContent.title || '',
              excerpt: articleContent.excerpt || '',
              category: articleContent.category || '',
              author: articleContent.author || '',
              date: articleContent.date || '',
              image: articleContent.image || '',
              content: articleContent.content || '',
              extractedContent: this.extractTranslatableFromArticle(articleContent),
              lastModified: fs.statSync(mediaPagePath).mtime
            };
            
            extractedContent.metadata.totalMediaArticles++;
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Error extracting media content:', error.message);
    }
  }

  /**
   * Extract translatable content from blog post
   */
  extractTranslatableFromPost(postContent) {
    const extractedContent = {
      meta: {
        title: postContent.title || '',
        excerpt: postContent.excerpt || '',
        category: postContent.category || '',
        author: postContent.author || ''
      },
      content: {}
    };

    // Extract content from HTML content field
    if (postContent.content) {
      const htmlContent = this.parser.extractHTMLContent(postContent.content);
      const parsedContent = this.parser.extractTranslatableContent(htmlContent);
      
      // Merge extracted content
      Object.assign(extractedContent.content, parsedContent.content);
    }

    return extractedContent;
  }

  /**
   * Extract translatable content from media article
   */
  extractTranslatableFromArticle(articleContent) {
    const extractedContent = {
      meta: {
        title: articleContent.title || '',
        excerpt: articleContent.excerpt || '',
        category: articleContent.category || '',
        author: articleContent.author || ''
      },
      content: {}
    };

    // Extract content from HTML content field
    if (articleContent.content) {
      const htmlContent = this.parser.extractHTMLContent(articleContent.content);
      const parsedContent = this.parser.extractTranslatableContent(htmlContent);
      
      // Merge extracted content
      Object.assign(extractedContent.content, parsedContent.content);
    }

    return extractedContent;
  }

  /**
   * Save dynamic content to cache
   */
  async saveDynamicContent(extractedContent) {
    const outputPath = path.join(this.outputDir, 'dynamic-content.json');
    
    try {
      fs.writeFileSync(outputPath, JSON.stringify(extractedContent, null, 2));
      console.log(`💾 Saved dynamic content to: ${outputPath}`);
    } catch (error) {
      console.error('❌ Error saving dynamic content:', error.message);
    }
  }

  /**
   * Load previously extracted dynamic content
   */
  loadDynamicContent() {
    const outputPath = path.join(this.outputDir, 'dynamic-content.json');
    
    if (fs.existsSync(outputPath)) {
      try {
        const content = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        console.log(`📂 Loaded cached dynamic content from: ${outputPath}`);
        return content;
      } catch (error) {
        console.error('❌ Error loading cached dynamic content:', error.message);
      }
    }
    
    return null;
  }

  /**
   * Get all blog slugs
   */
  getAllBlogSlugs(extractedContent) {
    return Object.keys(extractedContent.blog || {});
  }

  /**
   * Get all media slugs
   */
  getAllMediaSlugs(extractedContent) {
    return Object.keys(extractedContent.media || {});
  }

  /**
   * Get content for a specific blog post
   */
  getBlogPost(slug, extractedContent) {
    return extractedContent.blog?.[slug] || null;
  }

  /**
   * Get content for a specific media article
   */
  getMediaArticle(slug, extractedContent) {
    return extractedContent.media?.[slug] || null;
  }

  /**
   * Check if dynamic content needs to be re-extracted
   */
  needsReExtraction() {
    const outputPath = path.join(this.outputDir, 'dynamic-content.json');
    
    if (!fs.existsSync(outputPath)) {
      return true;
    }
    
    const cacheStat = fs.statSync(outputPath);
    const cacheTime = cacheStat.mtime;
    
    // Check if source files are newer than cache
    const sourceFiles = [
      path.join(this.pagesDir, 'blog', '[slug].astro'),
      path.join(this.pagesDir, 'media', '[slug].astro')
    ];
    
    for (const filePath of sourceFiles) {
      if (fs.existsSync(filePath)) {
        const fileStat = fs.statSync(filePath);
        if (fileStat.mtime > cacheTime) {
          console.log(`🔄 Source file ${filePath} is newer than cache, re-extraction needed`);
          return true;
        }
      }
    }
    
    return false;
  }
}

// CLI usage
if (require.main === module) {
  const extractor = new DynamicContentExtractor();
  
  extractor.extractAllDynamicContent()
    .then(() => {
      console.log('✅ Dynamic content extraction completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Dynamic content extraction failed:', error);
      process.exit(1);
    });
}

module.exports = DynamicContentExtractor;
