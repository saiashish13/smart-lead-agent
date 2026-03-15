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


const Particle = ({ delay }: { delay: number }) => (
    <motion.div
        initial={{ y: 0, x: 0, opacity: 0 }}
        animate={{
            y: -40,
            x: Math.random() * 40 - 20,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5]
        }}
        transition={{
            duration: 2,
            repeat: Infinity,
            delay: delay,
            ease: "easeOut"
        }}
        className="absolute w-1 h-1 bg-white rounded-full blur-[1px] pointer-events-none"
    />
)

export const DeployButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ className, isLoading, onClick, children, ...props }, ref) => {
        const [isHovered, setIsHovered] = React.useState(false)

        return (
            <div className="relative w-full group perspective-1000">
                {/* Emerald Glow Effect */}
                <div className={cn(
                    "absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500/40 to-teal-500/40 opacity-0 blur-xl transition-all duration-700",
                    isHovered && "opacity-100 scale-110",
                    isLoading && "opacity-50 animate-pulse"
                )} />

                <motion.button
                    ref={ref}
                    disabled={isLoading}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={onClick}
                    initial={false}
                    animate={{
                        scale: isLoading ? 0.98 : isHovered ? 1.05 : 1,
                        y: isHovered && !isLoading ? -3 : 0,
                    }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={cn(
                        "relative w-full flex flex-col items-center justify-center min-h-[64px] px-8 py-4 rounded-xl font-bold transition-all duration-500 overflow-hidden shadow-2xl",
                        "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
                        "border border-white/20",
                        isLoading && "cursor-not-allowed opacity-80",
                        className
                    )}
                    {...(props as any)}
                >
                    {/* Inner Top Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/40 z-20" />

                    {/* Shimmer Effects */}
                    <AnimatePresence>
                        {isHovered && !isLoading && (
                            <>
                                <motion.div
                                    initial={{ x: "-150%", skewX: -45 }}
                                    animate={{ x: "250%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full z-10"
                                />
                                <motion.div
                                    initial={{ x: "-150%", skewX: -45 }}
                                    animate={{ x: "250%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.2 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full z-10"
                                />
                            </>
                        )}
                    </AnimatePresence>

                    {/* Particles */}
                    {isHovered && !isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                                <Particle key={i} delay={i * 0.4} />
                            ))}
                        </div>
                    )}

                    <div className="relative z-20 flex items-center justify-center gap-3 w-full">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-3"
                                >
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span className="text-base tracking-tight uppercase">
                                        Intializing Agent
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-3"
                                >
                                    <motion.div
                                        animate={isHovered ? { rotate: -12, scale: 1.2 } : { rotate: 0, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Rocket className="h-5 w-5 fill-white/20" />
                                    </motion.div>
                                    <span className="text-base tracking-tight">
                                        {children || "Deploy Fresh Packet Agent"}
                                    </span>
                                    <motion.div
                                        animate={isHovered ? { x: 4 } : { x: 0 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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
                {/* Vibrant Red Glow Effect */}
                <div className={cn(
                    "absolute -inset-1 rounded-xl bg-gradient-to-r from-rose-500/40 to-red-600/40 opacity-0 blur-xl transition-all duration-700",
                    isHovered && "opacity-100 scale-110"
                )} />

                <motion.button
                    ref={ref}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={cn(
                        "relative flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-500 overflow-hidden shadow-2xl",
                        "bg-gradient-to-br from-rose-500 to-red-600 text-white",
                        "border border-white/20",
                        size === "sm" ? "px-4 py-2 text-xs" : size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-sm",
                        className
                    )}
                    {...(props as any)}
                >
                    {/* Inner Top Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/30 z-20" />
                    
                    {/* Glass Shine Sweep */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div 
                                initial={{ x: "-150%", skewX: -45 }}
                                animate={{ x: "250%" }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full z-10"
                            />
                        )}
                    </AnimatePresence>

                    <div className="relative z-20 flex items-center gap-2">
                        <motion.div
                            animate={isHovered ? { rotate: 12, scale: 1.1 } : { rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Trash2 className="h-4 w-4 fill-white/10" />
                        </motion.div>
                        <span className="tracking-wide">{children || "Clear All"}</span>
                    </div>
                </motion.button>
            </div>
        )
    }
)
 ClearButton.displayName = "ClearButton"
