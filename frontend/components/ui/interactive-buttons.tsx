"use client"

import * as React from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { Rocket, Send, Trash2, Loader2, Sparkles as SparklesIcon, ArrowRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    icon?: React.ReactNode
    size?: "default" | "sm" | "lg" | "icon"
}

/**
 * Hook for magnetic effect
 */
function useMagnetic(strength = 20) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 15, stiffness: 150 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY, currentTarget } = e
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        const centerX = left + width / 2
        const centerY = top + height / 2
        
        // Calculate offset from center and multiply by strength (percentage-based)
        mouseX.set((clientX - centerX) / (width / 2) * strength)
        mouseY.set((clientY - centerY) / (height / 2) * strength)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    return { x, y, handleMouseMove, handleMouseLeave }
}


export const DeployButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ className, isLoading, icon: customIcon, size = "default", children, ...props }, ref) => {
        const [isHovered, setIsHovered] = React.useState(false)

        return (
            <div className="relative w-full group">
                {/* Subtle Ambient Glow */}
                <div className={cn(
                    "absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/50 to-primary-foreground/50 opacity-0 blur transition-all duration-500",
                    isHovered && "opacity-20 blur-xl"
                )} />

                <motion.button
                    ref={ref}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{ scale: 0.995 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                        "relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-500 overflow-hidden shadow-lg",
                        "bg-primary text-primary-foreground",
                        "border border-primary-foreground/10",
                        isLoading && "cursor-not-allowed opacity-80",
                        className
                    )}
                    {...(props as any)}
                >
                    {/* Breathing/Pulse Effect */}
                    <div className="absolute inset-0 bg-white/5 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Glass Shine Sweep */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="uppercase tracking-widest text-xs font-bold">Initializing Agent...</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="flex items-center gap-2 relative z-10"
                            >
                                <Zap className="h-5 w-5 fill-current" />
                                <span className="uppercase tracking-widest text-sm font-bold">
                                    {children || "Deploy Fresh Packet Agent"}
                                </span>
                                <ArrowRight className={cn(
                                    "h-4 w-4 transition-transform duration-300",
                                    isHovered ? "translate-x-1" : ""
                                )} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        )
    }
)
DeployButton.displayName = "DeployButton"

export const SendButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ className, isLoading, icon: customIcon, size = "default", children, ...props }, ref) => {
        const { x, y, handleMouseMove, handleMouseLeave } = useMagnetic(10)

        return (
            <motion.div
                style={{ x, y }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative inline-block"
            >
                <motion.button
                    ref={ref}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "relative group flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition-all duration-300 shadow-xl overflow-hidden",
                        "bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-emerald-500/50",
                        "border border-white/10 backdrop-blur-sm",
                        size === "sm" ? "px-3 py-1.5 text-[0.7rem] uppercase tracking-wider" : size === "lg" ? "px-6 py-3 text-lg" : "px-4 py-2 text-base",
                        className
                    )}
                    {...(props as any)}
                >
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                <Loader2 className="h-4 w-4" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="icon"
                                whileHover={{ x: 3, y: -3, scale: 1.2 }}
                            >
                                <Send className="h-4 w-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span className="relative z-10">{children || "Send"}</span>
                </motion.button>
            </motion.div>
        )
    }
)
SendButton.displayName = "SendButton"

export const ClearButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ className, size = "default", isLoading, icon: customIcon, children, ...props }, ref) => {
        const [isHovered, setIsHovered] = React.useState(false)

        return (
            <div className="relative inline-block group">
                {/* Subtle Ambient Glow */}
                <div className={cn(
                    "absolute -inset-0.5 rounded-xl bg-gradient-to-r from-destructive/50 to-destructive/20 opacity-0 blur transition-all duration-500",
                    isHovered && "opacity-20 blur-xl"
                )} />

                <motion.button
                    ref={ref}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{ scale: 0.995 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                        "relative flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-500 overflow-hidden shadow-lg",
                        "bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground",
                        "border border-destructive/20",
                        size === "sm" ? "px-4 py-2 text-xs" : size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-sm",
                        className
                    )}
                    {...(props as any)}
                >
                    {/* Breathing/Pulse Effect */}
                    <div className="absolute inset-0 bg-white/5 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Glass Shine Sweep */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

                    <div className="relative z-10 flex items-center gap-2">
                        <Trash2 className={cn(
                            "h-4 w-4 transition-transform duration-300",
                            isHovered ? "rotate-12" : ""
                        )} />
                        <span>{children || "Clear All"}</span>
                    </div>
                </motion.button>
            </div>
        )
    }
)
ClearButton.displayName = "ClearButton"
