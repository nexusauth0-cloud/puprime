"use client"

import { useState, useEffect, FormEvent, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  Users,
  Download,
  Lock,
  LogOut,
  Search,
  Loader2,
  CalendarDays,
  BarChart3,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Registration {
  id: string
  fullName: string
  whatsappNumber: string
  email: string | null
  source: string | null
  referredBy: string | null
  createdAt: string
}

const PAGE_SIZE = 50

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-zinc-800/50", className)} />
  )
}

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchRegistrations()
  }, [])

  async function fetchRegistrations() {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/registrations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setRegistrations(await res.json().then((d) => d.registrations))
      } else {
        setError("Failed to load registrations")
      }
    } catch {
      setError("Network error. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_token")
    window.location.reload()
  }

  function handleExportCSV() {
    const headers = ["Full Name", "WhatsApp Number", "Email", "Source", "Registered At"]
    const rows = filteredRegistrations.map((r) => [
      escapeCSV(r.fullName),
      escapeCSV(r.whatsappNumber),
      escapeCSV(r.email || ""),
      escapeCSV(r.source || ""),
      escapeCSV(new Date(r.createdAt).toLocaleDateString()),
    ])

    const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "CSV exported", description: `${rows.length} registrations downloaded.` })
  }

  function toggleSelectAll() {
    if (selected.size === currentPage.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(currentPage.map((r) => r.id)))
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredRegistrations = useMemo(
    () =>
      registrations.filter((r) => {
        const matchesSearch =
          r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.whatsappNumber.includes(searchTerm) ||
          (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase()))

        if (dateFilter) {
          const regDate = new Date(r.createdAt).toISOString().split("T")[0]
          return matchesSearch && regDate === dateFilter
        }

        return matchesSearch
      }),
    [registrations, searchTerm, dateFilter]
  )

  const totalPages = Math.max(1, Math.ceil(filteredRegistrations.length / PAGE_SIZE))
  const currentPage = filteredRegistrations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [searchTerm, dateFilter])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220]">
        <nav className="border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-10 w-full mb-4" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-zinc-800/50">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-zinc-300">{error}</p>
            <Button onClick={fetchRegistrations} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
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
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/admin/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </a>
            </Button>
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
                    aria-label="Search registrations"
                  />
                </div>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-10 w-full sm:w-44"
                    aria-label="Filter by date"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => fetchRegistrations()} variant="outline" size="icon" aria-label="Refresh data">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button onClick={handleExportCSV} className="gap-2 shrink-0">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Registrations ({filteredRegistrations.length})</CardTitle>
            {selected.size > 0 && (
              <Badge variant="secondary">{selected.size} selected</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {filteredRegistrations.length} registrations
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
            {filteredRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No registrations found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-2 w-10">
                          <input
                            type="checkbox"
                            checked={selected.size === currentPage.length && currentPage.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-zinc-600 bg-zinc-800"
                            aria-label="Select all on page"
                          />
                        </th>
                        <th className="text-left py-3 px-2 text-zinc-400 font-medium">Name</th>
                        <th className="text-left py-3 px-2 text-zinc-400 font-medium">WhatsApp</th>
                        <th className="text-left py-3 px-2 text-zinc-400 font-medium">Email</th>
                        <th className="text-left py-3 px-2 text-zinc-400 font-medium">Source</th>
                        <th className="text-left py-3 px-2 text-zinc-400 font-medium">Referred By</th>
                        <th className="text-left py-3 px-2 text-zinc-400 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPage.map((reg) => (
                        <tr
                          key={reg.id}
                          className={cn(
                            "border-b border-zinc-800/50 transition-colors",
                            selected.has(reg.id) ? "bg-blue-600/5" : "hover:bg-zinc-800/30"
                          )}
                        >
                          <td className="py-3 px-2">
                            <input
                              type="checkbox"
                              checked={selected.has(reg.id)}
                              onChange={() => toggleSelect(reg.id)}
                              className="rounded border-zinc-600 bg-zinc-800"
                              aria-label={`Select ${reg.fullName}`}
                            />
                          </td>
                          <td className="py-3 px-2 text-white font-medium">{reg.fullName}</td>
                          <td className="py-3 px-2 text-zinc-300">{reg.whatsappNumber}</td>
                          <td className="py-3 px-2 text-zinc-400">
                            {reg.email || <span className="text-zinc-600">—</span>}
                          </td>
                          <td className="py-3 px-2">
                            {reg.source ? (
                              <Badge variant="secondary">{reg.source}</Badge>
                            ) : (
                              <span className="text-zinc-600">—</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-zinc-400">
                            {reg.referredBy ? (
                              <Badge variant="outline">referred</Badge>
                            ) : (
                              <span className="text-zinc-600">—</span>
                            )}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50 mt-4">
                    <p className="text-sm text-zinc-500">
                      Page {page} of {totalPages} ({filteredRegistrations.length} total)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
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
                autoComplete="email"
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
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 text-sm" role="alert">
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
