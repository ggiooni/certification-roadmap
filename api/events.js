import { kv } from '@vercel/kv'

const PLANNER_KEY_PREFIX = 'planner:'

function authenticate(req) {
  const apiKey = process.env.API_KEY
  if (!apiKey) return true // No API key configured = open (dev mode)
  const authHeader = req.headers.authorization
  if (!authHeader) return false
  return authHeader.replace('Bearer ', '') === apiKey
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (!authenticate(req)) {
    return res.status(401).json({ error: 'Invalid or missing API key' })
  }

  const { weekKey } = req.query.weekKey ? req.query : req.body || {}

  // GET /api/events?weekKey=2026-W11 — list events for a week
  if (req.method === 'GET') {
    if (!weekKey) {
      return res.status(400).json({ error: 'Missing weekKey query parameter' })
    }
    const data = await kv.get(PLANNER_KEY_PREFIX + weekKey)
    return res.status(200).json(data || { workShifts: {}, workouts: {}, confirmedStudy: [], customEvents: [] })
  }

  // POST /api/events — add a custom event
  if (req.method === 'POST') {
    const { event } = req.body
    if (!weekKey || !event) {
      return res.status(400).json({ error: 'Missing weekKey or event in body' })
    }

    // Validate event shape
    if (event.day === undefined || event.start === undefined || event.end === undefined || !event.label) {
      return res.status(400).json({ error: 'Event must have day, start, end, and label' })
    }

    const kvKey = PLANNER_KEY_PREFIX + weekKey
    const data = (await kv.get(kvKey)) || { workShifts: {}, workouts: {}, confirmedStudy: [], customEvents: [] }

    const newEvent = {
      day: event.day,
      start: event.start,
      end: event.end,
      label: event.label,
      type: event.type || 'custom',
    }
    data.customEvents = [...(data.customEvents || []), newEvent]
    await kv.set(kvKey, data)

    // Trigger GCal sync if connected
    let gcalSync = null
    try {
      const refreshToken = await kv.get('gcal_refresh_token')
      if (refreshToken) {
        // Import sync dynamically to avoid circular issues
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
        const syncRes = await fetch(`${baseUrl}/api/gcal/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.API_KEY ? { Authorization: `Bearer ${process.env.API_KEY}` } : {}),
          },
          body: JSON.stringify({
            blocks: buildAllBlocks(data),
            weekDates: getWeekDatesFromKey(weekKey),
          }),
        })
        gcalSync = await syncRes.json()
      }
    } catch (err) {
      gcalSync = { error: err.message }
    }

    return res.status(201).json({ status: 'created', event: newEvent, gcalSync })
  }

  // DELETE /api/events — remove a custom event by index
  if (req.method === 'DELETE') {
    const { index } = req.body
    if (!weekKey || index === undefined) {
      return res.status(400).json({ error: 'Missing weekKey or index in body' })
    }

    const kvKey = PLANNER_KEY_PREFIX + weekKey
    const data = (await kv.get(kvKey)) || { workShifts: {}, workouts: {}, confirmedStudy: [], customEvents: [] }

    if (!data.customEvents || index >= data.customEvents.length) {
      return res.status(404).json({ error: 'Event not found at given index' })
    }

    const removed = data.customEvents.splice(index, 1)[0]
    await kv.set(kvKey, data)

    return res.status(200).json({ status: 'deleted', event: removed })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

// Helper: build block list from planner data (matches frontend getAllBlocks)
function buildAllBlocks(data) {
  const blocks = []

  // Sport blocks (hardcoded same as frontend)
  const SPORT_BLOCKS = [
    { day: 0, start: 10, end: 11.5, label: 'Gym', type: 'sport' },
    { day: 2, start: 19.5, end: 21, label: 'Climbing', type: 'sport' },
    { day: 3, start: 7, end: 9, label: 'Fútbol', type: 'sport' },
  ]
  SPORT_BLOCKS.forEach(b => blocks.push({ ...b }))

  // Work shifts
  if (data.workShifts) {
    Object.entries(data.workShifts).forEach(([dayStr, shifts]) => {
      const day = parseInt(dayStr)
      shifts.forEach(shift => {
        blocks.push({ day, start: shift.start, end: shift.end, label: shift.label, type: 'work' })
      })
    })
  }

  // Confirmed study
  if (data.confirmedStudy) {
    data.confirmedStudy.forEach(b => {
      blocks.push({ day: b.day, start: b.start, end: b.end, label: 'Estudio', type: 'study' })
    })
  }

  // Custom events
  if (data.customEvents) {
    data.customEvents.forEach(evt => {
      blocks.push({ ...evt })
    })
  }

  return blocks
}

// Helper: get week dates array from a weekKey like "2026-W11"
function getWeekDatesFromKey(weekKey) {
  const [yearStr, weekStr] = weekKey.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr)

  // ISO week date to calendar date
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7
  const mondayOfWeek1 = new Date(jan4)
  mondayOfWeek1.setDate(jan4.getDate() - dayOfWeek + 1)

  const monday = new Date(mondayOfWeek1)
  monday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7)

  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}
