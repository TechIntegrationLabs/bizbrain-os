# Chrome Automation: Netlify Token Creation

> Step-by-step instructions for Claude in Chrome to automate Netlify Personal Access Token creation.

## Overview

This automation guides through creating a Netlify Personal Access Token for BizBrain OS integration.

## Steps

### 1. Navigate to Token Page

```
URL: https://app.netlify.com/user/applications#personal-access-tokens
```

### 2. Check Login Status

**Look for:** The Netlify dashboard navigation with user info.

**If not logged in:**
- The page will redirect to https://app.netlify.com/login or the Netlify login page
- Tell user: "Please log in to Netlify. I'll wait..."
- Wait for the applications page to load

**If login page shows:**
- Look for: login form, or SSO options (GitHub, GitLab, etc.)
- Most users log in via GitHub - look for "Continue with GitHub" button
- Wait for redirect back to the applications page

### 3. Navigate to Personal Access Tokens Section

If not already on the right section:
1. Look for the "Personal access tokens" heading on the page
2. If not visible, scroll down or look for tab/section navigation
3. The section should show existing tokens (if any) and a "New access token" button

### 4. Create New Token

1. **Click "New access token" button**
   - Selector: `button` or `a` containing text "New access token"
   - Alternative: `.token-create-button`, `[data-testid="create-token"]`

2. **Enter description**
   - Look for: input field in the dialog/form that appears
   - Selector: `input[name="description"]`, `input[placeholder*="description"]`, or the first text input in the dialog
   - Enter: "BizBrain OS"

3. **Set expiration** (if option exists)
   - Some Netlify token forms have expiration options
   - If available, select 90 days or "No expiration"

4. **Click "Generate token"**
   - Selector: `button` containing text "Generate" or "Create"
   - Wait for the token to appear

### 5. Capture the Token

After generation:
- **Look for:** A highlighted/boxed area showing the token string
- **The token is a long alphanumeric string** (typically starting with a random character)
- **Selector options:**
  - `.token-value`, `code`, `pre`
  - An input field with the token value (sometimes shown in a readonly input)
  - `[data-testid="token-value"]`
  - Look for any element with a "copy" button next to it

**CRITICAL:** Netlify only shows the token ONCE. Tell user: "I've captured your Netlify token. Save it now - Netlify won't show it again!"

### 6. Error Handling

**Page structure changed:**
- Netlify occasionally updates their UI
- Fallback: Ask user to navigate manually to User Settings > Applications > Personal Access Tokens
- Have them create the token manually and paste it

**Token not visible after creation:**
- Check if the token was created but displayed in a different format
- Look for any success message on the page
- If truly not visible, the token form may need to be resubmitted

**Rate limiting:**
- Netlify may limit how many tokens you create in a short period
- If this happens, wait a few minutes and try again

**SSO/Organization restrictions:**
- Some Netlify teams restrict token creation
- Tell user: "Your Netlify team may restrict personal tokens. Check with your team admin."

### 7. Verification

After obtaining the token, verify it works:
```bash
curl -H "Authorization: Bearer <TOKEN>" https://api.netlify.com/api/v1/sites?per_page=1
```

Expected: JSON array of site objects (or empty array if no sites).

Also verify account:
```bash
curl -H "Authorization: Bearer <TOKEN>" https://api.netlify.com/api/v1/accounts
```

Expected: JSON array with account info including `name`, `slug`, `type`.

### 8. Store Token

Save to:
```
Operations/dev-config-system/services/netlify.json
```

With structure:
```json
{
  "service": "netlify",
  "token": "<token>",
  "accountName": "<name from verification>",
  "accountSlug": "<slug from verification>",
  "createdAt": "<ISO timestamp>"
}
```
