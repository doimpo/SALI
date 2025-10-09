# SALi Logo Update Instructions

## New Logo Files Required

The website has been updated to use the new official SALi logos. Please add the following logo files to the `/public/assets/images/logo/` directory:

### Required Logo Files:

1. **`sali-logo-blue.png`** - Primary blue logo (used by default in header)
2. **`sali-logo-white.png`** - White logo (used when header becomes sticky)
3. **`sali-logo-gold.png`** - Gold version (alternative option)
4. **`sali-logo-black.png`** - Black version (for specific use cases)

### Logo Usage Strategy:

- **Header Navigation**: Blue logo by default, white logo when sticky
- **Footer**: Blue logo for consistent branding
- **All Pages**: Consistent logo implementation across the website

### Logo Specifications:

- **Format**: PNG with transparent background
- **Header Size**: Max height 70px, width auto
- **Footer Size**: Max height 80px, width auto
- **Mobile Size**: Max height 50px, max width 150px

### Files Updated:

1. `/public/index.html` - Main homepage
2. `/public/about/founder.html` - Founder page
3. `/src/components/header.html` - Reusable header component
4. `/src/components/footer.html` - Reusable footer component
5. `/public/assets/css/style.css` - Main stylesheet
6. `/public/assets/css/sali-custom.css` - Custom SALi styles

### Implementation Notes:

- Logo switching behavior maintained (blue → white on sticky)
- Proper alt text added for accessibility
- Preload hints updated for performance
- Responsive sizing implemented
- Component-based architecture supports easy logo updates

Once the logo files are added to the directory, the website will automatically display the new SALi branding across all pages.
