import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'

// ── Certification data ──────────────────────────────────────────────
const CERTIFICATIONS = [
  {
    id: 'uipath',
    title: 'UiPath Automation Developer Associate',
    shortTitle: 'UiPath',
    color: '#F56040',
    colorFaded: 'rgba(245,96,64,0.15)',
    period: 'Abr – Jul 2026',
    startDate: '2026-04-01',
    endDate: '2026-07-31',
    cost: 'USD $150 (training gratis)',
    description: 'RPA fundamentals, Studio, Orchestrator, attended/unattended bots.',
    steps: [
      { id: 'u1', label: 'Crear cuenta en UiPath Academy', est: 0.5, dueDate: '2026-04-05', resources: ['https://academy.uipath.com'] },
      { id: 'u2', label: 'Completar "RPA Developer Foundation"', est: 20, dueDate: '2026-04-30', resources: ['https://academy.uipath.com/learning-plans'] },
      { id: 'u3', label: 'Completar "UiPath Studio Overview"', est: 8, dueDate: '2026-05-15', resources: ['https://academy.uipath.com'] },
      { id: 'u4', label: 'Completar "Build Your First Process"', est: 6, dueDate: '2026-05-25', resources: ['https://academy.uipath.com'] },
      { id: 'u5', label: 'Completar "Variables, Arguments & Control Flow"', est: 10, dueDate: '2026-06-05', resources: ['https://docs.uipath.com'] },
      { id: 'u6', label: 'Completar "Selectors & UI Automation"', est: 8, dueDate: '2026-06-15', resources: ['https://docs.uipath.com'] },
      { id: 'u7', label: 'Completar "REFramework"', est: 12, dueDate: '2026-06-25', resources: ['https://docs.uipath.com'] },
      { id: 'u8', label: 'Completar "Orchestrator for Developers"', est: 8, dueDate: '2026-07-05', resources: ['https://academy.uipath.com'] },
      { id: 'u9', label: 'Práctica con mock exams', est: 10, dueDate: '2026-07-20', resources: ['https://www.uipath.com/learning/certification'] },
      { id: 'u10', label: 'Rendir examen de certificación', est: 2, dueDate: '2026-07-28', resources: ['https://www.uipath.com/learning/certification'] },
    ],
  },
  {
    id: 'ucd',
    title: 'UCD Professional Academy — Business Automation with Python',
    shortTitle: 'UCD Python',
    color: '#00B4D8',
    colorFaded: 'rgba(0,180,216,0.15)',
    period: 'Ago – Nov 2026',
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    cost: '~€1,500',
    description: 'Python scripting, APIs, web scraping, automation pipelines, portfolio project.',
    steps: [
      { id: 'd1', label: 'Inscripción y pago', est: 1, dueDate: '2026-07-15', resources: ['https://professionalacademy.ucd.ie'] },
      { id: 'd2', label: 'Setup entorno Python (venv, VS Code, Git)', est: 2, dueDate: '2026-08-05', resources: ['https://code.visualstudio.com'] },
      { id: 'd3', label: 'Módulo 1 — Python Fundamentals', est: 15, dueDate: '2026-08-20', resources: [] },
      { id: 'd4', label: 'Módulo 2 — Data Handling (pandas, CSV, JSON)', est: 12, dueDate: '2026-09-05', resources: [] },
      { id: 'd5', label: 'Módulo 3 — APIs & Web Scraping', est: 14, dueDate: '2026-09-20', resources: [] },
      { id: 'd6', label: 'Módulo 4 — Automation Pipelines', est: 14, dueDate: '2026-10-05', resources: [] },
      { id: 'd7', label: 'Módulo 5 — Testing & Deployment', est: 10, dueDate: '2026-10-20', resources: [] },
      { id: 'd8', label: 'Proyecto final — diseño y propuesta', est: 5, dueDate: '2026-10-30', resources: [] },
      { id: 'd9', label: 'Proyecto final — desarrollo', est: 20, dueDate: '2026-11-15', resources: [] },
      { id: 'd10', label: 'Proyecto final — presentación y entrega', est: 4, dueDate: '2026-11-25', resources: [] },
    ],
  },
  {
    id: 'pl500',
    title: 'Microsoft PL-500: Power Automate RPA Developer',
    shortTitle: 'PL-500',
    color: '#8338EC',
    colorFaded: 'rgba(131,56,236,0.15)',
    period: 'Dic 2026 – Mar 2027',
    startDate: '2026-12-01',
    endDate: '2027-03-31',
    cost: '~€150',
    description: 'Power Automate Desktop, cloud flows, AI Builder, connectors, ALM.',
    steps: [
      { id: 'p1', label: 'Crear cuenta Microsoft Learn + sandbox', est: 1, dueDate: '2026-12-05', resources: ['https://learn.microsoft.com/en-us/training/'] },
      { id: 'p2', label: 'Learning Path: "Get started with Power Automate"', est: 8, dueDate: '2026-12-20', resources: ['https://learn.microsoft.com/en-us/training/paths/get-started-power-automate/'] },
      { id: 'p3', label: 'Learning Path: "Work with Power Automate Desktop"', est: 12, dueDate: '2027-01-10', resources: ['https://learn.microsoft.com/en-us/training/paths/pad-work-power-automate-desktop/'] },
      { id: 'p4', label: 'Learning Path: "Build expertise with cloud flows"', est: 10, dueDate: '2027-01-25', resources: ['https://learn.microsoft.com'] },
      { id: 'p5', label: 'Módulo: AI Builder en Power Automate', est: 6, dueDate: '2027-02-05', resources: ['https://learn.microsoft.com'] },
      { id: 'p6', label: 'Módulo: Connectors & custom connectors', est: 8, dueDate: '2027-02-15', resources: ['https://learn.microsoft.com'] },
      { id: 'p7', label: 'Módulo: ALM & solution management', est: 6, dueDate: '2027-02-25', resources: ['https://learn.microsoft.com'] },
      { id: 'p8', label: 'Práctica con mock exams (MeasureUp / MS)', est: 10, dueDate: '2027-03-10', resources: ['https://www.measureup.com'] },
      { id: 'p9', label: 'Repaso final de temas débiles', est: 8, dueDate: '2027-03-20', resources: [] },
      { id: 'p10', label: 'Rendir examen PL-500', est: 2, dueDate: '2027-03-28', resources: ['https://learn.microsoft.com/en-us/credentials/certifications/power-automate-rpa-developer-associate/'] },
    ],
  },
]

const ALL_STEP_IDS = CERTIFICATIONS.flatMap(c => c.steps.map(s => s.id))
const TOTAL_HOURS = CERTIFICATIONS.reduce((sum, c) => sum + c.steps.reduce((s2, st) => s2 + st.est, 0), 0)

// ── Storage helpers ─────────────────────────────────────────────────
const STORAGE_KEY = 'cert-roadmap-v1'
const STREAK_KEY = 'cert-roadmap-streak'
const TAB_KEY = 'cert-roadmap-tab'
const PLANNER_KEY_PREFIX = 'cert-planner-'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { checked: {}, notes: {} }
    return JSON.parse(raw)
  } catch { return { checked: {}, notes: {} } }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    if (!raw) return { lastDate: null, count: 0 }
    return JSON.parse(raw)
  } catch { return { lastDate: null, count: 0 } }
}

function saveStreak(streak) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak))
}

function loadTab() {
  try { return localStorage.getItem(TAB_KEY) || 'certs' } catch { return 'certs' }
}

function loadPlannerData(weekKey) {
  const defaults = { workShifts: {}, workouts: {}, confirmedStudy: [], customEvents: [] }
  try {
    const raw = localStorage.getItem(PLANNER_KEY_PREFIX + weekKey)
    if (!raw) return defaults
    return { ...defaults, ...JSON.parse(raw) }
  } catch { return defaults }
}

function savePlannerData(weekKey, data) {
  localStorage.setItem(PLANNER_KEY_PREFIX + weekKey, JSON.stringify(data))
}

// ── Helpers ─────────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntil(iso) {
  const target = new Date(iso + 'T00:00:00')
  const now = new Date(today() + 'T00:00:00')
  return Math.ceil((target - now) / 86400000)
}

function googleCalendarUrl(title, dateIso) {
  const start = dateIso.replace(/-/g, '')
  const dtStart = start + 'T100000'
  const dtEnd = start + 'T120000'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `📚 ${title}`,
    dates: `${dtStart}/${dtEnd}`,
    details: 'Bloque de estudio — Certification Roadmap',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function getPhaseStatus(cert, checked) {
  const total = cert.steps.length
  const done = cert.steps.filter(s => checked[s.id]).length
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 }
}

