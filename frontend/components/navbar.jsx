"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    LayoutGrid, 
    Compass, 
    Users, 
    Zap,
    Menu,
    X,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutGrid,
        href: "/dashboard",
    },
    {
        label: "Discovery",
        icon: Compass,
        href: "/discovery",
    },
    {
        label: "Leads",
        icon: Users,
        href: "/leads",
    },
]

export function Navbar() {
    const pathname = usePathname()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const router = useRouter()

    const isAuthPage = pathname.startsWith("/auth")

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/auth")
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || isAuthPage) return null

    const isDarkMode = resolvedTheme === "dark"

    // Only apply the complex dark glassmorphism design if in dark mode
    if (isDarkMode) {
        return (
            <motion.nav 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-[#020205]/60 backdrop-blur-xl border-b border-white/10"
            >
                <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between px-6 relative h-full">
                    {/* LEFT: Logo Group */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[hsl(260,45%,20%)] to-[hsl(220,55%,18%)] border border-white/10 shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                            <Zap className="text-white h-5 w-5 fill-white" />
                        </div>
                        <span className="text-white font-semibold tracking-wider text-sm">
                            LEAD AGENT
                        </span>
                    </Link>

                    {/* CENTER: Centered Pill Navigation */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center bg-white/4 border border-white/10 rounded-full p-1.5 backdrop-blur-md">
                        {routes.map((route) => {
                            const isActive = pathname === route.href
                            const Icon = route.icon
                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300",
                                        isActive ? "text-white" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-active-pill"
                                            className="absolute inset-0 bg-white/10 border border-white/10 rounded-full -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                    <Icon className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-widest">{route.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button 
                            onClick={handleLogout}
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all text-xs font-semibold"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            LOGOUT
                        </button>
                        <button 
                            className="md:hidden p-2 text-white/70 hover:text-white transition"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-16 left-0 right-0 bg-[#020205]/95 border-b border-white/10 backdrop-blur-2xl md:hidden overflow-hidden"
                        >
                            <div className="flex flex-col p-6 gap-4">
                                {routes.map((route) => {
                                    const Icon = route.icon
                                    return (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl transition-all",
                                                pathname === route.href 
                                                    ? "bg-white/10 text-white" 
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-sm font-medium uppercase tracking-widest">{route.label}</span>
                                        </Link>
                                    )
                                })}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 p-3 rounded-xl transition-all text-red-400 hover:bg-red-500/10"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="text-sm font-medium uppercase tracking-widest">Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        )
    }

    // Default clean/simple layout for Light Mode (preserving original functionality)
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 shadow-md transition-transform group-hover:scale-105">
                        <Zap className="text-white h-5 w-5 fill-white" />
                    </div>
                    <span className="text-gray-900 font-bold tracking-tight text-lg uppercase">
                        Lead Agent
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-x-2">
                    {routes.map((route) => {
                        const isActive = pathname === route.href
                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    isActive 
                                        ? "bg-gray-100 text-blue-600" 
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                {route.label}
                            </Link>
                        )
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleLogout}
                        className="hidden md:flex"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                    <button 
                        className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>
        </nav>
    )
}
