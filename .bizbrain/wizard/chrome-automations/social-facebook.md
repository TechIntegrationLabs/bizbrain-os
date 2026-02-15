# Chrome Automation: Facebook Page Extraction

> Instructions for Claude in Chrome to extract business data from Facebook pages.

## Overview

Extract business information from Facebook business pages. Used during BizBrain OS setup to pre-populate business profile data.

## Important Notes

- Facebook requires login to view most page content
- Facebook's DOM structure changes frequently - selectors may need updating
- Only extract publicly visible information
- Do NOT interact with like/share/comment buttons
- Facebook aggressively detects automation - keep operations minimal

## Steps

### 1. Navigate to Facebook Page

Navigate to the provided URL. Wait for page load.

```
Expected URL format: https://www.facebook.com/<pagename>/
```

### 2. Check Login Status

**If not logged in:**
- Facebook shows limited content for logged-out users
- The page may show a login wall/overlay
- Tell user: "Facebook requires login to see full page details. Please log in to Facebook."
- Look for: `.login_form_container`, `#loginform`, the login overlay modal
- After login, navigate back to the page URL

**If logged in:**
- Proceed with extraction
- User's profile picture/name visible in the navigation

### 3. Extract Page Information

**Page Name:**
- Selector: `h1` (the main page name heading)
- Fallback: Look for the largest heading on the page
- Also check: `meta[property="og:title"]`

**Category:**
- Usually displayed below the page name
- Selector: Look for text near the page name that describes the category
- Example: "Marketing Agency", "Restaurant", "Technology Company"
- This is often in a span or div directly below h1

**About Section:**
- Navigate to the About tab if available
- URL: append `/about` to the page URL (e.g., `https://www.facebook.com/pagename/about`)
- Look for the page description text
- Selector: Try `[data-pagelet="page_about"]` or the main content area

**Contact Information:**
- On the About page, look for:
  - **Phone:** `a[href^="tel:"]` or text near a phone icon
  - **Email:** `a[href^="mailto:"]` or text with @ symbol
  - **Website:** External link (usually displayed with a globe icon)
  - **Address:** Text near a map/location pin icon

**Hours:**
- Often shown on the About page
- Look for day/time pairs (e.g., "Monday 9:00 AM - 5:00 PM")

**Location:**
- Map section on the About page
- Selector: `a[href*="maps"]` or address text near location section

### 4. Extract Visual Assets

**Profile Photo:**
- Selector: The main circular/square image associated with the page
- Look in: `[data-pagelet="ProfilePhoto"] img`, `[aria-label*="profile"] img`
- Get the `src` attribute
- Note: Facebook image URLs are temporary/CDN-based

**Cover Photo:**
- The large banner image at the top
- Selector: `[data-pagelet="ProfileCoverPhoto"] img`, `.cover-photo img`
- Get the `src` attribute

### 5. Extract Additional Data

**Likes/Followers:**
- Usually shown near the top of the page
- Look for text containing "likes" and "followers"
- Format: "12,345 likes" or "12K followers"

**Posts (recent activity):**
- Check the main timeline for recent post dates
- This indicates how active the business is on Facebook
- No need to extract post content

**Reviews/Rating:**
- Some business pages show star ratings
- Look for: rating display, star icons, "X.X out of 5" text

### 6. Compile Extracted Data

```json
{
  "platform": "facebook",
  "url": "<original URL>",
  "name": "<page name>",
  "category": "<business category>",
  "about": "<about/description text>",
  "contact": {
    "phone": "<phone number>",
    "email": "<email>",
    "website": "<external website URL>",
    "address": "<physical address>"
  },
  "hours": "<business hours if found>",
  "location": "<location/city>",
  "images": {
    "profilePhoto": "<URL>",
    "coverPhoto": "<URL>"
  },
  "metrics": {
    "likes": "<count>",
    "followers": "<count>",
    "rating": "<rating if found>"
  },
  "extractedAt": "<timestamp>"
}
```

## Error Handling

**Login wall blocks content:**
- Tell user to log in manually
- After login, re-navigate to the page
- Some content may still be restricted to page admins

**Page not found:**
- The page may have been renamed, deleted, or restricted
- Tell user: "This Facebook page doesn't seem accessible. Check the URL?"

**Limited content visible:**
- Some pages restrict content visibility
- Extract whatever is publicly available
- Note: "Limited data extracted - Facebook page has restricted visibility"

**DOM structure unrecognized:**
- Facebook uses dynamically generated class names
- Fall back to reading page text content with `get_page_text`
- Parse the text for business-relevant information

**Rate limiting or CAPTCHA:**
- Facebook may challenge with CAPTCHA
- Tell user: "Facebook is showing a security check. Please complete it, then I'll try again."
- Do not attempt to bypass CAPTCHAs

**Mobile-optimized page:**
- Some Facebook URLs redirect to `m.facebook.com`
- The mobile version has different selectors
- Prefer navigating to `www.facebook.com` version
