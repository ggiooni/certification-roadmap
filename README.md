# Certification Roadmap — AI Automation Engineer

Interactive app to track my certification path and weekly schedule. Built with React 18 + Vite, deployed on Vercel with serverless API.

**Live:** https://certification-roadmap.vercel.app/

## Features

### Certification Tracker
- 4 certification phases with checklists and progress bars:
  1. **DevOps Module** (Mar–Apr 2026)
  2. **UiPath Automation Developer Associate** (Apr–Jul 2026)
  3. **UCD Professional Academy — Business Automation with Python** (Aug–Nov 2026)
  4. **Microsoft PL-500: Power Automate RPA Developer** (Dec 2026–Mar 2027)
- Estimated hours per task with overall progress tracking
- Notes per step with localStorage persistence
- Streak tracking and stats dashboard
- Export/import progress as JSON

### Weekly Planner
- Visual week grid (7 days, 7:00–23:00) with color-coded blocks
- **Block types:** Sport (recurring), University classes (ICS import), Work shifts, Study sessions, Custom events
- Overlap handling — side-by-side rendering
- Deadlines & exams panel from ICS data + certification due dates

### Google Calendar Auto-Sync
- **Server-side OAuth 2.0** — refresh token stored in Vercel KV (no token loss on refresh)
- **Auto-sync** — 2 second debounce after any block change
- Smart sync: creates new events, deletes removed ones, skips unchanged
- Custom reminders per block type (classes: 30min, sports: 60+10min, work: 15min, study: 30min)
- Color-coded by type in Google Calendar

### REST API
- `POST /api/events` — add events from external tools (Claude Code, scripts, automations)
- `DELETE /api/events` — remove events
- `GET /api/events?weekKey=2026-W11` — list events for a week
- Protected by API key via `Authorization: Bearer` header

## Tech Stack

- **React 18** + **Vite** — frontend
- **Vercel** — hosting + serverless functions
- **Vercel KV** — server-side token storage (free tier)
- **googleapis** — server-side Google Calendar API
- **localStorage** — client-side data persistence

## Project Structure

```
certification-roadmap/
├── index.html                # Entry point
├── vite.config.js            # Vite config
├── vercel.json               # Vercel config (rewrites, build)
├── package.json
├── src/
│   ├── main.jsx              # React root
│   ├── App.jsx               # Main app (certifications + weekly planner)
│   └── syncService.js        # Frontend sync service (debounced GCal sync)
├── api/
│   ├── status.js             # GET /api/status — health check
│   ├── events.js             # GET/POST/DELETE /api/events — CRUD API
│   └── gcal/
│       ├── auth.js           # OAuth flow (login, callback, disconnect)
│       └── sync.js           # Smart sync to Google Calendar
└── CLAUDE.md                 # Project context for AI assistants
```

## Architecture

```
[React App]  <——>  [/api/* serverless]  <——>  [Google Calendar API]
      |                    |
  localStorage         Vercel KV
  (blocks, progress)   (refresh token)
      |
[Claude Code / curl]  ——>  POST /api/events  (API key auth)
```

## Setup (Development)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Deployment (Vercel)

Automatic — every push to `master` triggers build and deploy via Vercel.

### First-time setup

#### 1. Import project in Vercel
- Go to [vercel.com](https://vercel.com) → Add New Project → Import `certification-roadmap`
- Framework: Vite (auto-detected)
- Deploy

#### 2. Create Vercel KV store
- Vercel Dashboard → **Storage** → **Create** → **KV**
- Link it to the `certification-roadmap` project
- This auto-adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars

#### 3. Google Cloud Console setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use existing)
3. Enable **Google Calendar API** (APIs & Services → Library)
4. Go to **APIs & Services → Credentials**
5. Create **OAuth 2.0 Client ID** (Web application):
   - **Authorized redirect URIs:** `https://certification-roadmap.vercel.app/api/gcal/auth`
   - For local dev, also add: `http://localhost:3000/api/gcal/auth`
6. Copy the **Client ID** and **Client Secret**

#### 4. Environment variables in Vercel
Go to Vercel → Project → **Settings** → **Environment Variables** and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `GOOGLE_CLIENT_ID` | `123...apps.googleusercontent.com` | OAuth Client ID from Google Cloud |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | OAuth Client Secret from Google Cloud |
| `API_KEY` | Any string you choose | Protects /api/events from unauthorized access |

> `KV_REST_API_URL` and `KV_REST_API_TOKEN` are added automatically when you link the KV store.

#### 5. Redeploy
After adding env vars: Vercel → Deployments → ⋮ → **Redeploy** to pick up the new variables.

#### 6. Connect Google Calendar
- Open the app → Weekly Planner → click **"Conectar con Google"**
- Authorize in Google's consent screen
- Done! Auto-sync is now active. You only do this once.

## API Usage (External)

```bash
# Check status
curl https://certification-roadmap.vercel.app/api/status

# Add a custom event
curl -X POST https://certification-roadmap.vercel.app/api/events \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "weekKey": "2026-W11",
    "event": {
      "day": 0,
      "start": 14,
      "end": 15.5,
      "label": "DevOps Study",
      "type": "custom"
    }
  }'

# List events for a week
curl "https://certification-roadmap.vercel.app/api/events?weekKey=2026-W11" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Delete event by index
curl -X DELETE https://certification-roadmap.vercel.app/api/events \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"weekKey": "2026-W11", "index": 0}'

# Force sync to Google Calendar
curl -X POST https://certification-roadmap.vercel.app/api/gcal/sync \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"blocks": [...], "weekDates": ["2026-03-09", ...]}'
```

### Event fields
| Field | Type | Description |
|-------|------|-------------|
| `day` | 0-6 | Day of week (0=Monday, 6=Sunday) |
| `start` | float | Start hour (e.g., 14.5 = 2:30 PM) |
| `end` | float | End hour (e.g., 16 = 4:00 PM) |
| `label` | string | Event name |
| `type` | string | `sport`, `class`, `work`, `study`, or `custom` |
