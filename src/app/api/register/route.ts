import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const ipAttempts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = 60 * 60 * 1000

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }
  entry.count++
  if (entry.count > RATE_LIMIT_MAX) return true
  return false
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many registration attempts from this device. Try again later." },
        { status: 429 }
      )
    }

    const { fullName, whatsappNumber, email, source, referredBy } = await request.json()

    if (!fullName || !whatsappNumber) {
      return NextResponse.json(
        { error: "Full name and WhatsApp number are required" },
        { status: 400 }
      )
    }

    if (typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid name" },
        { status: 400 }
      )
    }

    if (fullName.trim().length > 100) {
      return NextResponse.json(
        { error: "Name is too long" },
        { status: 400 }
      )
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    const phoneClean = whatsappNumber.replace(/[\s\-\(\)\.]/g, "")
    if (!/^\+\d{7,15}$/.test(phoneClean)) {
      return NextResponse.json(
        { error: "Please enter a valid WhatsApp number with country code (e.g. +2348012345678)" },
        { status: 400 }
      )
    }

    const existing = await prisma.registration.findUnique({
      where: { whatsappNumber: phoneClean },
    })

    if (existing) {
      return NextResponse.json(
        { error: "This WhatsApp number is already registered" },
        { status: 409 }
      )
    }

    const cleanedSource = source
      ? source.toLowerCase().replace(/[^a-z0-9_-]/g, "")
      : null

    let referrerId: string | null = null
    if (referredBy) {
      const referrer = await prisma.registration.findUnique({
        where: { id: referredBy },
      })
      if (referrer) referrerId = referrer.id
    }

    const registration = await prisma.registration.create({
      data: {
        fullName: fullName.trim(),
        whatsappNumber: phoneClean,
        email: email?.trim() || null,
        source: cleanedSource || null,
        referredBy: referrerId,
      },
    })

    if (referrerId) {
      await prisma.referral.create({
        data: {
          referrerId,
          referredId: registration.id,
          source: cleanedSource || null,
        },
      })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) throw new Error("NEXT_PUBLIC_SITE_URL environment variable is required")
    const zoomLink = process.env.NEXT_PUBLIC_ZOOM_LINK
    if (!zoomLink) throw new Error("NEXT_PUBLIC_ZOOM_LINK environment variable is required")
    const referralLink = `${siteUrl}/?ref=${registration.id}`
    const whatsappMsg = encodeURIComponent(
      `Hi ${registration.fullName}, you're registered for the Market Education Session from ${cleanedSource || "direct"} traffic.\n\nHere is your Zoom link: ${zoomLink}\n\nYour referral link (share to earn rewards): ${referralLink}`
    )

    return NextResponse.json(
      {
        success: true,
        registration: {
          id: registration.id,
          fullName: registration.fullName,
          source: registration.source,
          referralLink,
        },
        whatsappLink: `https://wa.me/${phoneClean}?text=${whatsappMsg}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
