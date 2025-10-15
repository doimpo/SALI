/**
 * Get Form Submissions for Admin Dashboard
 * Fetches submissions from Netlify Forms API
 */

export async function handler(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
  
  try {
    // Basic authentication check
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
        },
        body: JSON.stringify({ error: 'Authentication required' }),
      };
    }
    
    // Parse Basic Auth
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    // Verify credentials
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'change-this-secure-password';
    
    if (username !== validUsername || password !== validPassword) {
      return {
        statusCode: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
        },
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }
    
    // Fetch submissions from Netlify Forms API
    const siteId = process.env.NETLIFY_SITE_ID;
    const apiKey = process.env.NETLIFY_FORM_API_KEY;
    
    if (!siteId || !apiKey) {
      console.error('Netlify API credentials not configured');
      return {
        statusCode: 503,
        body: JSON.stringify({ 
          error: 'API not configured',
          message: 'Please configure NETLIFY_SITE_ID and NETLIFY_FORM_API_KEY environment variables',
        }),
      };
    }
    
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const page = parseInt(queryParams.page || '1', 10);
    const perPage = parseInt(queryParams.per_page || '20', 10);
    const formName = queryParams.form || '';
    
    // Build API URL
    let apiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/submissions?page=${page}&per_page=${perPage}`;
    if (formName) {
      apiUrl += `&form_name=${formName}`;
    }
    
    // Fetch from Netlify API
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.status}`);
    }
    
    const submissions = await response.json();
    
    // Transform submissions to include parsed data
    const transformedSubmissions = submissions.map(sub => ({
      id: sub.id,
      number: sub.number,
      email: sub.email,
      name: sub.name,
      created_at: sub.created_at,
      form_name: sub.form_name,
      data: sub.data,
      // Try to extract AI tags if stored in submission
      aiTags: sub.data?.aiTags ? JSON.parse(sub.data.aiTags) : null,
    }));
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        success: true,
        submissions: transformedSubmissions,
        page,
        perPage,
      }),
    };
    
  } catch (error) {
    console.error('Get submissions error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch submissions',
        message: error.message,
      }),
    };
  }
}

export default handler;

