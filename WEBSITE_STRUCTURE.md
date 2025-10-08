# 🩺 SALi Website Structure

**South Asian Liver Institute (SALi)**  
*Think Liver. Think SALi. Because life depends on it.*

---

## 📁 Complete Website Structure

```
/
├── index.html                              # Homepage
├── about/
│   ├── about-us.html                       # About SALi
│   └── founder.html                        # Founder profile
├── services/
│   ├── liver-transplantation.html          # Liver transplantation services
│   ├── liver-cirrhosis.html                # Liver cirrhosis treatment
│   ├── fatty-liver.html                    # Fatty liver disease management
│   ├── liver-cancer.html                   # Liver cancer treatment
│   ├── gallbladder-cancer.html             # Gallbladder cancer treatment
│   ├── pancreas-cancer.html                # Pancreas cancer treatment
│   ├── interventional-treatments.html      # Interventional treatments
│   ├── laparoscopic-surgery.html           # Laparoscopic surgery services
│   ├── endoscopy.html                      # Endoscopy services
│   ├── in-patient-facility.html            # In-patient facility info
│   ├── ICU-facility.html                   # ICU facility info
│   ├── nutrition.html                      # Nutrition services
│   └── physiotherapy.html                  # Physiotherapy services
├── programmes/
│   ├── licap.html                          # LICAP programme
│   ├── ascites-club.html                   # Ascites Club programme
│   └── liver-line.html                     # Liver Line programme
├── locations/
│   ├── hyderabad.html                      # Hyderabad location
│   ├── mumbai.html                         # Mumbai location
│   ├── kolkata.html                        # Kolkata location
│   ├── nagpur.html                         # Nagpur location
│   ├── vijayawada-guntur.html              # Vijayawada-Guntur location
│   ├── visakhapatnam.html                  # Visakhapatnam location
│   ├── anantapur.html                      # Anantapur location
│   ├── jabalpur.html                       # Jabalpur location
│   ├── kakinada.html                       # Kakinada location
│   ├── khammam.html                        # Khammam location
│   ├── kurnool.html                        # Kurnool location
│   ├── rajahmundry.html                    # Rajahmundry location
│   └── rajkot.html                         # Rajkot location
├── media/
│   ├── index.html                          # News & media coverage
│   └── videos.html                         # Video library
├── resources/
│   ├── risk-calculator.html                # Liver disease risk calculator
│   ├── guide.html                          # Patient guides
│   └── videos.html                         # Educational videos
├── calendar.html                           # Events & appointments calendar
├── blog/
│   ├── index.html                          # Blog listing page
│   └── blog-slug.html                      # Individual blog post (template)
├── contact.html                            # Contact page
├── appointment.html                        # Book appointment page
├── gallery.html                            # Image gallery
├── faqs.html                               # Frequently asked questions
├── privacy-policy.html                     # Privacy policy
├── terms-of-service.html                   # Terms of service
└── sitemap.xml                             # XML sitemap for SEO
```

---

## 🎯 Navigation Structure

### Main Navigation Menu

1. **Home** → `/index.html`
2. **About** (Dropdown)
   - About SALi → `/about/about-us.html`
   - Our Founder → `/about/founder.html`
3. **Services** (Dropdown)
   - Liver Transplantation → `/services/liver-transplantation.html`
   - Liver Cirrhosis → `/services/liver-cirrhosis.html`
   - Fatty Liver → `/services/fatty-liver.html`
   - Liver Cancer → `/services/liver-cancer.html`
   - Gallbladder Cancer → `/services/gallbladder-cancer.html`
   - Pancreas Cancer → `/services/pancreas-cancer.html`
   - Interventional Treatments → `/services/interventional-treatments.html`
   - Laparoscopic Surgery → `/services/laparoscopic-surgery.html`
   - Endoscopy → `/services/endoscopy.html`
   - In-Patient Facility → `/services/in-patient-facility.html`
   - ICU Facility → `/services/ICU-facility.html`
   - Nutrition → `/services/nutrition.html`
   - Physiotherapy → `/services/physiotherapy.html`
