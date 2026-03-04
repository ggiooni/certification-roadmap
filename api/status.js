import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const refreshToken = await kv.get('gcal_refresh_token')
    return res.status(200).json({
      status: 'ok',
      gcal_connected: !!refreshToken,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return res.status(200).json({
      status: 'ok',
      gcal_connected: false,
      kv_error: err.message,
      timestamp: new Date().toISOString(),
    })
  }
}
