# Contact Forms Quick Start Guide

**Get your SALi contact forms up and running in 15 minutes!**

---

## ✅ Pre-Flight Checklist

Before you begin, make sure you have:
- [ ] Netlify account with site deployed
- [ ] Google account (for reCAPTCHA)
- [ ] OpenAI API key (optional but recommended)
- [ ] Email address for notifications

---

## 🚀 5-Step Setup

### Step 1: Install Dependencies (2 minutes)

```bash
cd /path/to/SALi
npm install
```

This installs:
- `@netlify/functions`
- `openai`
- `nodemailer`
- `dotenv`

### Step 2: Configure Environment Variables (5 minutes)

Create a `.env` file in the project root:

```bash
cp env.example .env
```

Edit `.env` and fill in these **required** values:

```bash
# 1. Get reCAPTCHA keys from https://www.google.com/recaptcha/admin
PUBLIC_RECAPTCHA_SITE_KEY=6Lc...your-site-key
RECAPTCHA_SECRET_KEY=6Lc...your-secret-key

# 2. Your notification email
NOTIFICATION_EMAIL=your-email@domain.com

# 3. Admin dashboard credentials (choose strong password!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongPassword123!
```

**Optional but recommended:**

```bash
# Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...your-openai-key

# Get from Netlify Dashboard → Site Settings → General
NETLIFY_SITE_ID=your-site-id
# Get from Netlify Dashboard → User Settings → Applications → Personal Access Tokens
NETLIFY_FORM_API_KEY=your-netlify-token
```

### Step 3: Set Up Google reCAPTCHA v3 (3 minutes)

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Fill in:
   - **Label**: SALi Contact Forms
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**: 
     - `your-domain.com`
     - `your-netlify-subdomain.netlify.app`
     - `localhost` (for testing)
3. Click "Submit"
4. Copy **Site Key** → `PUBLIC_RECAPTCHA_SITE_KEY` in `.env`
5. Copy **Secret Key** → `RECAPTCHA_SECRET_KEY` in `.env`

### Step 4: Configure Netlify (3 minutes)

#### A. Add Environment Variables

1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Click "Add a variable"
3. Add each variable from your `.env` file (except local ones)
4. Important: Use `PUBLIC_RECAPTCHA_SITE_KEY` (not just `RECAPTCHA_SITE_KEY`) for the site key

#### B. Enable Netlify Forms

1. Go to Site Settings → Forms
2. Check "Enable form detection" (should be enabled by default)
3. Set up form notifications:
   - Click "Form notifications"
   - Click "Add notification"
   - Select "Email notification"
   - Enter your email
   - Save

### Step 5: Deploy! (2 minutes)

```bash
# Build the site
npm run build

# Deploy to Netlify
netlify deploy --prod

# Or if using Git integration, just push:
git add .
git commit -m "Add contact forms with AI tagging"
git push
```

---

## ✨ Testing Your Setup

### Test 1: Basic Form Submission

1. Go to your website homepage
2. Scroll to "Book An Appointment" form
3. Fill in all required fields
4. Click "Book Appointment"
5. ✅ You should see a success message
6. ✅ Check your email for notification (may take 1-2 minutes)

### Test 2: Spam Protection

**Honeypot Test:**
- Forms automatically include hidden honeypot fields
- Bots that fill all fields will be blocked

**reCAPTCHA Test:**
- Submit a form normally
- reCAPTCHA runs invisibly in background
- No user action needed

### Test 3: Admin Dashboard

1. Go to `https://your-domain.com/admin/login`
2. Enter username and password from `.env`
3. Click "Sign In"
4. ✅ You should see the submissions dashboard
5. ✅ Your test submission should appear

### Test 4: AI Tagging (if OpenAI configured)

1. Submit a form with urgent keywords: "emergency", "urgent", "critical"
2. Check email notification
3. ✅ Should show "URGENT" badge and high priority
4. ✅ AI summary should describe the inquiry

---

## 🎯 What's Working Now

After setup, you have:

