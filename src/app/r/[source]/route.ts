import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
const WHATSAPP_GROUP = process.env.NEXT_PUBLIC_WHATSAPP_LINK

if (!SITE_URL) throw new Error("NEXT_PUBLIC_SITE_URL environment variable is required")
if (!WHATSAPP_GROUP) throw new Error("NEXT_PUBLIC_WHATSAPP_LINK environment variable is required")

const SOURCE_REDIRECTS: Record<string, string> = {
  whatsapp: WHATSAPP_GROUP,
  status: "https://wa.me/?text=" + encodeURIComponent(`Join the free Market Education Session! ${SITE_URL}/r/status`),
}

export async function GET(
  _request: Request,
  { params }: { params: { source: string } }
) {
  const source = params.source.toLowerCase().replace(/[^a-z0-9_-]/g, "")

  if (!source || source.length < 1) {
    return NextResponse.redirect(new URL("/", SITE_URL))
  }

  try {
    await prisma.click.create({
      data: {
        source,
        userAgent: _request.headers.get("user-agent") || null,
        ipAddress: _request.headers.get("x-forwarded-for") || _request.headers.get("x-real-ip") || null,
      },
    })
  } catch (error) {
    console.error("Click tracking error:", error)
  }

  const redirectUrl = SOURCE_REDIRECTS[source] || `${SITE_URL}/?source=${source}`
  return NextResponse.redirect(new URL(redirectUrl, SITE_URL))
}
