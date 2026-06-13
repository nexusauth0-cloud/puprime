import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { fullName, whatsappNumber, email } = await request.json()

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

    const registration = await prisma.registration.create({
      data: {
        fullName: fullName.trim(),
        whatsappNumber: phoneClean,
        email: email?.trim() || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        registration: {
          id: registration.id,
          fullName: registration.fullName,
        },
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
