"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AuthGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const isAuthPage = pathname.startsWith("/auth")
      const isCallbackPage = pathname === "/auth/callback"

      // Allow the callback page to load freely — it has its own redirect logic
      if (isCallbackPage) {
        setIsReady(true)
        return
      }

      if (!token && !isAuthPage) {
        // Not logged in and not on an auth page → go to login
        router.push("/auth")
      } else if (token && pathname === "/auth") {
        // Logged in but on auth page → go to dashboard
        router.push("/dashboard")
      } else {
        setIsReady(true)
      }
    }

    checkAuth()

    // Listen for storage events (login/logout from other tabs)
    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [pathname, router])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
