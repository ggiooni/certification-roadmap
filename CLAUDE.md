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
- React 18 + Vite
- localStorage for persistence (runs locally on my machine)
- Google Calendar API integration (to be added — for study alerts)

## Key features to build/improve
- Checklist with persistence (done — needs polish)
- Google Calendar API integration for automatic study block reminders
- Notes system per task
- Export/import progress
- Dashboard with stats (hours studied, completion %, streaks)
- Maybe: Pomodoro timer for study sessions
- Maybe: Connection to my actual Google Calendar via OAuth

## Code style
- Single-file React components are fine for now
- Tailwind-like inline styles (no CSS files)
- Spanish for UI text, English for code/comments
- Keep it simple — this is a personal tool, not a SaaS
