# Entity System

How BizBrain OS manages clients, partners, and vendors.

## Entity Types

### Client
- **Money flow:** They pay us
- **Folder:** `{{BRAIN_PATH}}/Clients/`
- **Purpose:** Track customers, projects, revenue
- **Examples:** Paying clients, contract work, retainer agreements

### Partner
- **Money flow:** Strategic collaboration (may or may not involve money)
- **Folder:** `{{BRAIN_PATH}}/Partners/`
- **Purpose:** Track partnerships, integrations, referrals
- **Examples:** Technology partners, referral networks, co-marketing agreements

### Vendor
- **Money flow:** We pay them
- **Folder:** `{{BRAIN_PATH}}/Vendors/`
- **Purpose:** Track suppliers, services, subscriptions
- **Examples:** SaaS tools, hosting providers, professional services

## Entity Lifecycle

### 1. Creation

Use slash commands:
- `/add-client` - Create new client
- `/add-partner` - Create new partner
- `/add-vendor` - Create new vendor

Or create manually from templates:
`{{BRAIN_PATH}}/.bizbrain/templates/entity/{type}/`

### 2. Active Management

Entity gets:
- Regular updates to `STATUS.md`
- New entries in `history.md`
- Contact information maintained
- Action items tracked
- Projects linked

### 3. Status Changes

**Active** → Normal operations, regular contact
**Inactive** → No current projects, minimal contact
**Archived** → Historical record, no longer relevant

Change status by updating `_meta.json`:
```json
{
  "status": "inactive",
  "inactiveSince": "2024-01-15",
  "inactiveReason": "Project completed, no new work"
}
```

### 4. Archival

When archiving:
1. Update status to "archived"
2. Move to `_archive/` subfolder (optional)
3. Update Entity Index
4. Keep for historical reference

Never delete entities (preserve history).

## Entity Files

### Required Files

Every entity must have:
- `_meta.json` - Metadata and configuration
- `_context/contacts.md` - Contact information
- `_context/history.md` - Chronological log
- `_context/action-items.md` - Todos
- `_pulse/STATUS.md` - Current status

### Optional Files

Depending on entity type:
- `_context/agreement.md` - Contracts, terms (partners)
- `_context/contract.md` - Service agreements (vendors)
- `_credentials/access-info.md` - Login details (vendors)
- `_projects/` - Links to project folders (clients)
- `_context/notes.md` - Unstructured notes (all)

## Entity Metadata Schema

### Client Metadata

```json
{
  "id": "client-1705315200000",
  "type": "client",
  "name": "Acme Corp",
  "aliases": ["Acme", "Acme Corporation"],
  "status": "active",
  "createdAt": "2024-01-15T10:00:00Z",
  "primaryContact": {
    "name": "John Smith",
    "email": "john@acme.com",
    "phone": "+1-555-0100",
    "title": "CEO"
  },
  "company": {
    "website": "https://acme.com",
    "location": "San Francisco, CA",
    "industry": "Technology"
  },
  "source": "referral",
  "referredBy": "Jane Doe",
  "projects": [
    "project-12345",
    "project-67890"
  ],
  "tags": ["enterprise", "saas", "priority"],
  "billing": {
    "type": "hourly",
    "rate": 150,
    "currency": "USD",
    "terms": "Net 30"
  }
}
```

### Partner Metadata

```json
{
  "id": "partner-1705315200000",
  "type": "partner",
  "partnershipType": "technology",
  "name": "Integration Co",
  "aliases": ["IntegrationCo"],
  "status": "active",
  "createdAt": "2024-01-15T10:00:00Z",
  "primaryContact": {
    "name": "Sarah Johnson",
    "email": "sarah@integrationco.com",
    "phone": "+1-555-0200",
    "title": "VP Partnerships"
  },
  "company": {
    "website": "https://integrationco.com",
    "location": "Austin, TX",
    "industry": "SaaS"
  },
  "partnership": {
    "scope": "API integration and co-marketing",
    "revenueShare": true,
    "revenueSharePercent": 20,
    "agreementStatus": "active",
    "startDate": "2024-01-01",
    "renewalDate": "2026-01-01"
  },
  "tags": ["saas", "api-partner", "co-marketing"]
}
```

### Vendor Metadata

```json
{
  "id": "vendor-1705315200000",
  "type": "vendor",
  "name": "Cloud Services Inc",
  "aliases": ["CloudServices", "CSI"],
  "status": "active",
  "createdAt": "2024-01-15T10:00:00Z",
  "service": "Infrastructure hosting",
  "category": "infrastructure",
  "primaryContact": {
    "name": "Support Team",
    "email": "support@cloudservices.com",
    "phone": "+1-555-0300"
  },
  "company": {
    "website": "https://cloudservices.com",
    "supportUrl": "https://support.cloudservices.com"
  },
  "contract": {
    "type": "annual",
    "amount": 1200,
    "currency": "USD",
    "startDate": "2024-01-01",
    "renewalDate": "2025-01-01",
    "autoRenew": true,
    "paymentMethod": "credit-card"
  },
  "account": {
    "accountId": "CS-12345",
    "loginUrl": "https://app.cloudservices.com"
  },
  "tags": ["infrastructure", "hosting", "critical"]
}
```

