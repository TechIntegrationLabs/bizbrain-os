# Chrome Automation: GitHub PAT Creation

> Step-by-step instructions for Claude in Chrome to automate GitHub Personal Access Token creation.

## Overview

This automation guides through creating a GitHub Personal Access Token (PAT) with the scopes needed for BizBrain OS integration.

## Steps

### 1. Navigate to Token Creation Page

```
URL: https://github.com/settings/tokens?type=beta
```

Alternative (classic tokens):
```
URL: https://github.com/settings/tokens/new
```

### 2. Check Login Status

**Look for:** The GitHub navigation bar with user avatar in the top right.

**If not logged in:**
- The page will redirect to https://github.com/login
- Tell user: "Please log in to GitHub. I'll wait..."
- Wait for the page to show the token creation form
- Check for elements: `input[name="login"]` or the token form fields

**If 2FA is required:**
- Tell user: "GitHub is asking for your 2FA code. Please enter it."
- Wait for the token page to load

### 3. Fill Token Form (Fine-grained tokens - preferred)

If on the fine-grained token page (`/settings/tokens?type=beta`):

1. Click "Generate new token" button
2. Fill in fields:
   - **Token name:** `input[name="token[description]"]` or `#token_description` -> Enter "BizBrain OS"
   - **Expiration:** Select 90 days (or custom)
   - **Description:** "BizBrain OS integration for repository and project management"

3. Repository access:
   - Select "All repositories" for full access
   - Or "Only select repositories" for limited access

4. Permissions (expand sections and select):
   - **Repository permissions:**
     - Contents: Read and write
     - Issues: Read and write
     - Pull requests: Read and write
     - Metadata: Read-only (auto-selected)
     - Workflows: Read and write
   - **Account permissions:**
     - (None required for basic usage)

5. Click "Generate token"

### 4. Fill Token Form (Classic tokens - fallback)

If on the classic token page (`/settings/tokens/new`):

1. **Note field:** `input#token_description` -> Enter "BizBrain OS"

2. **Expiration dropdown:** Select "90 days"
   - Look for: `select#token_expiration` or the expiration dropdown

3. **Select scopes** (check these checkboxes):
   - `input#scope_repo` -> Check (full control of private repositories)
   - `input#scope_read:org` -> Check (read org membership)
   - `input#scope_read:user` -> Check (read user profile)
   - `input#scope_workflow` -> Check (update GitHub Action workflows)

4. **Generate:** Click the "Generate token" button
   - Look for: `button[type="submit"]` with text "Generate token"

### 5. Capture the Token

After generation:
- **Look for:** The green box containing the token value
- **Selector:** `.token, .new-token, code, [data-clipboard-text]`
- **The token starts with:** `ghp_` (classic) or `github_pat_` (fine-grained)
- **Read the full token text**

**CRITICAL:** This token is only shown ONCE. If the page is refreshed, the token is gone forever.

Tell user: "I've captured your GitHub token. It's stored securely in your Brain."

### 6. Read Username

While on GitHub:
- Navigate to https://api.github.com/user (or read from page)
- **Selector for username:** `.Header-link img[alt]` attribute, or the dropdown menu
- Alternative: `meta[name="user-login"]` content attribute

### 7. Error Handling

**Token page not found:**
- The URL structure may have changed
- Fallback: Navigate to https://github.com/settings -> "Developer settings" -> "Personal access tokens"

**Permission denied:**
- User may not have permission to create tokens (org restrictions)
- Tell user: "Your organization may restrict token creation. Check with your GitHub admin."

**Token generation failed:**
- Check for error messages on the page
- Common issue: token name already exists (append a number)

**Session expired during process:**
- User will be redirected to login
- Start from Step 2 again

### 8. Verification

After obtaining the token, verify it works:
```bash
curl -H "Authorization: token <TOKEN>" https://api.github.com/user
```

Expected response includes: `login`, `name`, `email` fields.

### 9. Store Token

Save to:
```
Operations/dev-config-system/services/github.json
```

With structure:
```json
{
  "service": "github",
  "token": "<token>",
  "tokenType": "fine-grained|classic",
  "username": "<username>",
  "createdAt": "<ISO timestamp>",
  "expiresAt": "<ISO timestamp>",
  "scopes": ["repo", "read:org", "read:user", "workflow"]
}
```
