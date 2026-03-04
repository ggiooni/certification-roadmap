# Certification Roadmap — AI Automation Engineer

Interactive app to track my certification path and weekly schedule. Built with React 18 + Vite, deployed on GitHub Pages.

**Live:** https://ggiooni.github.io/certification-roadmap/

## Features

### Certification Tracker
- 3 certification phases with checklists and progress bars:
  1. **UiPath Automation Developer Associate** (Apr–Jul 2026)
  2. **UCD Professional Academy — Business Automation with Python** (Aug–Nov 2026)
  3. **Microsoft PL-500: Power Automate RPA Developer** (Dec 2026–Mar 2027)
- Estimated hours per task with overall progress tracking
- Notes per step with localStorage persistence
- Export/import progress as JSON

### Weekly Planner
- Visual week grid (7 days, 7:00–23:00) with color-coded blocks
- **Block types:**
  - Sport blocks (recurring, fixed) — Gym, Climbing, Football
  - University classes (imported from ICS, fixed)
  - Work shifts (configurable per day)
  - Study sessions (confirm from certification steps)
  - Custom events (user-created)
- Overlap handling — side-by-side rendering when blocks overlap
- Deadlines & exams panel from ICS data

### ICS Import (Moodle / University)
- Import `.ics` files from Moodle or any calendar
- Automatically parses class events (Attendance type) and deadlines ("is due" events)
- Extracts clean module names from course codes
- UTC to Europe/Dublin timezone conversion

### Google Calendar Sync
- OAuth 2.0 client-side flow (Google Identity Services + gapi)
- Syncs all weekly blocks to a Google Calendar
- Custom reminders per block type (classes: 30min, sports: 60+10min, work: 15min, study: 30min)
- Credentials stored in localStorage

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Deployment (GitHub Pages)

Automatic via GitHub Actions — every push to `master` triggers build and deploy.

Workflow: `.github/workflows/deploy.yml`

## Google Calendar Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google Calendar API**
4. Go to **APIs & Services > Credentials**
5. Create an **OAuth 2.0 Client ID** (Web application)
   - Authorized JavaScript origins: `https://ggiooni.github.io`
   - (For local dev, also add `http://localhost:5173`)
6. Create an **API Key**
7. In the app, open the Weekly Planner and paste both credentials in the setup panel

## Tech Stack

- **React 18** — single-file component architecture (`src/App.jsx`)
- **Vite** — dev server and build tool
- **localStorage** — all data persists locally (no backend)
- **Google Calendar API** — client-side OAuth via GIS
- **GitHub Actions** — CI/CD to GitHub Pages

## Project Structure

```
certification-roadmap/
├── index.html              # Entry point (includes Google API scripts)
├── vite.config.js          # Vite config with GitHub Pages base path
├── package.json
├── src/
│   ├── main.jsx            # React root
│   └── App.jsx             # Entire app (certifications + weekly planner)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deploy workflow
└── CLAUDE.md               # Project context for AI assistants
```

## How It Works

### Data Flow
- All state is managed with React `useState` + `useEffect` for localStorage sync
- Certification progress, planner data, class events, deadlines, and Google credentials each have their own localStorage keys
- Week navigation calculates Monday-based weeks from the current date

### Weekly Planner Grid
- CSS Grid for the time axis (7:00–23:00 rows) with absolute-positioned overlays per day
- Blocks are positioned using percentage-based `top` and `height` within each day column
- Overlapping blocks are detected and laid out in side-by-side columns automatically

### ICS Parsing
- Handles line unfolding (RFC 5545)
- Extracts `DTSTART`, `DTEND`, `SUMMARY`, `CATEGORIES`, `DESCRIPTION`
- Converts UTC timestamps to Europe/Dublin timezone
- Classifies events as class sessions or deadlines based on content

## TODO
- [ ] Pomodoro timer for study sessions
- [ ] Dashboard with stats (hours studied, completion %, streaks)
- [ ] Drag-and-drop for moveable blocks
- [ ] Dark/light theme toggle
- [ ] Mobile-responsive layout improvements
