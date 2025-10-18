/**
 * Netlify Function: Scheduled Build
 * 
 * Automatically triggers a rebuild at scheduled times (e.g., daily at 3 AM)
 * Useful for keeping content fresh without manual intervention
 * 
 * To use with Netlify Scheduled Functions:
 * 1. Add to netlify.toml:
 *    [[scheduled_functions]]
 *      path = "/.netlify/functions/scheduled-build"
 *      schedule = "0 3 * * *"  # Daily at 3 AM UTC
 * 
 * Or use as a regular function called by external cron service
 */

exports.handler = async (event, context) => {
  console.log('Scheduled build triggered at:', new Date().toISOString());

  try {
    // Verify secret for security (if called externally)
    const authHeader = event.headers.authorization;
    const SCHEDULED_BUILD_SECRET = process.env.SCHEDULED_BUILD_SECRET || 'change-me';

    if (!authHeader || authHeader !== `Bearer ${SCHEDULED_BUILD_SECRET}`) {
      // Allow if called by Netlify scheduled functions (no auth header)
      if (event.headers['x-netlify-trigger'] !== 'scheduled') {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' })
        };
      }
    }

    // Get build hook URL from environment
    const BUILD_HOOK_URL = process.env.BUILD_HOOK_URL;
    
    if (!BUILD_HOOK_URL) {
      throw new Error('BUILD_HOOK_URL environment variable not configured');
    }

    // Trigger the build
    const buildResponse = await fetch(BUILD_HOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trigger_title: 'Scheduled Daily Build',
        clear_cache: true
      })
    });

    if (!buildResponse.ok) {
      throw new Error(`Build hook failed: ${buildResponse.statusText}`);
    }

    const buildData = await buildResponse.json().catch(() => ({}));

    // Log the build trigger
    console.log('Build triggered successfully:', buildData);

    // Optional: Send notification
    await sendNotification({
      event: 'scheduled_build',
      status: 'success',
      timestamp: new Date().toISOString(),
      buildData
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Scheduled build triggered successfully',
        timestamp: new Date().toISOString(),
        buildData
      })
    };

  } catch (error) {
    console.error('Scheduled build error:', error);

    // Send error notification
    await sendNotification({
      event: 'scheduled_build',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to trigger scheduled build',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

/**
 * Send notification about build status
 * Can be extended to use email, Slack, Discord, etc.
 */
async function sendNotification(data) {
  // Get notification webhook URL (e.g., Slack, Discord)
  const NOTIFICATION_WEBHOOK = process.env.NOTIFICATION_WEBHOOK;
  
  if (!NOTIFICATION_WEBHOOK) {
    console.log('No notification webhook configured');
    return;
  }

  try {
    const message = data.status === 'success'
      ? `✅ Scheduled build triggered successfully at ${data.timestamp}`
      : `❌ Scheduled build failed at ${data.timestamp}: ${data.error}`;

    await fetch(NOTIFICATION_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: message,
        ...data
      })
    });

    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

/**
 * Manual trigger function for testing
 * Can be called via: curl -X POST /.netlify/functions/scheduled-build
 */
exports.manualTrigger = async () => {
  console.log('Manual build trigger requested');
  return exports.handler({
    httpMethod: 'POST',
    headers: {
      'x-netlify-trigger': 'manual'
    }
  }, {});
};

