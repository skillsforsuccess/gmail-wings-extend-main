# GmailCRM Step-by-Step Completion Checklist (for Ma'am)

> Goal: make this checklist executable, testable, and easy to report.  
> Rule: bawat step may **Done Criteria** + **How to Test**.  
> If hindi ma-automate locally, mark as **Human Confirmation Required**.

---

## 0) Current Baseline (today)

### Status summary
- Existing repo is currently a nested React/Vite app, not yet the required GmailCRM monorepo layout.
- Required `gmailcrm/extension` and `gmailcrm/backend` deliverables are not yet scaffolded.
- No current Chrome extension MV3 runtime, backend API server, SQLite schema, or OAuth/JWT handshake code.

### Baseline checks (already done / repeat anytime)
1. Check required top-level folders:
   ```bash
   test -d gmailcrm/extension && echo "extension exists" || echo "extension missing"
   test -d gmailcrm/backend && echo "backend exists" || echo "backend missing"
   ```
2. Check if core stack signatures exist:
   ```bash
   rg -n "manifest_version|chrome\.identity|getAuthToken|better-sqlite3|express\(" .
   ```

---

## 1) Create Exact Monorepo Structure

### Step 1.1 — Create required directories/files exactly as requested
Create this structure exactly:
- `gmailcrm/extension/...`
- `gmailcrm/backend/...`
- `gmailcrm/package.json`
- `gmailcrm/README.md`

### Done Criteria
- All requested folders and files exist in exact paths.

### How to Test
```bash
find gmailcrm -maxdepth 5 -type f | sort
```
- Compare output with the required spec list.

---

## 2) Chrome Extension Foundation (Manifest V3)

### Step 2.1 — Implement `extension/manifest.json`
Must include:
- `name: "GmailCRM"`
- `version: "1.0.0"`
- `manifest_version: 3`
- correct `permissions`, `host_permissions`
- content script mapping for Gmail
- `action` popup
- background service worker path
- web accessible resources for styles/content scripts

### Done Criteria
- Manifest validates and Chrome can load unpacked extension without manifest errors.

### How to Test
1. Static check:
   ```bash
   cat gmailcrm/extension/manifest.json
   ```
2. Human Confirmation Required (Chrome UI):
   - Open `chrome://extensions`
   - Enable Developer Mode
   - Load unpacked `gmailcrm/extension`
   - Confirm: no “Manifest is invalid” errors.

---

## 3) Gmail Injector + Sidebar/Compose Hooks

### Step 3.1 — Implement `gmail-injector.js`
Must do:
- Wait for Gmail navigation root (`[role="navigation"]`)
- Use `MutationObserver` on `document.body`
- Detect thread containers and call `sidebar.js`
- Detect compose containers and call `compose-toolbar.js`
- Set `chrome.storage.local` key `gmailcrm_api_url` defaulting to `http://localhost:3001`
- Use fallback selectors (Gmail DOM is unstable)

### Step 3.2 — Implement sidebar/compose/mail-merge/tracker scripts
Files:
- `sidebar.js`
- `compose-toolbar.js`
- `mail-merge.js`
- `tracker-injector.js`

### Done Criteria
- Opening Gmail thread shows CRM sidebar.
- Opening compose window shows added CRM buttons.
- API URL key is stored in `chrome.storage.local`.

### How to Test
1. Static existence check:
   ```bash
   ls gmailcrm/extension/content
   ```
2. Human Confirmation Required (Gmail runtime):
   - Load extension in Chrome.
   - Open Gmail inbox + open an email thread.
   - Confirm sidebar appears.
   - Click Compose.
   - Confirm CRM buttons appear.
3. Optional DevTools check in Gmail tab:
   ```js
   chrome.storage.local.get('gmailcrm_api_url', console.log)
   ```

---

## 4) Backend + SQLite Core

### Step 4.1 — Implement DB schema exactly
File: `backend/db/schema.sql` with required tables:
- users
- contacts
- pipelines
- deals
- email_tracks
- tracked_links
- mail_merge_jobs

### Step 4.2 — Implement DB connection/bootstrap
File: `backend/db/database.js` using `better-sqlite3`.

### Step 4.3 — Implement Express server
File: `backend/server.js` with:
- CORS for extension + localhost
- `/health`
- JWT auth middleware usage
- route mounting
- tracking endpoints for open/click

### Done Criteria
- Server starts successfully.
- Schema is created and queryable.
- `/health` returns OK.

### How to Test
1. Start backend:
   ```bash
   node gmailcrm/backend/server.js
   ```
2. Health check:
   ```bash
   curl -i http://localhost:3001/health
   ```
3. DB check (example; depends on chosen db path):
   ```bash
   sqlite3 gmailcrm/backend/db/gmailcrm.sqlite ".tables"
   ```

---

## 5) API Routes (CRUD + Tracking + Mail Merge)

