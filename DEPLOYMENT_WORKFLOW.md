# Deployment Workflow

This document outlines the **mandatory steps** for deploying changes to the SALi website.

---

## 🚨 Critical: Never Deploy Without Testing

**All deployments MUST pass performance testing.** This ensures our website maintains professional standards and provides excellent user experience.

---

## 📋 Pre-Deployment Checklist

### 1. Code Quality
- [ ] All features working as expected
- [ ] No console errors in browser
- [ ] Code reviewed (if team)
- [ ] Git commits are clean and descriptive

### 2. Performance Testing (REQUIRED)
```bash
npm run perf:test
```

**Wait for build to complete, then:**

- [ ] Open `http://localhost:4321` (or shown port)
- [ ] Run Lighthouse audit (F12 → Lighthouse)
- [ ] **Performance Score**: ≥ 90
- [ ] **Accessibility Score**: ≥ 95
- [ ] **Best Practices Score**: ≥ 95
- [ ] **SEO Score**: = 100
- [ ] Check Core Web Vitals (all "Good")
- [ ] Test on at least 3 pages:
  - [ ] Homepage
  - [ ] One service page
  - [ ] One location page

### 3. Mobile Testing
- [ ] Switch Lighthouse to "Mobile"
- [ ] Run audit again
- [ ] Mobile Performance ≥ 85 (slightly lower acceptable)
- [ ] Test on real mobile device if possible

### 4. Cross-Browser Check
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (recommended)
- [ ] Edge (recommended)

### 5. SEO & Meta Tags
- [ ] Page titles unique and descriptive
- [ ] Meta descriptions present
- [ ] Open Graph tags working
- [ ] Sitemap generated
- [ ] Robots.txt accessible

---

## 🚀 Deployment Steps

### Step 1: Run Performance Test
```bash
npm run perf:test
```

### Step 2: Verify All Metrics Pass
Use `PERFORMANCE_QUICK_REFERENCE.md` for quick checks.

### Step 3: Document Results
Record Lighthouse scores:

**Date**: _______________
**Pages Tested**:
- Homepage - Performance: ___ | A11y: ___ | BP: ___ | SEO: ___
- Services - Performance: ___ | A11y: ___ | BP: ___ | SEO: ___
- Location - Performance: ___ | A11y: ___ | BP: ___ | SEO: ___

### Step 4: Deploy to Netlify
```bash
npm run netlify:deploy:prod
```

Or use Netlify UI for git-based deployment.

### Step 5: Post-Deployment Verification
- [ ] Visit live site
- [ ] Verify deployed changes are live
- [ ] Run quick smoke test (navigation, forms)
- [ ] Check Google Analytics is tracking

### Step 6: Monitor
- [ ] Check Netlify deploy logs
- [ ] Monitor for errors (first 15 minutes)
- [ ] Review Google Analytics (next 24 hours)

---

## 🛑 If Performance Tests Fail

### DO NOT DEPLOY if:
- ❌ Any Lighthouse score below threshold
- ❌ Page load time > 5 seconds
- ❌ Console errors present
- ❌ Broken links or images
- ❌ Accessibility issues

### Fix First:
1. Identify the issue (Lighthouse will suggest fixes)
2. Fix the problem
3. Re-run performance tests
4. Only deploy when all tests pass

---

## 📊 Performance Benchmarks by Page Type

### Homepage (Most Critical)
- **Performance**: 90-100
- **Page Size**: < 2 MB
- **Load Time**: < 2.5s
- **LCP**: < 2.5s

### Service Pages
- **Performance**: 90-100
- **Page Size**: < 2.5 MB
- **Load Time**: < 3s
- **LCP**: < 3s

### Location Pages
- **Performance**: 85-100
- **Page Size**: < 3 MB
- **Load Time**: < 3s
- **LCP**: < 3s

---

## 🔄 Deployment Schedule

### Regular Deployments
- **Frequency**: As needed for features/fixes
- **Best Time**: Off-peak hours (early morning/late evening)
- **Avoid**: Peak traffic times (10 AM - 4 PM IST)

### Emergency Deployments
- Critical bugs: Deploy immediately after testing
- Security issues: Follow security protocol
- Minor fixes: Can wait for regular deployment window

---

## 📝 Deployment Log Template

Keep track of deployments:

```
Date: [DATE]
Time: [TIME]
Deployed By: [NAME]
Changes: [DESCRIPTION]

Performance Scores:
- Desktop Performance: [SCORE]
- Mobile Performance: [SCORE]
- Accessibility: [SCORE]
- SEO: [SCORE]

Issues: [NONE/LIST]
Rollback Plan: [IF NEEDED]
```

---

## 🆘 Rollback Procedure

If deployment causes issues:

### Immediate Rollback
```bash
# In Netlify UI:
1. Go to Deploys
2. Find previous working deploy
3. Click "Publish deploy"
```

### Or via CLI
```bash
netlify rollback
```

### After Rollback
1. Investigate issue locally
2. Fix problem
3. Re-test performance
4. Re-deploy

---

## 🎯 Quick Command Reference

```bash
# Test before deploy
npm run perf:test

# Build production
npm run build

# Preview production locally
npm run preview:astro

# Deploy to production
npm run netlify:deploy:prod

# Check deployment status
npm run netlify:status
```

---

## ✅ Final Pre-Deploy Checklist

Print this and check off before every deployment:

- [ ] Performance tests passed (90+ scores)
- [ ] Mobile tests passed (85+ scores)
- [ ] No console errors
- [ ] All pages tested (min. 3 pages)
- [ ] Cross-browser tested (Chrome + 1 other)
- [ ] SEO meta tags verified
- [ ] Images optimized and loading
- [ ] Forms working (if changed)
- [ ] Contact info correct
- [ ] Documentation updated (if needed)
- [ ] Team notified (if applicable)
- [ ] Deployment logged
- [ ] Ready to monitor post-deploy

---

## 📞 Support & Escalation

### If Stuck:
1. Check `PERFORMANCE_TESTING_CHECKLIST.md`
2. Review Lighthouse suggestions
3. Compare with previous working version
4. Check Netlify deploy logs

### Critical Issues:
- Document the issue
- Rollback if necessary
- Fix in development
- Re-test completely
- Deploy fix

---

## 🏆 Best Practices

1. **Always test locally first** with production build
2. **Never skip performance testing**
3. **Deploy during low-traffic times**
4. **Monitor after deployment**
5. **Keep deployment logs**
6. **Document all issues and fixes**
7. **Communicate with team**
8. **Have rollback plan ready**

---

## 📚 Related Documentation

- `PERFORMANCE_TESTING_CHECKLIST.md` - Full testing guide
- `PERFORMANCE_QUICK_REFERENCE.md` - Quick testing guide
- `README.md` - Project overview
- `NETLIFY_GUIDE.md` - Netlify-specific instructions

---

**Remember: A few minutes of testing prevents hours of firefighting! 🔥**

