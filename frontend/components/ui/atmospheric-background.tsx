"use client"

import React from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const Orb = ({ 
    className, 
    color, 
    size, 
    blur, 
    delay = 0, 
    duration = 20, 
    drift = 100 
}: { 
    className?: string
    color: string
    size: number
    blur: number
    delay?: number
    duration?: number
    drift?: number
}) => {
    return (
        <motion.div
            initial={{ 
                x: 0, 
                y: 0, 
                scale: 1, 
                opacity: 0.5 
            }}
            animate={{
                x: [0, drift, -drift, 0],
                y: [0, -drift, drift, 0],
                scale: [1, 1.4, 0.8, 1],
                opacity: [0.5, 1, 0.3, 0.5]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
            style={{
                width: size,
                height: size,
                background: color,
                filter: `blur(${blur}px)`,
            }}
            className={cn("absolute rounded-full pointer-events-none", className)}
        />
    )
}

export const AtmosphericBackground = () => {
    const { theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Wait for mount to avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || resolvedTheme !== "dark") return null

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#020205] transition-colors duration-1000">
            {/* Orbs Layer */}
            <div className="absolute inset-0 overflow-hidden opacity-80">
                {/* Top-Left Violet */}
                <Orb 
                    color="hsl(260, 65%, 25%)" 
                    size={600} 
                    blur={100} 
                    delay={1} 
                    duration={20} 
                    drift={140}
                    className="-top-24 -left-24"
                />
                
                {/* Right-Side Cobalt */}
                <Orb 
                    color="hsl(220, 75%, 22%)" 
                    size={650} 
                    blur={120} 
                    delay={4} 
                    duration={24} 
                    drift={160}
                    className="top-1/4 -right-32"
                />

                {/* Bottom-Center Violet */}
                <Orb 
                    color="hsl(260, 65%, 25%)" 
                    size={500} 
                    blur={90} 
                    delay={6} 
                    duration={18} 
                    drift={100}
                    className="-bottom-32 left-1/3"
                />

                {/* Center Cobalt */}
                <Orb 
                    color="hsl(220, 75%, 22%)" 
                    size={450} 
                    blur={110} 
                    delay={2} 
                    duration={19} 
                    drift={120}
                    className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </div>

            {/* Noise Texture Overlay */}
            <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.03] mix-blend-overlay">
                <filter id="noiseFilter">
                    <feTurbulence 
                        type="fractalNoise" 
                        baseFrequency="0.65" 
                        numOctaves="3" 
                        stitchTiles="stitch" 
                    />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
            
            {/* Depth Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020205]/40 pointer-events-none" />
        </div>
    )
}
