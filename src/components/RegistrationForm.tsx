"use client"

import { useState, FormEvent, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react"

function getSource(): string | null {
  if (typeof window === "undefined") return null
  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get("source")
  if (fromUrl) {
    localStorage.setItem("traffic_source", fromUrl)
    return fromUrl
  }
  return localStorage.getItem("traffic_source")
}

function getReferralCode(): string | null {
  if (typeof window === "undefined") return null
  const params = new URLSearchParams(window.location.search)
  return params.get("ref")
}

function generateSessionId(): string {
  let sid = localStorage.getItem("session_id")
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substring(2, 15)
    localStorage.setItem("session_id", sid)
  }
  return sid
}

export function RegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [source] = useState(getSource)
  const [refCode] = useState(getReferralCode)
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    email: "",
  })
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (source && typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.delete("source")
      window.history.replaceState({}, "", url.toString())
    }
  }, [source])

  useEffect(() => {
    const sid = generateSessionId()
    const interval = setInterval(() => {
      fetch("/api/live-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, source }),
      }).catch(() => {})
    }, 60000)
    fetch("/api/live-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid, source }),
    }).catch(() => {})
    return () => clearInterval(interval)
  }, [source])

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus()
    }
  }, [error])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source, referredBy: refCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      setSuccess(true)
      localStorage.removeItem("traffic_source")
      localStorage.removeItem("session_id")
      setTimeout(() => {
        router.push(`/success?name=${encodeURIComponent(formData.fullName)}&ref=${data.registration.id}`)
      }, 1500)
    } catch {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto text-center p-8" role="status" aria-live="polite">
        <CardContent className="pt-6 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Registration Successful!</h3>
          <p className="text-zinc-400" id="redirect-message">Redirecting you to the confirmation page...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              aria-describedby={error ? "form-error" : undefined}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
            <Input
              id="whatsappNumber"
              placeholder="+234 801 234 5678"
              required
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              aria-describedby="whatsapp-hint"
              autoComplete="tel"
            />
            <p id="whatsapp-hint" className="text-xs text-zinc-500">
              Include country code. We&apos;ll send the Zoom link here.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              autoComplete="email"
            />
          </div>

          {refCode && (
            <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm" role="status">
              Referred by a friend 🎉
            </div>
          )}

          {error && (
            <div
              ref={errorRef}
              id="form-error"
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
              className="p-3 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 text-sm focus:outline-none"
            >
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-base" disabled={loading} aria-busy={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                Processing...
              </>
            ) : (
              "Register Free"
            )}
          </Button>

          <p className="text-center text-xs text-zinc-500">
            By registering, you agree to receive event details via WhatsApp
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
