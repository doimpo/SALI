const fs = require('fs');
const path = require('path');

// Load i18n config
const translationConfig = {
  defaultLanguage: 'en',
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
 * Multi-language sitemap generator for SALi website
 */
class SitemapGenerator {
  constructor() {
    this.baseUrl = 'https://southasianliverinstitute.netlify.app';
    this.enabledLanguages = getEnabledLanguages();
    this.outputDir = path.join(process.cwd(), 'dist');
  }

  /**
   * Generate comprehensive multi-language sitemap
   */
  async generateSitemap() {
    console.log('🗺️  Generating multi-language sitemap...');
    
    try {
      // Generate main sitemap
      await this.generateMainSitemap();
      
      // Generate language-specific sitemaps
      for (const language of this.enabledLanguages) {
        if (language.code !== translationConfig.defaultLanguage) {
          await this.generateLanguageSitemap(language.code);
        }
      }
      
      // Generate sitemap index
      await this.generateSitemapIndex();
      
      console.log('✅ Multi-language sitemap generated successfully');
      
    } catch (error) {
      console.error('❌ Error generating sitemap:', error.message);
      throw error;
    }
  }

  /**
   * Generate main sitemap (default language)
   */
  async generateMainSitemap() {
    const urls = this.getAllUrls(translationConfig.defaultLanguage);
    const sitemap = this.buildSitemapXml(urls, translationConfig.defaultLanguage);
    
    const outputPath = path.join(this.outputDir, 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemap);
    
    console.log(`📄 Generated main sitemap with ${urls.length} URLs`);
  }

  /**
   * Generate language-specific sitemap
   */
  async generateLanguageSitemap(language) {
    const urls = this.getAllUrls(language);
    const sitemap = this.buildSitemapXml(urls, language);
    
    const outputPath = path.join(this.outputDir, `sitemap-${language}.xml`);
    fs.writeFileSync(outputPath, sitemap);
    
    console.log(`📄 Generated ${language} sitemap with ${urls.length} URLs`);
  }

  /**
   * Generate sitemap index
   */
  async generateSitemapIndex() {
    const sitemaps = [];
    
    // Add main sitemap
    sitemaps.push({
      loc: `${this.baseUrl}/sitemap.xml`,
      lastmod: new Date().toISOString()
    });
    
    // Add language-specific sitemaps
    for (const language of this.enabledLanguages) {
      if (language.code !== translationConfig.defaultLanguage) {
        sitemaps.push({
          loc: `${this.baseUrl}/sitemap-${language.code}.xml`,
          lastmod: new Date().toISOString()
        });
      }
    }
    
    const sitemapIndex = this.buildSitemapIndexXml(sitemaps);
    const outputPath = path.join(this.outputDir, 'sitemap-index.xml');
    fs.writeFileSync(outputPath, sitemapIndex);
    
    console.log(`📄 Generated sitemap index with ${sitemaps.length} sitemaps`);
  }

  /**
   * Get all URLs for a specific language
   */
  getAllUrls(language) {
    const urls = [];
    
    // Static pages
    const staticPages = this.getStaticPages();
    for (const page of staticPages) {
      const url = this.getLocalizedUrl(page, language);
      urls.push({
        loc: url,
        lastmod: new Date().toISOString(),
        changefreq: this.getChangeFreq(page),
        priority: this.getPriority(page),
        hreflang: this.getHreflangLinks(page)
      });
    }
    
    // Dynamic pages (blog, media)
    const dynamicPages = this.getDynamicPages();
    for (const page of dynamicPages) {
      const url = this.getLocalizedUrl(page, language);
      urls.push({
        loc: url,
        lastmod: new Date().toISOString(),
        changefreq: this.getChangeFreq(page),
        priority: this.getPriority(page),
        hreflang: this.getHreflangLinks(page)
      });
    }
    
    return urls;
  }

  /**
   * Get static pages list
   */
  getStaticPages() {
    return [
      '',
      'about/about-us',
      'about/founder',
      'services',
      'services/liver-transplantation',
      'services/liver-cirrhosis',
      'services/fatty-liver',
      'services/liver-cancer',
      'services/gallbladder-cancer',
      'services/pancreas-cancer',
      'services/laparoscopic-surgery',
      'services/endoscopy',
      'services/interventional-treatments',
      'services/ICU-facility',
      'programmes/licap',
      'programmes/ascites-club',
      'programmes/liver-line',
      'locations/hyderabad',
      'locations/mumbai',
      'locations/kolkata',
      'locations/nagpur',
      'locations/visakhapatnam',
      'locations/rajkot',
      'locations/vijayawada-guntur',
      'locations/kakinada',
      'locations/rajahmundry',
      'locations/anantapur',
      'locations/khammam',
      'locations/kurnool',
      'locations/jabalpur',
      'media',
      'media/videos',
      'blog',
      'resources/risk-calculator',
      'resources/guide',
      'resources/videos',
      'gallery',
      'faqs',
      'appointment',
      'contact',
      'calendar',
      'medical-disclaimer',
      'privacy-policy',
      'terms-of-service'
    ];
  }

  /**
   * Get dynamic pages list
   */
  getDynamicPages() {
    return [
      'blog/understanding-fatty-liver-disease',
      'blog/life-after-liver-transplant',
      'blog/managing-liver-cirrhosis',
      'blog/liver-cancer-early-detection',
      'blog/hepatitis-prevention-guide',
      'blog/nutrition-for-liver-health',
      'media/sali-achieves-milestone-2000-transplants',
      'media/free-liver-screening-camp-hyderabad',
      'media/world-liver-day-2025-awareness-campaign',
      'media/advanced-diagnostic-center-mumbai',
      'media/dr-tom-cherian-honored-excellence',
      'media/licap-programme-1000-patients'
    ];
  }

  /**
   * Get localized URL for a page and language
   */
  getLocalizedUrl(page, language) {
    if (language === translationConfig.defaultLanguage) {
      return `${this.baseUrl}/${page}`;
    } else {
      return `${this.baseUrl}/${language}/${page}`;
    }
  }

  /**
   * Get change frequency for a page
   */
  getChangeFreq(page) {
    if (page.includes('blog/') || page.includes('media/')) {
      return 'weekly';
    } else if (page.includes('services/') || page.includes('locations/')) {
      return 'monthly';
    } else {
      return 'weekly';
    }
  }

  /**
   * Get priority for a page
   */
  getPriority(page) {
    if (page === '') {
      return '1.0';
    } else if (page.includes('services/') || page.includes('about/')) {
      return '0.9';
    } else if (page.includes('blog/') || page.includes('media/')) {
      return '0.8';
    } else {
      return '0.7';
    }
  }

  /**
   * Get hreflang links for a page
   */
  getHreflangLinks(page) {
    const hreflangLinks = [];
    
    for (const language of this.enabledLanguages) {
      if (language.enabled) {
        const url = this.getLocalizedUrl(page, language.code);
        hreflangLinks.push({
          hreflang: language.code,
          href: url
        });
      }
    }
    
    // Add x-default
    const defaultUrl = this.getLocalizedUrl(page, translationConfig.defaultLanguage);
    hreflangLinks.push({
      hreflang: 'x-default',
      href: defaultUrl
    });
    
    return hreflangLinks;
  }

  /**
   * Build sitemap XML
   */
  buildSitemapXml(urls, language) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
    xml += 'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${url.loc}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      
      // Add hreflang links
      if (url.hreflang) {
        for (const link of url.hreflang) {
          xml += `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />\n`;
        }
      }
      
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    return xml;
  }

  /**
   * Build sitemap index XML
   */
  buildSitemapIndexXml(sitemaps) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const sitemap of sitemaps) {
      xml += '  <sitemap>\n';
      xml += `    <loc>${sitemap.loc}</loc>\n`;
      xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
      xml += '  </sitemap>\n';
    }
    
    xml += '</sitemapindex>';
    return xml;
  }
}

// CLI usage
if (require.main === module) {
  const generator = new SitemapGenerator();
  
  generator.generateSitemap()
    .then(() => {
      console.log('✅ Sitemap generation completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Sitemap generation failed:', error);
      process.exit(1);
    });
}

module.exports = SitemapGenerator;
