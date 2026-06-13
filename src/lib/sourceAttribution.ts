"use client"

export function getSource(): string | null {
  if (typeof window === "undefined") return null

  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get("source")

  if (fromUrl) {
    localStorage.setItem("traffic_source", fromUrl)
    document.cookie = `traffic_source=${fromUrl}; max-age=${60 * 60 * 24 * 30}; path=/; SameSite=Lax`
    return fromUrl
  }

  const stored = localStorage.getItem("traffic_source")
  if (stored) return stored

  const match = document.cookie.match(/(?:^|;\s*)traffic_source=([^;]*)/)
  return match ? match[1] : null
}

export function clearSource() {
  localStorage.removeItem("traffic_source")
  document.cookie = "traffic_source=; max-age=0; path=/"
}

export function getReferralCode(): string | null {
  if (typeof window === "undefined") return null
  const params = new URLSearchParams(window.location.search)
  return params.get("ref")
}

export function generateSessionId(): string {
  let sid = localStorage.getItem("session_id")
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substring(2, 15)
    localStorage.setItem("session_id", sid)
  }
  return sid
}
