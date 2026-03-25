"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  User, Mail, Lock, Eye, EyeOff, 
  Chrome, Sparkles, LayoutDashboard, Settings
} from "lucide-react"
import { CinematicButton } from "@/components/ui/cinematic-button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase-client"

export const AuthFormUnified = () => {
  const [activeTab, setActiveTab] = useState("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Specific focused state for premium input glow
  const [focusedInput, setFocusedInput] = useState(null)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const router = useRouter()

  const signInWithGoogle = () => {
    // Redirect to Flask backend which initiates the Google OAuth flow
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  const handleSubmit = async (e) => {
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
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-12 xl:p-24 relative overflow-hidden z-10 perspective-1000">
      
      {/* Background radial focus glow specific to form area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[140px] pointer-events-none -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Cinematic Glass Card */}
        <div className="relative p-8 sm:p-10 lg:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden isolate">
          
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none -z-10" />
          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/5 pointer-events-none -z-10" />

          {/* Header Section */}
          <div className="mb-10 text-center flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center border border-white/20 relative"
            >
              <div className="absolute inset-0 rounded-2xl pointer-events-none" />
              <Sparkles className="text-white h-6 w-6" />
            </motion.div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white font-heading">
              {activeTab === "signin" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-white/50 text-sm mt-3 leading-relaxed max-w-[280px]">
              {activeTab === "signin" 
                ? "Enter your credentials to access your smart sales dashboard." 
                : "Join our elite network and supercharge your pipeline with AI."}
            </p>
          </div>

          {/* Premium Pill Tabs */}
          <div className="flex p-1 mb-10 bg-white/[0.03] border border-white/10 rounded-2xl relative z-20 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("signin")}
              className={cn(
                "flex-1 relative h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors duration-300 z-10",
                activeTab === "signin" ? "text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              Sign In
              {activeTab === "signin" && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.5)] -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={cn(
                "flex-1 relative h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors duration-300 z-10",
                activeTab === "signup" ? "text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              Register
              {activeTab === "signup" && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.5)] -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {error && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className={cn(
                      "p-4 rounded-xl border text-xs font-bold uppercase tracking-widest text-center shadow-lg backdrop-blur-md",
                      error.includes("Success") 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    )}
                  >
                    {error}
                  </motion.div>
                )}

                {activeTab === "signup" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className={cn("absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300", focusedInput === 'username' ? "text-emerald-400 scale-110" : "text-white/20")} />
                      <Input
                        placeholder="John Doe"
                        className={cn(
                          "h-14 pl-14 bg-white/[0.03] border-white/10 rounded-xl text-white placeholder:text-white/20 shadow-inner transition-all duration-300",
                          focusedInput === 'username' ? "border-emerald-500/50 ring-1 ring-emerald-500/20 bg-emerald-500/[0.02]" : "hover:border-white/20 hover:bg-white/[0.05]"
                        )}
                        required
                        value={formData.username}
                        onFocus={() => setFocusedInput('username')}
                        onBlur={() => setFocusedInput(null)}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 relative">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1 transition-colors">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className={cn(
                      "absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300",
                      focusedInput === 'email' ? "text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "text-white/20"
                    )} />
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      className={cn(
                        "h-14 pl-14 bg-white/[0.03] border-white/10 rounded-xl text-white placeholder:text-white/20 shadow-inner transition-all duration-300",
                        focusedInput === 'email' ? "border-emerald-500/50 ring-1 ring-emerald-500/20 bg-emerald-500/[0.02]" : "hover:border-white/20 hover:bg-white/[0.05]"
                      )}
                      required
                      value={formData.email}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Password</label>
                  <div className="relative group">
                    <Lock className={cn(
                      "absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300",
                      focusedInput === 'password' ? "text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "text-white/20"
                    )} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={cn(
                        "h-14 pl-14 pr-14 bg-white/[0.03] border-white/10 rounded-xl text-white placeholder:text-white/30 shadow-inner transition-all duration-300 tracking-widest",
                        focusedInput === 'password' ? "border-emerald-500/50 ring-1 ring-emerald-500/20 bg-emerald-500/[0.02]" : "hover:border-white/20 hover:bg-white/[0.05]"
                      )}
                      required
                      value={formData.password}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {activeTab === "signup" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Confirm Password</label>
                    <div className="relative group">
                      <Lock className={cn("absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300", focusedInput === 'confirmPassword' ? "text-emerald-400 scale-110" : "text-white/20")} />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={cn(
                          "h-14 pl-14 pr-14 bg-white/[0.03] border-white/10 rounded-xl text-white placeholder:text-white/30 shadow-inner transition-all duration-300 tracking-widest",
                          focusedInput === 'confirmPassword' ? "border-emerald-500/50 ring-1 ring-emerald-500/20 bg-emerald-500/[0.02]" : "hover:border-white/20 hover:bg-white/[0.05]"
                        )}
                        required
                        value={formData.confirmPassword}
                        onFocus={() => setFocusedInput('confirmPassword')}
                        onBlur={() => setFocusedInput(null)}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {activeTab === "signin" ? (
              <CinematicButton 
                type="submit"
                disabled={isLoading}
                theme="cyan"
                label={isLoading ? "Authenticating..." : "Access Dashboard"}
                icon={LayoutDashboard}
                className="mt-6"
              />
            ) : (
              <CinematicButton 
                type="submit"
                disabled={isLoading}
                theme="violet"
                label={isLoading ? "Synchronizing..." : "Initiate Setup"}
                icon={Settings}
                className="mt-6"
              />
            )}
          </form>

          {/* Social Entry */}
          <div className="mt-10 pt-8 border-t border-white/10 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0f] px-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hidden">
              OR
            </div>
            <div className="flex justify-center w-full">
              <button 
                type="button"
                onClick={signInWithGoogle}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 h-14 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] disabled:opacity-50 transition-all duration-300 group"
              >
                <Chrome className="h-4 w-4 text-white/40 group-hover:text-emerald-400 transition-colors duration-300" />
                <span className="text-[10px] font-bold text-white/40 group-hover:text-white tracking-widest uppercase transition-colors duration-300">
                  Continue with Google
                </span>
              </button>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  )
}
