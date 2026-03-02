import React, { useState, useEffect, useCallback, useMemo } from 'react'

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
  // 2-hour study block starting at 10am
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
  // Timeline from Apr 2026 to Mar 2027 = 12 months
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

// ── Main App ────────────────────────────────────────────────────────

export default function App() {
  const [state, setState] = useState(loadState)
  const [streak, setStreak] = useState(loadStreak)
  const [filter, setFilter] = useState('all') // 'all' | cert.id | 'pending' | 'overdue'
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    try { return parseInt(localStorage.getItem('cert-roadmap-weekly') || '10') } catch { return 10 }
  })

  const { checked, notes } = state

  // Persist state
  useEffect(() => { saveState(state) }, [state])
  useEffect(() => { saveStreak(streak) }, [streak])
  useEffect(() => { localStorage.setItem('cert-roadmap-weekly', String(weeklyGoal)) }, [weeklyGoal])

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

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 0 0', color: '#3F3F46', fontSize: 12 }}>
        Nicolás Boggioni Troncoso &middot; AI Automation Engineer Path &middot; 2026–2027
      </footer>
    </div>
  )
}
