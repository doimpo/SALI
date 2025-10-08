# 🩺 SALi Website — Tailwind + SCSS Development Setup

This repo is the starter template to build South Asian Liver Institute's (SALi) official website using Tailwind CSS, SCSS, and modular HTML files. Designed for use in Cursor IDE with Git + NPM workflow.

---

## 📁 Folder Structure

```bash
SALi/
├── public/                          # Production-ready files
│   ├── index.html                   # Homepage
│   ├── about/                       # About section
│   │   ├── about-us.html
│   │   └── founder.html
│   ├── services/                    # 13 service pages
│   │   ├── liver-transplantation.html
│   │   ├── liver-cirrhosis.html
│   │   └── ... (11 more)
│   ├── programmes/                  # Programme pages
│   │   ├── licap.html
│   │   ├── ascites-club.html
│   │   └── liver-line.html
│   ├── locations/                   # 13 location pages
│   │   ├── hyderabad.html
│   │   ├── mumbai.html
│   │   └── ... (11 more)
│   ├── media/                       # Media section
│   │   ├── index.html
│   │   └── videos.html
│   ├── resources/                   # Resources section
│   │   ├── risk-calculator.html
│   │   ├── guide.html
│   │   └── videos.html
│   ├── blog/                        # Blog section
│   │   ├── index.html
│   │   └── blog-slug.html
│   ├── calendar.html                # Events calendar
│   ├── contact.html                 # Contact page
│   ├── appointment.html             # Booking page
│   ├── gallery.html                 # Gallery
│   ├── faqs.html                    # FAQs
│   ├── privacy-policy.html          # Privacy policy
│   ├── terms-of-service.html        # Terms of service
│   ├── sitemap.xml                  # SEO sitemap
│   └── assets/                      # Static assets
│       ├── css/
│       ├── js/
│       ├── images/
│       └── fonts/
├── src/                             # Source files
│   ├── assets/
│   ├── styles/
│   │   ├── main.scss
│   │   └── _variables.scss
│   ├── components/
│   └── tailwind/
├── dist/                            # Build output
├── medcity/                         # Original template files
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml                     # Netlify config
├── WEBSITE_STRUCTURE.md             # Complete site structure
└── README.md
```

---

## 🧱 Technologies Used

- **Tailwind CSS**: Utility-first CSS framework
- **SCSS**: Modular and maintainable styling
- **Vite**: Fast dev server and build tool
- **PostCSS**: Tailwind and autoprefixing
- **Sass CLI**: Compiling SCSS to CSS
- **Git**: Version control
- **Cursor IDE**: Dev environment

---

## 🚀 Setup Instructions

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Watch SCSS file for changes**
```bash
npm run watch:sass
```

4. **Build for production**
```bash
npm run build
```

---

## 🎨 Branding Tokens (SCSS)

```scss
$primary-color: #22336B;
$gold-color: #D1A648;
```

Add more variables as needed in `_variables.scss`.

---

## 🌐 Tailwind Configuration

Located in `tailwind.config.js`:

```js
content: ["./public/**/*.html", "./src/**/*.{js,html}"],
theme: {
  extend: {
    colors: {
      primary: "#22336B",
      gold: "#D1A648"
    },
    fontFamily: {
      sans: ["Montserrat", "Poppins", "sans-serif"]
    }
  }
}
```

---

## 📦 Scripts in `package.json`

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "watch:sass": "sass src/styles/main.scss dist/css/main.css --watch"
}
```

---

## 🛠 Recommended Extensions for Cursor

- Tailwind CSS IntelliSense
- Live Server
- SCSS Formatter
- GitLens

---

## ✅ Git Best Practices

- Create `main` or `dev` branch
- Commit changes frequently
- Push to GitHub or GitLab
- Use `.gitignore` to exclude `/dist`, `node_modules`

---

## 📞 Project Contact

> "Think Liver. Think SALi. Because life depends on it."  
> www.southasianliverinstitute.com  
> 📞 8070 670 670

---

## 🗂️ Website Structure

The website is organized into the following main sections:

### Main Sections
1. **About** (`/about/`) - About SALi and founder information
2. **Services** (`/services/`) - 13 specialized liver care services
3. **Programmes** (`/programmes/`) - LICAP, Ascites Club, Liver Line
4. **Locations** (`/locations/`) - 13 locations across India
5. **Media** (`/media/`) - News and video content
6. **Resources** (`/resources/`) - Patient tools and guides
7. **Blog** (`/blog/`) - Blog posts and articles

### Key Pages
- Homepage: `index.html`
- Contact: `contact.html`
- Calendar: `calendar.html`
- Appointment: `appointment.html`
- Gallery: `gallery.html`
- FAQs: `faqs.html`

For detailed structure, see `WEBSITE_STRUCTURE.md`

---
