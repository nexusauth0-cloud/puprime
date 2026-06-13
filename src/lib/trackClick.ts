import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ""
const WHATSAPP_GROUP = process.env.NEXT_PUBLIC_WHATSAPP_LINK || ""

export async function trackClick(
  source: string,
  request: Request,
  type: "go" | "hidden" = "go"
) {
  const cleanSource = source.toLowerCase().replace(/[^a-z0-9_-]/g, "")

  if (!cleanSource || cleanSource.length < 1) {
    return NextResponse.redirect(new URL("/", SITE_URL || "http://localhost:3000"))
  }

  try {
    await prisma.click.create({
      data: {
        source: cleanSource,
        type,
        userAgent: request.headers.get("user-agent") || null,
        ipAddress:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          null,
      },
    })
  } catch (error) {
    console.error("Click tracking error:", error)
  }

  const redirectUrl =
    type === "hidden" || !SOURCE_REDIRECTS[cleanSource]
      ? `/?source=${cleanSource}`
      : SOURCE_REDIRECTS[cleanSource]

  const response = NextResponse.redirect(new URL(redirectUrl, SITE_URL || "http://localhost:3000"))

  response.cookies.set("traffic_source", cleanSource, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  })

  return response
}

const SOURCE_REDIRECTS: Record<string, string> = {
  whatsapp: WHATSAPP_GROUP,
  status: SITE_URL
    ? "https://wa.me/?text=" +
      encodeURIComponent(`Join the free Market Education Session! ${SITE_URL}/go/status`)
    : "",
}
