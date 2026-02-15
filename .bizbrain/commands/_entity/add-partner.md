# Add Partner Command

Add a new strategic partner to the Brain.

## Usage

`/add-partner [partner-name]`

## Instructions

1. **Get partner name**
   - If provided as argument, use it
   - If not, ask: "What is the partner's name?"

2. **Check for existing partner**
   - Search `{{BRAIN_PATH}}/Partners/` for similar names
   - Check aliases in ENTITY-INDEX.md
   - If exists, offer to open instead

3. **Gather partner information**

   Interview:
   ```
   Creating partner: {Partner Name}

   1. Partnership type?
      - Technology partner
      - Referral partner
      - Integration partner
      - Reseller
      - Other

   2. Primary contact?
      Name:
      Email:
      Phone:
      Title:

   3. Company details:
      Website:
      Location:
      Industry:

   4. Partnership scope:
      What do they provide?
      What do we provide?
      Revenue share? [Y/n]

   5. Relationship status:
      - Discussion
      - Agreement drafted
      - Active partnership
      - On hold

   6. Initial notes?
      [Context about the partnership]
   ```

4. **Create partner folder structure**

   From template `.bizbrain/templates/entity/partner/`:
   ```
   Partners/{Partner-Name}/
   ├── _meta.json
   ├── _context/
   │   ├── contacts.md
   │   ├── history.md
   │   ├── action-items.md
   │   ├── agreement.md
   │   └── notes.md
   ├── _pulse/
   │   └── STATUS.md
   └── _projects/
       └── [collaboration projects]
   ```

5. **Populate metadata**

   `_meta.json`:
   ```json
   {
     "id": "partner-{timestamp}",
     "type": "partner",
     "partnershipType": "technology",
     "name": "Integration Co",
     "aliases": ["IntegrationCo", "Integration Company"],
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
       "agreementStatus": "active",
       "startDate": "2024-01-01"
     },
     "tags": ["saas", "api-partner", "co-marketing"]
   }
   ```

6. **Create initial files**

   `_context/contacts.md`:
   ```markdown
   # Contacts - Integration Co

   ## Primary Contact
   **Sarah Johnson** - VP Partnerships
   - Email: sarah@integrationco.com
   - Phone: +1-555-0200
   - Notes: Main partnership liaison

   ## Technical Contacts
   (Add as needed)

   ## Business Contacts
   (Add as needed)
   ```

   `_context/agreement.md`:
   ```markdown
   # Partnership Agreement - Integration Co

   ## Agreement Type
   Technology Partnership with Revenue Share

   ## Key Terms
   - Integration: Bidirectional API access
   - Co-marketing: Joint webinars, case studies
   - Revenue share: 20% on referred customers
   - Term: 2 years, auto-renew

   ## Agreement Status
   Active since 2024-01-01

   ## Documents
   - Partnership agreement: [link to signed doc]
   - API access terms: [link]
   ```

   `_context/history.md`:
   ```markdown
   # History - Integration Co

   ## 2024-01-15: Partner Added
   - Partnership type: Technology + Co-marketing
   - Status: Active
   - Agreement signed: 2024-01-01

   ## Key Milestones
   (Add as partnership progresses)
   ```

   `_pulse/STATUS.md`:
   ```markdown
   # Status - Integration Co

   **Last Updated:** 2024-01-15

   ## Partnership Health
   - Status: Active
   - Relationship: Strong
   - Last contact: 2024-01-10

   ## Active Initiatives
   - API integration in progress
   - Q1 webinar planned
   - Case study being drafted

   ## Recent Activity
   - 2024-01-15: Added to Brain
   ```

7. **Update Entity Index**

   Add to ENTITY-INDEX.md:
   ```markdown
   ### Integration Co
   - **Type:** Partner (Technology)
   - **Folder:** Partners/Integration-Co/
   - **Aliases:** IntegrationCo, Integration Company
   - **Primary Contact:** Sarah Johnson
   - **Keywords:** api, integration, saas partner
   ```

8. **Confirm creation**

   ```
   ✓ Partner created: Integration Co

   Type: Technology partner
   Primary contact: Sarah Johnson (sarah@integrationco.com)
   Status: Active
   Agreement: Signed (2024-01-01)

   Next steps:
   - Document agreement terms
   - Schedule kickoff meeting
   - Set up API access

   View partner: Partners/Integration-Co/
   ```

## Partnership Types

Common types:
- **Technology:** Integration, API access
- **Referral:** Lead exchange, commissions
- **Integration:** Product integration
- **Reseller:** Sell our product/service
- **Strategic:** High-level collaboration
- **Affiliate:** Marketing partnership

## Validation

- Partner name not empty
- Valid contact email
- Partnership type specified
- No duplicate partners

## Related Commands

- `/list-entities` - View all partners
- `/add-project` - Create collaboration project
- `/todo` - View partnership action items
