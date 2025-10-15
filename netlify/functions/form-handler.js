/**
 * Main Form Handler for Contact Form Submissions
 * Processes submissions, verifies reCAPTCHA, applies AI tagging, and sends notifications
 */

import { tagSubmission } from './ai-tagger.js';
import nodemailer from 'nodemailer';
import { generateEmailHTML, generateEmailText } from './templates/email-notification.js';

// Rate limiting storage (in-memory, will reset on function cold start)
const submissionTracker = new Map();

/**
 * Verify Google reCAPTCHA v3 token
 */
async function verifyRecaptcha(token) {
  if (!process.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY === 'your-recaptcha-secret-key-here') {
    console.log('reCAPTCHA not configured, skipping verification');
    return { success: true, score: 1.0 };
  }
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return { success: false, score: 0 };
  }
}

/**
 * Check rate limiting
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const maxSubmissions = parseInt(process.env.MAX_SUBMISSIONS_PER_IP_PER_HOUR || '5', 10);
  
  // Clean up old entries
  for (const [key, value] of submissionTracker.entries()) {
    if (now - value.timestamp > oneHour) {
      submissionTracker.delete(key);
    }
  }
  
  // Check current IP
  if (!submissionTracker.has(ip)) {
    submissionTracker.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  const tracker = submissionTracker.get(ip);
  if (now - tracker.timestamp > oneHour) {
    submissionTracker.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (tracker.count >= maxSubmissions) {
    return false;
  }
  
  tracker.count++;
  return true;
}

/**
 * Send email notification
 */
async function sendEmail(taggedData) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  
  if (!notificationEmail || notificationEmail === 'your-email@sali.com') {
    console.log('Notification email not configured');
    return { success: false, message: 'Email not configured' };
  }
  
  try {
    // Use Netlify's submission notification (automatic)
    // For custom SMTP, configure transporter
    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      const mailOptions = {
        from: `SALi Contact Forms <${process.env.SMTP_USER}>`,
        to: notificationEmail,
        subject: `[${taggedData.urgency.toUpperCase()}] New ${taggedData.formType} - Priority ${taggedData.priorityScore}/5`,
        html: generateEmailHTML(taggedData),
        text: generateEmailText(taggedData),
      };
      
      await transporter.sendMail(mailOptions);
      return { success: true, message: 'Email sent via SMTP' };
    }
    
    // If no SMTP configured, rely on Netlify's built-in notifications
    console.log('Using Netlify built-in form notifications');
    return { success: true, message: 'Using Netlify notifications' };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Main handler function
 */
export async function handler(event, context) {
  // Only handle POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
  
  try {
    // Parse form data
    const params = new URLSearchParams(event.body);
    const formData = {};
    for (const [key, value] of params.entries()) {
      formData[key] = sanitizeInput(value);
    }
    
    // Check honeypot
    if (formData['bot-field']) {
      console.log('Bot detected via honeypot');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Thank you for your submission' }),
      };
    }
    
    // Get client IP for rate limiting
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return {
        statusCode: 429,
        body: JSON.stringify({ 
          error: 'Too many submissions. Please try again later.',
        }),
      };
    }
    
    // Verify reCAPTCHA
    const recaptchaToken = formData['g-recaptcha-response'];
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    
    const threshold = parseFloat(process.env.RECAPTCHA_THRESHOLD || '0.5');
    if (!recaptchaResult.success || (recaptchaResult.score && recaptchaResult.score < threshold)) {
      console.log(`reCAPTCHA failed: score ${recaptchaResult.score}`);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Security verification failed. Please try again.',
        }),
      };
    }
    
    // Apply AI tagging
    const taggedData = await tagSubmission(formData);
    taggedData.spamScore = recaptchaResult.score || 1.0;
    
    // Send email notification
    const emailResult = await sendEmail(taggedData);
    
    // Log submission details
    console.log('Form submission processed:', {
      id: taggedData.submissionId,
      urgency: taggedData.urgency,
      priority: taggedData.priorityScore,
      location: taggedData.location,
      emailSent: emailResult.success,
    });
    
    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your submission. We will contact you shortly.',
        submissionId: taggedData.submissionId,
      }),
    };
    
  } catch (error) {
    console.error('Form handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An error occurred processing your submission. Please try again.',
      }),
    };
  }
}

export default handler;

