# Security Policy

## Security Model

BizBrain OS is **entirely local-first**. Your data never leaves your machine unless you explicitly configure integrations (GitHub, Netlify, Notion, etc.).

### What stays local
- All Brain folder contents (Clients, Projects, etc.)
- The dashboard runs on `localhost:5555` only
- Voice transcription uses Chrome's built-in speech API (processed locally)
- All configuration and wizard state files

### Credential storage
- API keys and tokens are stored in `.bizbrain/vault/` which is **gitignored**
- Credentials are **never committed to git**
- The `config.json` file (containing preferences but no secrets) is also gitignored
- MCP configurations reference credentials via environment variables or the local vault

### External connections
When you enable integrations, BizBrain OS connects to external services using **your own credentials**:
- **GitHub MCP** - connects to GitHub API with your Personal Access Token
- **Netlify MCP** - connects to Netlify API with your auth token
- **Notion/Slack/Supabase** - same pattern, your credentials, your accounts

### Chrome automation
During module setup, Chrome automation helps configure accounts by:
- Navigating to service token pages
- Reading generated tokens from the page
- It does **not** store browsing history or page content beyond the extracted credentials

### What we DON'T do
- No telemetry or analytics collection
- No "phone home" behavior
- No cloud storage of any kind
- No tracking of usage patterns
- No third-party scripts in the dashboard

## Reporting a Vulnerability

If you discover a security vulnerability in BizBrain OS:

1. **Do NOT** open a public GitHub issue
2. Email **security@techintegrationlabs.com** with details
3. Or use [GitHub's private security advisory](https://github.com/TechIntegrationLabs/bizbrain-os/security/advisories/new)

We will respond within 48 hours and work with you to address the issue.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |
