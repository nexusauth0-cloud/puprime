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

    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error("Fetch registrations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
