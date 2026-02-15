# Chrome Automation: Instagram Profile Extraction

> Instructions for Claude in Chrome to extract business data from Instagram profiles.

## Overview

Extract business-relevant information from Instagram profiles. Used during BizBrain OS setup to understand the user's brand presence and content activity.

## Important Notes

- Instagram requires login to view most profile content
- Instagram has aggressive bot detection - minimize interactions
- Only read publicly visible information
- Do NOT interact with follow/like/comment buttons
- Do NOT scroll through the feed extensively
- Rate limit: avoid rapid navigation between profiles

## Steps

### 1. Navigate to Profile

Navigate to the provided URL. Wait for page load.

```
Expected URL format: https://www.instagram.com/<username>/
```

### 2. Check Login Status

**If not logged in:**
- Instagram shows a login wall after brief viewing
- A modal overlay may appear asking to log in
- Tell user: "Instagram requires login to view profiles. Please log in."
- Look for: login form modal, `[role="dialog"]` with login fields
- After login, navigate back to the profile URL

**If logged in:**
- Profile content should be fully visible
- User's own profile icon visible in the navigation

### 3. Extract Profile Information

**Display Name:**
- Selector: `header h1`, `header h2`
- The display name (not the @username)
- May be a personal name or business name

**Username (handle):**
- From the URL: extract the path segment
- Or selector: `header h2` (the @username)

**Bio:**
- Selector: `header section > div` (the div containing bio text)
- Alternative: `[data-testid="user-bio"]`, `.-vDIg span`
- The bio often contains:
  - Business description
  - Contact methods (email in bio)
  - Hashtags describing the business
  - A call-to-action
  - Location

**External Link:**
- Selector: `header a[rel="me nofollow noopener noreferrer"]`
- Or: `a[href*="l.instagram.com"]` (Instagram link redirect wrapper)
- This is the business's external website/link-in-bio

**Profile Photo:**
- Selector: `header img[alt*="profile picture"]`, `header img[alt*="profile"]`
- Get the `src` attribute
- Note: Instagram image URLs are CDN-based and may expire

### 4. Extract Metrics

**Post Count:**
- Look in the header stats area
- Selector: `header ul li:first-child span`, `header ul li:first-child`
- Text format: "123 posts" or just "123"

**Follower Count:**
- Selector: `header ul li:nth-child(2) span`, `[title*="followers"]`
- Text format: "1,234 followers" or "12.3K" or "1.2M"
- Parse abbreviations: K = thousand, M = million

**Following Count:**
- Selector: `header ul li:nth-child(3) span`
- Text format: "567 following"

### 5. Assess Content Activity

Without scrolling extensively, check:

**Is it a business account?**
- Business accounts show a category label under the name
- They may show contact buttons (Call, Email, Directions)
- Selector: Look for category text near the name, contact action buttons

**Recent post dates:**
- Check the first few visible posts (the grid)
- If dates are visible, note the most recent post date
- This indicates how active they are

**Content type:**
- Look at the grid thumbnails
- Are they: photos, graphics/designs, text posts, reels/videos?
- This indicates the type of content they create

### 6. Extract Business-Specific Data

**Category (business accounts):**
- Displayed below the name on business profiles
- Example: "Marketing Agency", "Digital Creator", "Product/Service"

**Contact Buttons (business accounts):**
- Business profiles may show: Email, Phone, Directions buttons
- These indicate contact methods without revealing the actual data

**Story Highlights:**
- Named story highlights appear below the bio
- Read the highlight names - they often indicate business categories
- Example: "Services", "Portfolio", "Reviews", "FAQ"

### 7. Compile Extracted Data

```json
{
  "platform": "instagram",
  "url": "<original URL>",
  "username": "<@handle>",
  "displayName": "<display name>",
  "bio": "<full bio text>",
  "externalLink": "<linked website URL>",
  "profilePhoto": "<image URL>",
  "metrics": {
    "posts": "<count>",
    "followers": "<count>",
    "following": "<count>"
  },
  "isBusinessAccount": true/false,
  "category": "<business category if shown>",
  "contactButtons": ["email", "phone", "directions"],
  "storyHighlights": ["<highlight1>", "<highlight2>"],
  "contentActivity": {
    "lastPostApprox": "<recent/this week/this month/inactive>",
    "contentType": "<photos/graphics/mixed/video>"
  },
  "extractedAt": "<timestamp>"
}
```

## Useful Information to Derive

From the extracted data, BizBrain can infer:

- **Industry/Niche:** From bio keywords and category
- **Audience Size:** From follower count
- **Content Strategy:** From post frequency and type
- **Brand Voice:** From bio tone (professional vs casual)
- **Active Platforms:** If they link to other platforms from bio
- **Business Maturity:** Post count + account age indicators

## Error Handling

**Login wall / modal overlay:**
- Instagram shows a login modal after viewing 1-2 profiles when not logged in
- Tell user to log in, then re-navigate

**Private account:**
- Profile shows "This Account is Private"
- Only username, display name, and follower counts are visible
- Note: "This is a private account - limited data available"

**Account not found:**
- Instagram shows "Sorry, this page isn't available"
- Tell user: "This Instagram profile doesn't exist. Check the username?"

**Age gate / sensitive content:**
- Some profiles require age confirmation
- If encountered, ask user to confirm manually

**Rate limiting:**
- Instagram may show errors or block requests
- Do not retry immediately
- Tell user: "Instagram is rate-limiting access. Try again in a few minutes."

**Content not loading:**
- Instagram is a heavy SPA - wait longer for content
- If images don't load, the data might still be in the page HTML
- Use `get_page_text` as fallback
