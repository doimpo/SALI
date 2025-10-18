/**
 * Netlify Function: Rebuild Trigger
 * 
 * This function triggers a rebuild of the site when content changes.
 * Can be called via webhook from CMS or content management systems.
 * 
 * Usage:
 * POST /.netlify/functions/rebuild-trigger
 * Body: { "page": "blog/post-slug", "secret": "YOUR_SECRET_KEY" }
 */

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { page, secret, clearCache = true } = JSON.parse(event.body);

    // Verify the secret key for security
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'change-me-in-production';
    if (secret !== WEBHOOK_SECRET) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // Trigger Netlify build hook
    const BUILD_HOOK_URL = process.env.BUILD_HOOK_URL;
    
    if (!BUILD_HOOK_URL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'BUILD_HOOK_URL environment variable not configured',
          message: 'Please set up a build hook in Netlify and add the URL to environment variables'
        })
      };
    }

    const buildPayload = {
      trigger_title: page ? `Rebuild: ${page}` : 'Content Update Rebuild',
      clear_cache: clearCache
    };

    const response = await fetch(BUILD_HOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(buildPayload)
    });

    if (!response.ok) {
      throw new Error(`Build hook failed: ${response.statusText}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Build triggered successfully',
        page: page || 'all',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Rebuild trigger error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

