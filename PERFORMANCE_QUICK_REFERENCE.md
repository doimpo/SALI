# Performance Testing - Quick Reference Card

## 🚀 Quick Start
```bash
npm run perf:test
```
Then open: **http://localhost:4321**

---

## ✅ Acceptance Criteria (Must Pass)

### Lighthouse Scores
- 🎯 **Performance**: 90+
- 🎯 **Accessibility**: 95+
- 🎯 **Best Practices**: 95+
- 🎯 **SEO**: 100

### Core Web Vitals
- 🎯 **LCP**: < 2.5s
- 🎯 **FID**: < 100ms
- 🎯 **CLS**: < 0.1

### Page Metrics
- 🎯 **Page Size**: < 3 MB
- 🎯 **Requests**: < 50
- 🎯 **Load Time**: < 3s

---

## 📝 Before Every Deployment Checklist

- [ ] Run `npm run perf:test`
- [ ] Lighthouse audit (Desktop)
- [ ] Lighthouse audit (Mobile)
- [ ] Test on homepage
- [ ] Test on one service page
- [ ] Test on one location page
- [ ] All scores above acceptance criteria
- [ ] No console errors
- [ ] All images loading correctly

---

## 🔍 How to Run Lighthouse

1. Open site in Chrome **Incognito** mode
2. Press `F12` (DevTools)
3. Click **"Lighthouse"** tab
4. Select all categories
5. Choose **Desktop** or **Mobile**
6. Click **"Analyze page load"**
7. Wait for results
8. **Score must be 90+** for all categories

---

## 📱 Pages to Test (Minimum)

| Page | URL | Priority |
|------|-----|----------|
| Homepage | `/` | HIGH |
| Services Index | `/services/` | HIGH |
| Service Detail | `/services/liver-transplantation/` | HIGH |
| Location | `/locations/hyderabad/` | MEDIUM |
| About | `/about/about-us/` | MEDIUM |

---

## 🐛 If Performance Fails

1. Check Network tab for large files
2. Look for Lighthouse opportunities
3. Fix issues listed in report
4. Rebuild and retest
5. Document what was fixed

---

## 📊 Network Tab Checklist

Open DevTools → Network tab:
- [ ] Disable cache
- [ ] Reload page
- [ ] Total size < 3 MB ✓
- [ ] Total requests < 50 ✓
- [ ] No 404 errors ✓
- [ ] All images optimized ✓

---

## ⚡ Common Quick Fixes

| Issue | Solution |
|-------|----------|
| Large images | Compress/resize before uploading |
| Slow LCP | Optimize hero image |
| Layout shift | Add width/height to images |
| Low accessibility | Add alt text, fix headings |
| Poor SEO | Check meta tags, titles |

---

## 🔄 Testing Frequency

| When | What to Test |
|------|-------------|
| **Before deploy** | Full Lighthouse audit |
| **Weekly** | Mobile + Desktop performance |
| **Monthly** | Full checklist + competitors |
| **After changes** | Regression test |

---

## 📞 Emergency Contacts

If performance suddenly drops:
1. Check latest deployed changes
2. Review build logs for errors
3. Compare with last known good metrics
4. Rollback if necessary

---

## 📚 Full Documentation

See `PERFORMANCE_TESTING_CHECKLIST.md` for complete details.

---

## Server Info

**Production Preview**: `http://localhost:4321` (or next available port)

**Note**: Your preview server is currently running on **http://localhost:4323**

