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
    driftX = 100,
    driftY = 100
}) => {
    return (
        <motion.div
            initial={{ 
                x: 0, 
                y: 0, 
                scale: 1, 
                opacity: 0.4
            }}
            animate={{
                x: [0, driftX, -driftX, 0],
                y: [0, -driftY, driftY, 0],
                scale: [1, 1.2, 0.9, 1],
                opacity: [0.4, 0.8, 0.3, 0.4]
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
            className={cn("absolute rounded-full pointer-events-none mix-blend-screen", className)}
        />
    )
}

export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#030305] overflow-hidden">
      {/* Deep Space Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#030305] to-[#030305]" />

      {/* Cinematic Mesh Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-80">
        <Orb 
            color="rgba(16, 185, 129, 0.15)" // Emerald
            size={900} 
            blur={140} 
            delay={0} 
            duration={25} 
            driftX={200}
            driftY={150}
            className="-top-64 -left-32"
        />
        <Orb 
            color="rgba(56, 189, 248, 0.12)" // Light Blue
            size={1000} 
            blur={150} 
            delay={5} 
            duration={30} 
            driftX={-150}
            driftY={200}
            className="top-1/4 -right-64"
        />
        <Orb 
            color="rgba(139, 92, 246, 0.12)" // Violet
            size={850} 
            blur={160} 
            delay={10} 
            duration={28} 
            driftX={180}
            driftY={-120}
            className="-bottom-64 left-1/4"
        />
        <Orb 
            color="rgba(20, 184, 166, 0.1)" // Teal
            size={600} 
            blur={120} 
            delay={2} 
            duration={22} 
            driftX={-100}
            driftY={100}
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Grid Texture Layer (Linear/Stripe aesthetic) */}
      <div 
        className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay" />

      {/* Auth-Specific Radial Focus Glow */}
      <div className="absolute left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-emerald-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
      
      {/* Depth Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030305]/90 pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none" />
    </div>
  )
}
