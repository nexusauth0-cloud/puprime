import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "market-edu-secret-key-change-in-production"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@marketedu.com"

export function generateToken(): string {
  return jwt.sign({ email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string }
  } catch {
    return null
  }
}