✅ **Homepage appointment form** - Ready to receive bookings  
✅ **13 location-specific forms** - Each location has its own appointment form  
✅ **3 programme inquiry forms** - LICAP, Ascites Club, Liver Line  
✅ **Spam protection** - Honeypot + reCAPTCHA v3  
✅ **AI tagging** - Automatic categorization (if OpenAI configured)  
✅ **Email notifications** - Branded HTML emails with priority indicators  
✅ **Admin dashboard** - View and manage all submissions  
✅ **Rate limiting** - Max 5 submissions per IP per hour  

---

## 🔧 Quick Fixes

### "reCAPTCHA not loaded" error

**Solution**: 
1. Verify `PUBLIC_RECAPTCHA_SITE_KEY` (note the PUBLIC_ prefix)
2. Check domain is added in reCAPTCHA admin console
3. Clear browser cache
4. For localhost, use: `http://localhost:5173` (not `127.0.0.1`)

### Email not received

**Solutions**:
1. ✅ Check spam folder
2. ✅ Verify `NOTIFICATION_EMAIL` has no typos
3. ✅ Check Netlify Dashboard → Forms → Form notifications is configured
4. ✅ Wait 2-3 minutes (Netlify can be slow)
5. ✅ Check Netlify Functions logs for errors

### Admin login fails

**Solutions**:
1. ✅ Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` match your `.env`
2. ✅ Check Netlify environment variables are deployed
3. ✅ Redeploy after changing environment variables
4. ✅ Clear browser cache and try again

### Forms not submitting

**Solutions**:
1. ✅ Check browser console for JavaScript errors
2. ✅ Verify Netlify Forms is enabled in site settings
3. ✅ Try submitting from deployed site (not localhost)
4. ✅ Check form has all required fields filled

---

## 📊 Monitoring

### Check Form Submissions

**Netlify Dashboard:**
1. Go to your site in Netlify
2. Click "Forms" in the sidebar
3. See all submissions with timestamps

**Admin Dashboard:**
1. Go to `/admin/submissions` on your site
2. Filter and search submissions
3. Export to CSV

### Check Function Logs

1. Netlify Dashboard → Functions
2. Click on a function name
3. View real-time logs
4. Check for errors

### Email Delivery

- Check your notification email inbox
- Verify format looks correct
- Confirm AI tags are showing (if configured)
- Check priority badges

---

## 🎓 Learn More

- Full documentation: `CONTACT_FORMS_GUIDE.md`
- Form components: `src/components/`
- Functions: `netlify/functions/`
- Email templates: `netlify/functions/templates/`

---

## 🆘 Getting Help

### Common Issues

| Issue | Solution |
|-------|----------|
| Forms not visible | Clear cache, check component imports |
| reCAPTCHA errors | Verify keys, check domain settings |
| No emails | Check notification settings, verify email address |
| AI not working | Verify OpenAI key, check credits |
| Dashboard blank | Configure Netlify API credentials |

### Still Stuck?

1. Check `CONTACT_FORMS_GUIDE.md` troubleshooting section
2. Review Netlify Functions logs
3. Test with a fresh incognito browser window
4. Verify all environment variables are set correctly
5. Redeploy your site

---

## ✅ Success Checklist

Before going live, verify:

- [ ] All forms submit successfully
- [ ] Email notifications are received within 2 minutes
- [ ] Email formatting looks professional
- [ ] Admin dashboard accessible and showing submissions
- [ ] reCAPTCHA is invisible (no user action needed)
- [ ] Spam test: Honeypot blocks bot submissions
- [ ] Mobile responsive (test on phone)
- [ ] All 13 locations have working forms
- [ ] Programme forms working (LICAP, Ascites Club, Liver Line)
- [ ] Strong admin password set
- [ ] Production environment variables configured

---

## 🚀 You're Live!

Congratulations! Your contact form system is now active and ready to help patients connect with SALi.

**Monitor regularly:**
- Check email notifications daily
- Review submissions in admin dashboard
- Respond to urgent inquiries within 1-2 hours
- Export weekly reports for analysis

---

**Setup Time**: ~15 minutes  
**Status**: Production Ready  
**Version**: 1.0.0

*Think Liver. Think SALi. Because life depends on it.*