function getNextDeadline(cert, checked) {
  const pending = cert.steps.filter(s => !checked[s.id])
  if (!pending.length) return null
  return pending.reduce((a, b) => a.dueDate < b.dueDate ? a : b)
}

// ── Week helpers ────────────────────────────────────────────────────
function getWeekKey(date) {
  const d = new Date(date)
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((d - jan1) / 86400000) + 1
  const weekNum = Math.ceil((dayOfYear + jan1.getDay()) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function getWeekDates(refDate) {
  const d = new Date(refDate)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day // Monday as start
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  const dates = []
  for (let i = 0; i < 7; i++) {
    const dd = new Date(monday)
    dd.setDate(monday.getDate() + i)
    dates.push(dd)
  }
  return dates
}

function formatShortDate(date) {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7) // 7:00 to 22:00

// ── Fixed sport blocks (recurring weekly) ───────────────────────────
const SPORT_BLOCKS = [
  { day: 0, start: 10, end: 11.5, label: 'Gym', type: 'sport' },
  { day: 2, start: 19.5, end: 21, label: 'Climbing', type: 'sport' },
  { day: 3, start: 7, end: 9, label: 'Fútbol', type: 'sport' },
]

const WORKOUT_SLOTS = [
  { id: 'gym-mon', day: 0, label: 'Gym', time: '10:00–11:30' },
  { id: 'climb-wed', day: 2, label: 'Climbing', time: '19:30–21:00' },
  { id: 'futbol-thu', day: 3, label: 'Fútbol', time: '7:00–9:00' },
]

// ── ICS Import ──────────────────────────────────────────────────────
const CLASSES_STORAGE_KEY = 'cert-planner-classes'

function loadClassEvents() {
  try {
    const raw = localStorage.getItem(CLASSES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveClassEvents(events) {
  localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(events))
}

const DEADLINES_STORAGE_KEY = 'cert-planner-deadlines'

function loadDeadlines() {
  try {
    const raw = localStorage.getItem(DEADLINES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveDeadlines(deadlines) {
  localStorage.setItem(DEADLINES_STORAGE_KEY, JSON.stringify(deadlines))
}

function extractModuleName(category) {
  let name = category
    .replace(/&amp\\?;/g, '&')
    .replace(/\\,/g, ',')
    .replace(/^CS\d+L\d+M\d+[A-Z]?\s+/, '')
    .replace(/\s+\d{4}[A-Z]$/, '')
    .trim()
  const shorts = {
    'Statistics & Data Science': 'Stats & Data',
    'Full Stack Development 2': 'Full Stack Dev',
    'Game Design 2': 'Game Design',
    'Software Engineering': 'Software Eng',
  }
  return shorts[name] || name
}

function parseICS(icsText) {
  // Unfold continuation lines
  const unfolded = icsText.replace(/\r?\n[ \t]/g, '')
  const lines = unfolded.split(/\r?\n/)
  const classEvents = []
  const deadlines = []
  let current = null

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {}
    } else if (line === 'END:VEVENT' && current) {
      if (current.dtstart && current.dtend && current.categories) {
        // Convert UTC to Dublin time
        const start = icsDateToDublin(current.dtstart)
        const end = icsDateToDublin(current.dtend)
        if (start && end) {
          if (current.summary === 'Attendance') {
            const label = extractModuleName(current.categories)
            classEvents.push({
              uid: current.uid,
              date: dublinDateStr(current.dtstart),
              start: start.h + start.m / 60,
              end: end.h + end.m / 60,
              label,
              type: 'class',
              category: current.categories,
            })
          } else if (current.summary && current.summary.includes('is due')) {
            deadlines.push({
              uid: current.uid,
              date: dublinDateStr(current.dtstart),
              label: current.summary.replace(' is due', ''),
              category: current.categories,
            })
          }
        }
      }
      current = null
    } else if (current) {
      const colonIdx = line.indexOf(':')
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).split(';')[0]
        const value = line.slice(colonIdx + 1)
        if (key === 'UID') current.uid = value
        if (key === 'SUMMARY') current.summary = value
        if (key === 'DTSTART') current.dtstart = value
        if (key === 'DTEND') current.dtend = value
        if (key === 'CATEGORIES') current.categories = value
      }
    }
  }
  return { classEvents, deadlines }
}

function icsDateToDublin(dtStr) {
  const y = parseInt(dtStr.slice(0, 4))
  const mo = parseInt(dtStr.slice(4, 6)) - 1
  const d = parseInt(dtStr.slice(6, 8))
  const h = parseInt(dtStr.slice(9, 11))
  const mi = parseInt(dtStr.slice(11, 13))
  const utc = new Date(Date.UTC(y, mo, d, h, mi, 0))
  const dublin = new Date(utc.toLocaleString('en-US', { timeZone: 'Europe/Dublin' }))
  return { h: dublin.getHours(), m: dublin.getMinutes() }
}

function dublinDateStr(dtStr) {
  const y = parseInt(dtStr.slice(0, 4))
  const mo = parseInt(dtStr.slice(4, 6)) - 1
  const d = parseInt(dtStr.slice(6, 8))
  const h = parseInt(dtStr.slice(9, 11))
  const mi = parseInt(dtStr.slice(11, 13))
  const utc = new Date(Date.UTC(y, mo, d, h, mi, 0))
  return utc.toLocaleDateString('en-CA', { timeZone: 'Europe/Dublin' })
}

const BLOCK_COLORS = {
  class: '#3B82F6',
  sport: '#22C55E',
  work: '#F59E0B',
  study: '#8B5CF6',
  custom: '#EC4899',
  deadline: '#EF4444',
}

// ── Overlap layout for calendar blocks ──────────────────────────────
function layoutDayBlocks(blocks) {
  if (!blocks.length) return []
  const sorted = [...blocks].sort((a, b) => a.start - b.start || a.end - b.end)
  const groups = []
  let group = [sorted[0]]
  let groupEnd = sorted[0].end
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < groupEnd) {
      group.push(sorted[i])
      groupEnd = Math.max(groupEnd, sorted[i].end)
    } else {
      groups.push(group)
      group = [sorted[i]]
      groupEnd = sorted[i].end
    }
  }
  groups.push(group)
  const result = []
  for (const grp of groups) {
    const cols = []
    for (const block of grp) {
      let placed = false
      for (let c = 0; c < cols.length; c++) {
        if (cols[c] <= block.start) {
          cols[c] = block.end
          result.push({ ...block, _col: c, _totalCols: 0 })
          placed = true
          break
        }
      }
      if (!placed) {
        cols.push(block.end)
        result.push({ ...block, _col: cols.length - 1, _totalCols: 0 })
      }
    }
    const tc = cols.length
    for (let i = result.length - grp.length; i < result.length; i++) {
      result[i]._totalCols = tc
    }
  }
  return result
}

// ── Google Calendar Config ─────────────────────────────────────────
const GCAL_SCOPES = 'https://www.googleapis.com/auth/calendar.events'
const GCAL_DISCOVERY = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
const GCAL_CALENDAR_ID = 'e5e04e99051b8a3cf2cd0100cc98abbd59ebbdf8b4b5fe9011f3d848ca7b50e7@group.calendar.google.com'
const GCAL_CREDS_KEY = 'cert-roadmap-gcal-creds'

// Reminder config per block type (minutes before)
const GCAL_REMINDERS = {
  class: [{ method: 'popup', minutes: 30 }],
  sport: [{ method: 'popup', minutes: 60 }, { method: 'popup', minutes: 10 }],
  work: [{ method: 'popup', minutes: 15 }],
  study: [{ method: 'popup', minutes: 30 }],
  custom: [{ method: 'popup', minutes: 15 }],
}

// Google Calendar color IDs (1-11)
const GCAL_COLOR_MAP = {
  class: '9',    // Blueberry
  sport: '10',   // Basil (green)
  work: '5',     // Banana (yellow)
  study: '3',    // Grape (purple)
  custom: '4',   // Flamingo (pink)
}

function loadGCalCreds() {
  try {
    const raw = localStorage.getItem(GCAL_CREDS_KEY)
    if (!raw) return { clientId: '', apiKey: '' }
    return JSON.parse(raw)
  } catch { return { clientId: '', apiKey: '' } }
}

function saveGCalCreds(creds) {
  localStorage.setItem(GCAL_CREDS_KEY, JSON.stringify(creds))
}

// ── Styles ──────────────────────────────────────────────────────────
const S = {
  app: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#E4E4E7',
    background: '#0A0A0B',
    minHeight: '100vh',
    maxWidth: 960,
    margin: '0 auto',
    padding: '24px 20px 60px',
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 32,
  },
  h1: {
    fontSize: 28,
    fontWeight: 700,
    margin: '0 0 4px',
    color: '#FAFAFA',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: 14,
    color: '#71717A',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginTop: 20,
    marginBottom: 32,
  },
  statCard: (color) => ({
    background: '#18181B',
    border: '1px solid #27272A',
    borderRadius: 10,
    padding: '14px 16px',
    borderLeft: `3px solid ${color || '#3F3F46'}`,
  }),
  statLabel: {
    fontSize: 11,
    color: '#71717A',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: 0,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#FAFAFA',
    margin: '2px 0 0',
  },
  toolbar: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 28,
  },
  btn: (bg = '#27272A', fg = '#E4E4E7') => ({
    background: bg,
    color: fg,
    border: 'none',
    borderRadius: 6,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: 'opacity 0.15s',
  }),
  phaseCard: (color) => ({
    background: '#18181B',
    border: '1px solid #27272A',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderTop: `3px solid ${color}`,
  }),
  phaseHeader: {
    padding: '18px 20px 14px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    color: '#FAFAFA',
  },
  phaseMeta: {
    fontSize: 13,
    color: '#71717A',
    marginTop: 4,
  },
  progressBar: (pct, color) => ({
    height: 4,
    background: '#27272A',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
    position: 'relative',
  }),
  progressFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    background: color,
    borderRadius: 2,
    transition: 'width 0.4s ease',
  }),
  stepRow: (isChecked) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 20px',
    borderTop: '1px solid #1E1E21',
    opacity: isChecked ? 0.55 : 1,
    transition: 'opacity 0.2s',
  }),
  checkbox: (color) => ({
    width: 18,
    height: 18,
    marginTop: 2,
    accentColor: color,
    cursor: 'pointer',
    flexShrink: 0,
  }),
  stepLabel: (isChecked) => ({
    fontSize: 14,
    color: isChecked ? '#71717A' : '#E4E4E7',
    textDecoration: isChecked ? 'line-through' : 'none',
    flex: 1,
  }),
  stepMeta: {
    fontSize: 12,
    color: '#52525B',
    marginTop: 2,
  },
  badge: (bg) => ({
    display: 'inline-block',
    background: bg,
    color: '#FAFAFA',
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 7px',
    borderRadius: 4,
    marginLeft: 6,
  }),
  dueSoon: {
    display: 'inline-block',
    background: 'rgba(250,204,21,0.15)',
    color: '#FACC15',
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 7px',
    borderRadius: 4,
    marginLeft: 6,
  },
  overdue: {
    display: 'inline-block',
    background: 'rgba(239,68,68,0.15)',
    color: '#EF4444',
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 7px',
    borderRadius: 4,
    marginLeft: 6,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#52525B',
    cursor: 'pointer',
    padding: '2px 4px',
    fontSize: 15,
    borderRadius: 4,
    flexShrink: 0,
  },
  noteArea: {
    width: '100%',
    background: '#0F0F11',
    border: '1px solid #27272A',
    borderRadius: 6,
    color: '#D4D4D8',
    fontSize: 13,
    padding: '8px 10px',
    resize: 'vertical',
    minHeight: 50,
    marginTop: 6,
    fontFamily: 'inherit',
    outline: 'none',
  },
  resourceLink: {
    fontSize: 12,
    color: '#3B82F6',
    textDecoration: 'none',
    marginRight: 8,
  },
  timelineBar: {
    display: 'flex',
    gap: 2,
    marginBottom: 28,
    borderRadius: 6,
    overflow: 'hidden',
    height: 32,
  },
  timelineSeg: (color, widthPct, isActive) => ({
    background: isActive ? color : color + '44',
    width: `${widthPct}%`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
    color: isActive ? '#fff' : '#fff8',
    transition: 'all 0.3s',
  }),
  filterBar: {
    display: 'flex',
    gap: 6,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterBtn: (isActive, color) => ({
    background: isActive ? color + '22' : '#18181B',
    color: isActive ? color : '#71717A',
    border: `1px solid ${isActive ? color + '44' : '#27272A'}`,
    borderRadius: 20,
    padding: '5px 14px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  weeklyGoal: {
    background: '#18181B',
    border: '1px solid #27272A',
    borderRadius: 10,
    padding: '14px 16px',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  weeklyInput: {
    background: '#0F0F11',
    border: '1px solid #27272A',
    borderRadius: 6,
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: 600,
    padding: '4px 8px',
    width: 50,
    textAlign: 'center',
    outline: 'none',
  },
  // Tab styles
  tabBar: {
    display: 'flex',
    gap: 0,
    marginBottom: 28,
    borderBottom: '1px solid #27272A',
  },
  tab: (isActive) => ({
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '2px solid #FAFAFA' : '2px solid transparent',
    color: isActive ? '#FAFAFA' : '#71717A',
    fontSize: 14,
    fontWeight: 600,
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
}

// ── Components ──────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }) {
  return (
    <div style={S.statCard(color)}>
      <p style={S.statLabel}>{label}</p>
      <p style={S.statValue}>{value}</p>
      {sub && <p style={{ ...S.statLabel, marginTop: 2, fontSize: 12, textTransform: 'none' }}>{sub}</p>}
    </div>
  )
}

function StepItem({ step, cert, checked, notes, onToggle, onNote }) {
  const [showNote, setShowNote] = useState(!!notes[step.id])
  const isChecked = !!checked[step.id]
  const days = daysUntil(step.dueDate)

  return (
    <div>
      <div style={S.stepRow(isChecked)}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggle(step.id)}
          style={S.checkbox(cert.color)}
        />
        <div style={{ flex: 1 }}>
          <div style={S.stepLabel(isChecked)}>
            {step.label}
            {!isChecked && days < 0 && <span style={S.overdue}>Vencido ({Math.abs(days)}d)</span>}
            {!isChecked && days >= 0 && days <= 7 && <span style={S.dueSoon}>Pronto ({days}d)</span>}
          </div>
          <div style={S.stepMeta}>
            {formatDate(step.dueDate)} &middot; ~{step.est}h estimadas
            {step.resources.length > 0 && (
              <span>
                {' · '}
                {step.resources.map((r, i) => (
                  <a key={i} href={r} target="_blank" rel="noopener noreferrer" style={S.resourceLink}>
                    Recurso {i + 1}
                  </a>
                ))}
              </span>
            )}
          </div>
          {showNote && (
            <textarea
              style={S.noteArea}
              placeholder="Tus notas sobre este paso..."
              value={notes[step.id] || ''}
              onChange={(e) => onNote(step.id, e.target.value)}
              rows={2}
            />
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginTop: 2 }}>
          <button
            style={S.iconBtn}
            title="Agregar nota"
            onClick={() => setShowNote(!showNote)}
          >
            {showNote ? '▼' : '✎'}
          </button>
          <a
            href={googleCalendarUrl(step.label, step.dueDate)}
            target="_blank"
            rel="noopener noreferrer"
            style={S.iconBtn}
            title="Agregar a Google Calendar"
          >
            📅
          </a>
        </div>
      </div>
    </div>
  )
}

function PhaseCard({ cert, checked, notes, onToggle, onNote, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const { total, done, pct } = getPhaseStatus(cert, checked)
  const nextDeadline = getNextDeadline(cert, checked)
  const hoursLeft = cert.steps.filter(s => !checked[s.id]).reduce((s, st) => s + st.est, 0)

  return (
    <div style={S.phaseCard(cert.color)}>
      <div style={S.phaseHeader} onClick={() => setExpanded(!expanded)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={S.phaseTitle}>
              {expanded ? '▾' : '▸'} {cert.title}
            </h2>
            <div style={S.phaseMeta}>
              {cert.period} &middot; {cert.cost} &middot; {done}/{total} pasos &middot; ~{hoursLeft}h restantes
              {pct === 100 && <span style={S.badge('#22C55E')}>Completado</span>}
            </div>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: cert.color }}>{pct}%</span>
        </div>
        <div style={S.progressBar(pct, cert.color)}>
          <div style={S.progressFill(pct, cert.color)} />
        </div>
      </div>
      {expanded && cert.steps.map(step => (
        <StepItem
          key={step.id}
          step={step}
          cert={cert}
          checked={checked}
          notes={notes}
          onToggle={onToggle}
          onNote={onNote}
        />
      ))}
    </div>
  )
}

function Timeline({ checked }) {
  const months = ['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar']
  const now = new Date()
  const currentMonth = now.getFullYear() === 2026 ? now.getMonth() - 3 :
    now.getFullYear() === 2027 ? now.getMonth() + 9 : -1

  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ ...S.statLabel, marginBottom: 8 }}>Timeline 12 meses</p>
      <div style={S.timelineBar}>
        {months.map((m, i) => {
          let color = '#3F3F46'
          if (i <= 3) color = CERTIFICATIONS[0].color
          else if (i <= 7) color = CERTIFICATIONS[1].color
          else color = CERTIFICATIONS[2].color
          const isActive = i === currentMonth
          return (
            <div key={m} style={S.timelineSeg(color, 100 / 12, isActive)}>
              {m}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Google Calendar Sync Component ─────────────────────────────────

function GoogleCalendarSync({ allBlocks, weekDates, weekKey }) {
  const [creds, setCreds] = useState(loadGCalCreds)
  const [gapiReady, setGapiReady] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [tokenClient, setTokenClient] = useState(null)
  const [syncStatus, setSyncStatus] = useState(null) // null | 'syncing' | { created: N } | { error: msg }
  const [showSetup, setShowSetup] = useState(false)

  const hasCredentials = creds.clientId && creds.apiKey

  // Init gapi + GIS when credentials are set
  useEffect(() => {
    if (!hasCredentials) return

    let cancelled = false

    const initGapi = () => {
      if (!window.gapi) {
        setTimeout(initGapi, 200)
        return
      }
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: creds.apiKey,
            discoveryDocs: [GCAL_DISCOVERY],
          })
          if (!cancelled) setGapiReady(true)
        } catch (err) {
          console.error('gapi init error:', err)
        }
      })
    }

    const initGis = () => {
      if (!window.google?.accounts?.oauth2) {
        setTimeout(initGis, 200)
        return
      }
      const tc = window.google.accounts.oauth2.initTokenClient({
        client_id: creds.clientId,
        scope: GCAL_SCOPES,
        callback: (response) => {
          if (response.error) {
            console.error('OAuth error:', response)
            return
          }
          setIsAuthorized(true)
        },
      })
      if (!cancelled) setTokenClient(tc)
    }

    initGapi()
    initGis()

    return () => { cancelled = true }
  }, [hasCredentials, creds.clientId, creds.apiKey])

  const handleAuth = () => {
    if (!tokenClient) return
    tokenClient.requestAccessToken()
  }

  const handleDisconnect = () => {
    const token = window.gapi.client.getToken()
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token)
      window.gapi.client.setToken(null)
    }
    setIsAuthorized(false)
  }

  const handleSync = async () => {
    if (!gapiReady || !isAuthorized) return
    setSyncStatus('syncing')

    try {
      let created = 0
      for (const block of allBlocks) {
        const date = weekDates[block.day]
        if (!date) continue

        const startHour = Math.floor(block.start)
        const startMin = Math.round((block.start - startHour) * 60)
        const endHour = Math.floor(block.end)
        const endMin = Math.round((block.end - endHour) * 60)

        const startDt = new Date(date)
        startDt.setHours(startHour, startMin, 0, 0)
        const endDt = new Date(date)
        endDt.setHours(endHour, endMin, 0, 0)

        const event = {
          summary: block.label,
          start: {
            dateTime: startDt.toISOString(),
            timeZone: 'Europe/Dublin',
          },
          end: {
            dateTime: endDt.toISOString(),
            timeZone: 'Europe/Dublin',
          },
          reminders: {
            useDefault: false,
            overrides: GCAL_REMINDERS[block.type] || [{ method: 'popup', minutes: 30 }],
          },
          colorId: GCAL_COLOR_MAP[block.type] || '1',
        }

        await window.gapi.client.calendar.events.insert({
          calendarId: GCAL_CALENDAR_ID,
          resource: event,
        })
        created++
      }
      setSyncStatus({ created })
    } catch (err) {
      console.error('Sync error:', err)
      const msg = err?.result?.error?.message || err.message || 'Error desconocido'
      setSyncStatus({ error: msg })
    }
  }

  const updateCred = (key, value) => {
    const updated = { ...creds, [key]: value }
    setCreds(updated)
    saveGCalCreds(updated)
  }

  // Setup instructions panel
  if (!hasCredentials) {
    return (
      <div style={{
        background: '#18181B',
        border: '1px solid #27272A',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 16,
        borderLeft: '3px solid #3B82F6',
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => setShowSetup(!showSetup)}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
            Google Calendar — Configurar
          </span>
          <span style={{ fontSize: 12, color: '#71717A' }}>{showSetup ? '▲' : '▼'}</span>
        </div>
        {showSetup && (
          <div style={{ marginTop: 12 }}>
            <ol style={{ fontSize: 12, color: '#A1A1AA', paddingLeft: 20, margin: '0 0 12px', lineHeight: 1.8 }}>
              <li>Ir a <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ color: '#3B82F6' }}>Google Cloud Console</a></li>
              <li>Crear un proyecto nuevo (o usar uno existente)</li>
              <li>Habilitar <strong>Google Calendar API</strong> en APIs & Services</li>
              <li>Crear <strong>OAuth 2.0 Client ID</strong> (Web app, origin: <code style={{ background: '#27272A', padding: '1px 4px', borderRadius: 3 }}>http://localhost:5173</code>)</li>
              <li>Crear <strong>API Key</strong> en Credentials</li>
              <li>Pegar ambos abajo:</li>
            </ol>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                placeholder="Client ID (ej: 123...apps.googleusercontent.com)"
                value={creds.clientId}
                onChange={(e) => updateCred('clientId', e.target.value.trim())}
                style={{
                  background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
                  color: '#FAFAFA', fontSize: 12, padding: '8px 10px', outline: 'none', width: '100%',
                  boxSizing: 'border-box',
                }}
              />
              <input
                placeholder="API Key (ej: AIza...)"
                value={creds.apiKey}
                onChange={(e) => updateCred('apiKey', e.target.value.trim())}
                style={{
                  background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
                  color: '#FAFAFA', fontSize: 12, padding: '8px 10px', outline: 'none', width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Authorized / sync UI
  return (
    <div style={{
      background: '#18181B',
      border: '1px solid #27272A',
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 16,
      borderLeft: '3px solid #3B82F6',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
          Google Calendar
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!isAuthorized ? (
            <button
              style={{
                ...S.btn('#3B82F6', '#fff'),
                opacity: gapiReady ? 1 : 0.5,
              }}
              onClick={handleAuth}
              disabled={!gapiReady}
            >
              {gapiReady ? 'Conectar con Google' : 'Cargando...'}
            </button>
          ) : (
            <>
              <button
                style={S.btn('#22C55E', '#000')}
                onClick={handleSync}
                disabled={syncStatus === 'syncing'}
              >
                {syncStatus === 'syncing' ? 'Sincronizando...' : `Sincronizar semana (${allBlocks.length} bloques)`}
              </button>
              <button
                style={S.btn('#27272A', '#71717A')}
                onClick={handleDisconnect}
              >
                Desconectar
              </button>
            </>
          )}
          <button
            style={S.btn('#27272A', '#71717A')}
            onClick={() => {
              if (confirm('¿Borrar credenciales de Google Calendar?')) {
                updateCred('clientId', '')
                updateCred('apiKey', '')
                setIsAuthorized(false)
              }
            }}
            title="Cambiar credenciales"
          >
            ⚙
          </button>
        </div>
      </div>
      {/* Status messages */}
      {syncStatus && syncStatus !== 'syncing' && (
        <div style={{
          marginTop: 8,
          fontSize: 12,
          padding: '6px 10px',
          borderRadius: 6,
          background: syncStatus.error ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
          color: syncStatus.error ? '#EF4444' : '#22C55E',
          border: `1px solid ${syncStatus.error ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
        }}>
          {syncStatus.error
            ? `Error: ${syncStatus.error}`
            : `${syncStatus.created} evento${syncStatus.created !== 1 ? 's' : ''} creado${syncStatus.created !== 1 ? 's' : ''} en Google Calendar`}
        </div>
      )}
    </div>
  )
}

// ── Weekly Planner Component ────────────────────────────────────────

function WeeklyPlanner() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [classEvents, setClassEvents] = useState(loadClassEvents)
  const [deadlines, setDeadlines] = useState(loadDeadlines)
  const [editingBlock, setEditingBlock] = useState(null)
  const [editStart, setEditStart] = useState('')
  const [editEnd, setEditEnd] = useState('')
  const [importMsg, setImportMsg] = useState(null)
  const gridRef = useRef(null)

  const refDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + weekOffset * 7)
    return d
  }, [weekOffset])

  const weekDates = useMemo(() => getWeekDates(refDate), [refDate])
  const weekKey = useMemo(() => getWeekKey(weekDates[0]), [weekDates])

  const [plannerData, setPlannerData] = useState(() => loadPlannerData(weekKey))

  // Reload data when week changes
  useEffect(() => {
    setPlannerData(loadPlannerData(weekKey))
    setEditingBlock(null)
  }, [weekKey])

  // Persist data
  useEffect(() => {
    savePlannerData(weekKey, plannerData)
  }, [weekKey, plannerData])

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const { workShifts, workouts, confirmedStudy, customEvents } = plannerData

  // ICS import handler
  const handleImportICS = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const { classEvents: parsed, deadlines: parsedDeadlines } = parseICS(ev.target.result)
      setClassEvents(parsed)
      saveClassEvents(parsed)
      setDeadlines(parsedDeadlines)
      saveDeadlines(parsedDeadlines)
      setImportMsg(`${parsed.length} clases y ${parsedDeadlines.length} entregas importadas`)
      setTimeout(() => setImportMsg(null), 4000)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Deadlines for current week
  const weekDeadlines = useMemo(() => {
    return deadlines.filter(d => {
      const dayIdx = dateToDayIdx(d.date)
      return dayIdx >= 0
    }).map(d => ({ ...d, dayIdx: dateToDayIdx(d.date) }))
  }, [deadlines, dateToDayIdx])

  // Edit/delete custom events (NOT class events — those are fixed)
  const startEdit = (block) => {
    if (block.type === 'class' || block.type === 'study' || block.type === 'sport') return
    setEditingBlock(block)
    const fmtH = (h) => {
      const hh = Math.floor(h)
      const mm = Math.round((h - hh) * 60)
      return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
    }
    setEditStart(fmtH(block.start))
    setEditEnd(fmtH(block.end))
  }

  const saveEditBlock = () => {
    if (!editingBlock) return
    const startH = parseFloat(editStart.split(':')[0]) + parseFloat(editStart.split(':')[1]) / 60
    const endH = parseFloat(editEnd.split(':')[0]) + parseFloat(editEnd.split(':')[1]) / 60
    if (endH <= startH) return

    if (editingBlock.type === 'work' && editingBlock.shiftIdx !== undefined) {
      setPlannerData(prev => {
        const dayShifts = [...(prev.workShifts[editingBlock.day] || [])]
        dayShifts[editingBlock.shiftIdx] = { ...dayShifts[editingBlock.shiftIdx], start: startH, end: endH }
        return { ...prev, workShifts: { ...prev.workShifts, [editingBlock.day]: dayShifts } }
      })
    } else if (editingBlock.type === 'custom' && editingBlock.customIdx !== undefined) {
      setPlannerData(prev => {
        const events = [...(prev.customEvents || [])]
        events[editingBlock.customIdx] = { ...events[editingBlock.customIdx], start: startH, end: endH }
        return { ...prev, customEvents: events }
      })
    }
    setEditingBlock(null)
  }

  const deleteEditBlock = () => {
    if (!editingBlock) return
    if (editingBlock.type === 'work' && editingBlock.shiftIdx !== undefined) {
      removeWorkShift(editingBlock.day, editingBlock.shiftIdx)
    } else if (editingBlock.type === 'custom' && editingBlock.customIdx !== undefined) {
      setPlannerData(prev => ({
        ...prev,
        customEvents: (prev.customEvents || []).filter((_, i) => i !== editingBlock.customIdx)
      }))
    }
    setEditingBlock(null)
  }

  // Work shift input state
  const [shiftDay, setShiftDay] = useState(4) // Friday default
  const [shiftStart, setShiftStart] = useState('09:00')
  const [shiftEnd, setShiftEnd] = useState('17:00')

  // Custom event input state
  const [newEvtDay, setNewEvtDay] = useState(0)
  const [newEvtStart, setNewEvtStart] = useState('10:00')
  const [newEvtEnd, setNewEvtEnd] = useState('12:00')
  const [newEvtLabel, setNewEvtLabel] = useState('')

  const addCustomEvent = () => {
    if (!newEvtLabel.trim()) return
    const startH = parseFloat(newEvtStart.split(':')[0]) + parseFloat(newEvtStart.split(':')[1]) / 60
    const endH = parseFloat(newEvtEnd.split(':')[0]) + parseFloat(newEvtEnd.split(':')[1]) / 60
    if (endH <= startH) return
    setPlannerData(prev => ({
      ...prev,
      customEvents: [...(prev.customEvents || []), { day: newEvtDay, start: startH, end: endH, label: newEvtLabel.trim(), type: 'custom' }]
    }))
    setNewEvtLabel('')
  }

  const addWorkShift = () => {
    const startH = parseFloat(shiftStart.split(':')[0]) + parseFloat(shiftStart.split(':')[1]) / 60
    const endH = parseFloat(shiftEnd.split(':')[0]) + parseFloat(shiftEnd.split(':')[1]) / 60
    if (endH <= startH) return
    const dayShifts = workShifts[shiftDay] || []
    setPlannerData(prev => ({
      ...prev,
      workShifts: {
        ...prev.workShifts,
        [shiftDay]: [...dayShifts, { start: startH, end: endH, label: 'Biximply' }]
      }
    }))
  }

  const removeWorkShift = (dayIdx, shiftIdx) => {
    setPlannerData(prev => {
      const dayShifts = [...(prev.workShifts[dayIdx] || [])]
      dayShifts.splice(shiftIdx, 1)
      return {
        ...prev,
        workShifts: { ...prev.workShifts, [dayIdx]: dayShifts }
      }
    })
  }

  const toggleWorkout = (id) => {
    setPlannerData(prev => ({
      ...prev,
      workouts: { ...prev.workouts, [id]: !prev.workouts[id] }
    }))
  }

  const workoutsDone = WORKOUT_SLOTS.filter(w => workouts[w.id]).length

  // Helper: match date to day index in current week
  const dateToDayIdx = useCallback((dateStr) => {
    const evtDate = new Date(dateStr + 'T12:00:00')
    for (let i = 0; i < 7; i++) {
      const wd = weekDates[i]
      if (wd.getFullYear() === evtDate.getFullYear() &&
          wd.getMonth() === evtDate.getMonth() &&
          wd.getDate() === evtDate.getDate()) {
        return i
      }
    }
    return -1
  }, [weekDates])

  // Collect all blocks for the grid
  const getAllBlocks = useCallback(() => {
    const blocks = []

    // Sport blocks (recurring)
    SPORT_BLOCKS.forEach(b => {
      blocks.push({ ...b })
    })

    // Imported class events for this week
    classEvents.forEach(evt => {
      const dayIdx = dateToDayIdx(evt.date)
      if (dayIdx >= 0) {
        blocks.push({ ...evt, day: dayIdx })
      }
    })

    // Work shifts
    Object.entries(workShifts).forEach(([dayStr, shifts]) => {
      const day = parseInt(dayStr)
      shifts.forEach((shift, idx) => {
        blocks.push({
          day,
          start: shift.start,
          end: shift.end,
          label: shift.label,
          type: 'work',
          shiftIdx: idx,
        })
      })
    })

    // Confirmed study blocks
    confirmedStudy.forEach(b => {
      blocks.push({ day: b.day, start: b.start, end: b.end, label: 'Estudio', type: 'study' })
    })

    // Custom events
    ;(customEvents || []).forEach((evt, idx) => {
      blocks.push({ ...evt, customIdx: idx })
    })

    return blocks
  }, [classEvents, dateToDayIdx, workShifts, confirmedStudy, customEvents])

  // Find free gaps >= 1.5h for study suggestions
  const studySuggestions = useMemo(() => {
    const allBlocks = getAllBlocks()
    const suggestions = []

    for (let day = 0; day < 7; day++) {
      const dayBlocks = allBlocks
        .filter(b => b.day === day)
        .sort((a, b) => a.start - b.start)

      let cursor = 7 // Start at 7:00
      for (const block of dayBlocks) {
        const gap = block.start - cursor
        if (gap >= 1.5) {
          // Check if this suggestion is already confirmed
          const isConfirmed = confirmedStudy.some(
            s => s.day === day && s.start === cursor && s.end === cursor + Math.min(gap, 2)
          )
          if (!isConfirmed) {
            suggestions.push({
              day,
              start: cursor,
              end: cursor + Math.min(gap, 2), // Max 2h blocks
              label: 'Estudio sugerido',
            })
          }
        }
        cursor = Math.max(cursor, block.end)
      }
      // Check gap after last block until 22:00
      const gap = 22 - cursor
      if (gap >= 1.5) {
        const isConfirmed = confirmedStudy.some(
          s => s.day === day && s.start === cursor && s.end === cursor + Math.min(gap, 2)
        )
        if (!isConfirmed) {
          suggestions.push({
            day,
            start: cursor,
            end: cursor + Math.min(gap, 2),
            label: 'Estudio sugerido',
          })
        }
      }
    }
    return suggestions
  }, [getAllBlocks, confirmedStudy])

  const confirmStudyBlock = (suggestion) => {
    setPlannerData(prev => ({
      ...prev,
      confirmedStudy: [...prev.confirmedStudy, { day: suggestion.day, start: suggestion.start, end: suggestion.end }]
    }))
  }

  const removeStudyBlock = (idx) => {
    setPlannerData(prev => ({
      ...prev,
      confirmedStudy: prev.confirmedStudy.filter((_, i) => i !== idx)
    }))
  }

  // Current time indicator
  const todayDate = new Date()
  const todayDayIdx = (() => {
    const d = todayDate.getDay()
    return d === 0 ? 6 : d - 1 // Monday = 0
  })()
  const isCurrentWeek = weekOffset === 0
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60

  const allBlocks = getAllBlocks()

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '50px repeat(7, 1fr)',
    gridTemplateRows: `32px repeat(${HOURS.length}, 50px)`,
    gap: 0,
    background: '#18181B',
    border: '1px solid #27272A',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  }

  const formatHour = (h) => {
    const hh = Math.floor(h)
    const mm = Math.round((h - hh) * 60)
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
  }

  return (
    <div>
      {/* Week navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button style={S.btn()} onClick={() => setWeekOffset(w => w - 1)}>← Anterior</button>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#FAFAFA' }}>
            Semana del {formatShortDate(weekDates[0])} – {formatShortDate(weekDates[6])}
          </span>
          <span style={{ fontSize: 12, color: '#71717A', marginLeft: 8 }}>{weekKey}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {weekOffset !== 0 && (
            <button style={S.btn('#3B82F6', '#fff')} onClick={() => setWeekOffset(0)}>Hoy</button>
          )}
          <button style={S.btn()} onClick={() => setWeekOffset(w => w + 1)}>Siguiente →</button>
        </div>
      </div>

      {/* Google Calendar Sync */}
      <GoogleCalendarSync allBlocks={allBlocks} weekDates={weekDates} weekKey={weekKey} />

      {/* ICS Import */}
      <div style={{
        background: '#18181B',
        border: '1px solid #27272A',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 16,
        borderLeft: '3px solid #06B6D4',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
              Horario Dorset
            </span>
            <span style={{ fontSize: 12, color: '#71717A', marginLeft: 8 }}>
              {classEvents.length > 0 ? `${classEvents.length} clases cargadas` : 'Sin importar'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{
              ...S.btn('#06B6D4', '#000'),
              cursor: 'pointer',
              display: 'inline-block',
            }}>
              Importar .ics
              <input
                type="file"
                accept=".ics"
                onChange={handleImportICS}
                style={{ display: 'none' }}
              />
            </label>
            {classEvents.length > 0 && (
              <button
                style={S.btn('#27272A', '#EF4444')}
                onClick={() => {
                  if (confirm('¿Borrar todas las clases importadas?')) {
                    setClassEvents([])
                    saveClassEvents([])
                  }
                }}
              >
                Borrar todo
              </button>
            )}
          </div>
        </div>
        {importMsg && (
          <div style={{
            marginTop: 8, fontSize: 12, color: '#22C55E',
            background: 'rgba(34,197,94,0.1)', padding: '4px 10px',
            borderRadius: 6, border: '1px solid rgba(34,197,94,0.3)',
          }}>
            {importMsg}
          </div>
        )}
      </div>

      {/* Workout tracker */}
      <div style={{
        background: '#18181B',
        border: '1px solid #27272A',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 16,
        borderLeft: `3px solid ${BLOCK_COLORS.sport}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
            Entrenamientos: {workoutsDone}/3 esta semana
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: workoutsDone >= 3 ? '#22C55E' : '#F59E0B',
            background: workoutsDone >= 3 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            {workoutsDone >= 3 ? 'Meta cumplida' : `Faltan ${3 - workoutsDone}`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {WORKOUT_SLOTS.map(w => (
            <label key={w.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: workouts[w.id] ? 'rgba(34,197,94,0.1)' : '#0F0F11',
              border: `1px solid ${workouts[w.id] ? '#22C55E44' : '#27272A'}`,
              borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={!!workouts[w.id]}
                onChange={() => toggleWorkout(w.id)}
                style={{ accentColor: '#22C55E' }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#E4E4E7' }}>{DAY_NAMES[w.day]} — {w.label}</div>
                <div style={{ fontSize: 11, color: '#71717A' }}>{w.time}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Deadlines for this week */}
      {weekDeadlines.length > 0 && (
        <div style={{
          background: '#18181B',
          border: '1px solid #27272A',
          borderRadius: 10,
          padding: '14px 16px',
          marginBottom: 16,
          borderLeft: `3px solid ${BLOCK_COLORS.deadline}`,
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA', display: 'block', marginBottom: 8 }}>
            Entregas y exámenes esta semana
          </span>
          {weekDeadlines.map((d, i) => (
            <div key={i} style={{ fontSize: 12, color: '#A1A1AA', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontWeight: 600,
                padding: '1px 6px', borderRadius: 4, fontSize: 11,
              }}>
                {DAY_NAMES[d.dayIdx]} {d.date.slice(8)}/{d.date.slice(5, 7)}
              </span>
              <span style={{ color: '#E4E4E7' }}>{d.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Work shift input */}
      <div style={{
        background: '#18181B',
        border: '1px solid #27272A',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 16,
        borderLeft: `3px solid ${BLOCK_COLORS.work}`,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA', display: 'block', marginBottom: 10 }}>
          Agregar turno de trabajo
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={shiftDay}
            onChange={(e) => setShiftDay(parseInt(e.target.value))}
            style={{
              background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
              color: '#FAFAFA', fontSize: 13, padding: '6px 10px', outline: 'none',
            }}
          >
            {DAY_NAMES.map((name, i) => (
              <option key={i} value={i}>{name}</option>
            ))}
          </select>
          <input
            type="time"
            value={shiftStart}
            onChange={(e) => setShiftStart(e.target.value)}
            style={{
              background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
              color: '#FAFAFA', fontSize: 13, padding: '6px 10px', outline: 'none',
            }}
          />
          <span style={{ color: '#71717A' }}>a</span>
          <input
            type="time"
            value={shiftEnd}
            onChange={(e) => setShiftEnd(e.target.value)}
            style={{
              background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
              color: '#FAFAFA', fontSize: 13, padding: '6px 10px', outline: 'none',
            }}
          />
          <button style={S.btn('#F59E0B', '#000')} onClick={addWorkShift}>+ Agregar</button>
        </div>
        {Object.entries(workShifts).map(([dayStr, shifts]) =>
          shifts.map((shift, idx) => (
            <div key={`${dayStr}-${idx}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 6, padding: '4px 10px', marginTop: 8, marginRight: 8, fontSize: 12, color: '#F59E0B',
            }}>
              {DAY_NAMES[parseInt(dayStr)]} {formatHour(shift.start)}–{formatHour(shift.end)}
              <button
                onClick={() => removeWorkShift(parseInt(dayStr), idx)}
                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Custom event input */}
      <div style={{
        background: '#18181B',
        border: '1px solid #27272A',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 20,
        borderLeft: `3px solid ${BLOCK_COLORS.custom}`,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA', display: 'block', marginBottom: 10 }}>
          Agregar evento
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            placeholder="Nombre del evento"
            value={newEvtLabel}
            onChange={(e) => setNewEvtLabel(e.target.value)}
            style={{
              background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
              color: '#FAFAFA', fontSize: 13, padding: '6px 10px', outline: 'none', minWidth: 140,
            }}
          />
          <select
            value={newEvtDay}
            onChange={(e) => setNewEvtDay(parseInt(e.target.value))}
            style={{
              background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
              color: '#FAFAFA', fontSize: 13, padding: '6px 10px', outline: 'none',
            }}
          >
            {DAY_NAMES.map((name, i) => (
              <option key={i} value={i}>{name}</option>
            ))}
          </select>
          <input
            type="time"
            value={newEvtStart}
            onChange={(e) => setNewEvtStart(e.target.value)}
            style={{
              background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
              color: '#FAFAFA', fontSize: 13, padding: '6px 10px', outline: 'none',
            }}
          />
          <span style={{ color: '#71717A' }}>a</span>
          <input
            type="time"
            value={newEvtEnd}
            onChange={(e) => setNewEvtEnd(e.target.value)}
            style={{
              background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
              color: '#FAFAFA', fontSize: 13, padding: '6px 10px', outline: 'none',
            }}
          />
          <button style={S.btn('#EC4899', '#fff')} onClick={addCustomEvent}>+ Agregar</button>
        </div>
        {(customEvents || []).map((evt, idx) => (
          <div key={idx} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)',
            borderRadius: 6, padding: '4px 10px', marginTop: 8, marginRight: 8, fontSize: 12, color: '#EC4899',
          }}>
            {DAY_NAMES[evt.day]} {formatHour(evt.start)}–{formatHour(evt.end)} {evt.label}
            <button
              onClick={() => setPlannerData(prev => ({
                ...prev,
                customEvents: (prev.customEvents || []).filter((_, i) => i !== idx)
              }))}
              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Weekly Grid */}
      <div ref={gridRef} style={gridStyle}>
        {/* Header row: empty corner + day names */}
        <div style={{
          gridColumn: 1, gridRow: 1,
          background: '#0F0F11', borderBottom: '1px solid #27272A', borderRight: '1px solid #27272A',
        }} />
        {DAY_NAMES.map((name, i) => {
          const isToday = isCurrentWeek && todayDayIdx === i
          return (
            <div key={name} style={{
              gridColumn: i + 2, gridRow: 1,
              background: isToday ? '#1E293B' : '#0F0F11',
              borderBottom: '1px solid #27272A',
              borderRight: i < 6 ? '1px solid #1E1E21' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
              color: isToday ? '#3B82F6' : '#A1A1AA',
            }}>
              {name} {weekDates[i].getDate()}
            </div>
          )
        })}

        {/* Hour rows */}
        {HOURS.map((hour, rowIdx) => (
          <React.Fragment key={hour}>
            <div style={{
              gridColumn: 1, gridRow: rowIdx + 2,
              background: '#0F0F11',
              borderBottom: '1px solid #1E1E21',
              borderRight: '1px solid #27272A',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              fontSize: 10, color: '#52525B', paddingTop: 2,
            }}>
              {String(hour).padStart(2, '0')}:00
            </div>
            {DAY_NAMES.map((_, dayIdx) => (
              <div key={`${hour}-${dayIdx}`} style={{
                gridColumn: dayIdx + 2, gridRow: rowIdx + 2,
                borderBottom: '1px solid #1E1E21',
                borderRight: dayIdx < 6 ? '1px solid #1E1E21' : 'none',
                background: isCurrentWeek && todayDayIdx === dayIdx ? '#0D1117' : 'transparent',
              }} />
            ))}
          </React.Fragment>
        ))}

        {/* Day overlay containers — absolute positioning for precise block placement */}
        {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => {
          const dayBlocks = layoutDayBlocks(allBlocks.filter(b => b.day === dayIdx))
          const daySuggestions = studySuggestions.filter(s => s.day === dayIdx)

          return (
            <div key={`overlay-${dayIdx}`} style={{
              gridColumn: dayIdx + 2,
              gridRow: `2 / ${HOURS.length + 2}`,
              position: 'relative',
              zIndex: 2,
            }}>
              {/* Blocks */}
              {dayBlocks.map((block, idx) => {
                const color = BLOCK_COLORS[block.type] || '#3F3F46'
                const topPct = ((block.start - 7) / HOURS.length) * 100
                const heightPct = ((block.end - block.start) / HOURS.length) * 100
                const isEditable = block.type === 'work' || block.type === 'custom'
                const isEditing = editingBlock && isEditable &&
                  editingBlock.type === block.type && editingBlock.day === block.day &&
                  editingBlock.start === block.start
                const isClickable = isEditable || block.type === 'study'
                const leftPct = block._totalCols > 1 ? (block._col / block._totalCols) * 100 : 0
                const widthPct = block._totalCols > 1 ? 100 / block._totalCols : 100

                return (
                  <div key={`b-${idx}`} style={{
                    position: 'absolute',
                    top: `${topPct}%`,
                    height: `${heightPct}%`,
                    left: `calc(${leftPct}% + 2px)`,
                    width: `calc(${widthPct}% - 4px)`,
                    background: color + '33',
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 4,
                    padding: '2px 4px',
                    fontSize: block._totalCols > 1 ? 9 : 11,
                    fontWeight: 500,
                    color,
                    overflow: 'hidden',
                    cursor: isClickable ? 'pointer' : 'default',
                    outline: isEditing ? `2px solid ${color}` : 'none',
                    zIndex: isEditing ? 5 : 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    userSelect: 'none',
                  }}
                  onClick={() => {
                    if (block.type === 'study') {
                      const studyIdx = confirmedStudy.findIndex(
                        s => s.day === block.day && s.start === block.start && s.end === block.end
                      )
                      if (studyIdx >= 0) removeStudyBlock(studyIdx)
                    } else if (isEditable) {
                      startEdit(block)
                    }
                  }}
                  title={block.type === 'study' ? 'Click para quitar' : isEditable ? 'Click para editar' : ''}
                  >
                    <span>{block.label}</span>
                    <span style={{ fontSize: block._totalCols > 1 ? 7 : 9, opacity: 0.7 }}>
                      {formatHour(block.start)}–{formatHour(block.end)}
                    </span>
                  </div>
                )
              })}

              {/* Study suggestions */}
              {daySuggestions.map((sug, idx) => {
                const topPct = ((sug.start - 7) / HOURS.length) * 100
                const heightPct = ((sug.end - sug.start) / HOURS.length) * 100
                const color = BLOCK_COLORS.study
                return (
                  <div key={`sug-${idx}`} style={{
                    position: 'absolute',
                    top: `${topPct}%`,
                    height: `${heightPct}%`,
                    left: 2,
                    right: 2,
                    background: color + '11',
                    border: `1px dashed ${color}55`,
                    borderRadius: 4,
                    padding: '2px 4px',
                    fontSize: 10,
                    color: color + '99',
                    overflow: 'hidden',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                  onClick={() => confirmStudyBlock(sug)}
                  title="Click para confirmar bloque de estudio"
                  >
                    <span>+ Estudio</span>
                    <span style={{ fontSize: 8, opacity: 0.7 }}>
                      {formatHour(sug.start)}–{formatHour(sug.end)}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* Current time line */}
        {isCurrentWeek && currentHour >= 7 && currentHour <= 22 && (
          <div style={{
            gridColumn: todayDayIdx + 2,
            gridRow: `2 / ${HOURS.length + 2}`,
            position: 'relative',
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            <div style={{
              position: 'absolute',
              top: `${((currentHour - 7) / HOURS.length) * 100}%`,
              left: 0,
              right: 0,
              height: 2,
              background: '#EF4444',
              boxShadow: '0 0 4px rgba(239,68,68,0.5)',
            }}>
              <div style={{
                position: 'absolute',
                left: -3,
                top: -3,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#EF4444',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Clases (fijo)', color: BLOCK_COLORS.class },
          { label: 'Deporte', color: BLOCK_COLORS.sport },
          { label: 'Trabajo', color: BLOCK_COLORS.work },
          { label: 'Estudio', color: BLOCK_COLORS.study },
          { label: 'Custom', color: BLOCK_COLORS.custom },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#A1A1AA' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
            {item.label}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#A1A1AA' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, border: '1px dashed #8B5CF655', background: '#8B5CF611' }} />
          Sugerido (click para confirmar)
        </div>
      </div>

      {/* Edit panel for work/custom blocks */}
      {editingBlock && (
        <div style={{
          marginTop: 12,
          background: '#18181B',
          border: `1px solid ${BLOCK_COLORS[editingBlock.type] || '#3B82F6'}`,
          borderRadius: 10,
          padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
              Editar: {editingBlock.label}
            </span>
            <button
              style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', fontSize: 16 }}
              onClick={() => setEditingBlock(null)}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#71717A', marginBottom: 10 }}>
            {DAY_NAMES[editingBlock.day]}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="time"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
              style={{
                background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
                color: '#FAFAFA', fontSize: 13, padding: '6px 10px', outline: 'none',
              }}
            />
            <span style={{ color: '#71717A' }}>a</span>
            <input
              type="time"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
              style={{
                background: '#0F0F11', border: '1px solid #27272A', borderRadius: 6,
                color: '#FAFAFA', fontSize: 13, padding: '6px 10px', outline: 'none',
              }}
            />
            <button style={S.btn('#3B82F6', '#fff')} onClick={saveEditBlock}>
              Guardar
            </button>
            <button
              style={S.btn('#EF4444', '#fff')}
              onClick={deleteEditBlock}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main App ────────────────────────────────────────────────────────

export default function App() {
  const [state, setState] = useState(loadState)
  const [streak, setStreak] = useState(loadStreak)
  const [filter, setFilter] = useState('all')
  const [activeTab, setActiveTab] = useState(loadTab)
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    try { return parseInt(localStorage.getItem('cert-roadmap-weekly') || '10') } catch { return 10 }
  })

  const { checked, notes } = state

  // Persist state
  useEffect(() => { saveState(state) }, [state])
  useEffect(() => { saveStreak(streak) }, [streak])
  useEffect(() => { localStorage.setItem('cert-roadmap-weekly', String(weeklyGoal)) }, [weeklyGoal])
  useEffect(() => { localStorage.setItem(TAB_KEY, activeTab) }, [activeTab])

  // Update streak on any check
  const recordActivity = useCallback(() => {
    const td = today()
    setStreak(prev => {
      if (prev.lastDate === td) return prev
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const newCount = prev.lastDate === yesterday ? prev.count + 1 : 1
      return { lastDate: td, count: newCount }
    })
  }, [])

  const handleToggle = useCallback((id) => {
    setState(prev => {
      const newChecked = { ...prev.checked, [id]: !prev.checked[id] }
      return { ...prev, checked: newChecked }
    })
    recordActivity()
  }, [recordActivity])

  const handleNote = useCallback((id, value) => {
    setState(prev => ({
      ...prev,
      notes: { ...prev.notes, [id]: value }
    }))
  }, [])

  // Stats
  const totalDone = ALL_STEP_IDS.filter(id => checked[id]).length
  const totalSteps = ALL_STEP_IDS.length
  const totalPct = Math.round((totalDone / totalSteps) * 100)
  const hoursCompleted = CERTIFICATIONS.flatMap(c => c.steps).filter(s => checked[s.id]).reduce((sum, s) => sum + s.est, 0)
  const hoursRemaining = TOTAL_HOURS - hoursCompleted

  const overdueSteps = CERTIFICATIONS.flatMap(c => c.steps).filter(s => !checked[s.id] && daysUntil(s.dueDate) < 0)
  const upcomingStep = CERTIFICATIONS.flatMap(c => c.steps)
    .filter(s => !checked[s.id] && daysUntil(s.dueDate) >= 0)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]

  // Filter certs
  const filteredCerts = useMemo(() => {
    if (filter === 'all') return CERTIFICATIONS
    if (filter === 'pending') return CERTIFICATIONS.filter(c => c.steps.some(s => !checked[s.id]))
    if (filter === 'overdue') return CERTIFICATIONS.map(c => ({
      ...c,
      steps: c.steps.filter(s => !checked[s.id] && daysUntil(s.dueDate) < 0)
    })).filter(c => c.steps.length > 0)
    return CERTIFICATIONS.filter(c => c.id === filter)
  }, [filter, checked])

  // Export
  const handleExport = () => {
    const data = { checked, notes, streak, weeklyGoal, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cert-roadmap-backup-${today()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (data.checked) setState({ checked: data.checked, notes: data.notes || {} })
          if (data.streak) setStreak(data.streak)
          if (data.weeklyGoal) setWeeklyGoal(data.weeklyGoal)
          alert('Progreso importado correctamente.')
        } catch {
          alert('Error: archivo JSON inválido.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  // Reset confirmation
  const handleReset = () => {
    if (window.confirm('¿Seguro que querés resetear todo el progreso? Esta acción no se puede deshacer.')) {
      setState({ checked: {}, notes: {} })
      setStreak({ lastDate: null, count: 0 })
    }
  }

  return (
    <div style={S.app}>
      {/* Header */}
      <header style={S.header}>
        <h1 style={S.h1}>Certification Roadmap</h1>
        <p style={S.subtitle}>AI Automation Engineer &middot; Abr 2026 – Mar 2027</p>
      </header>

      {/* Tabs */}
      <div style={S.tabBar}>
        <button style={S.tab(activeTab === 'certs')} onClick={() => setActiveTab('certs')}>
          Certificaciones
        </button>
        <button style={S.tab(activeTab === 'planner')} onClick={() => setActiveTab('planner')}>
          Mi Semana
        </button>
      </div>

      {activeTab === 'certs' ? (
        <>
          {/* Timeline */}
          <Timeline checked={checked} />

          {/* Stats */}
          <div style={S.statsGrid}>
            <StatCard label="Progreso total" value={`${totalPct}%`} sub={`${totalDone}/${totalSteps} pasos`} color="#FAFAFA" />
            <StatCard label="Horas restantes" value={`${hoursRemaining}h`} sub={`${hoursCompleted}h completadas`} color="#3B82F6" />
            <StatCard label="Streak" value={`${streak.count} día${streak.count !== 1 ? 's' : ''}`} sub={streak.lastDate ? `Último: ${formatDate(streak.lastDate)}` : 'Sin actividad aún'} color="#FACC15" />
            <StatCard
              label="Próximo deadline"
              value={upcomingStep ? `${daysUntil(upcomingStep.dueDate)}d` : '—'}
              sub={upcomingStep ? upcomingStep.label.slice(0, 35) + (upcomingStep.label.length > 35 ? '…' : '') : 'Todo al día'}
              color="#22C55E"
            />
            {overdueSteps.length > 0 && (
              <StatCard label="Atrasados" value={overdueSteps.length} sub="pasos vencidos" color="#EF4444" />
            )}
          </div>

          {/* Weekly goal */}
          <div style={S.weeklyGoal}>
            <span style={{ fontSize: 13, color: '#A1A1AA' }}>Meta semanal:</span>
            <input
              type="number"
              min={1}
              max={40}
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(Math.max(1, Math.min(40, parseInt(e.target.value) || 1)))}
              style={S.weeklyInput}
            />
            <span style={{ fontSize: 13, color: '#A1A1AA' }}>horas/semana</span>
            <span style={{ fontSize: 12, color: '#52525B', marginLeft: 'auto' }}>
              A {weeklyGoal}h/semana → ~{Math.ceil(hoursRemaining / weeklyGoal)} semanas restantes
            </span>
          </div>

          {/* Toolbar */}
          <div style={S.toolbar}>
            <button style={S.btn('#27272A')} onClick={handleExport}>↓ Exportar JSON</button>
            <button style={S.btn('#27272A')} onClick={handleImport}>↑ Importar JSON</button>
            <button style={S.btn('#27272A', '#EF4444')} onClick={handleReset}>✕ Resetear</button>
          </div>

          {/* Filters */}
          <div style={S.filterBar}>
            <button style={S.filterBtn(filter === 'all', '#FAFAFA')} onClick={() => setFilter('all')}>Todas</button>
            {CERTIFICATIONS.map(c => (
              <button key={c.id} style={S.filterBtn(filter === c.id, c.color)} onClick={() => setFilter(c.id)}>
                {c.shortTitle}
              </button>
            ))}
            <button style={S.filterBtn(filter === 'pending', '#FACC15')} onClick={() => setFilter('pending')}>Pendientes</button>
            {overdueSteps.length > 0 && (
              <button style={S.filterBtn(filter === 'overdue', '#EF4444')} onClick={() => setFilter('overdue')}>
                Atrasados ({overdueSteps.length})
              </button>
            )}
          </div>

          {/* Certification phases */}
          {filteredCerts.map((cert, i) => (
            <PhaseCard
              key={cert.id}
              cert={cert}
              checked={checked}
              notes={notes}
              onToggle={handleToggle}
              onNote={handleNote}
              defaultExpanded={i === 0}
            />
          ))}
        </>
      ) : (
        <WeeklyPlanner />
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 0 0', color: '#3F3F46', fontSize: 12 }}>
        Nicolás Boggioni Troncoso &middot; AI Automation Engineer Path &middot; 2026–2027
      </footer>
    </div>
  )
}
