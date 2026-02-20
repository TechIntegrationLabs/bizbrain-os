# Add Vendor Command

Add a new vendor/supplier to the Brain.

## Usage

`/add-vendor [vendor-name]`

## Instructions

1. **Get vendor name**
   - If provided, use it
   - If not, ask: "What is the vendor's name?"

2. **Check for existing vendor**
   - Search `{{BRAIN_PATH}}/Vendors/` for similar names
   - Check ENTITY-INDEX.md
   - Offer to open if exists

3. **Gather vendor information**

   Interview:
   ```
   Creating vendor: {Vendor Name}

   1. What service/product do they provide?
      - Software/SaaS
      - Infrastructure/hosting
      - Professional services
      - Equipment/hardware
      - Other

   2. Account contact?
      Name:
      Email:
      Phone:

   3. Company details:
      Website:
      Support URL:

   4. Contract details:
      Contract type: [Monthly/Annual/Pay-as-go]
      Start date:
      Amount: $
      Renewal date:

   5. Account info:
      Account ID:
      Login URL:
      Notes on access:

   6. Payment method:
      - Credit card
      - Invoice
      - Other
   ```

4. **Create vendor folder structure**

   From template `.bizbrain/templates/entity/vendor/`:
   ```
   Vendors/{Vendor-Name}/
   ├── _meta.json
   ├── _context/
   │   ├── contacts.md
   │   ├── contract.md
   │   ├── history.md
   │   ├── action-items.md
   │   └── notes.md
   ├── _pulse/
   │   └── STATUS.md
   └── _credentials/
       └── access-info.md (encrypted)
   ```

5. **Populate metadata**

   `_meta.json`:
   ```json
   {
     "id": "vendor-{timestamp}",
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
       "autoRenew": true
     },
     "account": {
       "accountId": "CS-12345",
       "loginUrl": "https://app.cloudservices.com"
     },
     "tags": ["infrastructure", "hosting", "critical"]
   }
   ```

6. **Create initial files**

   `_context/contacts.md`:
   ```markdown
   # Contacts - Cloud Services Inc

   ## Support
   - Email: support@cloudservices.com
   - Phone: +1-555-0300
   - Portal: https://support.cloudservices.com

   ## Account Manager
   (Add when assigned)

   ## Technical Support
   (Add as needed)
   ```

   `_context/contract.md`:
   ```markdown
   # Contract - Cloud Services Inc

   ## Service
   Infrastructure hosting and managed services

   ## Terms
   - Type: Annual subscription
   - Amount: $1,200/year
   - Billing: Annual, January 1
   - Payment method: Credit card
   - Auto-renewal: Yes

   ## Renewal
   - Current term: Jan 1, 2024 - Jan 1, 2025
   - Renewal date: Jan 1, 2025
   - Notice period: 30 days

   ## Included Services
   - Hosting: 100GB storage
   - Bandwidth: 1TB/month
   - Support: Email, 24/7
   - SLA: 99.9% uptime

   ## Documents
   - Contract: [link to signed agreement]
   - SLA: [link to SLA doc]
   ```

   `_credentials/access-info.md`:
   ```markdown
   # Access Info - Cloud Services Inc

   **SENSITIVE - Do not commit to public repos**

   ## Account
   - Account ID: CS-12345
   - Login URL: https://app.cloudservices.com
   - Username: [stored in password manager]
   - Password: [stored in password manager]

   ## API Access
   - API Key: [stored in .env]
   - API Docs: https://api.cloudservices.com/docs

   ## Recovery
   - Recovery email: [email]
   - Support phone: +1-555-0300
   ```

   `_pulse/STATUS.md`:
   ```markdown
   # Status - Cloud Services Inc

   **Last Updated:** 2024-01-15

   ## Account Status
   - Status: Active
   - Contract: Annual, renews Jan 1, 2025
   - Usage: Normal
   - Issues: None

   ## Recent Activity
   - 2024-01-15: Vendor added to system
   ```

7. **Update Entity Index**

   ```markdown
   ### Cloud Services Inc
   - **Type:** Vendor (Infrastructure)
   - **Folder:** Vendors/Cloud-Services-Inc/
   - **Aliases:** CloudServices, CSI
   - **Service:** Infrastructure hosting
   - **Keywords:** hosting, cloud, infrastructure
   ```

8. **Add renewal reminder**

   Create action item in `_context/action-items.md`:
   ```markdown
   ## Future
   [ ] @2024-12-01: Review contract before renewal (Jan 1, 2025)
   ```

9. **Confirm creation**

   ```
   ✓ Vendor created: Cloud Services Inc

   Service: Infrastructure hosting
   Contract: $1,200/year (renews Jan 1, 2025)
   Account ID: CS-12345
   Status: Active

   Next steps:
   - Store credentials in password manager
   - Set calendar reminder for renewal (Dec 1, 2024)
   - Document usage and access procedures

   View vendor: Vendors/Cloud-Services-Inc/
   ```

## Vendor Categories

Common categories:
- Software/SaaS
- Infrastructure/Hosting
- Professional Services
- Equipment/Hardware
- Marketing/Advertising
- Financial Services

## Security Notes

- NEVER commit credentials to git
- Use `.gitignore` for `_credentials/` folders
- Reference credential location (password manager, .env)
- Encrypt sensitive files if needed

## Related Commands

- `/list-entities` - View all vendors
- `/todo` - See renewal reminders
- `/get-env` - Retrieve credentials from vault
