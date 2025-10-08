# Font Implementation Guide

## Overview
This document outlines the font implementation for the SALi website, using Brewery fonts as the primary brand fonts and Montserrat as the secondary font for body text.

## Font Hierarchy

### Primary Brand Fonts (Brewery)
- **BreweryNo2W01-Regular**: Used for all headings (h1-h6) and important focus text
- **Brewery No2 W06 Black**: Used for emphasis and important call-to-action text

### Secondary Font (Montserrat)
- **Montserrat**: Used for body text, paragraphs, and secondary content

## Implementation Details

### 1. Font Face Declarations
Added to `/src/styles/main.scss`:
```scss
@font-face {
  font-family: 'BreweryNo2W01-Regular';
  src: url('../assets/fonts/BreweryNo2W01-Regular.woff2') format('woff2'),
       url('../assets/fonts/BreweryNo2W01-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Brewery No2 W06 Black';
  src: url('../assets/fonts/Brewery No2 W06 Black It.woff2') format('woff2'),
       url('../assets/fonts/Brewery No2 W06 Black It.ttf') format('truetype');
  font-weight: 900;
  font-style: italic;
  font-display: swap;
}
```

### 2. SCSS Variables
Updated `/src/styles/_variables.scss`:
```scss
// Brand fonts - Brewery for headings and important elements
$font-brand: 'Brewery No2', 'Brewery', serif;
$font-brand-regular: 'BreweryNo2W01-Regular', 'Brewery No2', serif;
$font-brand-black: 'Brewery No2 W06 Black', 'Brewery No2', serif;

// Secondary font - Montserrat for body text and secondary elements
$font-primary: 'Montserrat', 'Poppins', sans-serif;
$font-secondary: 'Montserrat', 'Poppins', sans-serif;
```

### 3. Typography Styles
Updated heading styles in `/src/styles/main.scss`:
```scss
h1, h2, h3, h4, h5, h6 {
  font-family: $font-brand-regular;
  color: $text-primary;
  font-weight: 400;
  letter-spacing: -0.02em;
}

body {
  font-family: $font-secondary;
  color: $text-secondary;
  line-height: 1.6;
}
```

### 4. Utility Classes
Added utility classes for brand fonts:
```scss
/* Brand Font Utilities */
.font-brand { font-family: $font-brand-regular; }
.font-brand-black { font-family: $font-brand-black; }
.font-secondary { font-family: $font-secondary; }

/* Focus and Important Text */
.focus-text {
  font-family: $font-brand-regular;
  font-weight: 400;
  letter-spacing: -0.01em;
}

.important-text {
  font-family: $font-brand-black;
  font-weight: 900;
  font-style: italic;
}
```

### 5. Tailwind Configuration
Updated `/tailwind.config.js`:
```javascript
fontFamily: {
  sans: ["Montserrat", "Poppins", "sans-serif"],
  brand: ["BreweryNo2W01-Regular", "Brewery No2", "serif"],
  "brand-black": ["Brewery No2 W06 Black", "Brewery No2", "serif"],
  secondary: ["Montserrat", "Poppins", "sans-serif"]
}
```

## Usage Guidelines

### When to Use Brewery Fonts
- All headings (h1, h2, h3, h4, h5, h6)
- Brand name "SALi" and "South Asian Liver Institute"
- Important call-to-action text
- Section titles and feature titles
- Navigation brand elements

### When to Use Montserrat
- Body text and paragraphs
- Form labels and inputs
- Secondary information
- Footer content
- General UI elements

### CSS Classes Available
- `.font-brand` - Apply Brewery regular font
- `.font-brand-black` - Apply Brewery black italic font
- `.font-secondary` - Apply Montserrat font
- `.focus-text` - Apply brand font with focus styling
- `.important-text` - Apply black italic brand font for emphasis

## File Locations
- Font files: `/src/assets/fonts/`
- SCSS variables: `/src/styles/_variables.scss`
- Main styles: `/src/styles/main.scss`
- Tailwind config: `/tailwind.config.js`

## Browser Support
- WOFF2 format for modern browsers
- TTF fallback for older browsers
- Font-display: swap for optimal loading performance
