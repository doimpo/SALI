# 🩺 South Asian Liver Institute (SALi) Website

> "Think Liver. Think SALi. Because life depends on it."

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
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run watch:sass` | Watch and compile SCSS files |

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

**Think Liver. Think SALi. Because life depends on it.** 🩺

