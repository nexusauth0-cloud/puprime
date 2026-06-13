import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RegistrationForm } from "@/components/RegistrationForm"
import { CountdownTimer } from "@/components/CountdownTimer"
import {
  Users,
  Zap,
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Clock,
  Calendar,
  Monitor,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://chat.whatsapp.com/example"
const SHARE_LINK = process.env.NEXT_PUBLIC_SITE_URL || "https://marketedu.com"

const stats = [
  { value: "1,000+", label: "Registered", icon: Users },
  { value: "Free", label: "Access", icon: Zap },
  { value: "Live", label: "Zoom Session", icon: Monitor },
]

const features = [
  {
    icon: TrendingUp,
    title: "Market Fundamentals",
    desc: "Understand how markets really work and what drives price movements",
  },
  {
    icon: Target,
    title: "Winning Strategies",
    desc: "Proven strategies that active traders use to consistently profit",
  },
  {
    icon: Shield,
    title: "Risk Management",
    desc: "Learn how to protect your capital and manage risk effectively",
  },
  {
    icon: BarChart3,
    title: "Growth & Scaling",
    desc: "Scale your trading from small accounts to substantial portfolios",
  },
]

const speakers = [
  {
    name: "Michael Adenuga",
    role: "Senior Market Analyst",
    initials: "MA",
  },
  {
    name: "Sarah Okafor",
    role: "Trading Strategist",
    initials: "SO",
  },
  {
    name: "David Eze",
    role: "Risk Management Expert",
    initials: "DE",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1220]/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-gradient">MarketEdu</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="#register">Register</a>
            </Button>
            <Button size="sm" asChild>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                Join WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 px-4 py-1.5 text-sm">
            <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
            Free Live Session
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Market Education
            <br />
            <span className="text-gradient">Session</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Learn real strategies from active experts on Zoom. Join thousands of traders
            who have transformed their approach to the markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="xl" className="gap-2" asChild>
              <a href="#register">
                Register Free <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button size="xl" variant="outline" className="gap-2" asChild>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                Join WhatsApp Group
              </a>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-zinc-500">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Why This Event Exists
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl mx-auto">
            The financial markets are more accessible than ever, but most people lose money
            because they lack proper education. We created this free session to bridge that
            gap — connecting you with real experts who share actionable strategies, not just theory.
          </p>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="py-16 md:py-24 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Meet Your Mentors
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {speakers.map((speaker) => (
              <Card key={speaker.name} className="text-center p-6 glass-hover">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">{speaker.initials}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{speaker.name}</h3>
                    <p className="text-sm text-zinc-400">{speaker.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-zinc-500 mt-8 text-sm">
            + more industry experts inside the session
          </p>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            What You&apos;ll Learn
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="p-6 glass-hover group">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 md:py-24 bg-zinc-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Event Details
          </h2>
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-6 md:p-8 space-y-6">
              {[
                { icon: Calendar, label: "Date", value: "July 15, 2026" },
                { icon: Clock, label: "Time", value: "6:00 PM WAT" },
                { icon: Monitor, label: "Platform", value: "Zoom (link sent after registration)" },
                { icon: Clock, label: "Duration", value: "90 minutes" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Event Starts In
          </h2>
          <p className="text-zinc-400 mb-10">Don&apos;t miss out — secure your spot now</p>
          <CountdownTimer />
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-16 md:py-24 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Register for Free
            </h2>
            <p className="text-zinc-400">
              Fill in the form below to secure your spot. Zoom link will be sent to your WhatsApp.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-zinc-500">© 2026 MarketEdu. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href={WHATSAPP_LINK} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              WhatsApp Group
            </Link>
            <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
