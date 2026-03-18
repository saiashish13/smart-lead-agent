"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, 
  LogIn, UserPlus, Github, Chrome, Sparkles 
} from "lucide-react"
import { PremiumButton } from "@/components/ui/premium-button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

export const AuthFormUnified = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    // Validate passwords match for Register
    if (activeTab === "signup" && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const endpoint = activeTab === "signin" ? "/api/auth/login" : "/api/auth/register"
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeTab === "signup" ? formData.username : undefined,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed")
      }

      if (activeTab === "signin") {
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setError("Success! Redirecting...")
        setTimeout(() => router.push("/"), 1500)
      } else {
        setError("Registration successful! Please Sign In.")
        setTimeout(() => setActiveTab("signin"), 2000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-12 xl:p-24 relative overflow-hidden bg-[#0a0a0f]">
      {/* Background radial focus glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] pointer-events-none z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Minimal Glass Card */}
        <div className="relative p-10 lg:p-12 rounded-[2.5rem] border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="relative z-10">
            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Sparkles className="text-white h-5 w-5" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white font-heading text-gradient">
                  {activeTab === "signin" ? "Welcome Back" : "Create Account"}
                </h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
                {activeTab === "signin" 
                  ? "Enter your credentials to access your smart sales dashboard." 
                  : "Join our elite network and supercharge your pipeline with AI."}
              </p>
            </div>

            {/* Option A: Minimal Text Tabs */}
            <div className="flex gap-8 mb-12 relative border-b border-white/5 pb-4">
              <button
                onClick={() => setActiveTab("signin")}
                className={cn(
                  "text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 relative",
                  activeTab === "signin" ? "text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                Sign In
                {activeTab === "signin" && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={cn(
                  "text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 relative",
                  activeTab === "signup" ? "text-white" : "text-white/40 hover:text-white/60"
                )}
              >
                Create Account
                {activeTab === "signup" && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {error && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className={cn(
                        "p-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest text-center",
                        error.includes("Success") 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      )}
                    >
                      {error}
                    </motion.div>
                  )}

                  {activeTab === "signup" && (
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-400 group-focus-within:scale-110 transition-all duration-300" />
                        <Input
                          placeholder="John Doe"
                          className="h-16 pl-14 bg-white/[0.03] border-white/5 rounded-2xl focus-visible:ring-0 focus-visible:border-emerald-500/50 hover:bg-white/[0.05] transition-all duration-300 text-white placeholder:text-white/20 focus:glow-neon-emerald shadow-inner"
                          required
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-400 group-focus-within:scale-110 transition-all duration-300" />
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        className="h-16 pl-14 bg-white/[0.03] border-white/5 rounded-2xl focus-visible:ring-0 focus-visible:border-emerald-500/50 hover:bg-white/[0.05] transition-all duration-300 text-white placeholder:text-white/20 focus:glow-neon-emerald shadow-inner"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">Password</label>
                      {activeTab === "signin" && (
                        <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 hover:text-emerald-400 transition-colors">
                          Forgot?
                        </Link>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-400 group-focus-within:scale-110 transition-all duration-300" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-16 pl-14 pr-14 bg-white/[0.03] border-white/5 rounded-2xl focus-visible:ring-0 focus-visible:border-emerald-500/50 hover:bg-white/[0.05] transition-all duration-300 text-white placeholder:text-white/20 focus:glow-neon-emerald shadow-inner"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {activeTab === "signup" && (
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 ml-1">Confirm Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-400 group-focus-within:scale-110 transition-all duration-300" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-16 pl-14 bg-white/[0.03] border-white/5 rounded-2xl focus-visible:ring-0 focus-visible:border-emerald-500/50 hover:bg-white/[0.05] transition-all duration-300 text-white placeholder:text-white/20 focus:glow-neon-emerald shadow-inner"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <PremiumButton 
                type="submit" 
                disabled={isLoading}
                variant={activeTab === "signin" ? "primary" : "secondary"}
                className="w-full mt-4"
              >
                {isLoading ? "Synchronizing..." : (
                  <>
                    <span className="font-bold tracking-[0.3em]">
                      {activeTab === "signin" ? "Access Dashboard" : "Initiate Setup"}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </>
                )}
              </PremiumButton>
            </form>

            {/* Social Entry */}
            <div className="mt-12 pt-12 border-t border-white/5">
              <div className="flex justify-center">
                <button 
                  className="w-full max-w-[240px] flex items-center justify-center gap-3 h-14 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all duration-300 group"
                >
                  <Chrome className="h-4 w-4 text-white/30 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-bold text-white/30 group-hover:text-white tracking-[0.2em] uppercase">Continue with Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
