"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, ArrowRight, Loader2, Cpu } from "lucide-react"
import api from "@/lib/api"
import { GoogleLogin } from "@react-oauth/google"

export default function SigninPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter()
    
    const handleSignin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")
        try {
            const res = await api.post("/auth/signin", { email, password })
            const { token } = res.data
            document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error(error)
            const msg = error.response?.data?.message || "Sign in failed"
            if (msg.toLowerCase().includes("credentials")) {
                setErrorMsg("Invalid credentials. If you signed up with Google, please use the button below. Otherwise, try signing up first.")
            } else {
                setErrorMsg(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true)
        setErrorMsg("")
        try {
            const res = await api.post("/auth/google", { token: credentialResponse.credential })
            const { token } = res.data
            document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error("Google Auth Error", error)
            const msg = error.response?.data?.message || "Google authentication failed"
            setErrorMsg(msg)
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
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
                    
                    <CardHeader className="space-y-1 pt-8 pb-4 text-center relative z-10">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-2xl bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                <Cpu className="w-8 h-8 text-indigo-400" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-white">Welcome Back</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">
                            Enter your credentials or use Google to continue
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

                        <form onSubmit={handleSignin} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10 bg-white/5 border-white/10 text-white focus:ring-indigo-500/50"
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
                                        placeholder="••••••••"
                                        className="pl-10 bg-white/5 border-white/10 text-white focus:ring-indigo-500/50"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0f1115] px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center flex-col items-center gap-4">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setErrorMsg("Google Login Failed")}
                                theme="filled_blue"
                                shape="pill"
                                width="100%"
                            />
                        </div>
                        
                        <div className="text-center mt-6">
                            <p className="text-muted-foreground text-sm">
                                Don't have an account?{" "}
                                <Link 
                                    href="/signup" 
                                    className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
