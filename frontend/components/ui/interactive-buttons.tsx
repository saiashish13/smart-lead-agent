"use client"

import * as React from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { Rocket, Send, Trash2, Loader2, Sparkles as SparklesIcon, ArrowRight } from "lucide-react"
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

/**
 * Sparkle particle component
 */
const Sparkle = ({ size, color }: { size: number; color: string }) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ 
                scale: [0, 1.2, 0], 
                opacity: [0, 1, 0],
                rotate: 180,
                y: [0, -20, -40],
                x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60]
            }}
            transition={{ 
                duration: 1 + Math.random(), 
                repeat: Infinity,
                delay: Math.random() * 2
            }}
            style={{
                position: "absolute",
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: "50%",
                filter: "blur(1px)",
                boxShadow: `0 0 10px ${color}`
            }}
        />
    )
}

/**
 * Center Star component
 */
const CenterStar = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
            opacity: [0.3, 1, 0.3], 
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 90, 180] 
        }}
        transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
        <div className="w-1.5 h-1.5 bg-white rounded-full blur-[1px] shadow-[0_0_8px_white]" />
        <div className="absolute w-4 h-[1px] bg-white/40 blur-[0.5px]" />
        <div className="absolute h-4 w-[1px] bg-white/40 blur-[0.5px]" />
    </motion.div>
)

/**
 * Particle Explosion Component
 */
const ParticleExplosion = ({ isHovered }: { isHovered: boolean }) => {
    return (
        <div className="absolute inset-0 pointer-events-none -z-10">
            <AnimatePresence>
                {isHovered && 
                    [...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                            animate={{ 
                                x: (Math.random() - 0.5) * 150, 
                                y: (Math.random() - 0.5) * 150,
                                scale: [0, 1, 0],
                                opacity: [1, 1, 0]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                                duration: 0.8, 
                                repeat: Infinity, 
                                repeatDelay: 0.5,
                                ease: "easeOut" 
                            }}
                            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                        />
                    ))
                }
            </AnimatePresence>
        </div>
    )
}

/**
 * Pulsing Ripple Rings
 */
const RippleRings = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                    scale: [0.8, 2], 
                    opacity: [0.3, 0] 
                }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.6,
                    ease: "easeOut"
                }}
                className="absolute w-full h-full rounded-xl border border-blue-400/30"
            />
        ))}
    </div>
)

export const DeployButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ className, isLoading, icon: customIcon, size = "default", children, ...props }, ref) => {
        const { x, y, handleMouseMove, handleMouseLeave } = useMagnetic(15)
        const [isHovered, setIsHovered] = React.useState(false)
        const [hasMounted, setHasMounted] = React.useState(false)

        React.useEffect(() => {
            setHasMounted(true)
        }, [])

        return (
            <motion.div
                style={{ x, y }}
                onMouseMove={(e) => {
                    handleMouseMove(e)
                    setIsHovered(true)
                }}
                onMouseLeave={() => {
                    handleMouseLeave()
                    setIsHovered(false)
                }}
                className="relative inline-block"
            >
                {/* Advanced Pulsing Ripples */}
                {isHovered && <RippleRings />}

                {/* Particle Explosion */}
                <ParticleExplosion isHovered={isHovered} />

                {/* Glowing Aura Gradient behind button */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.7, scale: 1.3 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 -z-20 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 blur-3xl rounded-full"
                        />
                    )}
                </AnimatePresence>

                {/* Sparkles around button */}
                {isHovered && hasMounted && (
                    <div className="absolute inset-0 pointer-events-none -z-10">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ 
                                position: "absolute", 
                                left: `${Math.random() * 100}%`, 
                                top: `${Math.random() * 100}%` 
                            }}>
                                <Sparkle size={Math.random() * 4 + 2} color={i % 2 === 0 ? "#60a5fa" : "#c084fc"} />
                            </div>
                        ))}
                    </div>
                )}

                <motion.button
                    ref={ref}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                        "relative overflow-hidden group flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all duration-500",
                        // Rainbow Gradient Animation
                        "bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-indigo-600 bg-[length:400%_auto] animate-gradient-x shadow-2xl shadow-blue-500/40",
                        "border border-white/20 backdrop-blur-md",
                        size === "sm" ? "px-4 py-2 text-sm" : size === "lg" ? "px-8 py-4 text-xl" : "px-6 py-3 text-lg",
                        className
                    )}
                    {...(props as any)}
                >
                    <div className="absolute inset-0 rounded-xl border border-white/40 group-hover:animate-pulse-glow" />
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2"
                            >
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Deploying Agent...</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3 relative z-10"
                            >
                                <motion.div
                                    animate={{ 
                                        x: isHovered ? [0, 5, 0] : 0,
                                        rotate: isHovered ? [0, -10, 10, 0] : 0
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <ArrowRight className="h-6 w-6 group-hover:text-amber-200 transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                </motion.div>
                                <span className="tracking-widest uppercase text-[0.85rem] font-black drop-shadow-md">
                                    {children || "Deploy Fresh Packet Agent"}
                                </span>
                                <SparklesIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse text-yellow-200" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </motion.div>
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
        const { x, y, handleMouseMove, handleMouseLeave } = useMagnetic(10)
        const [isHovered, setIsHovered] = React.useState(false)
        const [isClicked, setIsClicked] = React.useState(false)

        return (
            <motion.div
                style={{ x, y }}
                onMouseMove={(e) => {
                    handleMouseMove(e)
                    setIsHovered(true)
                }}
                onMouseLeave={() => {
                    handleMouseLeave()
                    setIsHovered(false)
                }}
                className="relative inline-block"
            >
                <motion.button
                    ref={ref}
                    whileHover={{ 
                        scale: 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        setIsClicked(true)
                        setTimeout(() => setIsClicked(false), 600)
                        props.onClick?.(e as any)
                    }}
                    className={cn(
                        "relative group flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all duration-500 shadow-xl overflow-hidden",
                        "bg-gradient-to-br from-rose-500 to-orange-600 hover:shadow-rose-500/50",
                        "border border-white/10 backdrop-blur-sm",
                        size === "sm" ? "px-3 py-1.5 text-[0.7rem] uppercase tracking-wider" : size === "lg" ? "px-8 py-4 text-xl" : "px-6 py-3 text-lg",
                        className
                    )}
                    {...(props as any)}
                >
                    {/* Shine/Sweep Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    {/* Outer Glow on Hover */}
                    <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all duration-500" />

                    {/* Center Twinkle Star */}
                    <AnimatePresence>
                        {isHovered && <CenterStar />}
                    </AnimatePresence>

                    {/* Click Ripple Effect */}
                    <AnimatePresence>
                        {isClicked && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0.6 }}
                                animate={{ scale: 3, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-white rounded-full pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    <motion.div
                        animate={{ 
                            x: isHovered ? [0, -1, 1, -1, 1, 0] : 0,
                        }}
                        transition={{ repeat: Infinity, duration: 0.3 }}
                        className="relative z-10 flex items-center gap-2"
                    >
                        <Trash2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </motion.div>
                    
                    <span className="relative z-10">{children || "Clear All"}</span>
                </motion.button>
            </motion.div>
        )
    }
)
ClearButton.displayName = "ClearButton"
