"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      // Store token from Flask backend redirect
      localStorage.setItem("token", token)

      // Decode JWT payload (base64) to get basic user info
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        localStorage.setItem("user", JSON.stringify({ id: payload.sub }))
      } catch (e) {
        // non-critical, just proceed
      }

      router.replace("/dashboard")
    } else {
      // Fallback: if no token in URL, redirect to login
      router.replace("/auth")
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Signing you in...</h2>
          <p className="text-white/40 text-sm animate-pulse">Setting up your session</p>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  )
}
