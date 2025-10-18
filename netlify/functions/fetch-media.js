/**
 * Netlify Function: Fetch Media
 * 
 * Fetches media items (videos, images) with 30-minute cache
 * Provides API endpoint for client-side media loading
 */

// In-memory cache
let cache = null;
let cacheTimestamp = null;
const CACHE_TTL = 1800 * 1000; // 30 minutes in milliseconds

/**
 * Mock media data
 * In production, replace with actual CMS/API calls
 */
function getMediaItems() {
  return [
    {
      slug: 'patient-success-stories',
      title: 'Patient Success Stories',
      description: 'Hear from patients whose lives were transformed by liver transplantation at SALi.',
      type: 'video',
      thumbnail: '/assets/images/gallery/1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=nrJtHemSPW4',
      duration: '5:32',
      date: '2024-01-15',
      category: 'Patient Stories',
      views: 1250
    },
    {
      slug: 'liver-transplant-procedure',
      title: 'Liver Transplant Procedure Overview',
      description: 'A comprehensive overview of the liver transplantation process at SALi.',
      type: 'video',
      thumbnail: '/assets/images/gallery/2.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=example',
      duration: '8:45',
      date: '2024-01-10',
      category: 'Education',
      views: 2300
    },
    {
      slug: 'fatty-liver-awareness',
      title: 'Fatty Liver Disease Awareness',
      description: 'Understanding fatty liver disease and prevention strategies.',
      type: 'video',
      thumbnail: '/assets/images/gallery/3.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      duration: '6:12',
      date: '2024-01-05',
      category: 'Education',
      views: 1800
    },
    {
      slug: 'sali-facilities',
      title: 'SALi Facilities Tour',
      description: 'Virtual tour of our state-of-the-art liver care facilities.',
      type: 'gallery',
      images: [
        '/assets/images/gallery/1.jpg',
        '/assets/images/gallery/2.jpg',
        '/assets/images/gallery/3.jpg',
        '/assets/images/gallery/4.jpg'
      ],
      date: '2024-01-01',
      category: 'Facilities',
      views: 980
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
    'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600'
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
    // Parse query parameters
    const params = event.queryStringParameters || {};
    const { type, category, limit } = params;

    // Check if cache is valid
    const now = Date.now();
    if (cache && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
      let items = cache;

      // Apply filters
      if (type) {
        items = items.filter(item => item.type === type);
      }
      if (category) {
        items = items.filter(item => item.category === category);
      }
      if (limit) {
        items = items.slice(0, parseInt(limit));
      }

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'X-Cache': 'HIT'
        },
        body: JSON.stringify({
          media: items,
          total: items.length,
          cached: true,
          timestamp: cacheTimestamp
        })
      };
    }

    // Fetch fresh data
    let items = getMediaItems();

    // Update cache
    cache = items;
    cacheTimestamp = now;

    // Apply filters
    if (type) {
      items = items.filter(item => item.type === type);
    }
    if (category) {
      items = items.filter(item => item.category === category);
    }
    if (limit) {
      items = items.slice(0, parseInt(limit));
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'X-Cache': 'MISS'
      },
      body: JSON.stringify({
        media: items,
        total: items.length,
        cached: false,
        timestamp: now
      })
    };

  } catch (error) {
    console.error('Error fetching media:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch media',
        message: error.message
      })
    };
  }
};

