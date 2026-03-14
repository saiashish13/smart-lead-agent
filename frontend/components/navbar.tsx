"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    LayoutDashboard, 
    Users, 
    UserPlus, 
    Menu, 
    Sparkles, 
    Zap 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-blue-400",
        glow: "shadow-blue-500/50",
        bg: "from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/30"
    },
    {
        label: "Discovery",
        icon: UserPlus,
        href: "/discovery",
        color: "text-purple-400",
        glow: "shadow-purple-500/50",
        bg: "from-purple-500/20 to-indigo-500/20",
        border: "border-purple-500/30"
    },
    {
        label: "Leads",
        icon: Users,
        href: "/leads",
        color: "text-pink-400",
        glow: "shadow-pink-500/50",
        bg: "from-pink-500/20 to-rose-500/20",
        border: "border-pink-500/30"
    },
]

/**
 * Premium Nav Link Component
 */
function NavLink({ route, isActive }: { route: any; isActive: boolean }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Link 
            href={route.href}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative px-4 py-2 group"
        >
            <motion.div
                animate={{ 
                    y: isHovered ? -4 : 0,
                    scale: isHovered ? 1.05 : 1
                }}
                className={cn(
                    "relative z-10 flex items-center gap-2 transition-colors duration-300",
                    isActive || isHovered ? "text-foreground" : "text-muted-foreground"
                )}
            >
                <div className="relative">
                    <route.icon className={cn(
                        "h-4 w-4 transition-all duration-300",
                        (isActive || isHovered) ? route.color : "text-muted-foreground",
                        isHovered && "scale-110"
                    )} />
                </div>
                
                <span className="text-sm font-medium tracking-wide">
                    {route.label}
                </span>

                {/* Shimmer Sweep */}
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                </div>
            </motion.div>

            {/* Active/Hover Pill Background */}
            <AnimatePresence>
                {(isActive || isHovered) && (
                    <motion.div
                        layoutId="nav-pill"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                            "absolute inset-0 rounded-xl border -z-10 transition-colors duration-300",
                            isActive 
                                ? "bg-primary/5 border-primary/10 dark:bg-primary/10 dark:border-primary/20" 
                                : "bg-muted/50 border-transparent",
                            isActive && "shadow-sm"
                        )}
                    />
                )}
            </AnimatePresence>

        </Link>
    )
}

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center p-4 h-20 transition-all duration-500">
            <div className="flex items-center w-full max-w-7xl mx-auto justify-between px-6 h-full bg-background/60 dark:bg-background/40 backdrop-blur-xl border border-border rounded-3xl shadow-sm">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div 
                            whileHover={{ rotate: 180 }}
                            className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                        >
                            <Zap className="text-white h-5 w-5 fill-white" />
                        </motion.div>
                        <h1 className="text-lg font-bold tracking-tight hidden md:block text-foreground group-hover:text-primary transition-all duration-500 uppercase">
                            Lead Agent
                        </h1>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-x-1 p-1.5 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-xl">
                        {routes.map((route) => (
                            <NavLink 
                                key={route.href} 
                                route={route} 
                                isActive={pathname === route.href} 
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    
                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground transition"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-background border-b border-border md:hidden animate-in slide-in-from-top duration-200">
                    <div className="flex flex-col p-4 gap-2">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg transition",
                                    pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
