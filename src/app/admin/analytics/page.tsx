"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts"
import {
  TrendingUp,
  Users,
  MousePointerClick,
  ArrowLeft,
  LogOut,
  Loader2,
  BarChart3,
  Activity,
  Share2,
  Radio,
} from "lucide-react"
import Link from "next/link"

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

interface Analytics {
  totalClicks: number
  totalRegistrations: number
  totalReferrals: number
  conversionRate: number
  referralRate: number
  liveUsers: number
  sourceBreakdown: {
    source: string
    clicks: number
    registrations: number
    conversionRate: number
  }[]
  recentActivity: { type: string; source: string; createdAt: string }[]
  dailyTrend: { date: string; count: number }[]
  topReferrers: { fullname: string; whatsappnumber: string; referrals: number }[]
  funnel: {
    totalClicks: number
    totalRegistrations: number
    totalReferrals: number
    trackedRegistrations: number
  }
}

function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchAnalytics() {
    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setData(await res.json())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_token")
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-zinc-400">Failed to load analytics. Make sure you're logged in.</p>
            <Button className="mt-4" asChild>
              <Link href="/admin">Go to Admin Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const regPieData = data.sourceBreakdown
    .filter((s) => s.registrations > 0)
    .map((s) => ({ name: s.source || "(direct)", value: s.registrations }))

  const funnelSteps = [
    { name: "Clicks", value: data.funnel.totalClicks || data.totalClicks, color: "#2563EB" },
    { name: "Registrations", value: data.funnel.totalRegistrations || data.totalRegistrations, color: "#10B981" },
    { name: "Referrals", value: data.funnel.totalReferrals || data.totalReferrals, color: "#F59E0B" },
  ]

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <nav className="border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">Marketing Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Clicks", value: data.totalClicks, icon: MousePointerClick },
            { label: "Registrations", value: data.totalRegistrations, icon: Users },
            { label: "Conversion", value: `${data.conversionRate}%`, icon: TrendingUp },
            { label: "Referrals", value: data.totalReferrals, icon: Share2 },
            { label: "Referral Rate", value: `${data.referralRate}%`, icon: Share2 },
            { label: "Live Now", value: data.liveUsers, icon: Radio },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400">{stat.label}</p>
                      <p className="text-xl md:text-2xl font-bold text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Funnel Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-lg">Marketing Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {funnelSteps.map((step, i) => (
                <div key={step.name} className="flex flex-col items-center">
                  <div
                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center flex-col"
                    style={{
                      background: `conic-gradient(${step.color} ${Math.min(step.value / Math.max(funnelSteps[0].value, 1) * 360, 360)}deg, rgba(30,41,59,0.5) 0deg)`,
                      border: `3px solid ${step.color}`,
                    }}
                  >
                    <span className="text-xl md:text-2xl font-bold text-white">{step.value}</span>
                    <span className="text-xs text-zinc-400">{step.name}</span>
                  </div>
                  {i < funnelSteps.length - 1 && (
                    <div className="hidden md:block text-2xl text-zinc-600">→</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {funnelSteps.map((step) => (
                <div key={step.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: step.color }} />
                  <span className="text-sm text-zinc-400">{step.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white text-lg">Clicks by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.sourceBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="source" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                    <Bar dataKey="clicks" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-white text-lg">Registrations by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regPieData.length > 0 ? regPieData : [{ name: "No data", value: 1 }]}
                      cx="50%" cy="50%" outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {regPieData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Traffic */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-lg">Daily Traffic (14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} />
                  <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rates by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-lg">Conversion Rate by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-2 text-zinc-400 font-medium">Source</th>
                    <th className="text-right py-3 px-2 text-zinc-400 font-medium">Clicks</th>
                    <th className="text-right py-3 px-2 text-zinc-400 font-medium">Registrations</th>
                    <th className="text-right py-3 px-2 text-zinc-400 font-medium">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sourceBreakdown.map((s) => (
                    <tr key={s.source} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-2 text-white font-medium capitalize">{s.source || "(direct)"}</td>
                      <td className="py-3 px-2 text-zinc-300 text-right">{s.clicks}</td>
                      <td className="py-3 px-2 text-zinc-300 text-right">{s.registrations}</td>
                      <td className="py-3 px-2 text-right">
                        <Badge variant={s.conversionRate > 5 ? "default" : "secondary"}>{s.conversionRate}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        {data.topReferrers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-white text-lg">Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-2 text-zinc-400 font-medium">#</th>
                      <th className="text-left py-3 px-2 text-zinc-400 font-medium">Name</th>
                      <th className="text-left py-3 px-2 text-zinc-400 font-medium">WhatsApp</th>
                      <th className="text-right py-3 px-2 text-zinc-400 font-medium">Referrals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topReferrers.map((r, i) => (
                      <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3 px-2 text-zinc-500">{i + 1}</td>
                        <td className="py-3 px-2 text-white font-medium">{r.fullname}</td>
                        <td className="py-3 px-2 text-zinc-300">{r.whatsappnumber}</td>
                        <td className="py-3 px-2 text-right">
                          <Badge>{r.referrals}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-2 text-zinc-400 font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-zinc-400 font-medium">Source</th>
                    <th className="text-left py-3 px-2 text-zinc-400 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentActivity.map((ev, i) => (
                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-2">
                        <Badge variant={ev.type === "registration" ? "default" : ev.type === "referral" ? "secondary" : "outline"}>
                          {ev.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-zinc-300 capitalize">{ev.source || "(direct)"}</td>
                      <td className="py-3 px-2 text-zinc-400">
                        {new Date(ev.createdAt).toLocaleString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function AnalyticsLogin() {
  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <p className="text-zinc-400 mb-4">Please log in to view analytics.</p>
          <Button asChild><Link href="/admin">Go to Login</Link></Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AnalyticsPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      fetch("/api/analytics", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => setAuthed(r.ok))
        .finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return authed ? <AdminAnalytics /> : <AnalyticsLogin />
}
