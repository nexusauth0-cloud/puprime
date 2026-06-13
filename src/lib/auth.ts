import jwt from "jsonwebtoken"

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET environment variable is required")
  return secret
}

function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL
  if (!email) throw new Error("ADMIN_EMAIL environment variable is required")
  return email
}

export function generateToken(): string {
  return jwt.sign({ email: getAdminEmail() }, getJwtSecret(), { expiresIn: "7d" })
}

export function verifyToken(token: string): { email: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { email: string }
  } catch {
    return null
  }
}
