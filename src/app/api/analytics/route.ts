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

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    const [
      totalClicks,
      totalRegistrations,
      totalReferrals,
      liveUsers,
      clicksBySource,
      registrationsBySource,
      recentActivity,
      dailyTrend,
      topReferrers,
      funnelData,
    ] = await Promise.all([
      prisma.click.count(),
      prisma.registration.count(),
      prisma.referral.count(),
      prisma.liveUser.count({ where: { lastSeen: { gte: fiveMinutesAgo } } }),
      prisma.click.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } } }),
      prisma.registration.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } } }),
      prisma.$queryRaw`
        (SELECT 'click' as type, source, "createdAt" FROM clicks ORDER BY "createdAt" DESC LIMIT 20)
        UNION ALL
        (SELECT 'registration' as type, source, "createdAt" FROM registrations WHERE source IS NOT NULL ORDER BY "createdAt" DESC LIMIT 20)
        UNION ALL
        (SELECT 'referral' as type, COALESCE(source,'direct') as source, "createdAt" FROM referrals ORDER BY "createdAt" DESC LIMIT 20)
        ORDER BY "createdAt" DESC LIMIT 30
      `,
      prisma.$queryRaw`
        SELECT DATE("createdAt") as date, COUNT(*)::int as count
        FROM clicks
        WHERE "createdAt" >= NOW() - INTERVAL '14 days'
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
      prisma.$queryRaw`
        SELECT r.fullName, r."whatsappNumber", COUNT(*)::int as referrals
        FROM referrals rf
        JOIN registrations r ON r.id = rf."referrerId"
        GROUP BY r.id, r.fullName, r."whatsappNumber"
        ORDER BY referrals DESC
        LIMIT 10
      `,
      prisma.$queryRaw`
        SELECT
          (SELECT COUNT(*)::int FROM clicks) as "totalClicks",
          (SELECT COUNT(*)::int FROM registrations) as "totalRegistrations",
          (SELECT COUNT(*)::int FROM referrals) as "totalReferrals",
          (SELECT COUNT(*)::int FROM registrations WHERE source IS NOT NULL) as "trackedRegistrations"
      `,
    ])

    const conversionRate = totalClicks > 0
      ? Number(((totalRegistrations / totalClicks) * 100).toFixed(1))
      : 0

    const referralRate = totalRegistrations > 0
      ? Number(((totalReferrals / totalRegistrations) * 100).toFixed(1))
      : 0

    const sourceBreakdown = clicksBySource.map((cs) => {
      const reg = registrationsBySource.find((r) => r.source === cs.source)
      const regCount = reg?._count ?? 0
      return {
        source: cs.source || "(direct)",
        clicks: cs._count,
        registrations: regCount,
        conversionRate: cs._count > 0 ? Number(((regCount / cs._count) * 100).toFixed(1)) : 0,
      }
    })

    return NextResponse.json({
      totalClicks,
      totalRegistrations,
      totalReferrals,
      conversionRate,
      referralRate,
      liveUsers,
      sourceBreakdown,
      recentActivity,
      dailyTrend,
      topReferrers,
      funnel: funnelData[0] || {},
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
