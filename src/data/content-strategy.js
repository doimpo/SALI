/**
 * Content Strategy Configuration
 * 
 * Defines content tiers and caching strategies for different page types.
 * This helps optimize which content is:
 * - Built at build time (static)
 * - Regenerated on-demand (ISR)
 * - Fetched dynamically (serverless)
 */

export const contentTiers = {
  // Tier 1: Build-time static (rebuilt only when code/content changes)
  // These pages change rarely and can be cached forever
  static: {
    paths: [
      '/about/*',
      '/services/*',
      '/programmes/*',
      '/medical-disclaimer',
      '/privacy-policy',
      '/terms-of-service',
      '/faqs'
    ],
    revalidate: false, // No automatic revalidation
    cacheControl: 'public, max-age=31536000, immutable'
  },

  // Tier 2: Semi-static with ISR (rebuilt periodically or on-demand)
  // Content that changes regularly but not constantly
  semiStatic: {
    blog: {
      paths: ['/blog/*'],
      revalidate: 3600, // 1 hour
      cacheControl: 'public, max-age=3600, stale-while-revalidate=86400',
      priority: 'high'
    },
    media: {
      paths: ['/media/*'],
      revalidate: 1800, // 30 minutes
      cacheControl: 'public, max-age=1800, stale-while-revalidate=7200',
      priority: 'medium'
    },
    locations: {
      paths: ['/locations/*'],
      revalidate: 21600, // 6 hours
      cacheControl: 'public, max-age=21600, stale-while-revalidate=86400',
      priority: 'medium'
    }
  },

  // Tier 3: Dynamic (always fresh, minimal caching)
  // Content that must be up-to-date
  dynamic: {
    forms: {
      paths: ['/contact', '/appointment'],
      revalidate: 0,
      cacheControl: 'no-cache, no-store, must-revalidate',
      priority: 'high'
    },
    admin: {
      paths: ['/admin/*'],
      revalidate: 0,
      cacheControl: 'private, no-cache, no-store, must-revalidate',
      priority: 'critical'
    }
  },

  // Tier 4: Progressive loading strategies
  progressive: {
    images: {
      strategy: 'lazy', // 'lazy' | 'eager' | 'auto'
      formats: ['avif', 'webp', 'jpg'], // Order of preference
      sizes: {
        thumbnail: 300,
        small: 640,
        medium: 1024,
        large: 1920,
        xlarge: 2560
      },
      quality: {
        thumbnail: 60,
        default: 80,
        hero: 90
      }
    },
    videos: {
      strategy: 'intersection-observer',
      preload: 'metadata' // 'none' | 'metadata' | 'auto'
    },
    scripts: {
      strategy: 'defer',
      critical: ['jquery', 'main'],
      defer: ['analytics', 'plugins']
    }
  }
};

/**
 * Get cache configuration for a specific path
 */
export function getCacheConfig(path) {
  // Check static paths
  if (matchesPatterns(path, contentTiers.static.paths)) {
    return {
      tier: 'static',
      ...contentTiers.static
    };
  }

  // Check semi-static paths
  for (const [key, config] of Object.entries(contentTiers.semiStatic)) {
    if (matchesPatterns(path, config.paths)) {
      return {
        tier: 'semi-static',
        type: key,
        ...config
      };
    }
  }

  // Check dynamic paths
  for (const [key, config] of Object.entries(contentTiers.dynamic)) {
    if (matchesPatterns(path, config.paths)) {
      return {
        tier: 'dynamic',
        type: key,
        ...config
      };
    }
  }

  // Default to semi-static with moderate caching
  return {
    tier: 'default',
    revalidate: 3600,
    cacheControl: 'public, max-age=3600, stale-while-revalidate=7200',
    priority: 'medium'
  };
}

/**
 * Check if a path matches any pattern
 */
function matchesPatterns(path, patterns) {
  return patterns.some(pattern => {
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
    return regex.test(path);
  });
}

/**
 * Get image loading strategy for a specific context
 */
export function getImageStrategy(context = 'default') {
  const strategies = {
    hero: {
      loading: 'eager',
      fetchpriority: 'high',
      formats: ['avif', 'webp', 'jpg'],
      quality: contentTiers.progressive.images.quality.hero
    },
    aboveFold: {
      loading: 'eager',
      fetchpriority: 'high',
      formats: ['avif', 'webp', 'jpg'],
      quality: contentTiers.progressive.images.quality.default
    },
    default: {
      loading: 'lazy',
      fetchpriority: 'auto',
      formats: ['avif', 'webp', 'jpg'],
      quality: contentTiers.progressive.images.quality.default
    },
    thumbnail: {
      loading: 'lazy',
      fetchpriority: 'low',
      formats: ['webp', 'jpg'],
      quality: contentTiers.progressive.images.quality.thumbnail
    }
  };

  return strategies[context] || strategies.default;
}

export default contentTiers;

