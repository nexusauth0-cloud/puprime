"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
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
} from "lucide-react"
import Link from "next/link"

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

interface Analytics {
  totalClicks: number
  totalRegistrations: number
  conversionRate: number
  sourceBreakdown: {
    source: string
    clicks: number
    registrations: number
    conversionRate: number
  }[]
  recentActivity: { type: string; source: string; createdAt: string }[]
  dailyTrend: { date: string; count: number }[]
}

function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
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

  const pieData = data.sourceBreakdown.map((s) => ({
    name: s.source || "(direct)",
    value: s.clicks,
  }))

  const regPieData = data.sourceBreakdown
    .filter((s) => s.registrations > 0)
    .map((s) => ({
      name: s.source || "(direct)",
      value: s.registrations,
    }))

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <nav className="border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">Analytics</span>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Clicks", value: data.totalClicks, icon: MousePointerClick },
            { label: "Total Registrations", value: data.totalRegistrations, icon: Users },
            {
              label: "Conversion Rate",
              value: `${data.conversionRate}%`,
              icon: TrendingUp,
            },
            {
              label: "Top Source",
              value: data.sourceBreakdown[0]?.source || "(none)",
              icon: Activity,
            },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">{stat.label}</p>
                      <p className="text-2xl md:text-3xl font-bold text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Clicks by Source */}
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
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                    <Bar dataKey="clicks" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Registrations by Source (Pie) */}
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
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {regPieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Traffic Trend */}
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
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
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
                    <th className="text-right py-3 px-2 text-zinc-400 font-medium">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sourceBreakdown.map((s) => (
                    <tr key={s.source} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-2 text-white font-medium capitalize">{s.source || "(direct)"}</td>
                      <td className="py-3 px-2 text-zinc-300 text-right">{s.clicks}</td>
                      <td className="py-3 px-2 text-zinc-300 text-right">{s.registrations}</td>
                      <td className="py-3 px-2 text-right">
                        <Badge variant={s.conversionRate > 5 ? "default" : "secondary"}>
                          {s.conversionRate}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

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
                        <Badge variant={ev.type === "registration" ? "default" : "secondary"}>
                          {ev.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-zinc-300 capitalize">{ev.source || "(direct)"}</td>
                      <td className="py-3 px-2 text-zinc-400">
                        {new Date(ev.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
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
          <Button asChild>
            <Link href="/admin">Go to Login</Link>
          </Button>
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
