"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export type Theme = "cyan" | "violet"

interface CinematicButtonProps {
  theme?: Theme
  label: string
  icon: React.ElementType
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
}

// Particle configurations
const NUM_EXPLOSION_PARTICLES = 16
const NUM_SPARKLE_PARTICLES = 8

// Theme definitions based on HSL instructions
const themes = {
  cyan: {
    baseColor: "hsl(199, 89%, 48%)", // Base Cyan/Blue
    gradient: "linear-gradient(90deg, #00bfff, #1e90ff, #00ffff, #4169e1, #00bfff)",
    palette: ["#00bfff", "#87cefa", "#00ffff", "#4682b4", "#1e90ff", "#00ced1", "#4169e1", "#5f9ea0"],
    ringColor: "rgba(0, 191, 255, 0.5)"
  },
  violet: {
    baseColor: "hsl(262, 83%, 58%)", // Base Violet/Purple
    gradient: "linear-gradient(90deg, #8a2be2, #9932cc, #da70d6, #9400d3, #8a2be2)",
    palette: ["#8a2be2", "#9932cc", "#ba55d3", "#da70d6", "#ee82ee", "#ff00ff", "#9400d3", "#8b008b"],
    ringColor: "rgba(138, 43, 226, 0.5)"
  }
}

interface ExplosionParticle {
  id: number
  x: number
  y: number
  color: string
}

interface SparkleParticle {
  id: number
  top: string
  left: string
  color: string
}

export function CinematicButton({ 
  theme = "cyan", 
  label, 
  icon: Icon,
  onClick,
  disabled,
  className,
  type = "button"
}: CinematicButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const currentTheme = themes[theme]

  // Generated static particle configs so they don't jump around on re-renders, but trigger on hover
  const [explosionParticles, setExplosionParticles] = useState<ExplosionParticle[]>([])
  const [sparkleParticles, setSparkleParticles] = useState<SparkleParticle[]>([])

  useEffect(() => {
    // Generate explosion particles (circle distribution)
    const exp: ExplosionParticle[] = []
    for (let i = 0; i < NUM_EXPLOSION_PARTICLES; i++) {
        const angle = (Math.PI * 2 * i) / NUM_EXPLOSION_PARTICLES
        // radius between 60 to 100
        const radius = 60 + Math.random() * 40
        exp.push({
            id: i,
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * (radius * 0.5), // slightly squished burst horizontally
            color: currentTheme.palette[i % currentTheme.palette.length]
        })
    }
    setExplosionParticles(exp)

    // Generate sparkle particles (scattered around)
    const sparks: SparkleParticle[] = []
    for (let i = 0; i < NUM_SPARKLE_PARTICLES; i++) {
        sparks.push({
            id: i,
            top: `${Math.random() * 120 - 10}%`,
            left: `${Math.random() * 120 - 10}%`,
            color: currentTheme.palette[(i + 3) % currentTheme.palette.length]
        })
    }
    setSparkleParticles(sparks)
  }, [theme, currentTheme.palette])

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", stiffness: 400, damping: 20
      }}
      className={cn(
        "relative group h-16 w-full rounded-2xl flex items-center justify-center border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50 text-white font-bold tracking-widest uppercase text-xs",
        className
      )}
    >
      {/* 1. Base Layer: Animated Gradient Background (revealed VERY subtly on hover) */}
      <motion.div 
        className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
        style={{
            backgroundImage: currentTheme.gradient,
            backgroundSize: "400% 100%"
        }}
        animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            opacity: isHovered ? 1 : 0.8
        }}
        transition={{ 
            backgroundPosition: { ease: "linear", duration: 4, repeat: Infinity },
            opacity: { duration: 0.3 }
        }}
      />

      {/* 2. Remove Solid Cover and instead use a subtle darkening overlay when NOT hovered */}
      <motion.div 
        className="absolute inset-0 rounded-2xl pointer-events-none z-0 bg-black/20"
        animate={{ opacity: isHovered ? 0 : 0.4 }}
        transition={{ duration: 0.3 }}
      />

      {/* 3. Particle Explosion on Hover Edge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {explosionParticles.map((p, i) => (
            <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{ 
                    width: '6px', 
                    height: '6px', 
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.color}`
                }}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={isHovered ? {
                    scale: [1, 1.5, 0],
                    opacity: [1, 0.8, 0],
                    x: p.x,
                    y: p.y
                } : { scale: 0, opacity: 0, x: 0, y: 0 }}
                transition={{ 
                    duration: 0.8, 
                    delay: i * 0.04, 
                    ease: "easeOut"
                }}
            />
        ))}
      </div>

      {/* 5. Shimmer Sweep Band */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl"
      >
        <motion.div
            className="absolute top-0 bottom-0 w-[50px]"
            style={{
                background: "linear-gradient(110deg, transparent, rgba(255,255,255,0.35), transparent)",
                transform: "skewX(-20deg)"
            }}
            initial={{ x: "-300%" }}
            animate={isHovered ? { x: ["-300%", "500%"] } : { x: "-300%" }}
            transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                delay: 0.5,
                ease: "linear"
            }}
        />
      </motion.div>

      {/* 6. Sparkle Diamond Particles */}
      {sparkleParticles.map((sparkle, i) => (
        <motion.div
            key={`sparkle-${sparkle.id}`}
            className="absolute z-20 pointer-events-none"
            style={{
                top: sparkle.top,
                left: sparkle.left,
                width: '8px',
                height: '8px',
                backgroundColor: sparkle.color,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                boxShadow: `0 0 10px ${sparkle.color}`
            }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={isHovered ? {
                scale: [0, 1.2, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
            } : { scale: 0, rotate: 0, opacity: 0 }}
            transition={{
                duration: 1.5,
                delay: i * 0.2, // staggered delay
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
      ))}

      {/* 7. Inner Border Glow done via outer motion.button's dynamic boxShadow */}
      
      {/* Container masking for content */}
      <div className="relative z-30 flex items-center justify-center gap-3 w-full h-full rounded-2xl">
        {/* 8. Icon Rotation & Scale */}
        <motion.div
            animate={isHovered ? {
                rotate: [0, 360],
                scale: [1, 1.2, 1]
            } : { rotate: 0, scale: 1 }}
            transition={{
                rotate: { duration: 1, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 },
                scale: { duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }
            }}
        >
            <Icon className="w-5 h-5 drop-shadow-md text-white" />
        </motion.div>

        {/* 9. Letter Spacing Expansion */}
        <motion.span
            animate={isHovered ? { letterSpacing: "0.05em" } : { letterSpacing: "0em" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="drop-shadow-md"
        >
            {label}
        </motion.span>
      </div>

    </motion.button>
  )
}
