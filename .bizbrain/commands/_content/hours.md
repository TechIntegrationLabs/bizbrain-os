# Hours Command

Quick timesheet summary showing hours worked.

## Usage

`/hours [period]`

Periods: `today`, `week`, `month`, or date range

## Instructions

1. **Parse period**
   - Default (no period): Today
   - `today`: Today's hours
   - `week`: This week (Monday-Sunday)
   - `month`: This month
   - `YYYY-MM-DD`: Specific date
   - `YYYY-MM-DD to YYYY-MM-DD`: Date range

2. **Load timesheet data**

   Read from:
   - `~/.claude/timesheet/logs/` (Claude Code sessions)
   - `{{BRAIN_PATH}}/Operations/timesheet/manual-entries.json` (manual entries)
   - `{{BRAIN_PATH}}/Operations/timesheet/tracked-time.json` (aggregate)

3. **Calculate hours**

   For each session/entry:
   - Start time
   - End time
   - Duration (in hours)
   - Project/client associated
   - Tasks/activities

4. **Display summary**

   **Today:**
   ```
   Hours Today - 2024-01-15
   ════════════════════════════════════════════════

   Total: 6.5 hours

   By Project:
   ────────────────────────────────────────────────
   ProjectAlpha            4.0 hours
     - Feature development (2.5h)
     - Bug fixes (1.0h)
     - Code review (0.5h)

   AppBeta                 2.0 hours
     - Schema design (1.5h)
     - Testing (0.5h)

   Admin                   0.5 hours
     - Client email (0.5h)

   Sessions:
   ────────────────────────────────────────────────
   09:00 - 11:30  ProjectAlpha  Feature development
   11:30 - 12:00  ProjectAlpha  Bug fixes
   13:00 - 14:30  AppBeta       Schema design
   14:30 - 15:00  AppBeta       Testing
   15:00 - 16:00  ProjectAlpha  Code review + bugs
   16:00 - 16:30  Admin       Email follow-ups
   ```

   **This Week:**
   ```
   Hours This Week - Jan 14-20, 2024
   ════════════════════════════════════════════════

   Total: 32.5 hours

   By Day:
   ────────────────────────────────────────────────
   Mon 1/14    6.0 hours
   Tue 1/15    6.5 hours (today)
   Wed 1/16    -
   Thu 1/17    -
   Fri 1/18    -

   By Project:
   ────────────────────────────────────────────────
   ProjectAlpha 18.0 hours  (55%)
   AppBeta      12.0 hours  (37%)
   Admin         2.5 hours  (8%)

   By Client:
   ────────────────────────────────────────────────
   Acme Design Co (ProjectAlpha)   18.0 hours
   Nova Analytics (AppBeta)        12.0 hours
   Internal                         2.5 hours
   ```

   **This Month:**
   ```
   Hours This Month - January 2024
   ════════════════════════════════════════════════

   Total: 142.5 hours (18 working days)
   Average: 7.9 hours/day

   Weekly Breakdown:
   ────────────────────────────────────────────────
   Week 1 (Jan 1-7)     38.5 hours
   Week 2 (Jan 8-14)    42.0 hours
   Week 3 (Jan 15-21)   32.5 hours (partial)
   Week 4 (Jan 22-28)   -

   By Project:
   ────────────────────────────────────────────────
   ProjectAlpha  72.0 hours  (51%)
   AppBeta       48.5 hours  (34%)
   MediCare Pro  15.0 hours  (11%)
   Admin          7.0 hours  (5%)

   By Client:
   ────────────────────────────────────────────────
   Acme Design Co     72.0 hours
   Nova Analytics     48.5 hours
   MediCare Pro       15.0 hours
   Internal            7.0 hours

   Billable: 135.5 hours (95%)
   Non-billable: 7.0 hours (5%)
   ```

5. **Add visual indicators**

   Use progress bars for relative time:
   ```
   ProjectAlpha ████████████░░░░░░░░  60%  (18.0h)
   AppBeta      ████████░░░░░░░░░░░░  40%  (12.0h)
   ```

6. **Calculate rates**

   If rate configured in client/project metadata:
   ```
   Revenue This Week:
   ────────────────────────────────────────────────
   ProjectAlpha 18.0h × $XX/h = $X,XXX
   AppBeta      12.0h × $XX/h = $X,XXX
   ────────────────────────────────────────────────
   Total billable: $4,800
   ```

7. **Quick actions**

   Offer:
   ```
   Actions:
   1. Export timesheet (/timesheet)
   2. View detailed breakdown
   3. Add manual entry
   4. Sync to Notion (/notion-sync)
   5. Generate invoice
   ```

8. **Session tracking**

   If Claude Code session is active:
   ```
   Current Session:
   Started: 16:45 (30 minutes ago)
   Project: ProjectAlpha
   Running time: 0.5 hours
   ```

## Data Sources

Priority order:
1. Claude Code automatic tracking (`~/.claude/timesheet/logs/`)
2. Manual entries (`Operations/timesheet/manual-entries.json`)
3. Git commit timestamps (fallback)
4. Notion sync data (if configured)

## Formatting

- Always show totals first
- Group by project, then by task type
- Include percentages for relative time
- Highlight current day/week
- Show billable vs non-billable
- Calculate revenue if rates available

## Related Commands

- `/timesheet` - Detailed timesheet report
- `/notion-sync` - Sync to Notion
- `/generate-activity-log` - Generate from git commits
