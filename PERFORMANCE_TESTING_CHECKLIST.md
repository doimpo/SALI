# Performance Testing Checklist

This checklist should be run **before every deployment** and **regularly** (weekly/monthly) to ensure the website maintains acceptable market standards.

## Quick Start
```bash
# Run the full performance test suite
npm run perf:test
```

## Market Standards Benchmarks

### Core Web Vitals (Google's Standards)
- ✅ **Largest Contentful Paint (LCP)**: < 2.5 seconds (Good)
- ✅ **First Input Delay (FID)**: < 100 milliseconds (Good)
- ✅ **Cumulative Layout Shift (CLS)**: < 0.1 (Good)
- ✅ **First Contentful Paint (FCP)**: < 1.8 seconds (Good)
- ✅ **Time to Interactive (TTI)**: < 3.8 seconds (Good)

### Lighthouse Scores (Target: 90+)
- ✅ **Performance**: 90-100 (Green)
- ✅ **Accessibility**: 90-100 (Green)
- ✅ **Best Practices**: 90-100 (Green)
- ✅ **SEO**: 90-100 (Green)

### Page Weight Benchmarks (Healthcare Industry)
- ✅ **Total Page Size**: < 3 MB (Good), < 1.5 MB (Excellent)
- ✅ **Total Requests**: < 50 (Good), < 30 (Excellent)
- ✅ **Time to First Byte**: < 600ms (Good), < 200ms (Excellent)

---

## Step-by-Step Testing Process

### 1. Build Production Version
```bash
npm run build
```

**Expected Results:**
- Build completes without errors
- Compression reports show savings
- No image format errors

---

### 2. Start Preview Server
```bash
npm run preview:astro
```

**Server runs at:** `http://localhost:4321` (or next available port)

---

### 3. Run Lighthouse Audit

#### Using Chrome DevTools:
1. Open the site in Chrome (Incognito mode recommended)
2. Press `F12` to open DevTools
3. Go to **"Lighthouse"** tab
4. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
   - Device: Desktop & Mobile
   - Mode: Navigation (Default)
5. Click **"Analyze page load"**

#### Target Scores (All pages):
| Page Type | Performance | Accessibility | Best Practices | SEO |
|-----------|-------------|---------------|----------------|-----|
| Homepage | 90+ | 95+ | 95+ | 100 |
| Service Pages | 90+ | 95+ | 95+ | 100 |
| Location Pages | 90+ | 95+ | 95+ | 100 |
| About Pages | 90+ | 95+ | 95+ | 100 |

**Pages to Test:**
- `/` (Homepage) - Most critical
- `/services/liver-transplantation/` - Heavy content page
- `/locations/hyderabad/` - Location page
- `/about/about-us/` - About page

---

### 4. Check Core Web Vitals

#### Using Chrome DevTools Performance Tab:
1. Open **Performance** tab in DevTools
2. Click **Record** (⏺)
3. Reload the page
4. Stop recording after page loads

**Check for:**
- **LCP**: First significant content element load time
- **CLS**: Layout stability (no jumping content)
- **FCP**: Time to first visual render

#### Using PageSpeed Insights (Online):
1. Visit: https://pagespeed.web.dev/
2. Enter your deployed URL (or test locally with ngrok)
3. Review Field Data & Lab Data

---

### 5. Network Performance Analysis

#### Using DevTools Network Tab:
1. Open **Network** tab (`F12` → Network)
2. Check **"Disable cache"**
3. Reload the page
4. Review metrics:

**Document these metrics:**
- [ ] **Total Page Weight**: _________ KB/MB
- [ ] **Total Requests**: _________
- [ ] **DOMContentLoaded**: _________ ms
- [ ] **Load Time**: _________ ms
- [ ] **Largest Resources**:
  - Images: _________ KB
  - JavaScript: _________ KB
  - CSS: _________ KB
  - Fonts: _________ KB

**Acceptance Criteria:**
- Total page weight < 3 MB
- Total requests < 50
- Load time < 3 seconds (on Fast 3G or better)

---

### 6. Mobile Performance Testing

#### Test on Different Network Conditions:
1. Open DevTools Network tab
2. Select network throttling:
   - ✅ **Slow 3G** (minimum acceptable)
   - ✅ **Fast 3G** (common in India)
   - ✅ **4G** (target performance)

**Acceptance Criteria:**
| Network | Load Time | LCP |
|---------|-----------|-----|
| Slow 3G | < 10s | < 5s |
| Fast 3G | < 5s | < 3s |
| 4G | < 3s | < 2.5s |

---

### 7. Image Optimization Check

