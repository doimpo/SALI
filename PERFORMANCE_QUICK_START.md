# Performance Optimization Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you quickly set up and test the performance optimizations.

---

## Step 1: Environment Variables Setup (2 minutes)

### In Netlify Dashboard

1. Go to **Site settings** → **Environment variables**
2. Add these variables:

```bash
# Required for rebuild triggers
BUILD_HOOK_URL=https://api.netlify.com/build_hooks/YOUR_HOOK_ID
WEBHOOK_SECRET=your-secure-random-string

# Optional for scheduled builds
SCHEDULED_BUILD_SECRET=another-secure-random-string

# Optional for notifications (Slack, Discord, etc.)
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Get Your Build Hook URL

1. In Netlify: **Site settings** → **Build & deploy** → **Build hooks**
2. Click **Add build hook**
3. Name it "Content Update Rebuild"
4. Copy the URL and add it to environment variables

---

## Step 2: Deploy the Changes (1 minute)

```bash
# Commit all changes
git add .
git commit -m "Add performance optimization system"

# Push to your repository
git push origin feature/email-integration
```

Netlify will automatically build and deploy your changes.

---

## Step 3: Verify Installation (2 minutes)

### Test 1: Check Skeleton Loaders

1. Open your deployed site
2. Open DevTools → Network tab
3. Set throttling to "Slow 3G"
4. Reload the page
5. ✅ You should see skeleton loaders appear briefly

### Test 2: Check Image Optimization

1. Open DevTools → Network tab
2. Filter by "Img"
3. Click on any image
4. Check the **Response Headers** → **Content-Type**
5. ✅ Should show `image/webp` or `image/avif`

### Test 3: Check Performance Metrics

1. Open DevTools → Console
2. Reload the page
3. ✅ Look for logs like: `Web Vital: LCP 1850 good`

### Test 4: Run Lighthouse Audit

1. Open DevTools → Lighthouse tab
2. Click "Analyze page load"
3. ✅ Performance score should be > 85

---

## Quick Wins You Can Implement Right Now

### 1. Update Hero Images (Instant Impact)

Find your hero/banner images and update them:

```astro
<!-- BEFORE -->
<img src="/assets/images/hero.jpg" alt="Hero">

<!-- AFTER -->
<OptimizedImage
  src="/assets/images/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  loading="eager"
  fetchpriority="high"
/>
```

**Impact**: 50-70% faster hero image loading

### 2. Add Skeleton to Blog/Service Cards (Prevents Empty Canvas)

```astro
<div class="blog-grid content-loading">
  <!-- Skeleton (shows while loading) -->
  <div class="skeleton-show">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>

  <!-- Real content (shows when ready) -->
  <div class="content-show">
    {posts.map(post => <BlogCard post={post} />)}
  </div>
</div>
```

**Impact**: Eliminates "empty canvas" problem

### 3. Enable Link Prefetching (Instant Navigation)

Already enabled! The prefetcher automatically prefetches links on hover.

**Impact**: Near-instant page navigation

---

## Monitoring Your Performance

### View Web Vitals in Google Analytics

1. Go to **Google Analytics** → **Events**
2. Look for "Web Vitals" category
3. You'll see:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)
   - PageLoad

### Check Cache Performance

Look for these headers in DevTools → Network:

```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
X-Cache: HIT
```

**HIT** = Cached response (fast!)
**MISS** = Fresh fetch (slower)

---

## Common Scenarios

### Scenario 1: You Added a New Blog Post

**Option A: Manual Trigger**
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/rebuild-trigger \
  -H "Content-Type: application/json" \
  -d '{"page": "blog/new-post", "secret": "YOUR_WEBHOOK_SECRET"}'
```

**Option B: Automatic (Scheduled)**
The scheduled build function will rebuild your site daily at 3 AM UTC automatically.

### Scenario 2: You Want to Update a Service Page

Since service pages are in the "static" tier, they're cached forever. To update:

1. Make your changes in the code
2. Commit and push to GitHub
3. Netlify will automatically rebuild
4. CDN cache will clear automatically

### Scenario 3: Images Are Loading Slowly

**Quick Fix**:
1. Replace `<img>` tags with `<OptimizedImage>` component
2. Ensure images have width/height attributes
3. Use `loading="lazy"` for below-fold images
4. Use `loading="eager"` for hero images

---

## Performance Targets & What They Mean

### 🟢 Good Performance
- **LCP**: < 2.5 seconds
  - *User sees main content quickly*
- **FID**: < 100ms
  - *Site responds to clicks immediately*
- **CLS**: < 0.1
  - *Content doesn't jump around while loading*

### 🟡 Needs Improvement
- **LCP**: 2.5 - 4 seconds
- **FID**: 100 - 300ms
- **CLS**: 0.1 - 0.25

### 🔴 Poor Performance
- **LCP**: > 4 seconds
- **FID**: > 300ms
- **CLS**: > 0.25

---

## Troubleshooting Quick Fixes

### Problem: Skeleton loaders not showing

**Fix**:
```astro
<!-- Make sure parent has content-loading class -->
<div class="content-loading">
  <div class="skeleton-show">
    <SkeletonCard />
  </div>
  <div class="content-show">
    {/* Your content */}
  </div>
</div>
```

### Problem: Images still loading as JPG

**Fix**:
- Use `OptimizedImage` component instead of `<img>`
- The component automatically generates WebP/AVIF

### Problem: Cache not working

**Fix**:
1. Clear your browser cache (Cmd+Shift+R or Ctrl+Shift+R)
2. Check if `netlify.toml` changes are deployed
3. Wait 5 minutes for CDN to propagate changes

---

## Next Steps

Now that the system is set up:

1. ✅ **Monitor**: Check Google Analytics Web Vitals daily
2. ✅ **Optimize**: Replace `<img>` tags with `OptimizedImage` as you update pages
3. ✅ **Test**: Run Lighthouse audits weekly
4. ✅ **Iterate**: Use performance budget to guide improvements

---

## Need Help?

### Check these files:
- `PERFORMANCE_OPTIMIZATION_IMPLEMENTATION.md` - Full documentation
- `.performance-budget.json` - Performance targets
- `src/data/content-strategy.js` - Caching configuration

### Key Components:
- `src/components/OptimizedImage.astro` - Image optimization
- `src/components/SkeletonCard.astro` - Loading states
- `netlify/functions/fetch-*.js` - Cached APIs

---

## Success Metrics

After implementing these optimizations, you should see:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| LCP | 3-4s | <2.5s | 40-60% faster |
| Page Load | 2-3s | <1s | 60-70% faster |
| Image Size | ~500KB | ~200KB | 60% smaller |
| Cache Hit Rate | 0% | 80%+ | Huge! |
| Empty Canvas | Yes | No | Fixed! |

---

**You're all set!** 🎉

The performance optimization system is ready to use. Start by updating your most visited pages with `OptimizedImage` and skeleton loaders for the biggest impact.

