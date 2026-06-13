"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CountdownTimer } from "@/components/CountdownTimer"
import { CheckCircle, Share2, MessageCircle, ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name") || "Trader"
  const refCode = searchParams.get("ref") || ""
  const [copied, setCopied] = useState(false)

  const siteUrl = typeof window !== "undefined"
    ? window.location.origin
    : "https://market-edu-a302.onrender.com"

  const referralLink = refCode ? `${siteUrl}/?ref=${refCode}` : siteUrl

  function handleCopyReferral() {
    navigator.clipboard.writeText(
      `Join the free Market Education Session! 🚀\n\nLearn real trading strategies from active experts on Zoom.\n\nRegister free: ${referralLink}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-float">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            You&apos;re Registered, {name}! 🎉
          </h1>
          <p className="text-zinc-400 text-lg">
            Check your WhatsApp for the Zoom link and event details.
          </p>
        </div>

        <Card className="p-6">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold text-white">Event Countdown</h2>
            <CountdownTimer />
          </CardContent>
        </Card>

        {refCode && (
          <Card className="p-6 border-blue-800/30 bg-blue-900/10">
            <CardContent className="space-y-4 pt-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Your Referral Link</h3>
              <p className="text-zinc-300 text-sm">
                Share your unique link with friends. When they register, you&apos;ll earn referral credit!
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralLink}
                  className="flex-1 h-11 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 text-sm text-zinc-300 truncate"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyReferral}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleCopyReferral}
              >
                <Share2 className="w-5 h-5" />
                {copied ? "Copied!" : "Copy Referral Link"}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="p-6 border-green-800/30 bg-green-900/10">
          <CardContent className="space-y-4 pt-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-zinc-300">
              Join our WhatsApp group to connect with other attendees and get
              updates about the session.
            </p>
            <Button
              size="lg"
              className="w-full gap-2 bg-green-600 hover:bg-green-700"
              asChild
            >
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://chat.whatsapp.com/example"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                Join WhatsApp Group
              </a>
            </Button>
          </CardContent>
        </Card>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
          <div className="text-zinc-400">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
