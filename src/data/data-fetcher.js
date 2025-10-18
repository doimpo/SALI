/**
 * Data Fetcher Utilities
 * 
 * Unified data fetching with caching, error handling, and retry logic.
 * Supports both build-time and runtime data fetching.
 */

import { getCacheConfig } from './content-strategy.js';

/**
 * In-memory cache for build-time data fetching
 */
const buildCache = new Map();

/**
 * Fetch data with caching and error handling
 */
export async function fetchData(url, options = {}) {
  const {
    cache = true,
    ttl = 3600,
    retry = 3,
    timeout = 10000,
    fallback = null
  } = options;

  // Check build cache
  if (cache && buildCache.has(url)) {
    const cached = buildCache.get(url);
    if (Date.now() - cached.timestamp < ttl * 1000) {
      return cached.data;
    }
  }

  // Fetch with retry logic
  let lastError;
  for (let attempt = 0; attempt < retry; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache the result
      if (cache) {
        buildCache.set(url, {
          data,
          timestamp: Date.now()
        });
      }

      return data;

    } catch (error) {
      lastError = error;
      console.warn(`Fetch attempt ${attempt + 1} failed for ${url}:`, error.message);
      
      // Wait before retry (exponential backoff)
      if (attempt < retry - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // All retries failed
  console.error(`All fetch attempts failed for ${url}:`, lastError);
  
  if (fallback !== null) {
    return fallback;
  }

  throw lastError;
}

/**
 * Fetch blog posts
 */
export async function fetchBlogPosts() {
  // For now, this returns static data
  // In production, replace with actual API call or CMS integration
  return [
    {
      slug: 'understanding-fatty-liver',
      title: 'Understanding Fatty Liver Disease: Prevention and Management',
      excerpt: 'Fatty liver disease affects millions worldwide. Learn about risk factors...',
      category: 'Liver Health',
      date: '2024-01-15',
      image: '/assets/images/blog/grid/1.jpg'
    },
    {
      slug: 'life-after-transplant',
      title: 'Life After Liver Transplant: What to Expect During Recovery',
      excerpt: 'Recovering from a liver transplant involves multiple stages...',
      category: 'Liver Transplant',
      date: '2024-01-10',
      image: '/assets/images/blog/grid/2.jpg'
    },
    {
      slug: 'managing-cirrhosis',
      title: 'Managing Liver Cirrhosis: Diet, Lifestyle, and Treatment Options',
      excerpt: 'Living with cirrhosis requires careful management...',
      category: 'Cirrhosis',
      date: '2024-01-05',
      image: '/assets/images/blog/grid/3.jpg'
    }
  ];
}

/**
 * Fetch media items
 */
export async function fetchMediaItems() {
  // Placeholder for media items
  // In production, replace with actual data source
  return [
    {
      slug: 'patient-success-stories',
      title: 'Patient Success Stories',
      type: 'video',
      thumbnail: '/assets/images/gallery/1.jpg',
      date: '2024-01-15'
    },
    {
      slug: 'liver-transplant-procedure',
      title: 'Liver Transplant Procedure Overview',
      type: 'video',
      thumbnail: '/assets/images/gallery/2.jpg',
      date: '2024-01-10'
    }
  ];
}

/**
 * Fetch locations
 */
export async function fetchLocations() {
  // Static location data
  return [
    {
      slug: 'hyderabad',
      name: 'Hyderabad',
      address: 'Partner Hospital, Hyderabad',
      phone: '+91-8070 670 670',
      isMain: true
    },
    {
      slug: 'mumbai',
      name: 'Mumbai',
      address: 'Partner Hospital, Mumbai',
      phone: '+91-8070 670 670',
      isMain: false
    },
    {
      slug: 'kolkata',
      name: 'Kolkata',
      address: 'Partner Hospital, Kolkata',
      phone: '+91-8070 670 670',
      isMain: false
    }
    // Add more locations as needed
  ];
}

/**
 * Preload data for a specific page
 */
export async function preloadPageData(path) {
  const config = getCacheConfig(path);
  
  // Determine what data to preload based on path
  if (path.startsWith('/blog')) {
    return await fetchBlogPosts();
  } else if (path.startsWith('/media')) {
    return await fetchMediaItems();
  } else if (path.startsWith('/locations')) {
    return await fetchLocations();
  }

  return null;
}

/**
 * Clear cache (useful for development)
 */
export function clearCache(pattern) {
  if (!pattern) {
    buildCache.clear();
    return;
  }

  for (const key of buildCache.keys()) {
    if (key.includes(pattern)) {
      buildCache.delete(key);
    }
  }
}

export default {
  fetchData,
  fetchBlogPosts,
  fetchMediaItems,
  fetchLocations,
  preloadPageData,
  clearCache
};

