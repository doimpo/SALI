/**
 * Build Configuration for SALi Modular System
 * Handles component compilation and asset optimization
 */

const buildConfig = {
  // Source directories
  src: {
    components: './src/components/',
    styles: './src/styles/',
    scripts: './src/js/',
    assets: './src/assets/'
  },

  // Output directories
  dist: {
    components: './public/components/',
    styles: './public/assets/css/',
    scripts: './public/assets/js/',
    assets: './public/assets/'
  },

  // Component configuration
  components: {
    // List of components to compile
    list: [
      'header',
      'footer', 
      'page-title',
      'contact-info',
      'service-card',
      'team-card',
      'testimonial-card'
    ],

    // Template variables that can be replaced
    variables: {
      siteName: 'South Asian Liver Institute',
      siteTagline: 'Think Liver, Think SALi. We provide the best liver care.',
      contactPhone: '+91-8070 670 670',
      contactEmail: 'info@southasianliverinstitute.com',
      address: 'Plot No. 8-2-269/4/B, 4th Floor, Road No. 2, Banjara Hills, Hyderabad, Telangana 500034'
    }
  },

  // CSS configuration
  styles: {
    // Main SCSS files to compile
    main: [
      'main-modular.scss'
    ],

    // Component SCSS files
    components: [
      'components/_buttons.scss',
      'components/_cards.scss',
      'components/_forms.scss'
    ],

    // Output format
    outputStyle: 'compressed', // nested, expanded, compact, compressed

    // Source maps
    sourceMap: true,

    // Autoprefixer options
    autoprefixer: {
      browsers: ['last 2 versions', '> 1%', 'ie 11']
    }
  },

  // JavaScript configuration
  scripts: {
    // Entry point
    main: 'main-modular.js',

    // Modules to bundle
    modules: [
      'modules/ComponentLoader.js',
      'modules/PerformanceMonitor.js',
      'modules/FormValidator.js',
      'modules/LazyLoader.js'
    ],

    // Output format
    format: 'es', // es, umd, iife

    // Minification
    minify: true,

    // Source maps
    sourceMap: true
  },

  // Asset optimization
  assets: {
    // Image optimization
    images: {
      quality: 85,
      formats: ['webp', 'jpg', 'png'],
      sizes: [320, 640, 768, 1024, 1200, 1920]
    },

    // Font optimization
    fonts: {
      formats: ['woff2', 'woff', 'ttf'],
      subset: true,
      display: 'swap'
    }
  },

  // Build tasks
  tasks: {
    // Development build
    dev: [
      'copy-assets',
      'compile-scss',
      'bundle-js',
      'compile-components',
      'generate-sitemap'
    ],

    // Production build
    prod: [
      'clean-dist',
      'copy-assets',
      'optimize-images',
      'compile-scss',
      'bundle-js',
      'minify-html',
      'compile-components',
      'generate-sitemap',
      'generate-service-worker'
    ]
  },

  // Browser support
  browsers: {
    modern: [
      'last 2 versions',
      'not dead',
      'not ie 11'
    ],
    legacy: [
      'last 2 versions',
      '> 1%',
      'ie 11'
    ]
  },

  // Performance budgets
  performance: {
    budgets: {
      // File size limits (in bytes)
      maxCssSize: 500000,      // 500KB
      maxJsSize: 1000000,      // 1MB
      maxImageSize: 2000000,   // 2MB
      maxFontSize: 100000,     // 100KB

      // Performance metrics
      maxLcp: 2500,            // 2.5s
      maxFid: 100,             // 100ms
      maxCls: 0.1              // 0.1
    }
  },

  // SEO configuration
  seo: {
    // Meta tags
    meta: {
      title: 'SALi - South Asian Liver Institute',
      description: 'Premier liver care and treatment facility. Think Liver, Think SALi. We provide the best liver care.',
      keywords: 'liver transplant, hepatology, liver surgery, liver disease, liver care, South Asian Liver Institute',
      author: 'South Asian Liver Institute',
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1.0'
    },

    // Open Graph
    openGraph: {
      type: 'website',
      siteName: 'South Asian Liver Institute',
      locale: 'en_US'
    },

    // Structured data
    structuredData: {
      organization: {
        '@type': 'MedicalOrganization',
        name: 'South Asian Liver Institute',
        url: 'https://www.southasianliverinstitute.com',
        logo: 'https://www.southasianliverinstitute.com/assets/images/logo/sali-logo-light.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-8070-670-670',
          contactType: 'customer service'
        }
      }
    }
  },

  // Cache configuration
  cache: {
    // Static assets cache (1 year)
    static: {
      '*.css': 31536000,
      '*.js': 31536000,
      '*.woff2': 31536000,
      '*.woff': 31536000,
      '*.ttf': 31536000,
      '*.png': 31536000,
      '*.jpg': 31536000,
      '*.jpeg': 31536000,
      '*.webp': 31536000
    },

    // HTML cache (1 hour)
    html: {
      '*.html': 3600
    }
  }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = buildConfig;
} else {
  window.buildConfig = buildConfig;
}
