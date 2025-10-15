# 🩺 South Asian Liver Institute (SALi) Website

> "Think Liver, Think SALi. We provide the best liver care."

Official website for South Asian Liver Institute - A premier healthcare facility specializing in liver care and treatment.

---

## 🌐 About SALi

South Asian Liver Institute is dedicated to providing world-class liver care with cutting-edge technology and compassionate healthcare professionals.

**Contact Information:**
- 📞 Phone: 8070 670 670
- 🌐 Website: www.southasianliverinstitute.com

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

- ✅ Responsive design for all devices
- ✅ Modern UI with Tailwind CSS
- ✅ Custom SCSS styling
- ✅ Fast page loads with Vite
- ✅ SEO optimized
- ✅ Accessibility focused

---

## 📄 Pages

- Home
- About Us
- Services
- Departments
- Doctors/Team
- Appointments
- Gallery
- Blog
- Contact Us
- FAQs

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

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service:
   - Netlify
   - Vercel
   - AWS S3
   - Traditional web hosting

---

## 📞 Support

For technical issues or questions about the website, contact the development team.

For medical inquiries, please call: **8070 670 670**

---

## 📝 License

© 2025 South Asian Liver Institute. All rights reserved.

---

**Think Liver, Think SALi. We provide the best liver care.** 🩺

