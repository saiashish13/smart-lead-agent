"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-9 w-16" /> // Placeholder
    }

    const isDark = theme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "group relative h-9 w-16 rounded-full p-1 transition-all duration-300",
                "bg-zinc-200/50 dark:bg-zinc-800/50 backdrop-blur-md",
                "border border-zinc-300/50 dark:border-zinc-700/50",
                "hover:shadow-lg focus:outline-none"
            )}
        >
            <span className="sr-only">Toggle theme</span>

            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Background Glow */}
            <div className={cn(
                "absolute inset-0 rounded-full opacity-50 blur-md transition-all duration-500",
                isDark ? "bg-blue-600/20" : "bg-amber-400/20"
            )} />

            {/* Sliding Knob */}
            <motion.div
                className={cn(
                    "relative z-10 h-7 w-7 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300",
                    isDark ? "bg-zinc-900" : "bg-white"
                )}
                animate={{
                    x: isDark ? 28 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon className="h-4 w-4 text-blue-400 fill-blue-400/20" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ scale: 0, rotate: 90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Micro-stars for dark mode */}
                {isDark && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute h-0.5 w-0.5 bg-white rounded-full"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ 
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    x: (i - 1) * 8 + (Math.random() - 0.5) * 4,
                                    y: (Math.random() - 0.5) * 12
                                }}
                                transition={{
                                    duration: 1 + Math.random(),
                                    repeat: Infinity,
                                    delay: Math.random()
                                }}
                            />
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Static background icons */}
            <div className="absolute inset-x-0 inset-y-1 flex items-center justify-around px-1 px-1.5 pointer-events-none opacity-40">
                <Sun className={cn("h-3.5 w-3.5 transition-colors", !isDark ? "text-amber-500" : "text-zinc-500")} />
                <Moon className={cn("h-3.5 w-3.5 transition-colors", isDark ? "text-blue-400" : "text-zinc-500")} />
            </div>
        </button>
    )
}