### Step 5.1 — Implement required route files
- `routes/auth.js`
- `routes/contacts.js`
- `routes/deals.js`
- `routes/pipelines.js`
- `routes/tracking.js`
- `routes/mailmerge.js`
- `middleware/auth.js`

### Step 5.2 — Expose endpoints
Required minimum behavior:
- CRUD for:
  - `/api/contacts`
  - `/api/deals`
  - `/api/pipelines`
  - `/api/email-tracks`
  - `/api/mail-merge`
- Tracking:
  - `GET /track/open/:pixelToken.png` returns 1x1 transparent GIF + records open
  - `GET /track/click/:linkToken` records click + redirects

### Done Criteria
- CRUD endpoints respond correctly (200/201/204).
- Tracking endpoints increment counters and timestamps.

### How to Test
Use `curl` or Postman with JWT token.

Example checks:
```bash
curl -i http://localhost:3001/track/open/test-token.png
curl -i http://localhost:3001/track/click/test-link-token
```

Human Confirmation Required if dynamic data setup is incomplete:
- If test tokens are not seeded yet, backend dev should confirm tracking works via seeded records/manual DB verification.

---

## 6) OAuth + JWT Handshake

### Step 6.1 — Extension side auth
- Use `chrome.identity.getAuthToken()`.
- Send Google token to backend token-exchange endpoint.
- Store backend JWT in `chrome.storage.local`.

### Step 6.2 — Backend side auth
- Verify/accept Google token (or exchange flow as designed).
- Issue app JWT.
- Protect `/api/*` routes via middleware.

### Done Criteria
- User can authenticate from extension.
- Protected API requests succeed with JWT and fail without JWT.

### How to Test
1. API auth negative test:
   ```bash
   curl -i http://localhost:3001/api/contacts
   ```
   Expect unauthorized.
2. API auth positive test with token:
   ```bash
   curl -i -H "Authorization: Bearer <JWT>" http://localhost:3001/api/contacts
   ```
   Expect success.
3. Human Confirmation Required:
   - Actual Google OAuth consent flow must be tested in Chrome extension runtime by a human.

---

## 7) Dashboard Placement + Integration

### Step 7.1 — Move/create dashboard under `extension/dashboard`
Must include:
- `index.html`
- `src/App.jsx`
- pages/components specified in brief

### Step 7.2 — Connect dashboard to backend APIs
- Pipeline, contacts, analytics data should come from backend routes.

### Done Criteria
- Dashboard runs and displays live backend data.

### How to Test
```bash
cd gmailcrm/extension/dashboard && npm install && npm run dev
```
Then verify UI pages load and API calls succeed.

Human Confirmation Required:
- Visual/UX acceptance of Kanban and panels.

---

## 8) README + Deployment Instructions

### Step 8.1 — Replace generic README with project-specific docs
Must include:
- local setup
- backend env vars
- SQLite notes
- extension unpacked loading steps
- Railway/Render deployment steps
- troubleshooting + known limits

### Done Criteria
- A new team member can run backend + load extension without verbal help.

### How to Test
- Dry-run docs from clean terminal/profile.
- Human Confirmation Required:
  - Another team member follows README and confirms they can run the project.

---

## 9) End-to-End Acceptance Flow (Final Gate)

### Required scenario
1. Login/auth from extension.
2. Create contact.
3. Create deal and assign pipeline stage.
4. Send tracked email.
5. Open tracking pixel and click tracked link.
6. Verify open/click counters update.

### Done Criteria
- Full flow works from extension + backend + DB.

### How to Test
- Mix automated API checks + manual Gmail runtime flow.
- Human Confirmation Required:
  - Final sign-off from tester that all 6 actions passed in real Gmail environment.

---

## Suggested report to Ma'am (ready to copy)

**Current progress:** UI foundation exists, but requested full-stack GmailCRM architecture is not yet complete.  
**What is missing:** extension runtime (MV3 + Gmail injection), backend+DB APIs, OAuth/JWT integration, and final deployment docs.  
**How we will prove completion:** we will submit this checklist with per-step test evidence (command outputs + manual confirmation notes), and only mark “Done” when each step passes its criteria.

---

## Execution Tracker (fill habang gumagawa)

- [ ] Step 1 Monorepo scaffold complete
- [ ] Step 2 Manifest valid and extension loads
- [ ] Step 3 Gmail injector + sidebar/compose working
- [ ] Step 4 Backend + DB health verified
- [ ] Step 5 CRUD + tracking endpoints verified
- [ ] Step 6 OAuth/JWT handshake verified
- [ ] Step 7 Dashboard under extension integrated
- [ ] Step 8 README complete and validated by teammate
- [ ] Step 9 End-to-end scenario passed

If any checkbox cannot be fully tested, write:  
**"Needs Human Confirmation"** + reason + who validated + date.
