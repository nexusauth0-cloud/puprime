import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 })
    }

    const referrer = await prisma.registration.findUnique({
      where: { id: code },
      select: { id: true, fullName: true },
    })

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
    }

    return NextResponse.json({ valid: true, referrer: referrer.fullName })
  } catch (error) {
    console.error("Referral lookup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
