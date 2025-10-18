/**
 * Netlify Function: Fetch Locations
 * 
 * Fetches location data with 6-hour cache
 * Provides API endpoint for client-side location loading
 */

// In-memory cache
let cache = null;
let cacheTimestamp = null;
const CACHE_TTL = 21600 * 1000; // 6 hours in milliseconds

/**
 * Location data
 * This is relatively static data that changes infrequently
 */
function getLocations() {
  return [
    {
      slug: 'hyderabad',
      name: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      address: 'Partner Hospital, Banjara Hills, Hyderabad, Telangana 500034',
      phone: '+91-8070 670 670',
      email: 'hyderabad@sali.org.in',
      coordinates: {
        lat: 17.4126,
        lng: 78.4484
      },
      isMain: true,
      facilities: [
        'Liver Transplantation',
        'Advanced Hepatology',
        'ICU Facility',
        'Diagnostic Center',
        'Emergency Services'
      ],
      timings: {
        weekdays: '8:00 AM - 7:00 PM',
        saturday: '9:00 AM - 10:00 PM',
        sunday: '10:00 AM - 12:00 PM'
      }
    },
    {
      slug: 'mumbai',
      name: 'Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Partner Hospital, Andheri West, Mumbai, Maharashtra 400053',
      phone: '+91-8070 670 670',
      email: 'mumbai@sali.org.in',
      coordinates: {
        lat: 19.1334,
        lng: 72.8306
      },
      isMain: false,
      facilities: [
        'Liver Transplantation',
        'Hepatology',
        'Endoscopy',
        'Diagnostic Center'
      ],
      timings: {
        weekdays: '9:00 AM - 6:00 PM',
        saturday: '9:00 AM - 2:00 PM',
        sunday: 'Closed'
      }
    },
    {
      slug: 'kolkata',
      name: 'Kolkata',
      city: 'Kolkata',
      state: 'West Bengal',
      address: 'Partner Hospital, Salt Lake, Kolkata, West Bengal 700091',
      phone: '+91-8070 670 670',
      email: 'kolkata@sali.org.in',
      coordinates: {
        lat: 22.5726,
        lng: 88.3639
      },
      isMain: false,
      facilities: [
        'Hepatology',
        'Liver Cirrhosis Management',
        'Diagnostic Center'
      ],
      timings: {
        weekdays: '9:00 AM - 6:00 PM',
        saturday: '9:00 AM - 2:00 PM',
        sunday: 'Closed'
      }
    },
    {
      slug: 'visakhapatnam',
      name: 'Visakhapatnam',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      address: 'Partner Hospital, Visakhapatnam, Andhra Pradesh',
      phone: '+91-8070 670 670',
      email: 'vizag@sali.org.in',
      coordinates: {
        lat: 17.6868,
        lng: 83.2185
      },
      isMain: false,
      facilities: [
        'Hepatology',
        'Liver Care',
        'Diagnostic Services'
      ],
      timings: {
        weekdays: '9:00 AM - 6:00 PM',
        saturday: '9:00 AM - 2:00 PM',
        sunday: 'Closed'
      }
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
    'Cache-Control': 'public, max-age=21600, stale-while-revalidate=86400'
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
    const { slug, state, main } = params;

    // Check if cache is valid
    const now = Date.now();
    if (cache && cacheTimestamp && (now - cacheTimestamp < CACHE_TTL)) {
      let locations = cache;

      // Apply filters
      if (slug) {
        const location = locations.find(loc => loc.slug === slug);
        return {
          statusCode: location ? 200 : 404,
          headers: {
            ...headers,
            'X-Cache': 'HIT'
          },
          body: JSON.stringify(location || { error: 'Location not found' })
        };
      }

      if (state) {
        locations = locations.filter(loc => 
          loc.state.toLowerCase() === state.toLowerCase()
        );
      }

      if (main === 'true') {
        locations = locations.filter(loc => loc.isMain);
      }

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'X-Cache': 'HIT'
        },
        body: JSON.stringify({
          locations,
          total: locations.length,
          cached: true,
          timestamp: cacheTimestamp
        })
      };
    }

    // Fetch fresh data
    let locations = getLocations();

    // Update cache
    cache = locations;
    cacheTimestamp = now;

    // Apply filters
    if (slug) {
      const location = locations.find(loc => loc.slug === slug);
      return {
        statusCode: location ? 200 : 404,
        headers: {
          ...headers,
          'X-Cache': 'MISS'
        },
        body: JSON.stringify(location || { error: 'Location not found' })
      };
    }

    if (state) {
      locations = locations.filter(loc => 
        loc.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (main === 'true') {
      locations = locations.filter(loc => loc.isMain);
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'X-Cache': 'MISS'
      },
      body: JSON.stringify({
        locations,
        total: locations.length,
        cached: false,
        timestamp: now
      })
    };

  } catch (error) {
    console.error('Error fetching locations:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch locations',
        message: error.message
      })
    };
  }
};

