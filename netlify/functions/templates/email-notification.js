/**
 * Email Template for Form Submission Notifications
 * Responsive HTML email with SALi branding
 */

export function generateEmailHTML(taggedData) {
  const { urgency, priorityScore, location, serviceArea, tags, summary, rawData, timestamp, submissionId } = taggedData;
  
  // Determine priority badge color
  const priorityColors = {
    5: { bg: '#dc3545', text: 'IMMEDIATE ATTENTION' },
    4: { bg: '#ff6b6b', text: 'HIGH PRIORITY' },
    3: { bg: '#ffd93d', text: 'MEDIUM PRIORITY' },
    2: { bg: '#95e1d3', text: 'LOW PRIORITY' },
    1: { bg: '#38ada9', text: 'INFORMATIONAL' },
  };
  
  const priorityBadge = priorityColors[priorityScore] || priorityColors[3];
  const urgentBanner = urgency === 'urgent' ? `
    <div style="background-color: #dc3545; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 20px;">
      ⚠️ URGENT: This submission requires immediate attention
    </div>
  ` : '';
  
  // Format form fields
  const formFields = Object.entries(rawData)
    .filter(([key]) => !key.startsWith('form-') && key !== 'bot-field' && key !== 'g-recaptcha-response')
    .map(([key, value]) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #555; text-transform: capitalize;">
          ${key.replace(/-/g, ' ').replace('contact ', '')}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; color: #333;">
          ${value || 'Not provided'}
        </td>
      </tr>
    `).join('');
  
  // Format tags
  const tagBadges = tags.map(tag => `
    <span style="display: inline-block; background-color: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin: 2px;">
      ${tag}
    </span>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Form Submission - SALi</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px;">South Asian Liver Institute</h1>
              <p style="margin: 5px 0 0 0; color: #e0e7ff; font-size: 14px;">Think Liver, Think SALi. We provide the best liver care.</p>
            </td>
          </tr>
          
          <!-- Urgent Banner -->
          ${urgentBanner}
          
          <!-- Priority Badge -->
          <tr>
            <td style="padding: 20px 30px 10px 30px;">
              <div style="background-color: ${priorityBadge.bg}; color: ${priorityScore <= 2 ? '#333' : 'white'}; padding: 10px 20px; border-radius: 6px; text-align: center; font-weight: bold; font-size: 14px;">
                ${priorityBadge.text}
              </div>
            </td>
          </tr>
          
          <!-- Summary -->
          <tr>
            <td style="padding: 20px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1e3a8a; font-size: 20px;">New ${rawData['form-type'] || 'Contact'} Form Submission</h2>
              <p style="margin: 0; color: #555; font-size: 15px; line-height: 1.6;">
                <strong>AI Summary:</strong> ${summary}
              </p>
            </td>
          </tr>
          
          <!-- Metadata -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 13px;">
                    <strong>Submission ID:</strong> ${submissionId}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 13px;">
                    <strong>Received:</strong> ${new Date(timestamp).toLocaleString('en-US', { 
                      dateStyle: 'full', 
                      timeStyle: 'short' 
                    })}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 13px;">
                    <strong>Location:</strong> ${location}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 13px;">
                    <strong>Service Area:</strong> ${serviceArea}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Tags -->
          ${tags.length > 0 ? `
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <p style="margin: 0 0 8px 0; color: #666; font-size: 13px; font-weight: bold;">AI Tags:</p>
              <div>${tagBadges}</div>
            </td>
          </tr>
          ` : ''}
          
          <!-- Form Data -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="margin: 0 0 15px 0; color: #1e3a8a; font-size: 16px;">Submission Details</h3>
              <table style="width: 100%; border-collapse: collapse; background-color: #fafafa; border-radius: 6px; overflow: hidden;">
                ${formFields}
              </table>
            </td>
          </tr>
          
          <!-- Action Buttons -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="${process.env.URL || 'https://southasianliverinstitute.com'}/admin/submissions" 
                 style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">
                View in Dashboard
              </a>
            </td>
          </tr>
          
          <!-- Response Time Recommendation -->
          <tr>
            <td style="padding: 0 30px 30px 30px; background-color: #f8f9fa; border-top: 1px solid #e0e0e0;">
              <p style="margin: 15px 0 0 0; color: #666; font-size: 13px; text-align: center;">
                ${priorityScore >= 4 
                  ? '⏰ <strong>Recommended Response Time:</strong> Within 1-2 hours' 
                  : priorityScore === 3
                  ? '⏰ <strong>Recommended Response Time:</strong> Within 24 hours'
                  : '⏰ <strong>Recommended Response Time:</strong> Within 48 hours'}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #1e3a8a; text-align: center;">
              <p style="margin: 0; color: #e0e7ff; font-size: 12px;">
                South Asian Liver Institute<br>
                Emergency Line: <a href="tel:+918070670670" style="color: #93c5fd;">+91-8070 670 670</a>
              </p>
              <p style="margin: 10px 0 0 0; color: #93c5fd; font-size: 11px;">
                This is an automated notification from your website contact form.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateEmailText(taggedData) {
  const { urgency, priorityScore, location, serviceArea, tags, summary, rawData, timestamp, submissionId } = taggedData;
  
  const urgentNotice = urgency === 'urgent' ? '⚠️ URGENT: This submission requires immediate attention\n\n' : '';
  
  const formFields = Object.entries(rawData)
    .filter(([key]) => !key.startsWith('form-') && key !== 'bot-field' && key !== 'g-recaptcha-response')
    .map(([key, value]) => `${key.replace(/-/g, ' ').replace('contact ', '').toUpperCase()}: ${value || 'Not provided'}`)
    .join('\n');
  
  return `
${urgentNotice}NEW FORM SUBMISSION - SOUTH ASIAN LIVER INSTITUTE
${'='.repeat(60)}

PRIORITY: ${priorityScore}/5 (${urgency.toUpperCase()})

AI SUMMARY: ${summary}

SUBMISSION DETAILS:
------------------
Submission ID: ${submissionId}
Received: ${new Date(timestamp).toLocaleString()}
Location: ${location}
Service Area: ${serviceArea}
Tags: ${tags.join(', ') || 'None'}

FORM DATA:
----------
${formFields}

RESPONSE TIME:
--------------
${priorityScore >= 4 
  ? 'Recommended: Within 1-2 hours' 
  : priorityScore === 3
  ? 'Recommended: Within 24 hours'
  : 'Recommended: Within 48 hours'}

--
South Asian Liver Institute
Think Liver, Think SALi. We provide the best liver care.
Emergency: +91-8070 670 670
  `.trim();
}

