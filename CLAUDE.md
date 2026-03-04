# Certification Roadmap — Project Context

## What is this
An interactive React app to track my AI Automation Engineer certification path. I'm building this to have on my desktop and track progress through 3 certifications over 12 months.

## My background
- Final-year BSc Computing student at Dorset College Dublin
- Already running an AI automation agency (building bots, selling services to SMBs)
- Experience with Python, WhatsApp bots (Twilio), n8n, APIs, Supabase
- Bilingual: Spanish (native) + English
- Living in Dublin, Ireland
- Target markets: corporates/multinationals in Dublin + mining companies in Chile/LATAM

## The 3 certifications (in order)
1. **UiPath Automation Developer Associate** — Apr–Jul 2026, $150 exam, free training
2. **UCD Professional Academy — Business Automation with Python** — Aug–Nov 2026, ~€1,500
3. **Microsoft PL-500: Power Automate RPA Developer** — Dec 2026–Mar 2027, ~€150 exam

## Tech stack
- React 18 + Vite, deployed on Vercel
- localStorage for persistence (planner data, progress)
- Vercel KV for server-side storage (Google OAuth refresh token)
- Serverless API functions (`/api/*`) for Google Calendar sync
- Google Calendar auto-sync via server-side OAuth (refresh token in KV)

## Architecture
```
[React App]  <-->  [/api/* serverless]  <-->  [Google Calendar API]
     |                    |
localStorage         Vercel KV
```

### API Endpoints
- `GET /api/status` — health check + GCal connection status
- `GET /api/gcal/auth?action=login` — start OAuth flow
- `GET /api/gcal/auth?code=...` — OAuth callback
- `POST /api/gcal/sync` — sync blocks to Google Calendar
- `GET/POST/DELETE /api/events` — CRUD for planner events (API key auth)

### Environment Variables (Vercel)
- `GOOGLE_CLIENT_ID` — OAuth client ID
- `GOOGLE_CLIENT_SECRET` — OAuth client secret
- `GCAL_CALENDAR_ID` — target calendar (defaults to hardcoded)
- `API_KEY` — for external API access (Claude Code, scripts)
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` — auto-set by Vercel KV

## Key features
- Certification checklist with progress tracking, notes, streaks
- Weekly planner with visual grid (7 days x 16 hours)
- Google Calendar auto-sync (2s debounce after block changes)
- REST API for external tools (Claude Code, scripts)
- ICS import from Moodle
- Export/import progress as JSON

## Code style
- Single-file React components are fine for now
- Tailwind-like inline styles (no CSS files)
- Spanish for UI text, English for code/comments
- Keep it simple — this is a personal tool, not a SaaS
