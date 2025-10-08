# Git Changes Guide - Website Restructuring

## 📋 Summary
This document outlines the git operations needed to commit the website restructuring changes.

---

## 🗂️ New Directories Created
```bash
public/about/
public/services/
public/programmes/
public/locations/
public/media/
public/resources/
public/blog/
```

---

## ➕ New Files to Add (42+ files)

### Documentation Files
```bash
git add WEBSITE_STRUCTURE.md
git add RESTRUCTURE_SUMMARY.md
git add GIT_CHANGES.md
```

### About Section
```bash
git add public/about/about-us.html
git add public/about/founder.html
```

### Services Section (13 files)
```bash
git add public/services/liver-transplantation.html
git add public/services/liver-cirrhosis.html
git add public/services/fatty-liver.html
git add public/services/liver-cancer.html
git add public/services/gallbladder-cancer.html
git add public/services/pancreas-cancer.html
git add public/services/interventional-treatments.html
git add public/services/laparoscopic-surgery.html
git add public/services/endoscopy.html
git add public/services/in-patient-facility.html
git add public/services/ICU-facility.html
git add public/services/nutrition.html
git add public/services/physiotherapy.html
```

### Programmes Section (3 files)
```bash
git add public/programmes/licap.html
git add public/programmes/ascites-club.html
git add public/programmes/liver-line.html
```

### Locations Section (13 files)
```bash
git add public/locations/hyderabad.html
git add public/locations/mumbai.html
git add public/locations/kolkata.html
git add public/locations/nagpur.html
git add public/locations/vijayawada-guntur.html
git add public/locations/visakhapatnam.html
git add public/locations/anantapur.html
git add public/locations/jabalpur.html
git add public/locations/kakinada.html
git add public/locations/khammam.html
git add public/locations/kurnool.html
git add public/locations/rajahmundry.html
git add public/locations/rajkot.html
```

### Media Section (2 files)
```bash
git add public/media/index.html
git add public/media/videos.html
```

### Resources Section (3 files)
```bash
git add public/resources/risk-calculator.html
git add public/resources/guide.html
git add public/resources/videos.html
```

### Blog Section (2 files)
```bash
git add public/blog/index.html
git add public/blog/blog-slug.html
```

### Root Level New Files
```bash
git add public/calendar.html
git add public/privacy-policy.html
git add public/terms-of-service.html
git add public/contact.html
```

---

## 📝 Modified Files
```bash
git add public/index.html
git add public/sitemap.xml
git add SALI_website_setup.md
```

---

## 🗑️ Files to Remove/Stage for Deletion

The following files were deleted and should be staged:
```bash
git add medcity/home-classic.html
git add medcity/home-dentist.html
git add medcity/home-modern.html
git add medcity/home-pharmacy.html
git add medcity/shop-single-product.html
git add medcity/shop.html
git add medcity/shopping-cart.html
git add public/cart.html
git add public/home-classic.html
git add public/home-dentist.html
git add public/home-modern.html
git add public/home-pharmacy.html
git add public/shop-single-product.html
git add public/shop.html
```

Note: `contact-us.html` was renamed to `contact.html`

---

## 🚀 Recommended Git Commands

### Option 1: Stage All Changes at Once
```bash
# Stage all new, modified, and deleted files
git add -A

# Review what will be committed
git status

# Commit with descriptive message
git commit -m "feat: Complete website restructuring

- Reorganized website into 7 main sections
- Created 42+ new pages for services, locations, and programmes
- Updated navigation across all pages
- Generated comprehensive sitemap.xml
- Updated documentation
- Renamed contact-us.html to contact.html

Sections added:
- about/ (2 pages)
- services/ (13 pages)
- programmes/ (3 pages)
- locations/ (13 pages)
- media/ (2 pages)
- resources/ (3 pages)
- blog/ (2 pages)
- Additional root pages (calendar, privacy-policy, terms-of-service)

Total pages: 60+
See RESTRUCTURE_SUMMARY.md for complete details."
```

### Option 2: Stage Changes by Section
```bash
# Stage documentation changes
git add WEBSITE_STRUCTURE.md RESTRUCTURE_SUMMARY.md GIT_CHANGES.md SALI_website_setup.md

# Stage main files
git add public/index.html public/sitemap.xml

# Stage new directories
git add public/about/
git add public/services/
git add public/programmes/
git add public/locations/
git add public/media/
git add public/resources/
git add public/blog/

# Stage new root files
git add public/calendar.html public/privacy-policy.html public/terms-of-service.html public/contact.html

# Stage deletions
git add -u

# Review staged changes
git status

# Commit
git commit -m "feat: Complete website restructuring - see RESTRUCTURE_SUMMARY.md for details"
```

### Option 3: Interactive Staging (Review Each Change)
```bash
# Interactive staging - review each change
git add -p

# Or use interactive mode
git add -i

# Then commit
git commit -m "feat: Complete website restructuring"
```

---

## ✅ Post-Commit Checklist

After committing:
1. ✅ Push changes to remote: `git push origin main`
2. ✅ Verify deployment on staging/production
3. ✅ Test all navigation links
4. ✅ Check sitemap.xml accessibility
5. ✅ Verify mobile responsiveness
6. ✅ Test 404 redirects for old URLs
7. ✅ Update any external documentation
8. ✅ Notify content team about new pages

---

## 🔄 Setting Up Redirects (Optional but Recommended)

To maintain SEO and avoid broken links, consider setting up redirects:

### In Netlify (_redirects file):
```
/about-us.html           /about/about-us.html           301
/contact-us.html         /contact.html                  301
/blog.html              /blog/index.html               301
/blog-single-post.html  /blog/blog-slug.html          301
```

### In Apache (.htaccess):
```apache
Redirect 301 /about-us.html /about/about-us.html
Redirect 301 /contact-us.html /contact.html
Redirect 301 /blog.html /blog/index.html
```

### In Nginx:
```nginx
rewrite ^/about-us.html$ /about/about-us.html permanent;
rewrite ^/contact-us.html$ /contact.html permanent;
rewrite ^/blog.html$ /blog/index.html permanent;
```

---

## 📊 Git Statistics

### Changes Summary:
- **Files Added**: ~42+ new HTML files + 3 documentation files
- **Files Modified**: 2 (index.html, sitemap.xml, SALI_website_setup.md)
- **Files Deleted**: ~14 old/unused files
- **Directories Added**: 7 new directories
- **Total Changes**: ~60+ file operations

---

## 🎯 Branch Strategy Recommendation

### If working on a team:
```bash
# Create feature branch
git checkout -b feature/website-restructure

# After committing changes
git push origin feature/website-restructure

# Create pull request for review
# After approval, merge to main
```

### If working solo:
```bash
# Commit directly to main
git add -A
git commit -m "feat: Complete website restructuring"
git push origin main
```

---

## 📝 Notes

- All new pages use consistent template structure
- Navigation is identical across all pages
- All paths use relative URLs
- Asset paths are properly configured
- Sitemap includes all pages with proper priorities

---

**Last Updated**: October 8, 2025  
**Branch**: main  
**Status**: Ready to commit ✅
