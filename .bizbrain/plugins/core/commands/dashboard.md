# Dashboard Command

Launch or open the BizBrain configuration dashboard.

## Instructions

1. **Check if dashboard server is running**
   - Look for process on port 3456 (or configured port)
   - Check `{{BRAIN_PATH}}/.bizbrain/dashboard/.pid` file

2. **If not running:**
   - Start the dashboard server:
     ```bash
     cd {{BRAIN_PATH}}/.bizbrain/dashboard
     node server.js &
     ```
   - Save PID to `.pid` file
   - Wait 2 seconds for server to initialize

3. **If already running:**
   - Confirm server is responsive (check port)
   - Use existing instance

4. **Open in browser**
   - URL: `http://localhost:3456`
   - On Windows: `start http://localhost:3456`
   - On Mac: `open http://localhost:3456`
   - On Linux: `xdg-open http://localhost:3456`

5. **Confirm successful launch**

```
✓ Dashboard server running on http://localhost:3456
✓ Opening in browser...

Dashboard features:
  - View and edit Brain configuration
  - Activate/deactivate modules
  - Manage integrations
  - View entity overview
  - Monitor active todos
  - Configure sync settings

To stop the dashboard:
  /dashboard stop
```

6. **Handle errors**
   - If port in use: suggest alternative port or show conflict
   - If dependencies missing: `npm install` in dashboard folder
   - If browser doesn't open: show URL for manual opening

## Dashboard Stop

If user runs `/dashboard stop`:
- Read PID from `.pid` file
- Kill process
- Remove `.pid` file
- Confirm shutdown

## Dashboard State

The dashboard reads from:
- `{{BRAIN_PATH}}/.bizbrain/config.json`
- `{{BRAIN_PATH}}/.bizbrain/wizard/state.json`
- `{{BRAIN_PATH}}/.bizbrain/capabilities.json`
- `{{BRAIN_PATH}}/Operations/todos/aggregated-todos.json`

Any changes made in dashboard are written back to these files.

## Requirements

- Node.js installed
- Dashboard dependencies installed (`npm install` in `.bizbrain/dashboard/`)