**Verify in Network Tab:**
- [ ] All images are compressed (check file sizes)
- [ ] Images use modern formats (WebP where supported)
- [ ] No images over 500 KB
- [ ] Lazy loading is working (scroll test)

---

### 8. JavaScript & CSS Check

**Review in Network Tab:**
- [ ] CSS files are minified
- [ ] JavaScript files are minified
- [ ] No unused CSS (check Coverage tab)
- [ ] Scripts load asynchronously (no blocking)

**Coverage Check:**
1. Open **Coverage** tab (`Cmd+Shift+P` → "Show Coverage")
2. Reload page
3. Check unused code percentage
   - Target: < 30% unused code

---

### 9. Accessibility Testing

**Automated Checks:**
- [ ] Run axe DevTools (Chrome Extension)
- [ ] Check color contrast (4.5:1 minimum)
- [ ] Verify keyboard navigation works
- [ ] Test screen reader (VoiceOver/NVDA)

**Quick Checks:**
- [ ] Tab through entire page (logical order)
- [ ] All images have alt text
- [ ] Form labels are present
- [ ] Heading hierarchy is correct (H1 → H2 → H3)

---

### 10. SEO Technical Checks

**On-Page SEO:**
- [ ] Title tag present and unique (< 60 chars)
- [ ] Meta description present (< 160 chars)
- [ ] Canonical URL set correctly
- [ ] Open Graph tags present
- [ ] Schema.org markup present (JSON-LD)
- [ ] Robots.txt accessible
- [ ] Sitemap.xml accessible and valid

---

### 11. Browser Testing

**Test on Multiple Browsers:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

### 12. Performance Monitoring Tools

#### Recommended Tools:
1. **Google Lighthouse** (Built into Chrome)
2. **WebPageTest** (https://webpagetest.org)
3. **GTmetrix** (https://gtmetrix.com)
4. **Google Analytics** (Real User Monitoring)

---

## Performance Testing Schedule

### Before Every Deployment:
- ✅ Run production build
- ✅ Lighthouse audit (Desktop + Mobile)
- ✅ Core Web Vitals check
- ✅ Network performance review

### Weekly:
- ✅ Full performance audit
- ✅ Mobile performance testing
- ✅ Accessibility scan
- ✅ Review Google Analytics Core Web Vitals

### Monthly:
- ✅ Comprehensive browser testing
- ✅ Third-party script audit
- ✅ Image optimization review
- ✅ Competitor performance benchmarking

### After Major Changes:
- ✅ Full regression testing
- ✅ Before/after performance comparison
- ✅ Document performance impact

---

## Common Performance Issues & Solutions

### Issue: Slow Page Load
**Solutions:**
- Optimize images (compress, resize, WebP)
- Minify CSS/JS
- Enable compression (Gzip/Brotli)
- Use CDN for assets
- Implement caching headers

### Issue: Poor LCP
**Solutions:**
- Optimize hero images
- Preload critical resources
- Reduce server response time
- Remove render-blocking resources

### Issue: High CLS
**Solutions:**
- Set explicit image dimensions
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use CSS aspect-ratio for responsive images

### Issue: Low Lighthouse Score
**Solutions:**
- Remove unused JavaScript
- Defer non-critical CSS
- Optimize font loading
- Reduce third-party scripts
- Enable text compression

---

## Performance Regression Prevention

### Before Committing Code:
```bash
# Always test locally first
npm run build
npm run preview:astro
# Run Lighthouse audit
# Check metrics against benchmarks
```

### Git Hook (Optional):
Add pre-push hook to run performance checks automatically.

---

## Emergency Performance Issues

### If Performance Drops Below Standards:
1. **Identify**: Use Lighthouse and DevTools to find bottleneck
2. **Isolate**: Test page sections individually
3. **Fix**: Apply targeted optimization
4. **Verify**: Re-test after fix
5. **Document**: Record issue and solution

---

## Performance Metrics Dashboard

Track these metrics over time:

| Date | Page | Performance | LCP | FCP | CLS | Page Size | Requests |
|------|------|-------------|-----|-----|-----|-----------|----------|
| | | | | | | | |

---

## Quick Reference Commands

```bash
# Build production
npm run build

# Preview production build
npm run preview:astro

# Run all performance tests
npm run perf:test

# Check bundle sizes
npm run build -- --stats

# Analyze bundle (if needed)
npx vite-bundle-visualizer
```

---

## External Resources

- [Web.dev Performance Guides](https://web.dev/performance/)
- [Google Core Web Vitals](https://web.dev/vitals/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## Notes

- Always test on production build, never on dev server
- Test with cleared cache for accurate results
- Consider geographic location for server response time
- Monitor real user metrics via Google Analytics
- Keep this checklist updated with new standards

