import { google } from 'googleapis'
import { kv } from '@vercel/kv'

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/gcal/auth`
      : 'http://localhost:3000/api/gcal/auth'
  )
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  // GET: Start OAuth flow — redirect user to Google consent screen
  if (req.method === 'GET' && req.query.action === 'login') {
    const oauth2Client = getOAuth2Client()
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
    })
    return res.redirect(authUrl)
  }

  // GET: OAuth callback — Google redirects here with ?code=...
  if (req.method === 'GET' && req.query.code) {
    try {
      const oauth2Client = getOAuth2Client()
      const { tokens } = await oauth2Client.getToken(req.query.code)

      if (tokens.refresh_token) {
        await kv.set('gcal_refresh_token', tokens.refresh_token)
      }

      // Redirect back to the app with success
      const appUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
      return res.redirect(`${appUrl}?gcal_auth=success`)
    } catch (err) {
      console.error('OAuth token exchange error:', err)
      return res.status(500).json({ error: 'Token exchange failed', details: err.message })
    }
  }

  // POST: Disconnect — remove refresh token
  if (req.method === 'POST' && req.body?.action === 'disconnect') {
    await kv.del('gcal_refresh_token')
    return res.status(200).json({ status: 'disconnected' })
  }

  // GET: Check auth status
  if (req.method === 'GET') {
    const refreshToken = await kv.get('gcal_refresh_token')
    return res.status(200).json({ connected: !!refreshToken })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
