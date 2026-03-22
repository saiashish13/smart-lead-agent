"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Database, Send, Network, Cpu, CreditCard, Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
    {
        name: "Dashboard",
        href: "/",
        icon: BarChart3,
    },
    {
        name: "Discovery",
        href: "/discovery",
        icon: Database,
    },
    {
        name: "Leads",
        href: "/leads",
        icon: Network,
    },
    {
        name: "Subscription",
        href: "/subscription",
        icon: CreditCard,
    }
]

export function Navbar() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none">
            {/* The actual navigation container, isolated for centering */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 px-2 py-2 glass-card rounded-2xl md:rounded-full pointer-events-auto border-white/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] w-full max-w-sm md:max-w-fit">
                
                {/* Logo Section & Mobile Toggle */}
                <div className="flex items-center justify-between pl-3 pr-2 md:pr-6 md:border-r border-white/10 md:mr-2">
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                            <Cpu className="w-5 h-5 text-indigo-400 drop-shadow-md" />
                        </div>
                        <span className="font-bold tracking-tight text-white drop-shadow-sm">
                            Smart Lead Agent
                        </span>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                        aria-label="Toggle Navigation Menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Primary Navigation Links - Desktop (always visible) */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out group flex items-center gap-2.5",
                                    isActive
                                        ? "text-white"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                {/* Glowing Active Background Pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className="absolute inset-0 bg-white/10 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    >
                                        <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                                    </motion.div>
                                )}

                                <item.icon 
                                    className={cn(
                                        "w-4 h-4 relative z-10 transition-colors duration-300",
                                        isActive ? "text-cyan-400 drop-shadow-md" : "group-hover:text-white"
                                    )} 
                                />
                                <span className="relative z-10 tracking-wide">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Mobile Navigation Menu - Expandable via framer-motion */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.nav 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex flex-col gap-1 overflow-hidden md:hidden px-2 pb-2"
                        >
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                
                                return (
                                    <Link
                                        key={`mobile-${item.href}`}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out group flex items-center gap-3",
                                            isActive
                                                ? "text-white bg-white/10"
                                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon 
                                            className={cn(
                                                "w-4 h-4 transition-colors duration-300",
                                                isActive ? "text-cyan-400 drop-shadow-md" : "group-hover:text-white"
                                            )} 
                                        />
                                        <span className="tracking-wide">{item.name}</span>
                                    </Link>
                                )
                            })}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}