4. **Programmes** (Dropdown)
   - LICAP → `/programmes/licap.html`
   - Ascites Club → `/programmes/ascites-club.html`
   - Liver Line → `/programmes/liver-line.html`
5. **Locations** (Dropdown)
   - Hyderabad → `/locations/hyderabad.html`
   - Mumbai → `/locations/mumbai.html`
   - Kolkata → `/locations/kolkata.html`
   - Nagpur → `/locations/nagpur.html`
   - And 9 more locations...
6. **Media** (Dropdown)
   - News → `/media/index.html`
   - Videos → `/media/videos.html`
7. **Resources** (Dropdown)
   - Risk Calculator → `/resources/risk-calculator.html`
   - Patient Guide → `/resources/guide.html`
   - Videos → `/resources/videos.html`
8. **Calendar** → `/calendar.html`
9. **Blog** → `/blog/index.html`
10. **Contact** → `/contact.html`

---

## 📝 Page Types & Templates

### Standard Page Sections
Each page typically includes:
- **Header**: Logo, emergency contact, navigation menu
- **Page Title Banner**: Breadcrumb navigation
- **Main Content Area**: Page-specific content
- **Footer**: Quick links, contact info, social media

### Key Page Categories

1. **About Pages** (`/about/`)
   - About SALi organization
   - Founder & leadership profiles

2. **Service Pages** (`/services/`)
   - 13 specialized liver care services
   - Each with detailed treatment information

3. **Programme Pages** (`/programmes/`)
   - LICAP (Liver Care Programme)
   - Ascites Club
   - Liver Line helpline

4. **Location Pages** (`/locations/`)
   - 13 locations across India
   - Each with address, contact, facilities

5. **Media Pages** (`/media/`)
   - News & press releases
   - Video gallery

6. **Resource Pages** (`/resources/`)
   - Interactive tools
   - Educational materials
   - Video resources

---

## 🔗 Important Links

### Contact Information
- **Emergency Line**: 8070 670 670
- **Website**: www.southasianliverinstitute.com
- **Tagline**: Think Liver. Think SALi. Because life depends on it.

### Social Media
- Facebook
- Instagram
- Twitter

---

## 🚀 Development Notes

### File Organization
- All HTML files use relative paths for assets
- Assets located in `/assets/` directory
- Consistent navigation across all pages
- SEO-optimized with meta descriptions

### Asset Paths
- CSS: `/assets/css/`
- JavaScript: `/assets/js/`
- Images: `/assets/images/`
- Fonts: `/assets/fonts/`

### Navigation Implementation
- Dropdown menus for major sections
- Mobile-responsive hamburger menu
- Breadcrumb navigation on all pages
- Active state indicators

---

## 📊 SEO & Analytics

### Sitemap
- XML sitemap at `/sitemap.xml`
- Updated: October 8, 2025
- Includes all 60+ pages
- Priority and change frequency set

### Page Priorities
- Homepage: 1.0
- Main sections: 0.9
- Service pages: 0.8-0.9
- Location pages: 0.7-0.8
- Resource pages: 0.7

---

## 🔄 Recent Changes (October 2025)

### Structure Reorganization
✅ Created organized directory structure with 7 main sections
✅ Moved from flat structure to hierarchical folders
✅ Created 13 service pages for specialized treatments
✅ Added 13 location pages across India
✅ Implemented 3 programme pages
✅ Created media and resources sections
✅ Updated all navigation menus site-wide
✅ Generated comprehensive sitemap.xml
✅ Renamed `contact-us.html` to `contact.html`
✅ Moved blog to `/blog/` directory

### Files Created
- Total pages: 60+
- New directories: 6 (about, services, programmes, locations, media, resources, blog)
- Service pages: 13
- Location pages: 13
- Programme pages: 3
- Media pages: 2
- Resource pages: 3

---

## 📞 Support

For website updates or technical support, contact the SALi web development team.

**Last Updated**: October 8, 2025