## Entity Relationships

### Client → Projects

Clients can have multiple projects.

In client's `_meta.json`:
```json
{
  "projects": ["project-12345", "project-67890"]
}
```

In project's `_context/client.json`:
```json
{
  "clientId": "client-1705315200000",
  "clientName": "Acme Corp",
  "clientFolder": "Clients/Acme-Corp/"
}
```

### Projects → Repositories

Projects link to code repositories.

In project's `_context/repo-link.json`:
```json
{
  "repo": "C:\\Users\\{{USER_NAME}}\\Repos\\project-name",
  "github": "https://github.com/org/project-name",
  "branch": "main"
}
```

### Vendors → Services

Track which vendor provides which service.

Group vendors by category:
- Infrastructure (hosting, cloud, servers)
- Software (SaaS tools, licenses)
- Professional services (consultants, contractors)
- Financial (banking, accounting, payments)

## Entity Index

Master index at:
`{{BRAIN_PATH}}/Operations/entity-watchdog/ENTITY-INDEX.md`

Format:
```markdown
# Entity Index

## Clients

### Acme Corp
- **Type:** Client
- **Folder:** Clients/Acme-Corp/
- **Aliases:** Acme, Acme Corporation
- **Primary Contact:** John Smith (john@acme.com)
- **Keywords:** enterprise, saas, technology
- **Projects:** ProjectAlpha, Dashboard
- **Status:** Active

## Partners

### Integration Co
- **Type:** Partner (Technology)
- **Folder:** Partners/Integration-Co/
- **Aliases:** IntegrationCo, Integration Company
- **Primary Contact:** Sarah Johnson
- **Keywords:** api, integration, saas
- **Status:** Active

## Vendors

### Cloud Services Inc
- **Type:** Vendor (Infrastructure)
- **Folder:** Vendors/Cloud-Services-Inc/
- **Aliases:** CloudServices, CSI
- **Service:** Infrastructure hosting
- **Keywords:** hosting, cloud, infrastructure
- **Renewal:** Jan 1, 2025
- **Status:** Active
```

This index enables:
- Entity Watchdog auto-detection
- Quick reference lookup
- Alias resolution
- Keyword search

## Action Items Integration

Each entity can have action items in:
`_context/action-items.md`

Format:
```markdown
# Action Items - {{ENTITY_NAME}}

## Active
[ ] C-ACM-001: Schedule Q1 planning call
[ ] C-ACM-002: Send proposal for Phase 2
[ ] C-ACM-003: Follow up on contract renewal

## Completed
[x] C-ACM-000: Initial discovery call (2024-01-10)

## Blocked
[ ] C-ACM-004: Deploy to production (waiting on client approval)
```

These aggregate into the global todo system:
`{{BRAIN_PATH}}/Operations/todos/AGGREGATED-VIEW.md`

## Status Tracking

Update `_pulse/STATUS.md` regularly:

```markdown
# Status - {{ENTITY_NAME}}

**Last Updated:** 2024-01-15T16:30:00Z

## Current State
- Status: Active engagement
- Active projects: 2 (ProjectAlpha, Dashboard)
- Next action: Schedule Phase 2 planning call
- Health: 🟢 Good

## Recent Activity
- 2024-01-15: Sent Phase 2 proposal
- 2024-01-12: Weekly check-in call
- 2024-01-10: Deployed ProjectAlpha v1.2
- 2024-01-08: Code review session

## Upcoming
- 2024-01-17: Phase 2 planning call
- 2024-01-20: ProjectAlpha v1.3 release
- 2024-01-25: Contract renewal discussion
```

## Best Practices

1. **Update regularly** - Keep STATUS.md current
2. **Log everything** - Add to history.md chronologically
3. **Link projects** - Maintain client-project relationships
4. **Track action items** - Use todo system consistently
5. **Maintain contacts** - Keep contact info up to date
6. **Use aliases** - Add all name variations for Entity Watchdog
7. **Tag appropriately** - Use tags for categorization and search
8. **Archive cleanly** - Update status before archiving
9. **Document agreements** - Keep contracts and terms documented
10. **Secure credentials** - Never commit sensitive data

## Related Systems

- **Entity Watchdog** - Auto-detects entity mentions (`systems/entity-watchdog.md`)
- **Todo System** - Aggregates action items (`systems/todo-system.md`)
- **Communication Hub** - Links messages to entities
- **Timesheet System** - Tracks time per client/project
- **Content Factory** - Generates entity-specific content
