import { NextResponse } from "next/server"
import { generateToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@marketedu.com"
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const valid = password === ADMIN_PASSWORD
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const token = generateToken()

    return NextResponse.json({ token, success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
