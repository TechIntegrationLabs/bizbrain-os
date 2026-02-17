# Module Setup: Stripe

> Manage products, subscriptions, and payments from your Brain -- create pricing, check revenue status, and configure webhooks without leaving Claude Code.

## What This Module Does

Stripe Integration brings payment management into your Brain:
- Create and manage products, prices, and subscription plans
- Check payment status, revenue metrics, and customer data
- Stripe MCP for full API access (customers, invoices, subscriptions, charges)
- Test mode support so you can experiment safely before going live
- Webhook configuration for real-time payment event handling

## What Gets Created

| Type | Items |
|------|-------|
| **Folders** | *(none)* |
| **Agents** | *(none)* |
| **Commands** | `stripe-products`, `stripe-status` |
| **Hooks** | *(none)* |
| **MCPs** | `stripe.json` |
| **Knowledge** | *(none)* |

## Prerequisites

| Module | Why |
|--------|-----|
| `chrome-extension` | Browser-guided key retrieval (optional but recommended) |
| `supabase` | Webhook event storage, customer data sync (optional) |

You need a Stripe account. The free tier gives full access to test mode with no charges.

## Setup Flow

### Step 1: Check Existing Config

Look for existing Stripe keys in `Operations/dev-config-system/services/stripe.json`, environment variables (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`), or `.env` files in known project directories. If found, offer to reuse.

### Step 2: Confirm Stripe Account

**Q: Do you have a Stripe account?**
- `Yes` - Proceed to authentication
- `No` - Guide to https://dashboard.stripe.com/register (free, no credit card required to start)

### Step 3: Choose Authentication Method

**Q: How would you like to retrieve your Stripe keys?**
- `Browser guided` - Open the Stripe dashboard in Chrome and read the keys
- `Manual` - You'll copy the keys from the Stripe dashboard yourself

### Step 4: Retrieve API Keys

**For browser guided:**
Navigate to `https://dashboard.stripe.com/apikeys` and guide through:
1. Locate the "Publishable key" (starts with `pk_test_` or `pk_live_`)
2. Click "Reveal test key" or "Reveal live key" for the Secret key (starts with `sk_test_` or `sk_live_`)
3. Copy both keys

**For manual:** Direct the user to `https://dashboard.stripe.com/apikeys` to copy both the Publishable key and the Secret key.

### Step 5: Test Mode vs Live Mode

**IMPORTANT: Recommend test mode keys first.**

**Q: Which keys are you providing?**
- `Test mode` *(recommended for initial setup)* - Safe to experiment, no real charges
- `Live mode` - Real payments, use with caution

If they provide live keys, confirm they understand these process real payments. Suggest setting up test mode first if they haven't already.

### Step 6: Store Keys

Save to `Operations/dev-config-system/services/stripe.json`:
```json
{
  "service": "stripe",
  "publishableKey": "pk_test_...",
  "secretKey": "sk_test_...",
  "testMode": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Step 7: Verify Connection

Run a GET request to `https://api.stripe.com/v1/products` with the secret key as Basic auth. Confirm the response succeeds and show the account name.

### Step 8: Webhook Configuration

**Q: Set up webhooks for real-time payment events?**
- `Yes` - Configure a webhook endpoint now
- `Later` - Skip for now, can be added anytime

If yes:
1. Ask for the webhook endpoint URL (e.g., `https://your-app.com/api/webhooks/stripe`)
2. Guide through creating the webhook in the Stripe dashboard or via API
3. Capture the webhook signing secret (`whsec_...`)
4. Store the signing secret alongside the API keys

### Step 9: Configure Stripe MCP

Generate the MCP configuration for Stripe, enabling API access to manage products, customers, subscriptions, invoices, and payment intents from Claude Code.

### Step 10: Save Configuration

Save to `config.json`:
```json
{
  "integrations": {
    "stripe": {
      "tokenStored": true,
      "testMode": true,
      "webhookConfigured": false,
      "mcpEnabled": true,
      "verifiedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Step 11: Activate

```bash
node .bizbrain/wizard/generators/module-activator.js activate stripe
```

## Quick Mode Defaults

| Setting | Default |
|---------|---------|
| testMode | `true` |
| webhookConfigured | `false` (set up later) |
| mcpEnabled | `true` |

Quick mode still requires API keys -- Stripe has no unauthenticated access. It defaults to test mode and skips webhook setup.

## Activation

```bash
node .bizbrain/wizard/generators/module-activator.js activate stripe
```

## Completion

Stripe is connected to your Brain. You can now manage products, pricing, and payment status directly from Claude Code.

**Available commands:**
- `/stripe-products` - List, create, and manage products and prices
- `/stripe-status` - Revenue overview, recent charges, and subscription metrics

**Stripe MCP** is active for full API access -- manage customers, create subscriptions, issue refunds, and query payment data from Claude Code.

**Next steps:**
- Create your first product with `/stripe-products`
- If using test mode, switch to live keys when ready for production
- Set up webhooks when your app endpoint is deployed
