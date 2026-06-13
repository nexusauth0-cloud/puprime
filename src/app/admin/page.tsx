"use client"

import { useState, useEffect, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Download,
  Lock,
  LogOut,
  Search,
  Loader2,
  CalendarDays,
} from "lucide-react"

interface Registration {
  id: string
  fullName: string
  whatsappNumber: string
  email: string | null
  createdAt: string
}

function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    fetchRegistrations()
  }, [])

  async function fetchRegistrations() {
    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/registrations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setRegistrations(data.registrations)
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

  function handleExportCSV() {
    const headers = ["Full Name", "WhatsApp Number", "Email", "Registered At"]
    const rows = filteredRegistrations.map((r) => [
      r.fullName,
      r.whatsappNumber,
      r.email || "",
      new Date(r.createdAt).toLocaleDateString(),
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.whatsappNumber.includes(searchTerm) ||
      (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase()))

    if (dateFilter) {
      const regDate = new Date(r.createdAt).toISOString().split("T")[0]
      return matchesSearch && regDate === dateFilter
    }

    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Admin Nav */}
      <nav className="border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              {registrations.length} total
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Registrations", value: registrations.length, icon: Users },
            {
              label: "This Week",
              value: registrations.filter((r) => {
                const d = new Date(r.createdAt)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return d >= weekAgo
              }).length,
              icon: CalendarDays,
            },
            {
              label: "With Email",
              value: registrations.filter((r) => r.email).length,
              icon: Users,
            },
            {
              label: "Today",
              value: registrations.filter((r) => {
                const d = new Date(r.createdAt).toISOString().split("T")[0]
                return d === new Date().toISOString().split("T")[0]
              }).length,
              icon: CalendarDays,
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

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    placeholder="Search by name, phone, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-72"
                  />
                </div>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-10 w-full sm:w-44"
                  />
                </div>
              </div>
              <Button onClick={handleExportCSV} className="gap-2 shrink-0">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">
              Registrations ({filteredRegistrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No registrations found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-2 text-zinc-400 font-medium">#</th>
                      <th className="text-left py-3 px-2 text-zinc-400 font-medium">Name</th>
                      <th className="text-left py-3 px-2 text-zinc-400 font-medium">WhatsApp</th>
                      <th className="text-left py-3 px-2 text-zinc-400 font-medium">Email</th>
                      <th className="text-left py-3 px-2 text-zinc-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((reg, index) => (
                      <tr
                        key={reg.id}
                        className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="py-3 px-2 text-zinc-500">{index + 1}</td>
                        <td className="py-3 px-2 text-white font-medium">{reg.fullName}</td>
                        <td className="py-3 px-2 text-zinc-300">{reg.whatsappNumber}</td>
                        <td className="py-3 px-2 text-zinc-400">
                          {reg.email || <span className="text-zinc-600">—</span>}
                        </td>
                        <td className="py-3 px-2 text-zinc-400">
                          {new Date(reg.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid credentials")
        setLoading(false)
        return
      }

      localStorage.setItem("admin_token", data.token)
      window.location.reload()
    } catch {
      setError("Network error")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
          <CardTitle className="text-white">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@marketedu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      fetch("/api/registrations", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) setIsAuthenticated(true)
          else localStorage.removeItem("admin_token")
        })
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

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />
}
