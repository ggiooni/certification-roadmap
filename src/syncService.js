// Sync service — handles communication with serverless API
const API_BASE = '' // Same origin on Vercel

let debounceTimer = null

export async function checkStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/status`)
    return await res.json()
  } catch {
    return { status: 'error', gcal_connected: false }
  }
}

export async function checkGCalAuth() {
  try {
    const res = await fetch(`${API_BASE}/api/gcal/auth`)
    return await res.json()
  } catch {
    return { connected: false }
  }
}

export function getAuthUrl() {
  return `${API_BASE}/api/gcal/auth?action=login`
}

export async function disconnectGCal() {
  const res = await fetch(`${API_BASE}/api/gcal/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'disconnect' }),
  })
  return await res.json()
}

export async function syncToGCal(blocks, weekDates) {
  const res = await fetch(`${API_BASE}/api/gcal/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks, weekDates }),
  })
  return await res.json()
}

// Debounced auto-sync: waits 2 seconds after last change before syncing
export function debouncedSync(blocks, weekDates, onResult) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    try {
      const result = await syncToGCal(blocks, weekDates)
      onResult?.(result)
    } catch (err) {
      onResult?.({ error: err.message })
    }
  }, 2000)
}

export function cancelPendingSync() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}
