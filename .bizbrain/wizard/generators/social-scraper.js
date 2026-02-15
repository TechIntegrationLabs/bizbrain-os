#!/usr/bin/env node
// Social Scraper - Generates instructions for Chrome automation to extract profile data

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');

const EXTRACTION_RULES = {
  linkedin: {
    urlPattern: /linkedin\.com\/(in|company)\//,
    selectors: {
      name: '.text-heading-xlarge, .org-top-card-summary__title',
      headline: '.text-body-medium, .org-top-card-summary-info-list__info-item',
      about: '#about ~ .display-flex .visually-hidden ~ span, .org-about-us-organization-description__text',
      location: '.text-body-small .inline-show-more-text, .org-top-card-summary-info-list__info-item:nth-child(2)',
      photo: '.pv-top-card-profile-picture__image, .org-top-card-primary-content__logo',
      experience: '#experience ~ .display-flex .display-flex.flex-column',
      companySize: '.org-about-company-module__company-size-definition-text',
      industry: '.org-top-card-summary-info-list .inline-show-more-text'
    },
    extractionNotes: [
      'LinkedIn requires login to view full profiles',
      'Company pages show more info than personal profiles for business extraction',
      'Look for the "About" section for business description',
      'Company size is shown on the "About" tab of company pages'
    ]
  },
  website: {
    urlPattern: /^https?:\/\//,
    extractBrandColors: true,
    extractLogo: true,
    selectors: {
      title: 'title, h1',
      description: 'meta[name="description"], meta[property="og:description"]',
      logo: 'img[class*="logo"], img[id*="logo"], img[alt*="logo"], link[rel="icon"], link[rel="apple-touch-icon"]',
      favicon: 'link[rel="icon"], link[rel="shortcut icon"]',
      ogImage: 'meta[property="og:image"]',
      themeColor: 'meta[name="theme-color"]'
    },
    brandColorStrategy: [
      'Check CSS custom properties: --primary, --brand, --color-primary, --theme-primary',
      'Check :root and body for CSS variables',
      'Look at header/nav background colors',
      'Check button and link colors (these are often brand colors)',
      'Extract from the most prominent colors in the stylesheet',
      'Check meta[name="theme-color"] for mobile theme color'
    ],
    logoStrategy: [
      'Look for <img> with "logo" in class, id, alt, or src attributes',
      'Check the header/nav area for the first meaningful image',
      'Look for SVG elements in the header',
      'Check link[rel="icon"] or link[rel="apple-touch-icon"] as fallback'
    ]
  },
  facebook: {
    urlPattern: /facebook\.com\//,
    selectors: {
      name: 'h1',
      category: '.x1yc453h, [data-pagelet="page_about"] span',
      about: '[data-pagelet="page_about"], .x1yc453h + div',
      location: '[data-pagelet="page_about"] a[href*="maps"]',
      phone: '[data-pagelet="page_about"] a[href^="tel:"]',
      website: '[data-pagelet="page_about"] a[target="_blank"]',
      coverPhoto: '.x1jx94hy img, [data-pagelet="ProfileCoverPhoto"] img',
      profilePhoto: '[data-pagelet="ProfilePhoto"] img, .x1rg5ohu img'
    },
    extractionNotes: [
      'Facebook pages may require login for full access',
      'Business pages show category, hours, and contact info',
      'Cover and profile photos can reveal brand identity'
    ]
  },
  instagram: {
    urlPattern: /instagram\.com\//,
    selectors: {
      bio: '.-vDIg span, header section > div:nth-child(3), [data-testid="user-bio"]',
      followers: '.g47SY, header ul li:nth-child(2) span, [title*="followers"]',
      following: '.g47SY, header ul li:nth-child(3) span',
      posts: '.g47SY:first-child, header ul li:first-child span',
      name: 'header h1, header h2',
      website: 'header a[rel="me nofollow noopener noreferrer"]',
      profilePhoto: 'header img[alt*="profile"]'
    },
    extractionNotes: [
      'Instagram may require login for full profile access',
      'Bio often contains business category and contact methods',
      'Post frequency indicates content activity level',
      'Follower count gives audience size context'
    ]
  },
  twitter: {
    urlPattern: /(?:twitter|x)\.com\//,
    selectors: {
      name: '[data-testid="UserName"] span',
      bio: '[data-testid="UserDescription"]',
      location: '[data-testid="UserLocation"]',
      website: '[data-testid="UserUrl"] a',
      joinDate: '[data-testid="UserJoinDate"]',
      followers: '[href$="/followers"] span, [href$="/verified_followers"] span',
      following: '[href$="/following"] span'
    },
    extractionNotes: [
      'X/Twitter profiles are mostly public',
      'Bio and pinned tweet reveal business positioning',
      'Follower ratio indicates authority in space'
    ]
  }
};

function detectPlatform(url) {
  for (const [platform, rules] of Object.entries(EXTRACTION_RULES)) {
    if (rules.urlPattern.test(url)) {
      return platform;
    }
  }
  return 'website'; // Default to generic website extraction
}

function generateChromeInstructions(url) {
  const platform = detectPlatform(url);
  const rules = EXTRACTION_RULES[platform];

  return {
    platform,
    url,
    instructions: `Navigate to ${url} and extract the following information using the selectors provided. If a selector doesn't match, try alternatives or extract from visible page content.`,
    selectors: rules.selectors,
    extractBrandColors: rules.extractBrandColors || false,
    extractLogo: rules.extractLogo || false,
    brandColorStrategy: rules.brandColorStrategy || null,
    logoStrategy: rules.logoStrategy || null,
    notes: rules.extractionNotes || [],
    chromeAutomationFile: `.bizbrain/wizard/chrome-automations/social-${platform}.md`
  };
}

function generateAllInstructions(urls) {
  const results = {
    profiles: [],
    combinedData: {
      businessName: null,
      description: null,
      industry: null,
      brandColors: null,
      logo: null,
      socialLinks: {},
      contactInfo: {},
      scrapedAt: new Date().toISOString()
    }
  };

  urls.forEach(url => {
    const instructions = generateChromeInstructions(url);
    results.profiles.push(instructions);
    results.combinedData.socialLinks[instructions.platform] = url;
  });

  return results;
}

// If run directly with URLs as arguments
if (require.main === module) {
  const urls = process.argv.slice(2);
  if (urls.length === 0) {
    console.log('Social Scraper - Generate Chrome automation instructions for profile extraction');
    console.log('');
    console.log('Usage: node social-scraper.js <url1> [url2] [url3] ...');
    console.log('');
    console.log('Supported platforms:');
    Object.keys(EXTRACTION_RULES).forEach(platform => {
      console.log(`  - ${platform}`);
    });
    console.log('  - Any other URL (analyzed as generic website)');
    console.log('');
    console.log('Example:');
    console.log('  node social-scraper.js https://linkedin.com/company/acme https://acme.com');
    process.exit(0);
  }

  const results = generateAllInstructions(urls);
  console.log(JSON.stringify(results, null, 2));
}

module.exports = { generateChromeInstructions, generateAllInstructions, detectPlatform, EXTRACTION_RULES };
