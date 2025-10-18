/**
 * Netlify Function: Fetch Blog Posts
 * 
 * Fetches blog posts with 1-hour cache
 * Provides API endpoint for client-side blog post loading
 */

// In-memory cache
let cache = null;
let cacheTimestamp = null;
const CACHE_TTL = 3600 * 1000; // 1 hour in milliseconds

/**
 * Mock blog posts data
 * In production, replace with actual CMS/API calls
 */
function getBlogPosts() {
  return [
    {
      slug: 'understanding-fatty-liver',
      title: 'Understanding Fatty Liver Disease: Prevention and Management',
      excerpt: 'Fatty liver disease affects millions worldwide. Learn about risk factors, early warning signs, dietary modifications, and lifestyle changes that can prevent progression to more serious liver conditions.',
      content: '<p>Full article content here...</p>',
      category: 'Liver Health',
      tags: ['fatty liver', 'NAFLD', 'prevention'],
      author: 'SALi Experts',
      date: '2024-01-15',
      image: '/assets/images/blog/grid/1.jpg',
      readTime: 8
    },
    {
      slug: 'life-after-transplant',
      title: 'Life After Liver Transplant: What to Expect During Recovery',
      excerpt: 'Recovering from a liver transplant involves multiple stages. Our comprehensive guide covers post-operative care, immunosuppression management, dietary guidelines, and long-term health monitoring.',
      content: '<p>Full article content here...</p>',
      category: 'Liver Transplant',
      tags: ['transplant', 'recovery', 'post-op care'],
      author: 'SALi Experts',
      date: '2024-01-10',
      image: '/assets/images/blog/grid/2.jpg',
      readTime: 10
    },
    {
      slug: 'managing-cirrhosis',
      title: 'Managing Liver Cirrhosis: Diet, Lifestyle, and Treatment Options',
      excerpt: 'Living with cirrhosis requires careful management of diet, medications, and regular monitoring. Discover evidence-based strategies to slow disease progression and improve quality of life.',
      content: '<p>Full article content here...</p>',
      category: 'Cirrhosis',
      tags: ['cirrhosis', 'management', 'nutrition'],
      author: 'SALi Experts',
      date: '2024-01-05',
      image: '/assets/images/blog/grid/3.jpg',
      readTime: 12
    }
  ];
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Check if cache is valid
    const now = Date.now();
    if (cache && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'X-Cache': 'HIT'
        },
        body: JSON.stringify({
          posts: cache,
          cached: true,
          timestamp: cacheTimestamp
        })
      };
    }

    // Fetch fresh data
    const posts = getBlogPosts();

    // Update cache
    cache = posts;
    cacheTimestamp = now;

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'X-Cache': 'MISS'
      },
      body: JSON.stringify({
        posts,
        cached: false,
        timestamp: now
      })
    };

  } catch (error) {
    console.error('Error fetching blog posts:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch blog posts',
        message: error.message
      })
    };
  }
};

