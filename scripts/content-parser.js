const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

/**
 * Content parser utility for extracting translatable content from Astro files
 */
class ContentParser {
  constructor() {
    this.translatableSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'div', 'li', 'td', 'th',
      'a', 'button', 'label', 'title', 'meta'
    ];
    
    this.skipSelectors = [
      'script', 'style', 'code', 'pre',
      '.no-translate', '[data-no-translate]',
      '.skeleton', '.loading'
    ];
    
    this.preserveAttributes = [
      'href', 'src', 'alt', 'title', 'data-*',
      'class', 'id', 'aria-*', 'role'
    ];
  }

  /**
   * Extract content from an Astro file
   */
  parseAstroFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = this.extractFrontmatter(content);
    const htmlContent = this.extractHTMLContent(content);
    
    return {
      filePath,
      frontmatter,
      htmlContent,
      extractedContent: this.extractTranslatableContent(htmlContent)
    };
  }

  /**
   * Extract frontmatter from Astro file
   */
  extractFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return {};

    const frontmatterText = frontmatterMatch[1];
    const frontmatter = {};

    // Parse simple key-value pairs
    const lines = frontmatterText.split('\n');
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        frontmatter[key] = value.replace(/^['"]|['"]$/g, ''); // Remove quotes
      }
    }

    return frontmatter;
  }

  /**
   * Extract HTML content from Astro file (everything after frontmatter)
   */
  extractHTMLContent(content) {
    // Find the end of frontmatter
    const firstDashIndex = content.indexOf('---');
    if (firstDashIndex === -1) return content;
    
    const secondDashIndex = content.indexOf('---', firstDashIndex + 3);
    if (secondDashIndex === -1) return content;
    
    // Get content after frontmatter
    const htmlContent = content.substring(secondDashIndex + 3).trim();
    
    // Remove Astro component script sections (between <script> tags)
    return htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  /**
   * Extract translatable content from HTML
   */
  extractTranslatableContent(htmlContent) {
    // Simple text extraction without HTML parsing for better results
    const extractedContent = {
      meta: {},
      content: {},
      structure: {}
    };

    // Extract text content using regex patterns
    this.extractTextContent(htmlContent, extractedContent.content);

    return extractedContent;
  }

  /**
   * Extract text content from HTML using regex
   */
  extractTextContent(htmlContent, contentObj) {
    let contentIndex = 0;

    // Extract headings
    const headingMatches = htmlContent.matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gis);
    for (const match of headingMatches) {
      const text = this.stripHTMLTags(match[2]).trim();
      if (this.isTranslatableText(text)) {
        contentObj[`heading-${contentIndex++}`] = text;
      }
    }

    // Extract paragraphs
    const paragraphMatches = htmlContent.matchAll(/<p[^>]*>(.*?)<\/p>/gis);
    for (const match of paragraphMatches) {
      const text = this.stripHTMLTags(match[1]).trim();
      if (this.isTranslatableText(text)) {
        contentObj[`paragraph-${contentIndex++}`] = text;
      }
    }

    // Extract spans and divs with text
    const spanMatches = htmlContent.matchAll(/<span[^>]*>(.*?)<\/span>/gis);
    for (const match of spanMatches) {
      const text = this.stripHTMLTags(match[1]).trim();
      if (this.isTranslatableText(text) && text.length > 10) {
        contentObj[`text-${contentIndex++}`] = text;
      }
    }

    // Extract list items
    const liMatches = htmlContent.matchAll(/<li[^>]*>(.*?)<\/li>/gis);
    for (const match of liMatches) {
      const text = this.stripHTMLTags(match[1]).trim();
      if (this.isTranslatableText(text)) {
        contentObj[`list-item-${contentIndex++}`] = text;
      }
    }

    // Extract button and link text
    const buttonMatches = htmlContent.matchAll(/<(?:button|a)[^>]*>(.*?)<\/(?:button|a)>/gis);
    for (const match of buttonMatches) {
      const text = this.stripHTMLTags(match[1]).trim();
      if (this.isTranslatableText(text) && !text.startsWith('http') && !text.includes('icon-')) {
        contentObj[`button-${contentIndex++}`] = text;
      }
    }
  }

  /**
   * Strip HTML tags from text
   */
  stripHTMLTags(html) {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract meta tags and title information
   */
  extractMetaContent(root, metaObj) {
    const title = root.querySelector('title');
    if (title) {
      metaObj.title = title.text;
    }

    const metaTags = root.querySelectorAll('meta');
    metaTags.forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const content = meta.getAttribute('content');
      if (name && content) {
        metaObj[name] = content;
      }
    });
  }

  /**
   * Extract main content from HTML elements
   */
  extractMainContent(root, contentObj) {
    let contentIndex = 0;

    const extractFromElement = (element, parentKey = '') => {
      if (!element || this.shouldSkipElement(element)) return;

      const tagName = element.tagName?.toLowerCase();
      const text = element.text?.trim();
      
      if (text && text.length > 0 && this.isTranslatableText(text)) {
        const key = parentKey || `content-${contentIndex++}`;
        contentObj[key] = {
          text: text,
          tag: tagName,
          attributes: this.extractRelevantAttributes(element),
          selector: this.getElementSelector(element)
        };
      }

      // Recursively process children
      if (element.childNodes) {
        element.childNodes.forEach(child => {
          if (child.tagName) {
            const childKey = `${parentKey}-${child.tagName}-${contentIndex}`;
            extractFromElement(child, childKey);
          }
        });
      }
    };

    // Start extraction from body or root
    const body = root.querySelector('body') || root;
    extractFromElement(body);
  }

  /**
   * Extract structure information for maintaining layout
   */
  extractStructureInfo(root, structureObj) {
    const sections = root.querySelectorAll('section, article, div[class*="section"]');
    
    sections.forEach((section, index) => {
      const sectionKey = `section-${index}`;
      structureObj[sectionKey] = {
        tag: section.tagName,
        classes: section.getAttribute('class') || '',
        id: section.getAttribute('id') || '',
        children: section.childNodes.length
      };
    });
  }

  /**
   * Check if element should be skipped
   */
  shouldSkipElement(element) {
    if (!element.tagName) return true;

    const tagName = element.tagName.toLowerCase();
    const className = element.getAttribute('class') || '';
    const dataNoTranslate = element.getAttribute('data-no-translate');

    // Skip script, style, and other non-content elements
    if (this.skipSelectors.includes(tagName)) return true;
    
    // Skip elements with no-translate class or attribute
    if (className.includes('no-translate') || dataNoTranslate !== null) return true;
    
    // Skip skeleton/loading elements
    if (className.includes('skeleton') || className.includes('loading')) return true;

    return false;
  }

  /**
   * Check if text is translatable
   */
  isTranslatableText(text) {
    // Skip empty or whitespace-only text
    if (!text || text.trim().length === 0) return false;
    
    // Skip text that's mostly numbers, symbols, or URLs
    if (/^[\d\s\-_\.\/\:\+\(\)]+$/.test(text)) return false;
    
    // Skip URLs and email addresses
    if (text.includes('http') || text.includes('@') || text.includes('www.')) return false;
    
    // Skip very short text (likely navigation or UI elements)
    if (text.trim().length < 5) return false;
    
    // Skip text that looks like code or technical content
    if (/^[A-Z_]+$/.test(text) && text.length > 5) return false;
    
    // Skip icon classes and CSS classes
    if (text.includes('icon-') || text.includes('fa-') || text.includes('class=')) return false;
    
    // Must contain at least one letter
    if (!/[a-zA-Z]/.test(text)) return false;
    
    return true;
  }

  /**
   * Extract relevant attributes that should be preserved
   */
  extractRelevantAttributes(element) {
    const attributes = {};
    const attrs = element.attributes;
    
    if (attrs) {
      Object.keys(attrs).forEach(attrName => {
        if (this.preserveAttributes.some(pattern => 
          pattern.includes('*') ? attrName.startsWith(pattern.replace('*', '')) : attrName === pattern
        )) {
          attributes[attrName] = attrs[attrName];
        }
      });
    }
    
    return attributes;
  }

  /**
   * Generate CSS selector for element
   */
  getElementSelector(element) {
    if (!element.tagName) return '';
    
    let selector = element.tagName.toLowerCase();
    
    if (element.id) {
      selector += `#${element.id}`;
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.length > 0);
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }
    
    return selector;
  }

  /**
   * Parse dynamic content from blog/media pages
   */
  parseDynamicContent(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const staticPathsMatch = content.match(/export function getStaticPaths\(\)\s*{([\s\S]*?)}/);
    
    if (!staticPathsMatch) return null;

    const staticPathsContent = staticPathsMatch[1];
    const slugs = this.extractSlugsFromStaticPaths(staticPathsContent);
    
    // Extract content objects
    const contentObjectsMatch = content.match(/const\s+\w+Articles?\s*=\s*{([\s\S]*?)};/);
    if (!contentObjectsMatch) return null;

    const contentObjects = this.parseContentObjects(contentObjectsMatch[1]);
    
    return {
      filePath,
      slugs,
      contentObjects,
      extractedContent: this.extractDynamicContent(contentObjects)
    };
  }

  /**
   * Extract slugs from getStaticPaths function
   */
  extractSlugsFromStaticPaths(staticPathsContent) {
    const slugMatches = staticPathsContent.match(/slug:\s*['"`]([^'"`]+)['"`]/g);
    if (!slugMatches) return [];
    
    return slugMatches.map(match => {
      const slug = match.match(/slug:\s*['"`]([^'"`]+)['"`]/);
      return slug ? slug[1] : null;
    }).filter(Boolean);
  }

  /**
   * Parse content objects from JavaScript
   */
  parseContentObjects(contentObjectsText) {
    const objects = {};
    const objectMatches = contentObjectsText.match(/'([^']+)':\s*{([\s\S]*?)}/g);
    
    if (objectMatches) {
      objectMatches.forEach(match => {
        const keyMatch = match.match(/'([^']+)':\s*{/);
        if (keyMatch) {
          const key = keyMatch[1];
          const objectContent = match.match(/{([\s\S]*?)}/);
          if (objectContent) {
            objects[key] = this.parseObjectContent(objectContent[1]);
          }
        }
      });
    }
    
    return objects;
  }

  /**
   * Parse individual object content
   */
  parseObjectContent(objectText) {
    const obj = {};
    const lines = objectText.split('\n');
    
    for (const line of lines) {
      const match = line.match(/(\w+):\s*(.+),?$/);
      if (match) {
        const [, key, value] = match;
        // Remove quotes and trim
        obj[key] = value.replace(/^['"`]|['"`],?$/g, '').trim();
      }
    }
    
    return obj;
  }

  /**
   * Extract content from dynamic content objects
   */
  extractDynamicContent(contentObjects) {
    const extractedContent = {};
    
    Object.keys(contentObjects).forEach(slug => {
      const content = contentObjects[slug];
      extractedContent[slug] = {
        meta: {
          title: content.title || '',
          excerpt: content.excerpt || '',
          category: content.category || '',
          author: content.author || '',
          date: content.date || ''
        },
        content: {
          'main-content': content.content || ''
        }
      };
    });
    
    return extractedContent;
  }
}

module.exports = ContentParser;
