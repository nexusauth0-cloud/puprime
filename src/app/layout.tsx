import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Market Education Session | Learn Real Strategies",
  description: "Join our free Market Education Session and learn real strategies from active experts on Zoom. Register now for free access.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
