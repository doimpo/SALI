# 🩺 South Asian Liver Institute (SALi) Website

> "Think Liver, Think SALi. We provide the best liver care."

Official website for South Asian Liver Institute - A premier healthcare facility specializing in liver care and treatment.

**🎉 STATUS: PRODUCTION READY** - All pages implemented, navigation fixed, fully integrated website.

---

## 🌐 About SALi

South Asian Liver Institute is dedicated to providing world-class liver care with cutting-edge technology and compassionate healthcare professionals.

**Contact Information:**
- 📞 Phone: +91-8070 670 670
- 🌐 Website: www.southasianliverinstitute.com
- 📧 Email: info@southasianliverinstitute.com

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Watch SCSS for changes (in another terminal)
npm run watch:sass

# Build for production
npm run build
```

The development server will start at `http://localhost:5173`

---

## 📁 Project Structure

```
SALi/
├── public/               # HTML pages
│   ├── index.html       # Homepage
│   ├── about-us.html    # About page
│   ├── services.html    # Services
│   ├── contact-us.html  # Contact
│   └── ...              # Other pages
├── src/
│   ├── assets/          # Images, fonts, JS, CSS
│   │   ├── images/
│   │   ├── fonts/
│   │   ├── js/
│   │   └── css/
│   ├── styles/          # SCSS files
│   │   ├── main.scss
│   │   └── _variables.scss
│   ├── components/      # Reusable HTML components
│   └── tailwind/        # Tailwind utilities
├── dist/                # Build output
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

---

## 🎨 Brand Colors

The website uses SALi's brand colors:

- **Primary Blue**: `#22336B`
- **Gold**: `#D1A648`

These are configured in both:
- `src/styles/_variables.scss` for SCSS
- `tailwind.config.js` for Tailwind utilities

---

## 🛠 Technologies

- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **SCSS** - Enhanced CSS with variables and mixins
- **PostCSS** - CSS transformations and autoprefixing
- **Vanilla JavaScript** - For interactions and animations

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview:astro` | Preview production build locally |
| `npm run perf:test` | **Run performance testing** (build + preview) |
| `npm run netlify:deploy:prod` | Deploy to production |

---

## ⚡ Performance Testing (Required)

**Performance testing MUST be run before every deployment** to ensure the website meets market standards.

### Quick Performance Test
```bash
npm run perf:test
# Then open http://localhost:4321 and run Lighthouse
```

### Acceptance Criteria
- ✅ **Lighthouse Performance**: 90+
- ✅ **Lighthouse Accessibility**: 95+
- ✅ **Lighthouse Best Practices**: 95+
- ✅ **Lighthouse SEO**: 100
- ✅ **Page Load Time**: < 3 seconds
- ✅ **Page Size**: < 3 MB
- ✅ **Core Web Vitals**: All "Good" (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### Testing Documentation
- 📋 **Quick Reference**: See `PERFORMANCE_QUICK_REFERENCE.md`
- 📚 **Full Checklist**: See `PERFORMANCE_TESTING_CHECKLIST.md`

### When to Test
- ✅ Before every deployment
- ✅ Weekly (ongoing monitoring)
- ✅ After any major code changes
- ✅ Monthly comprehensive audit

---

## 🌟 Features

### Design & UX
- ✅ Fully responsive design for all devices
- ✅ Modern UI with Tailwind CSS + Custom SCSS
- ✅ Consistent branding (SALi blue #22336B, gold #D1A648)
- ✅ Intuitive navigation structure
- ✅ Interactive elements (calculators, filters, accordions)

### Technical
- ✅ Built with Astro for optimal performance
- ✅ Fast page loads (<3 seconds)
- ✅ SEO optimized (meta tags, structured data, sitemaps)
- ✅ Accessibility focused (WCAG 2.1)
- ✅ Security headers configured
- ✅ Image lazy loading
- ✅ Code minification and compression

### Functionality
- ✅ Contact form with spam protection
- ✅ Appointment booking system
- ✅ Interactive liver health risk calculator
- ✅ Blog system with categories
- ✅ Video library integration
- ✅ Event calendar
- ✅ Admin dashboard for form submissions
- ✅ AI-powered form tagging

---

## 📄 Complete Site Structure (50+ Pages)

### Main Sections
- **Home** - Modern homepage with services showcase
- **About** (2 pages)
  - About SALi
  - Our Founder - Dr. Tom Cherian
- **Services** (10 pages)
  - Liver Transplantation, Cirrhosis, Fatty Liver, Liver Cancer
  - Gallbladder Cancer, Pancreas Cancer, Laparoscopic Surgery
  - Endoscopy, Interventional Treatments, ICU Facility
- **Programmes** (3 pages)
  - LICAP, Ascites Club, Liver Line
- **Locations** (13 pages)
  - Hyderabad, Mumbai, Kolkata, Nagpur, Visakhapatnam
  - And 8 more locations across India
- **Media** (2 pages)
  - News & Press Releases
  - Video Library
- **Resources** (3 pages)
  - Interactive Risk Calculator
  - Patient Guides
  - Educational Videos
- **Blog** - Article system with categories
- **Events/Calendar** - Health camps and events
- **Gallery** - Facilities and team photos
- **FAQs** - Comprehensive Q&A
- **Contact** - Full contact form and information
- **Appointment** - Online booking system
- **Legal** (3 pages)
  - Privacy Policy
  - Terms of Service
  - Medical Disclaimer
- **Admin Dashboard** - Submission management

---

## 🔧 Development

### Adding New Pages

1. Create HTML file in `public/` directory
2. Update navigation links
3. Add any new styles to `src/styles/`

### Modifying Styles

- **Tailwind classes**: Use directly in HTML
- **Custom SCSS**: Edit files in `src/styles/`
- **Brand colors**: Update in `_variables.scss` and `tailwind.config.js`

### Asset Management

- Images: `src/assets/images/`
- Fonts: `src/assets/fonts/`
- JavaScript: `src/assets/js/`

---

## 🚀 Deployment

### Prerequisites
1. Create `.env` file from `.env.example`:
   ```bash
   cp env.example .env
   ```
2. Configure environment variables:
   - `PUBLIC_GA_TRACKING_ID` - Google Analytics tracking ID
   - `PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA site key
   - `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key
   - `OPENAI_API_KEY` - OpenAI API key for form AI tagging
   - `NOTIFICATION_EMAIL` - Email for form submissions
   - Additional optional SMTP settings

### Build & Deploy
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   ```bash
   npm run netlify:deploy:prod
   ```

### Deployment Options
- ✅ **Netlify** (Recommended) - Configured with `netlify.toml`
- Vercel
- AWS S3 + CloudFront
- Traditional web hosting

### Post-Deployment
- Verify all forms work in production
- Test Google Analytics tracking
- Run Lighthouse performance audit
- Submit sitemap to search engines

---

## 📞 Support

For technical issues or questions about the website, contact the development team.

For medical inquiries, please call: **8070 670 670**

---

## 📝 License

© 2025 South Asian Liver Institute. All rights reserved.

---

**Think Liver, Think SALi. We provide the best liver care.** 🩺

