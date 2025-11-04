# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static photography portfolio website for Butalia Media Photography, specializing in family portraits, headshots, kids' portraits, and event photography in Los Angeles. The site is deployed to GitHub Pages with a custom domain (photography.butaliamedia.com).

## Architecture

### Site Structure

The website uses a single-page application (SPA) architecture with multiple HTML files:

- **index.html**: Main homepage with full portfolio showcase (sections: home, about, services, portfolio, pricing, contact)
- **about.html**: Standalone about page
- **service-fam.html**: Family services page
- **contact.html**: Contact page (though main site uses Google Forms)
- **butaliamoments.html**: Portfolio gallery page for recent work
- **beckFamFun2024.html**: Specific client portfolio page

### Template Structure

- **modak-template-org/**: Original template files (reference only, not actively used)
- Site is built on the Modak photography template with Bootstrap framework

### Asset Organization

```
assets/
├── css/          # Bootstrap, plugins, custom styles, responsive, color schemes
├── fonts/        # Icon fonts
├── images/       # Logo, backgrounds, portfolio images, icons
└── js/           # jQuery, Bootstrap, plugins, custom scripts

butaliamoments/
└── 2024/         # Year-organized portfolio photos
    ├── z_family/
    ├── z_familyPhotos/
    ├── z_kids/
    └── z_ShaileeSimran/
```

### Key Dependencies

- **Bootstrap** (via bootstrap.min.css/js)
- **jQuery** (jquery.min.js)
- **Custom plugins** (plugins.js, plugins.css)
- **Custom scripts** (custom.js)

All CSS/JS files are loaded from the `assets/` directory with version query parameters on some pages (e.g., `?v=20250101`) for cache busting.

## Development Workflow

### Making Changes

1. **CSS Updates**: Edit files in `assets/css/`
   - `style.css`: Main styles
   - `responsive.css`: Mobile/responsive styles
   - `color.css`: Color scheme overrides

2. **Adding Portfolio Images**:
   - Add images to `assets/images/` or `butaliamoments/YYYY/category/`
   - Update HTML img tags in relevant portfolio sections

3. **Content Updates**: Edit HTML files directly (no build process)

### Cache Busting

When updating CSS/JS on `butaliamoments.html`, increment the version parameter:
```html
<link rel="stylesheet" href="assets/css/style.css?v=20250101">
```

The butaliamoments.html page also includes cache-control meta tags:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

### Testing Locally

Open HTML files directly in a browser or use a simple HTTP server:
```bash
python -m http.server 8000
# or
npx serve
```

### Deployment

The site is deployed via GitHub Pages:
1. Commit changes to the main branch
2. Push to GitHub
3. Changes automatically deploy to photography.butaliamedia.com (configured via CNAME)

## Code Patterns

### Navigation

- Main site uses scroll spy navigation (`dtr-scrollspy`) for single-page sections
- Mobile responsive header with hamburger menu (`dtr-hamburger`)
- External contact form links to Google Forms: `https://forms.gle/uikf3bp62a6VaZ8d8`

### Portfolio Structure

Portfolio items use a consistent pattern:
```html
<div class="dtr-portfolio-item">
    <img src="assets/images/portfolio-X.jpg" alt="description">
    <div class="dtr-portfolio-caption">Caption text</div>
</div>
```

### Pricing Packages

Three tier pricing structure hardcoded in HTML:
- Silver Package: $199 (1 hour)
- Gold Package: $349 (2 hours)
- Platinum Package: $499 (3-4 hours)

All packages include complimentary full-resolution images.

## Important Notes

- **No Build Process**: This is a static site with no npm scripts, bundlers, or build tools
- **Direct HTML Editing**: All changes are made directly to HTML files
- **SEO**: Meta tags for description, keywords, and author are present in all pages
- **Analytics/Tracking**: Check if Google Analytics or similar is configured in the HTML
- **Email Contact**: info@butaliamedia.com (shown in footer)
