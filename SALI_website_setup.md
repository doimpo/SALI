# 🩺 SALi Website — Tailwind + SCSS Development Setup

This repo is the starter template to build South Asian Liver Institute's (SALi) official website using Tailwind CSS, SCSS, and modular HTML files. Designed for use in Cursor IDE with Git + NPM workflow.

---

## 📁 Folder Structure

```bash
sali-website/
├── public/
│   ├── index.html
│   ├── about.html
│   └── ...
├── src/
│   ├── assets/
│   │   ├── images/
│   ├── styles/
│   │   ├── main.scss
│   │   └── _variables.scss
│   ├── components/
│   │   ├── header.html
│   │   └── footer.html
│   ├── tailwind/
│   │   └── tailwind.css
├── dist/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
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

> “Think Liver. Think SALi. Because life depends on it.”  
> www.southasianliverinstitute.com  
> 📞 8070 670 670

---
