"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react"

export function RegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    email: "",
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/success?name=${encodeURIComponent(formData.fullName)}`)
      }, 1500)
    } catch {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto text-center p-8">
        <CardContent className="pt-6 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Registration Successful!</h3>
          <p className="text-zinc-400">Redirecting you to the confirmation page...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
            <Input
              id="whatsappNumber"
              placeholder="+234 801 234 5678"
              required
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
            />
            <p className="text-xs text-zinc-500">We'll send the Zoom link here</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
