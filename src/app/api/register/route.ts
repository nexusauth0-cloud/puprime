import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
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

    const phoneClean = whatsappNumber.replace(/[\s\-\(\)]/g, "")
    if (phoneClean.length < 8) {
      return NextResponse.json(
        { error: "Please enter a valid WhatsApp number" },
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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://market-edu-a302.onrender.com"
    const zoomLink = process.env.NEXT_PUBLIC_ZOOM_LINK || "https://zoom.us/j/example"
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
