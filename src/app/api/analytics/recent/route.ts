import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const since = searchParams.get("since")

    const whereFilter = since ? { createdAt: { gte: new Date(since) } } : undefined

    const [recentClicks, recentRegistrations] = await Promise.all([
      prisma.click.findMany({
        where: whereFilter,
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { source: true, type: true, createdAt: true },
      }),
      prisma.registration.findMany({
        where: whereFilter,
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { fullName: true, source: true, createdAt: true },
      }),
    ])

    return NextResponse.json({
      clicks: recentClicks,
      registrations: recentRegistrations,
      serverTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Recent analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
