# List Entities Command

List all entities (clients, partners, vendors) with their status.

## Usage

`/list-entities [type]`

Optional type filter: `clients`, `partners`, `vendors`, or `all` (default)

## Instructions

1. **Parse filter**
   - If type specified, show only that type
   - If no type or "all", show all entity types

2. **Scan entity folders**

   For each type:
   - Read `{{BRAIN_PATH}}/Clients/` → all subdirectories
   - Read `{{BRAIN_PATH}}/Partners/` → all subdirectories
   - Read `{{BRAIN_PATH}}/Vendors/` → all subdirectories

3. **Load metadata for each entity**

   Read `_meta.json` from each entity folder:
   - Name
   - Status (active/inactive/archived)
   - Type-specific data (project count, partnership type, service)
   - Created date
   - Last activity (from STATUS.md timestamp)

4. **Display organized list**

   **All entities:**
   ```
   Entities Overview
   ════════════════════════════════════════════════

   CLIENTS (7 active, 2 inactive)
   ────────────────────────────────────────────────
   1. Acme Corp                    [Active]
      Contact: John Smith | Projects: 2 | Since: Jan 2024

   2. Beta Industries              [Active]
      Contact: Sarah Lee | Projects: 1 | Since: Dec 2023

   3. Gamma LLC                    [Inactive]
      Contact: - | Last activity: Nov 2023

   PARTNERS (3 active)
   ────────────────────────────────────────────────
   1. Integration Co               [Active]
      Type: Technology | Contact: Sarah Johnson

   2. Referral Network             [Active]
      Type: Referral | Contact: Mike Davis

   VENDORS (5 active, 1 renewal pending)
   ────────────────────────────────────────────────
   1. Cloud Services Inc           [Active]
      Service: Hosting | $1,200/year | Renews: Jan 2025

   2. SaaS Tool Pro                [Active] ⚠ Renewal: Feb 15
      Service: Software | $99/month | Renews: Feb 2024

   3. Design Studio                [Active]
      Service: Professional services | Contract: As-needed
   ```

   **Clients only:**
   ```
   Clients (7 active, 2 inactive)
   ════════════════════════════════════════════════

   Active Clients
   ────────────────────────────────────────────────
   1. Acme Corp
      Primary: John Smith (john@acme.com)
      Projects: 2 active (BuildTrack, Dashboard)
      Status: Active engagement
      Since: Jan 2024
      Last contact: 3 days ago

   2. Beta Industries
      Primary: Sarah Lee (sarah@beta.com)
      Projects: 1 active (Website Redesign)
      Status: In delivery
      Since: Dec 2023
      Last contact: 1 day ago

   [... more clients ...]

   Inactive Clients (2)
   ────────────────────────────────────────────────
   3. Gamma LLC - Last activity: Nov 2023
   4. Delta Corp - Last activity: Oct 2023
   ```

5. **Add statistics**

   Show summary stats:
   - Total count by type
   - Active vs inactive
   - Upcoming renewals (vendors)
   - Recent additions
   - Pending action items

6. **Provide filters and sorting**

   Offer options:
   ```
   Sort by:
   1. Name (A-Z)
   2. Most recent activity
   3. Created date
   4. Number of projects (clients)

   Filter by:
   - Status: active | inactive | archived
   - Has pending todos
   - Recent activity (last 7/30/90 days)
   ```

7. **Quick actions**

   For each entity, offer:
   ```
   Quick actions for Acme Corp:
   - View details: Navigate to Clients/Acme-Corp/
   - View projects: List linked projects
   - View todos: Show action items
   - Update status: Change active/inactive
   ```

8. **Export options**

   Offer to export list:
   - Markdown table
   - CSV for spreadsheet
   - JSON for integrations
   - Send to Notion

## Display Modes

**Summary mode** (default):
- One line per entity
- Key info only
- Status indicators

**Detailed mode** (`--detailed`):
- Multiple lines per entity
- All contacts
- All projects
- Recent history
- Pending action items

**Table mode** (`--table`):
- Clean table format
- Sortable columns
- Good for export

## Status Indicators

Visual indicators:
- ✓ Active, healthy
- ▶ Active, needs attention
- ⚠ Warning (renewal pending, no recent activity)
- ⏸ Inactive
- 📦 Archived

## Related Commands

- `/add-client` - Add new client
- `/add-partner` - Add new partner
- `/add-vendor` - Add new vendor
- `/status` - Full Brain status
- `/todo` - View all entity action items
