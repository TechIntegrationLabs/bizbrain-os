# Chrome Automation: LinkedIn Profile Extraction

> Instructions for Claude in Chrome to extract business data from LinkedIn profiles.

## Overview

Extract business-relevant information from LinkedIn personal profiles and company pages. This data is used during BizBrain OS setup to pre-populate the user's business profile.

## Important Notes

- LinkedIn requires login to view most profile content
- LinkedIn aggressively detects automation - use read-only operations only
- Do NOT interact with buttons, forms, or make connection requests
- Only extract publicly visible information after the user logs in
- Respect rate limits - do not rapidly navigate between profiles

## Personal Profile Extraction

### URL Pattern
```
https://www.linkedin.com/in/<username>/
```

### Step 1: Navigate and Wait

Navigate to the profile URL. Wait for the page to fully load.

**Login check:**
- If redirected to login page, tell user: "Please log in to LinkedIn. I'll wait..."
- Look for: `.authentication-outlet`, `form[action*="login"]`
- After login, navigate back to the profile URL if needed

### Step 2: Extract Data

**Name:**
- Selector: `.text-heading-xlarge`, `h1.text-heading-xlarge`
- Fallback: `h1` in the main profile section
- This is the person's display name

**Headline:**
- Selector: `.text-body-medium.break-words`
- Usually contains role and company (e.g., "CEO at Acme Corp")

**Location:**
- Selector: `.text-body-small.inline-show-more-text--is-collapsed`
- Usually city/region format

**About Section:**
- Scroll to "About" section
- Selector: `#about ~ .display-flex .inline-show-more-text`
- May need to click "see more" to get full text: `.inline-show-more-text__button`

**Profile Photo:**
- Selector: `.pv-top-card-profile-picture__image--show`, `img.pv-top-card-profile-picture__image`
- Get the `src` attribute for the image URL
- Note: LinkedIn photo URLs may expire

**Experience (most recent):**
- Scroll to "Experience" section
- Selector: `#experience ~ .display-flex .display-flex.flex-column.full-width`
- Extract: company name, role title, duration

**Skills:**
- Scroll to "Skills" section (if visible)
- Selector: `#skills ~ .display-flex .display-flex`

### Step 3: Compile Personal Profile Data

```json
{
  "platform": "linkedin",
  "type": "personal",
  "name": "<extracted name>",
  "headline": "<extracted headline>",
  "location": "<extracted location>",
  "about": "<extracted about text>",
  "photoUrl": "<extracted photo URL>",
  "currentRole": "<extracted from experience or headline>",
  "currentCompany": "<extracted from experience or headline>",
  "skills": ["<skill1>", "<skill2>"],
  "extractedAt": "<timestamp>"
}
```

## Company Page Extraction

### URL Pattern
```
https://www.linkedin.com/company/<company-slug>/
```

### Step 1: Navigate and Wait

Navigate to the company page URL. Wait for the page to fully load.

### Step 2: Extract Data

**Company Name:**
- Selector: `.org-top-card-summary__title`, `h1`
- The main heading on the company page

**Tagline/Industry:**
- Selector: `.org-top-card-summary-info-list__info-item`
- Usually shows industry and location

**About:**
- Navigate to the "About" tab if not visible
- Selector: `.org-about-us-organization-description__text`
- May need to click "See more"

**Company Size:**
- Selector: `.org-about-company-module__company-size-definition-text`
- Or look in the info list for employee count

**Headquarters:**
- Look in the About section or info sidebar
- Selector: `.org-about-company-module__headquarters`

**Website:**
- Selector: `.org-about-company-module__company-page-url a`
- The external website link

**Logo:**
- Selector: `.org-top-card-primary-content__logo`, `.org-top-card-primary-content img`
- Get the `src` attribute

**Specialties:**
- Selector: `.org-about-company-module__specialities`
- Often comma-separated keywords

### Step 3: Compile Company Data

```json
{
  "platform": "linkedin",
  "type": "company",
  "name": "<company name>",
  "tagline": "<tagline if found>",
  "industry": "<industry>",
  "about": "<about text>",
  "size": "<employee range>",
  "headquarters": "<location>",
  "website": "<website URL>",
  "logoUrl": "<logo image URL>",
  "specialties": ["<specialty1>", "<specialty2>"],
  "extractedAt": "<timestamp>"
}
```

## Error Handling

**Profile not found (404):**
- Tell user: "That LinkedIn profile doesn't exist. Check the URL?"

**Login wall / limited view:**
- Some content only visible to connections or premium users
- Extract what's visible and note limitations

**Rate limiting:**
- LinkedIn may show a "You've reached the search limit" page
- Back off and try again later
- Do not retry immediately

**Page structure changed:**
- LinkedIn updates their UI frequently
- If selectors don't match, try reading the full page text and extracting relevant sections
- Use `get_page_text` as fallback to get all visible text
