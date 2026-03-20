"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export const PremiumButton = ({
  children,
  className,
  variant = "primary",
  glowColor = "emerald",
  particleCount = 12,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [particles, setParticles] = useState([])

  const primaryColors = ["bg-emerald-400", "bg-cyan-400", "bg-blue-400"]
  const secondaryColors = ["bg-purple-400", "bg-pink-400", "bg-rose-400", "bg-fuchsia-400"]

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 0.8 + 0.6, // Faster particles
      delay: Math.random() * 1.5,
      colorIndex: Math.floor(Math.random() * (variant === "primary" ? primaryColors.length : secondaryColors.length))
    }))
    setParticles(newParticles)
  }, [particleCount, variant])

  const variants = {
    primary: "animate-moving-gradient-primary shadow-[0_10px_40px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_60px_rgba(16,185,129,0.6)] text-white border-none",
    secondary: "animate-moving-gradient-secondary shadow-[0_10px_40px_rgba(168,85,247,0.3)] hover:shadow-[0_15px_60px_rgba(168,85,247,0.6)] text-white border-none",
  }

  const currentColors = variant === "primary" ? primaryColors : secondaryColors

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 12 }}
      className={cn(
        "relative group h-16 px-10 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-500 premium-easing font-bold uppercase tracking-[0.3em] text-[10px]",
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Breathing Idle Glow - More Intense */}
      <motion.div
        animate={{ 
          opacity: isHovered ? 0.9 : [0.4, 0.7, 0.4],
          scale: isHovered ? 1.3 : [1, 1.1, 1]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute inset-0 blur-3xl pointer-events-none",
          variant === "primary" ? "bg-emerald-500/30" : "bg-purple-600/30"
        )}
      />

      {/* Shimmer Sweep - More visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

      {/* Twinkling Particle System - Multi-colored */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {isHovered && particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: ["100%", "-20%"],
                x: [`${p.x}%`, `${p.x + (Math.random() * 20 - 10)}%`],
                scale: [0, 1.5, 0.5, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: p.duration, 
                delay: p.delay, 
                repeat: Infinity,
                ease: "easeOut"
              }}
              className={cn("absolute rounded-full blur-[0.5px] shadow-[0_0_8px_currentColor]", currentColors[p.colorIndex])}
              style={{ 
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                color: "inherit"
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Content Label */}
      <div className="relative z-10 flex items-center justify-center gap-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
        {children}
      </div>
    </motion.button>
  )
}
