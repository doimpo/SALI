# Contact Forms Implementation Guide

**South Asian Liver Institute - Contact Form System**  
*Comprehensive Email Workflow with AI Tagging and Spam Protection*

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Setup Instructions](#setup-instructions)
4. [Environment Variables](#environment-variables)
5. [Form Types](#form-types)
6. [Spam Protection](#spam-protection)
7. [AI Tagging System](#ai-tagging-system)
8. [Email Notifications](#email-notifications)
9. [Admin Dashboard](#admin-dashboard)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)
12. [Future Enhancements](#future-enhancements)

---

## Overview

The SALi contact form system provides a comprehensive solution for managing patient inquiries, appointment requests, and programme enrollment across all locations.

### Key Features

✅ **Multiple Form Types**: Appointment, Contact, Programme Inquiry  
✅ **Dual Spam Protection**: Honeypot fields + Google reCAPTCHA v3  
✅ **AI-Powered Tagging**: Automatic categorization and priority scoring  
✅ **Email Notifications**: Immediate notifications with formatted HTML emails  
✅ **Admin Dashboard**: Real-time viewing and management of submissions  
✅ **Rate Limiting**: IP-based submission limits to prevent abuse  
✅ **Location-Aware**: Context-sensitive forms for all 13 locations  

---

## System Architecture

```
User submits form
    ↓
Netlify Forms (captures data)
    ↓
Form Handler Function (netlify/functions/form-handler.js)
    ├→ Honeypot Check
    ├→ reCAPTCHA Verification
    ├→ Rate Limiting
    ├→ AI Tagging (netlify/functions/ai-tagger.js)
    └→ Email Notification (templates/email-notification.js)
         ↓
Admin Dashboard (view/manage submissions)
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

Required packages (already added to `package.json`):
- `@netlify/functions` - Netlify Functions runtime
- `openai` - OpenAI API for AI tagging
- `nodemailer` - Email sending (optional, for custom SMTP)
- `dotenv` - Environment variable management

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Fill in your actual values (see [Environment Variables](#environment-variables) section).

### 3. Set Up Google reCAPTCHA v3

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site with reCAPTCHA v3
3. Add your domain(s)
4. Copy the Site Key and Secret Key
5. Add to `.env` and Netlify environment variables

### 4. Configure Netlify

#### In Netlify Dashboard:
1. Go to Site Settings → Environment Variables
2. Add all variables from `.env`
3. Enable Netlify Forms under Site Settings → Forms
4. Enable form notifications under Site Settings → Forms → Form notifications

#### Deploy:
```bash
npm run build
netlify deploy --prod
```

### 5. Set Up OpenAI API (Optional but Recommended)

1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to environment variables
3. If not configured, system falls back to rule-based classification

---

## Environment Variables

### Required Variables

```bash
# Google reCAPTCHA v3 (https://www.google.com/recaptcha/admin)
PUBLIC_RECAPTCHA_SITE_KEY=your-site-key-here
RECAPTCHA_SECRET_KEY=your-secret-key-here

# Email Configuration
NOTIFICATION_EMAIL=contact@southasianliverinstitute.com

# Admin Dashboard Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
```

### Optional Variables

```bash
# OpenAI API for AI Tagging (recommended)
OPENAI_API_KEY=sk-your-openai-key-here

# Netlify API (for admin dashboard)
NETLIFY_SITE_ID=your-site-id
NETLIFY_FORM_API_KEY=your-api-key

# Custom SMTP (if not using Netlify's built-in)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Spam Protection Thresholds
RECAPTCHA_THRESHOLD=0.5
MAX_SUBMISSIONS_PER_IP_PER_HOUR=5
```

### Setting in Netlify

1. Go to Site Settings → Environment Variables
2. Click "Add a variable"
3. Add each variable one by one
4. Redeploy your site for changes to take effect

---

## Form Types

### 1. Appointment Form (`AppointmentForm.astro`)

**Used for**: Booking medical appointments at any location

**Fields**:
- Clinic/Location selection
- Doctor preference (optional)
- Full name *
- Email address *
- Phone number *
- Preferred date *
- Preferred time *
- Reason for visit / Medical concern (optional)

**Locations**:
- Homepage
- All 13 location pages (Hyderabad, Mumbai, Kolkata, etc.)

**Usage**:
```astro
<AppointmentForm 
  location="hyderabad"
  formTitle="Book An Appointment"
  formDescription="Schedule your consultation with our specialists"
  showClinicSelector={false}
  showDoctorSelector={true}
/>
```

### 2. Contact Form (`ContactForm.astro`)

**Used for**: General inquiries, questions, support requests

**Fields**:
- Full name *
- Email address *
- Phone number *
- Inquiry type * (dropdown)
- Message *

**Locations**:
- Can be added to any page
- Footer (optional)
- Dedicated contact page

**Usage**:
```astro
<ContactForm 
  formTitle="Get In Touch"
  formDescription="We'd love to hear from you"
  showSubject={true}
/>
```

### 3. Inquiry Form (`InquiryForm.astro`)

**Used for**: Programme-specific inquiries (LICAP, Ascites Club, Liver Line)

**Fields**:
- Full name *
- Email address *
- Phone number *
- Preferred location * (dropdown)
- Reason for inquiry * (dropdown)
- Message / Questions *

**Locations**:
- `/programmes/licap`
- `/programmes/ascites-club`
- `/programmes/liver-line`

**Usage**:
```astro
<InquiryForm 
  programme="LICAP"
  formTitle="Inquire About LICAP"
  formDescription="Learn more about our programme"
/>
```

---

## Spam Protection

### Layer 1: Honeypot Field

**How it works**:
- Hidden field (`bot-field`) added to all forms
- CSS hides it from human users
- Bots typically fill all fields
- Netlify automatically rejects submissions with honeypot filled

**Implementation**: Automatically included in all form components

### Layer 2: Google reCAPTCHA v3

**How it works**:
- Invisible to users (no clicking required)
- Generates a score (0.0 - 1.0) based on user behavior
- Score > threshold (default 0.5) = legitimate
- Score < threshold = likely spam/bot

**Configuration**:
```javascript
// netlify/functions/form-handler.js
const threshold = parseFloat(process.env.RECAPTCHA_THRESHOLD || '0.5');
```

**Testing reCAPTCHA**:
- Use special test keys from Google for development
- Production keys work on deployed domain only

### Layer 3: Rate Limiting

**How it works**:
- Tracks submissions per IP address
- Default: 5 submissions per hour per IP
- Prevents spam flooding

**Configuration**:
```bash
MAX_SUBMISSIONS_PER_IP_PER_HOUR=5
```

---

## AI Tagging System

### Overview

The AI tagging system analyzes each form submission and extracts:
- **Urgency**: urgent vs routine
- **Priority Score**: 1-5 (5 = immediate attention)
- **Service Area**: transplant, cirrhosis, cancer, etc.
- **Tags**: insurance-query, second-opinion, follow-up, etc.
- **Summary**: Brief description of the inquiry
- **Contact Preference**: phone, email, or either

### Implementation

**File**: `netlify/functions/ai-tagger.js`

**Two-tier approach**:
1. **AI Analysis** (OpenAI GPT-4): Sophisticated understanding
2. **Rule-Based Fallback**: Keyword matching if AI unavailable

### Urgency Keywords

```javascript
const URGENT_KEYWORDS = [
  'emergency', 'urgent', 'critical', 'immediate', 
  'severe', 'pain', 'bleeding', 'unconscious'
];
```

### Service Keywords

```javascript
const SERVICE_KEYWORDS = {
  transplant: ['transplant', 'liver transplant', 'donor', 'recipient'],
  cirrhosis: ['cirrhosis', 'fibrosis', 'scarring'],
  cancer: ['cancer', 'tumor', 'malignant', 'oncology'],
  'fatty-liver': ['fatty liver', 'NAFLD', 'NASH', 'steatosis'],
  endoscopy: ['endoscopy', 'ERCP', 'EGD', 'colonoscopy'],
  ICU: ['ICU', 'intensive care', 'critical care'],
};
```

### Example AI Response

```json
{
  "urgency": "urgent",
  "priorityScore": 5,
  "serviceArea": "transplant",
  "tags": ["insurance-query", "second-opinion"],
  "summary": "Patient inquiring about liver transplant eligibility with severe cirrhosis",
  "contactPreference": "phone"
}
```

---

## Email Notifications

### Email Templates

**File**: `netlify/functions/templates/email-notification.js`

### Features

✅ **Branded HTML Design**: SALi colors and logo  
✅ **Priority Badges**: Visual urgency indicators  
✅ **Structured Data**: Table format for easy reading  
✅ **AI Tags**: Display categorization results  
✅ **Response Time Guidance**: Recommended timeframes  
✅ **Mobile Responsive**: Looks great on all devices  
✅ **Plain Text Fallback**: For email clients without HTML support  

### Email Subject Format

```
[URGENT] New appointment - Priority 5/5
[ROUTINE] New contact - Priority 3/5
```

### Response Time Recommendations

- **Priority 5 or 4**: Within 1-2 hours
- **Priority 3**: Within 24 hours
- **Priority 2 or 1**: Within 48 hours

### Notification Configuration

**Netlify Built-in** (Default):
- Configure in Netlify Dashboard → Forms → Form notifications
- Add email address to receive notifications
- Automatic with no coding required

**Custom SMTP** (Advanced):
- Configure SMTP variables in environment
- Supports SendGrid, AWS SES, Mailgun, etc.
- More control over email format and delivery

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

---

## Admin Dashboard

### Accessing the Dashboard

1. Navigate to: `https://your-domain.com/admin/login`
2. Enter username and password (from environment variables)
3. View and manage submissions at `/admin/submissions`

### Features

📊 **Statistics Dashboard**:
- Total submissions
- Today's submissions
- Urgent submissions
- Week's submissions

🔍 **Advanced Filtering**:
- Search by name, email, phone
- Filter by form type
- Filter by urgency
- Filter by location

📋 **Submission Details**:
- Complete form data
- Submission timestamp
- AI tags and categorization
- Priority and urgency badges

📥 **Export**:
- Export to CSV
- Includes all fields and metadata
- Date-stamped filename

🔄 **Auto-Refresh**:
- Updates every 60 seconds
- Manual refresh button available

### Authentication

**Simple Basic Auth**:
- Username and password from environment variables
- Session-based (stored in sessionStorage)
- No database required
- Logout clears session

**Security Note**: For production, consider implementing:
- Netlify Identity (OAuth)
- JWT tokens
- Multi-factor authentication

### API Integration

Dashboard fetches data from:
```
/netlify/functions/get-submissions
```

**Authentication**: Basic Auth header required

**Rate Limits**: Respects Netlify API limits

---

## Testing

### Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access forms at http://localhost:5173
```

### Testing Forms

1. **Honeypot Test**:
   - Use browser dev tools
   - Unhide the `bot-field`
   - Fill it in
   - Submission should be silently accepted but filtered

2. **reCAPTCHA Test**:
   - Use Google's test keys for development
   - Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
   - Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`
   - Always returns success score of 1.0

3. **AI Tagging Test**:
   - Submit form with urgent keywords ("emergency", "critical")
   - Check email for priority badge and urgency classification
   - Test different service keywords

4. **Rate Limiting Test**:
   - Submit 6+ forms rapidly
   - 6th submission should be rejected with 429 error

### Testing Email Delivery

1. **Netlify Forms Notifications**:
   - Check Netlify Dashboard → Forms → Submissions
   - Verify notification email settings
   - Submit test form
   - Check inbox (may take 1-2 minutes)

2. **Custom SMTP**:
   - Configure test SMTP credentials
   - Use SendGrid's test mode
   - Monitor delivery logs

### Testing Admin Dashboard

```bash
# Set test credentials
ADMIN_USERNAME=testadmin
ADMIN_PASSWORD=testpass123

# Access /admin/login
# Submit forms
# Verify they appear in dashboard
```

---

## Troubleshooting

### Forms Not Submitting

**Symptom**: Form submits but no confirmation message

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify Netlify Forms is enabled in site settings
3. Ensure `data-netlify="true"` attribute is present
4. Check form has `name` attribute
5. Verify all form fields have `name` attributes

### reCAPTCHA Not Working

**Symptom**: "Security verification failed" error

**Solutions**:
1. Verify `PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
2. Check domain is added in reCAPTCHA admin console
3. For localhost testing, use test keys
4. Check browser console for reCAPTCHA errors
5. Ensure reCAPTCHA script is loading (check Network tab)

### Email Not Received

**Symptom**: Form submitted successfully but no email

**Solutions**:
1. Check spam/junk folder
2. Verify `NOTIFICATION_EMAIL` is set correctly
3. Check Netlify Forms notification settings
4. If using custom SMTP, verify credentials
5. Check Netlify Functions logs for errors
6. Verify SMTP rate limits not exceeded

### AI Tagging Not Working

**Symptom**: No AI tags in email or always shows "routine"

**Solutions**:
1. Verify `OPENAI_API_KEY` is set correctly
2. Check OpenAI API credits/quota
3. System falls back to rule-based classification
4. Check function logs for AI errors
5. Verify internet connectivity from Netlify Functions

### Admin Dashboard Login Fails

**Symptom**: "Invalid credentials" error

**Solutions**:
1. Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
2. Check for typos in credentials
3. Clear browser cache and sessionStorage
4. Check Netlify environment variables are deployed
5. Redeploy site after changing environment variables

### Dashboard Shows No Submissions

**Symptom**: Dashboard loads but shows empty state

**Solutions**:
1. Verify `NETLIFY_SITE_ID` is correct
2. Check `NETLIFY_FORM_API_KEY` has correct permissions
3. Submit a test form to verify forms are working
4. Check Network tab for API errors
5. Verify authentication is working

---

## Future Enhancements

### Phase 2 Features

#### Multi-Email Routing
- Route appointments to location-specific emails
- Send service inquiries to department heads
- CC relevant team members based on urgency

#### SMS Notifications
- Immediate SMS for urgent submissions
- Integration with Twilio or AWS SNS
- Phone verification for appointments

#### Slack Integration
- Real-time alerts to Slack channels
- Urgent notifications to on-call team
- Daily submission summaries

#### CRM Integration
- Sync submissions to Salesforce/HubSpot
- Auto-create leads and contacts
- Track follow-up activities

#### Automated Responses
- Immediate thank-you emails to patients
- Appointment confirmation emails
- Follow-up reminder emails

#### Advanced Analytics
- Submission trends over time
- Location-based analytics
- Conversion funnel tracking
- Response time metrics

#### Patient Portal
- Patients can check submission status
- Upload additional documents
- Direct messaging with staff

#### Appointment Scheduling
- Real-time availability checking
- Calendar integration
- Automated booking confirmations
- Reminder notifications

#### Multi-Language Support
- Forms in regional languages
- Auto-detection based on location
- Translation of email notifications

---

## Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files to git
- ✅ Use different keys for dev/production
- ✅ Rotate API keys regularly
- ✅ Use Netlify's encrypted environment variables

### Form Security
- ✅ Always validate on server-side
- ✅ Sanitize all inputs
- ✅ Implement rate limiting
- ✅ Use HTTPS only (Netlify enforces this)

### Admin Dashboard
- ✅ Strong passwords (12+ characters)
- ✅ Consider implementing 2FA
- ✅ Regular security audits
- ✅ Monitor access logs

### Data Privacy
- ✅ GDPR compliant data handling
- ✅ Clear privacy policy
- ✅ Data retention policies
- ✅ Secure data storage

---

## Support

### Documentation
- [Netlify Forms Docs](https://docs.netlify.com/forms/setup/)
- [reCAPTCHA v3 Docs](https://developers.google.com/recaptcha/docs/v3)
- [OpenAI API Docs](https://platform.openai.com/docs)

### Monitoring
- Check Netlify Functions logs for errors
- Monitor email delivery rates
- Track form completion rates
- Set up alerts for failed submissions

### Maintenance
- Review spam filter effectiveness monthly
- Update AI prompts based on results
- Check and respond to submissions daily
- Update location/service options as needed

---

## Changelog

### Version 1.0.0 (October 2025)
- ✅ Initial implementation
- ✅ Three form types (Appointment, Contact, Inquiry)
- ✅ Dual spam protection (honeypot + reCAPTCHA v3)
- ✅ AI-powered tagging with OpenAI
- ✅ Email notifications with HTML templates
- ✅ Admin dashboard with filtering
- ✅ Rate limiting and security features
- ✅ Deployed across all 13 locations
- ✅ Programme inquiry forms

---

**Last Updated**: October 15, 2025  
**Version**: 1.0.0  
**Contact**: SALi Development Team

---

*Think Liver. Think SALi. Because life depends on it.*

