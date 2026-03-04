import { google } from 'googleapis'
import { kv } from '@vercel/kv'

const CALENDAR_ID = process.env.GCAL_CALENDAR_ID ||
  'e5e04e99051b8a3cf2cd0100cc98abbd59ebbdf8b4b5fe9011f3d848ca7b50e7@group.calendar.google.com'

const GCAL_REMINDERS = {
  class: [{ method: 'popup', minutes: 30 }],
  sport: [{ method: 'popup', minutes: 60 }, { method: 'popup', minutes: 10 }],
  work: [{ method: 'popup', minutes: 15 }],
  study: [{ method: 'popup', minutes: 30 }],
  custom: [{ method: 'popup', minutes: 15 }],
}

const GCAL_COLOR_MAP = {
  class: '9',
  sport: '10',
  work: '5',
  study: '3',
  custom: '4',
}

async function getAuthClient() {
  const refreshToken = await kv.get('gcal_refresh_token')
  if (!refreshToken) throw new Error('Not connected to Google Calendar')

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  return oauth2Client
}

function blockToEvent(block, weekDates) {
  const date = weekDates[block.day]
  if (!date) return null

  const startHour = Math.floor(block.start)
  const startMin = Math.round((block.start - startHour) * 60)
  const endHour = Math.floor(block.end)
  const endMin = Math.round((block.end - endHour) * 60)

  const startDt = new Date(date)
  startDt.setHours(startHour, startMin, 0, 0)
  const endDt = new Date(date)
  endDt.setHours(endHour, endMin, 0, 0)

  return {
    summary: block.label,
    start: { dateTime: startDt.toISOString(), timeZone: 'Europe/Dublin' },
    end: { dateTime: endDt.toISOString(), timeZone: 'Europe/Dublin' },
    reminders: {
      useDefault: false,
      overrides: GCAL_REMINDERS[block.type] || [{ method: 'popup', minutes: 30 }],
    },
    colorId: GCAL_COLOR_MAP[block.type] || '1',
    extendedProperties: {
      private: { source: 'certification-roadmap', blockKey: `${block.day}-${block.start}-${block.end}-${block.label}` },
    },
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Auth: either API key or frontend (no key needed from same origin)
  const apiKey = process.env.API_KEY
  const authHeader = req.headers.authorization
  if (apiKey && authHeader) {
    const token = authHeader.replace('Bearer ', '')
    if (token !== apiKey) {
      return res.status(401).json({ error: 'Invalid API key' })
    }
  }

  const { blocks, weekDates } = req.body
  if (!blocks || !weekDates) {
    return res.status(400).json({ error: 'Missing blocks or weekDates' })
  }

  try {
    const auth = await getAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })

    // Get existing events for the week created by this app
    const weekStart = new Date(weekDates[0])
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekDates[6])
    weekEnd.setHours(23, 59, 59, 999)

    const existingResponse = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: weekStart.toISOString(),
      timeMax: weekEnd.toISOString(),
      maxResults: 250,
      singleEvents: true,
      privateExtendedProperty: 'source=certification-roadmap',
    })
    const existingEvents = existingResponse.data.items || []

    // Build a set of blockKeys from current blocks
    const currentBlockKeys = new Set()
    const eventsToCreate = []

    for (const block of blocks) {
      const event = blockToEvent(block, weekDates)
      if (!event) continue

      const blockKey = event.extendedProperties.private.blockKey
      currentBlockKeys.add(blockKey)

      // Check if already exists
      const exists = existingEvents.some(ev =>
        ev.extendedProperties?.private?.blockKey === blockKey
      )
      if (!exists) {
        eventsToCreate.push(event)
      }
    }

    // Delete events that no longer exist in blocks
    const eventsToDelete = existingEvents.filter(ev =>
      ev.extendedProperties?.private?.source === 'certification-roadmap' &&
      !currentBlockKeys.has(ev.extendedProperties?.private?.blockKey)
    )

    let created = 0
    let deleted = 0
    let errors = 0

    // Create new events
    for (const event of eventsToCreate) {
      try {
        await calendar.events.insert({ calendarId: CALENDAR_ID, resource: event })
        created++
      } catch (err) {
        console.error('Insert error:', err.message)
        errors++
      }
    }

    // Delete removed events
    for (const event of eventsToDelete) {
      try {
        await calendar.events.delete({ calendarId: CALENDAR_ID, eventId: event.id })
        deleted++
      } catch (err) {
        console.error('Delete error:', err.message)
        errors++
      }
    }

    return res.status(200).json({
      status: 'synced',
      created,
      deleted,
      unchanged: blocks.length - created,
      errors,
    })
  } catch (err) {
    console.error('Sync error:', err)
    if (err.message === 'Not connected to Google Calendar') {
      return res.status(401).json({ error: err.message })
    }
    return res.status(500).json({ error: err.message })
  }
}
