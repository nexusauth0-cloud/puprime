"use client"

import { useState, useEffect } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE
  ? new Date(process.env.NEXT_PUBLIC_EVENT_DATE)
  : new Date("2026-07-15T18:00:00+01:00")

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(EVENT_DATE))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(EVENT_DATE))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const items = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ]

  return (
    <div className="flex gap-3 md:gap-4 justify-center">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]"
        >
          <span className="text-2xl md:text-4xl font-bold text-blue-400 tabular-nums">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-xs md:text-sm text-zinc-500 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
