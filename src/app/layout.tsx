import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "Market Education Session | Learn Real Strategies",
  description:
    "Join our free Market Education Session and learn real strategies from active experts on Zoom. Register now for free access.",
  openGraph: {
    title: "Market Education Session | Learn Real Strategies",
    description:
      "Join our free Market Education Session and learn real strategies from active experts on Zoom. Register now for free access.",
    type: "website",
    locale: "en_US",
    siteName: "MarketEdu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Market Education Session | Learn Real Strategies",
    description:
      "Join our free Market Education Session and learn real strategies from active experts on Zoom. Register now for free access.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
