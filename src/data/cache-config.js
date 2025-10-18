/**
 * Cache Configuration
 * 
 * Centralized cache duration and strategy settings
 * for different types of content and resources.
 */

/**
 * Cache durations in seconds
 */
export const CACHE_DURATION = {
  // No cache
  NONE: 0,
  
  // Very short (1-5 minutes)
  VERY_SHORT: 60,
  SHORT: 300,
  
  // Medium (5-60 minutes)
  MEDIUM_SHORT: 600,      // 10 minutes
  MEDIUM: 1800,           // 30 minutes
  MEDIUM_LONG: 3600,      // 1 hour
  
  // Long (1-24 hours)
  LONG: 7200,             // 2 hours
  VERY_LONG: 21600,       // 6 hours
  DAY: 86400,             // 24 hours
  
  // Very long (days to weeks)
  WEEK: 604800,           // 7 days
  MONTH: 2592000,         // 30 days
  YEAR: 31536000,         // 365 days
  
  // Immutable (never expires)
  IMMUTABLE: 31536000     // 1 year (effectively immutable with immutable flag)
};

/**
 * Stale-while-revalidate durations in seconds
 */
export const SWR_DURATION = {
  SHORT: 300,             // 5 minutes
  MEDIUM: 1800,           // 30 minutes
  LONG: 3600,             // 1 hour
  VERY_LONG: 7200,        // 2 hours
  DAY: 86400              // 24 hours
};

/**
 * Content-specific cache configurations
 */
export const CONTENT_CACHE = {
  // Static pages (About, Services, etc.)
  staticPages: {
    maxAge: CACHE_DURATION.YEAR,
    swr: SWR_DURATION.DAY,
    immutable: true,
    headers: 'public, max-age=31536000, immutable'
  },

  // Blog posts
  blogPosts: {
    maxAge: CACHE_DURATION.MEDIUM_LONG,
    swr: SWR_DURATION.DAY,
    headers: 'public, max-age=3600, stale-while-revalidate=86400'
  },

  // Media items
  media: {
    maxAge: CACHE_DURATION.MEDIUM,
    swr: SWR_DURATION.LONG,
    headers: 'public, max-age=1800, stale-while-revalidate=3600'
  },

  // Location pages
  locations: {
    maxAge: CACHE_DURATION.VERY_LONG,
    swr: SWR_DURATION.DAY,
    headers: 'public, max-age=21600, stale-while-revalidate=86400'
  },

  // Forms (no cache)
  forms: {
    maxAge: CACHE_DURATION.NONE,
    swr: CACHE_DURATION.NONE,
    headers: 'no-cache, no-store, must-revalidate'
  }
};

/**
 * Asset-specific cache configurations
 */
export const ASSET_CACHE = {
  // Images
  images: {
    maxAge: CACHE_DURATION.MONTH,
    headers: 'public, max-age=2592000, immutable'
  },

  // Fonts
  fonts: {
    maxAge: CACHE_DURATION.YEAR,
    headers: 'public, max-age=31536000, immutable, crossorigin'
  },

  // CSS
  css: {
    maxAge: CACHE_DURATION.YEAR,
    headers: 'public, max-age=31536000, immutable'
  },

  // JavaScript
  javascript: {
    maxAge: CACHE_DURATION.YEAR,
    headers: 'public, max-age=31536000, immutable'
  },

  // Videos
  videos: {
    maxAge: CACHE_DURATION.MONTH,
    headers: 'public, max-age=2592000'
  }
};

/**
 * API cache configurations
 */
export const API_CACHE = {
  // Blog posts API
  blogPosts: {
    ttl: CACHE_DURATION.MEDIUM_LONG,
    maxAge: CACHE_DURATION.MEDIUM_LONG,
    swr: SWR_DURATION.DAY
  },

  // Media API
  media: {
    ttl: CACHE_DURATION.MEDIUM,
    maxAge: CACHE_DURATION.MEDIUM,
    swr: SWR_DURATION.LONG
  },

  // Locations API
  locations: {
    ttl: CACHE_DURATION.VERY_LONG,
    maxAge: CACHE_DURATION.VERY_LONG,
    swr: SWR_DURATION.DAY
  },

  // Form submissions (no cache)
  submissions: {
    ttl: CACHE_DURATION.NONE,
    maxAge: CACHE_DURATION.NONE,
    swr: CACHE_DURATION.NONE
  }
};

/**
 * Get cache headers string for a content type
 */
export function getCacheHeaders(type, category = 'content') {
  const config = {
    content: CONTENT_CACHE,
    asset: ASSET_CACHE,
    api: API_CACHE
  }[category];

  return config?.[type]?.headers || 'public, max-age=3600';
}

/**
 * Generate cache control header
 */
export function generateCacheControl(maxAge, swr, options = {}) {
  const parts = ['public'];
  
  if (maxAge) {
    parts.push(`max-age=${maxAge}`);
  }
  
  if (swr) {
    parts.push(`stale-while-revalidate=${swr}`);
  }
  
  if (options.immutable) {
    parts.push('immutable');
  }
  
  if (options.mustRevalidate) {
    parts.push('must-revalidate');
  }
  
  if (options.private) {
    parts[0] = 'private';
  }

  return parts.join(', ');
}

/**
 * Check if cache is still valid
 */
export function isCacheValid(timestamp, ttl) {
  if (!timestamp || !ttl) return false;
  return Date.now() - timestamp < ttl * 1000;
}

export default {
  CACHE_DURATION,
  SWR_DURATION,
  CONTENT_CACHE,
  ASSET_CACHE,
  API_CACHE,
  getCacheHeaders,
  generateCacheControl,
  isCacheValid
};

