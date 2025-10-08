# 🚀 Netlify CLI Deployment Guide for SALi Website

## 📋 Prerequisites

Make sure you have:
- ✅ A Netlify account (sign up at https://netlify.com)
- ✅ netlify-cli installed (already done via npm)
- ✅ Your site built locally

---

## 🔧 Initial Setup (One-time)

### 1. Login to Netlify
```bash
npx netlify login
```
This will open your browser to authenticate with Netlify.

### 2. Link Your Project to Netlify

**Option A: Link to an existing site**
```bash
npm run netlify:link
```
Select your existing Netlify site from the list.

**Option B: Create a new site**
```bash
npx netlify init
```
Follow the prompts to create a new site on Netlify.

---

## 🚀 Deployment Commands

### Development Server (Local)
```bash
npm run netlify:dev
```
Starts Netlify Dev server with serverless functions support.

### Preview Deployment (Draft)
```bash
npm run netlify:deploy
```
Deploys to a unique draft URL for testing before going live.

### Production Deployment
```bash
npm run netlify:deploy:prod
```
Deploys directly to your production site URL.

### Check Status
```bash
npm run netlify:status
```
Shows information about your linked Netlify site.

---

## 📦 Typical Workflow

### For Production Deployment:
```bash
# 1. Build your site
npm run build

# 2. Deploy to production
npm run netlify:deploy:prod
```

### For Testing Before Production:
```bash
# 1. Build your site
npm run build

# 2. Deploy as draft/preview
npm run netlify:deploy

# Review the preview URL, then deploy to production when ready:
npm run netlify:deploy:prod
```

---

## ⚙️ Configuration

Your site is configured via `netlify.toml`:

- **Build Directory**: `dist/` (output from Vite)
- **Build Command**: `npm run build`
- **Dev Server**: Runs on port 5173
- **Security Headers**: Added for production
- **Cache Headers**: Optimized for static assets

---

## 🔐 Environment Variables

To add environment variables:

```bash
# Via CLI
npx netlify env:set VARIABLE_NAME "value"

# Via Netlify Dashboard
# Go to Site Settings > Environment Variables
```

---

## 🌐 Continuous Deployment (Optional)

For automatic deployments when you push to GitHub:

1. Connect your Git repository in the Netlify dashboard
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Production branch**: `main`

---

## 🛠️ Useful Commands

```bash
# Open site in browser
npx netlify open

# Open admin dashboard
npx netlify open:admin

# Open site settings
npx netlify open:site

# View deploy logs
npx netlify watch

# List all sites in your account
npx netlify sites:list
```

---

## 🐛 Troubleshooting

### MIME Type Error for JavaScript Files

**Problem**: Console errors like:
```
Refused to execute script from '...' because its MIME type ('text/html') is not executable
```

**Solution**: This issue has been fixed in `vite.config.js`. The build now correctly copies all assets from `public/assets/` to `dist/assets/`, preserving the folder structure that matches the HTML file references.

If you still see this error:
1. Delete the `dist/` folder
2. Run `npm run build` again
3. Verify files exist in `dist/assets/js/`
4. Redeploy with `npm run netlify:deploy:prod`

### Build Warnings

You may see warnings like:
```
<script src="assets/js/..."> can't be bundled without type="module" attribute
```

This is **expected and safe to ignore**. These are traditional scripts (not ES modules), and Vite correctly copies them as static assets rather than bundling them.

---

## 📞 Support

- Netlify Docs: https://docs.netlify.com
- Netlify CLI Docs: https://cli.netlify.com
- SALi Website: www.southasianliverinstitute.com

---

## 🎯 Quick Start Checklist

- [ ] Run `npx netlify login`
- [ ] Run `npm run netlify:link` (or `npx netlify init`)
- [ ] Run `npm run build` to build the site
- [ ] Run `npm run netlify:deploy` to test deployment
- [ ] Review the preview URL
- [ ] Run `npm run netlify:deploy:prod` to deploy to production
- [ ] ✅ Your site is live!

---

## 🔄 After Fixing Issues

If you've just fixed the MIME type errors:
1. Build the project: `npm run build`
2. Deploy to production: `npm run netlify:deploy:prod`
3. Clear your browser cache and reload the site
4. Check the browser console - errors should be gone!

---

**Remember**: Always test with a draft deployment before pushing to production! 🎉

