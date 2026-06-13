"use client"

import { useEffect, useState } from "react"

export function ReferralNotice() {
  const [referrer, setReferrer] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get("ref")
    if (ref) {
      fetch(`/api/referral?code=${ref}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.valid) setReferrer(d.referrer)
        })
        .catch(() => {})
    }
  }, [])

  if (!referrer) return null

  return (
    <div className="text-center mb-6 p-4 rounded-xl bg-blue-600/10 border border-blue-600/20">
      <p className="text-blue-400 text-sm">
        You were invited by <span className="font-semibold">{referrer}</span> 🎉
      </p>
    </div>
  )
}
