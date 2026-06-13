import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { sessionId, source } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    await prisma.liveUser.upsert({
      where: { sessionId },
      update: { source, lastSeen: new Date() },
      create: { sessionId, source },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Live user heartbeat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
