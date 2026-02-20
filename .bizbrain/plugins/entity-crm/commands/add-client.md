# Add Client Command

Add a new client/customer to the Brain.

## Usage

`/add-client [client-name]`

## Instructions

1. **Get client name**
   - If provided as argument, use it
   - If not, ask: "What is the client's name?"

2. **Check for existing client**
   - Search `{{BRAIN_PATH}}/Clients/` for similar names
   - Check aliases in ENTITY-INDEX.md
   - If found, ask: "Client '{name}' already exists. Open it instead? [Y/n]"

3. **Gather client information**

   Interview:
   ```
   Creating client: {Client Name}

   1. Primary contact person?
      Name:
      Email:
      Phone:

   2. Company details:
      Website:
      Location:
      Industry:

   3. Current project (if any)?
      [Select from existing projects or create new]

   4. How did they find us?
      - Referral (from whom?)
      - Website
      - Social media
      - Other

   5. Initial notes?
      [Any important context to capture]
   ```

4. **Create client folder structure**

   From template `.bizbrain/templates/entity/client/`:
   ```
   Clients/{Client-Name}/
   ├── _meta.json
   ├── _context/
   │   ├── contacts.md
   │   ├── history.md
   │   ├── action-items.md
   │   └── notes.md
   ├── _pulse/
   │   └── STATUS.md
   └── _projects/
       └── [links to project folders]
   ```

5. **Populate metadata**

   `_meta.json`:
   ```json
   {
     "id": "client-{timestamp}",
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
     "tags": ["enterprise", "saas"],
     "projects": []
   }
   ```

6. **Create initial files**

   `_context/contacts.md`:
   ```markdown
   # Contacts - Acme Corp

   ## Primary Contact
   **John Smith** - CEO
   - Email: john@acme.com
   - Phone: +1-555-0100
   - Notes: Initial contact, very responsive

   ## Additional Contacts
   (Add more as you learn about the organization)
   ```

   `_context/history.md`:
   ```markdown
   # History - Acme Corp

   ## 2024-01-15: Client Added
   - Source: Referral from Jane Doe
   - Initial contact: John Smith (CEO)
   - Status: Active
   ```

   `_context/action-items.md`:
   ```markdown
   # Action Items - Acme Corp

   ## Active
   [ ] Schedule initial discovery call
   [ ] Send service overview deck
   [ ] Draft proposal

   ## Completed
   (None yet)
   ```

   `_pulse/STATUS.md`:
   ```markdown
   # Status - Acme Corp

   **Last Updated:** 2024-01-15

   ## Current State
   - Status: New client
   - Active projects: 0
   - Next action: Schedule discovery call

   ## Recent Activity
   - 2024-01-15: Client added to system
   ```

7. **Update Entity Index**

   Add to `{{BRAIN_PATH}}/Operations/entity-watchdog/ENTITY-INDEX.md`:
   ```markdown
   ### Acme Corp
   - **Type:** Client
   - **Folder:** Clients/Acme-Corp/
   - **Aliases:** Acme, Acme Corporation
   - **Primary Contact:** John Smith (john@acme.com)
   - **Keywords:** acme, enterprise saas
   ```

8. **Link to project (if applicable)**

   If project was specified:
   - Create symlink or reference in `_projects/`
   - Add client to project's `_context/client.json`

9. **Confirm creation**

   ```
   ✓ Client created: Acme Corp

   Folder: {{BRAIN_PATH}}/Clients/Acme-Corp/
   Primary contact: John Smith (john@acme.com)
   Status: Active

   Next steps:
   - Add action items: Open _context/action-items.md
   - Schedule meeting: Add to calendar
   - Create project: /add-project [project-name]

   View client: Navigate to Clients/Acme-Corp/
   ```

10. **Add to aggregated todo** (if action items created)

    Run todo aggregation to include new client action items in global dashboard.

## Template Variables

Replace in template files:
- `{{CLIENT_NAME}}` → Actual client name
- `{{CREATED_DATE}}` → ISO date string
- `{{PRIMARY_CONTACT}}` → Contact person's name

## Validation

Before creating:
- Client name is not empty
- No special characters that break file systems
- Contact email is valid format
- No duplicate in existing clients

## Related Commands

- `/list-entities` - View all clients
- `/add-project` - Create project for this client
- `/todo` - View client action items
