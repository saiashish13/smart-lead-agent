"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, ArrowRight, Loader2, Cpu, CheckCircle } from "lucide-react"
import api from "@/lib/api"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter()
    
    const handleSignup = async (e) => {
        e.preventDefault()
        setErrorMsg("")
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match")
            return
        }
        setLoading(true)
        try {
            const res = await api.post("/auth/signup", { email, password })
            const { token } = res.data
            document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error(error)
            const msg = error.response?.data?.message || "Sign up failed"
            if (msg.toLowerCase().includes("already exists")) {
                setErrorMsg("An account with this email already exists. Please Sign In instead.")
            } else {
                setErrorMsg(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-104px)] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="glass-card border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                    
                    <CardHeader className="space-y-1 pt-8 pb-4 text-center relative z-10">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-2xl bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                                <Cpu className="w-8 h-8 text-cyan-400" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-white">Create Account</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">
                            Start your AI-powered lead generation journey
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 pt-4 pb-8 relative z-10">
                        {errorMsg && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center"
                            >
                                {errorMsg}
                            </motion.div>
                        )}
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10 bg-white/5 border-white/10 text-white focus:ring-cyan-500/50"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10 bg-white/5 border-white/10 text-white focus:ring-cyan-500/50"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="pl-10 bg-white/5 border-white/10 text-white focus:ring-cyan-500/50"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign Up <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                        
                        <div className="text-center mt-6">
                            <p className="text-muted-foreground text-sm">
                                Already have an account?{" "}
                                <Link 
                                    href="/signin" 
                                    className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4 transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
