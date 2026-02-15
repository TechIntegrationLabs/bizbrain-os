# Chrome Automation: Website Brand Extraction

> Instructions for Claude in Chrome to extract brand colors, logo, description, and other business data from company websites.

## Overview

Extract brand identity and business information from a company's website. This is used during BizBrain OS setup to automatically populate brand configuration.

## Steps

### 1. Navigate to Website

Navigate to the provided URL. Wait for full page load including stylesheets and images.

**Common issues:**
- HTTP might redirect to HTTPS - follow the redirect
- www vs non-www - follow the redirect
- Some sites may block automated access - fall back to manual reading

### 2. Extract Meta Information

**Page Title:**
- Selector: `title`
- This often contains the business name and tagline

**Meta Description:**
- Selector: `meta[name="description"]` -> `content` attribute
- Fallback: `meta[property="og:description"]` -> `content` attribute
- This is the business's own description of itself

**Open Graph Data:**
- `meta[property="og:title"]` -> Business/page name
- `meta[property="og:description"]` -> Description
- `meta[property="og:image"]` -> Social sharing image (often the logo or hero image)
- `meta[property="og:site_name"]` -> Site/business name
- `meta[property="og:type"]` -> Site type (website, business, etc.)

**Theme Color:**
- `meta[name="theme-color"]` -> Browser/mobile theme color (often a brand color)

**Favicon:**
- `link[rel="icon"]` -> `href` attribute
- `link[rel="apple-touch-icon"]` -> `href` attribute (higher resolution)

### 3. Extract Brand Colors

Brand colors are the most valuable extraction. Use these strategies in order:

**Strategy 1: CSS Custom Properties**

Execute JavaScript to read CSS custom properties from :root:
```javascript
const styles = getComputedStyle(document.documentElement);
const colorVars = [
  '--primary', '--primary-color', '--brand', '--brand-color',
  '--color-primary', '--theme-primary', '--main-color',
  '--accent', '--accent-color', '--secondary', '--secondary-color',
  '--color-accent', '--color-brand'
];
const colors = {};
colorVars.forEach(v => {
  const val = styles.getPropertyValue(v).trim();
  if (val) colors[v] = val;
});
```

**Strategy 2: Header/Navigation Background**

- Read the background color of `header`, `nav`, `.header`, `.navbar`, `#header`
- These are often set to the primary brand color
- Selector: `header, nav, [class*="header"], [class*="nav"]`

**Strategy 3: Button Colors**

- Read the background color of primary buttons
- Selector: `button.primary, .btn-primary, [class*="btn-primary"], a.button`
- Also check link colors: `a` elements (often brand-colored)

**Strategy 4: Dominant Colors from Elements**

- Read colors from: headings (`h1`, `h2`), links (`a`), highlighted sections
- Look for repeated color values - brand colors are used consistently

**Color Format:**
- Convert all colors to hex format (#RRGGBB)
- Identify: primary (most prominent), secondary (supporting), accent (highlight/CTA)

### 4. Extract Logo

**Strategy 1: Logo-specific elements**
- Selector: `img[class*="logo"], img[id*="logo"], img[alt*="logo"]`
- Also: `img[src*="logo"], svg[class*="logo"]`
- Check inside header/nav for the first image

**Strategy 2: Header area images**
- Look for `<img>` tags within `<header>` or `<nav>`
- The first image in the header is usually the logo
- Also check for inline SVG elements

**Strategy 3: SVG logos**
- Many modern sites use inline SVG for logos
- Selector: `header svg, nav svg, .logo svg`
- These can be exported as SVG files

**Strategy 4: Favicon as fallback**
- `link[rel="apple-touch-icon"]` -> best quality
- `link[rel="icon"][sizes="192x192"]` or largest size available
- Standard `link[rel="icon"]` as last resort

**Get the logo URL:**
- For `<img>`: read the `src` attribute
- For SVG: read the outer HTML
- Resolve relative URLs to absolute
- Prefer PNG/SVG over JPG for logos

### 5. Extract Business Content

**Main Heading:**
- Selector: `h1` (first one on the page)
- Often the main value proposition

**Services/Features:**
- Look for sections with headings like "Services", "What We Do", "Features"
- Selector: `section h2, section h3` and their sibling content
- Extract a summary of each service/feature

**Contact Information:**
- Look for: `a[href^="mailto:"]` (email), `a[href^="tel:"]` (phone)
- Footer often contains address information
- Selector: `footer, .footer, #footer`

**Social Links:**
- Selector: `a[href*="linkedin"], a[href*="twitter"], a[href*="facebook"], a[href*="instagram"]`
- These are often in the header or footer

### 6. Compile Extracted Data

```json
{
  "platform": "website",
  "url": "<original URL>",
  "title": "<page title>",
  "description": "<meta description>",
  "siteName": "<og:site_name or extracted business name>",
  "brandColors": {
    "primary": "#XXXXXX",
    "secondary": "#XXXXXX",
    "accent": "#XXXXXX",
    "themeColor": "#XXXXXX",
    "allDetected": ["#color1", "#color2", "#color3"]
  },
  "logo": {
    "url": "<logo image URL>",
    "type": "img|svg|favicon",
    "alt": "<alt text if available>"
  },
  "favicon": "<favicon URL>",
  "ogImage": "<og:image URL>",
  "content": {
    "mainHeading": "<h1 text>",
    "services": ["<service1>", "<service2>"],
    "valueProposition": "<extracted from hero section>"
  },
  "contact": {
    "email": "<extracted email>",
    "phone": "<extracted phone>",
    "address": "<extracted address>"
  },
  "socialLinks": {
    "linkedin": "<url>",
    "twitter": "<url>",
    "facebook": "<url>",
    "instagram": "<url>"
  },
  "extractedAt": "<timestamp>"
}
```

## Error Handling

**Site not loading:**
- Check if URL is valid
- Try with/without www
- Check if site is down (timeout)

**Single Page Application (SPA):**
- Wait longer for JavaScript to render content
- Some SPAs don't render without JavaScript
- Use `get_page_text` as fallback

**Cookie/consent banners:**
- These may block content extraction
- Look for "Accept" or "Close" button to dismiss
- Selector: `button[id*="accept"], button[class*="accept"], .cookie-banner button`

**CAPTCHA or bot detection:**
- Some sites detect automation
- Tell user: "This site has bot protection. Please navigate there manually and I'll read what I can."
