import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { generateToken } from "@/lib/auth"

const BCRYPT_ROUNDS = 12

let cachedHash: string | null = null

async function getAdminHash(): Promise<string> {
  if (cachedHash) return cachedHash
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) throw new Error("ADMIN_PASSWORD environment variable is required")
  cachedHash = await bcrypt.hash(pw, BCRYPT_ROUNDS)
  return cachedHash
}

const ipAttempts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000

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

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL
    if (!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL environment variable is required")

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const hash = await getAdminHash()
    const valid = await bcrypt.compare(password, hash)
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
