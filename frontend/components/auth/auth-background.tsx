"use client"

import React from "react"
import { motion } from "framer-motion"
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

export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f] transition-colors duration-1000">
      {/* Orbs Layer - Synchronized with main AtmosphericBackground (Vivid) */}
      <div className="absolute inset-0 overflow-hidden opacity-90">
        {/* Top-Left Violet */}
        <Orb 
            color="hsl(260, 65%, 25%)" 
            size={700} 
            blur={100} 
            delay={1} 
            duration={20} 
            drift={140}
            className="-top-32 -left-32"
        />
        
        {/* Right-Side Cobalt */}
        <Orb 
            color="hsl(220, 75%, 22%)" 
            size={750} 
            blur={120} 
            delay={4} 
            duration={24} 
            drift={160}
            className="top-1/4 -right-40"
        />

        {/* Bottom-Center Violet */}
        <Orb 
            color="hsl(260, 65%, 25%)" 
            size={600} 
            blur={90} 
            delay={6} 
            duration={18} 
            drift={100}
            className="-bottom-40 left-1/3"
        />

        {/* Center Cobalt */}
        <Orb 
            color="hsl(220, 75%, 22%)" 
            size={550} 
            blur={110} 
            delay={2} 
            duration={19} 
            drift={120}
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* Auth-Specific Radial Focus Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/[0.02] rounded-full blur-[150px] pointer-events-none" />
      
      {/* Depth Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,15,1)_100%)]" />
    </div>
  )
}
