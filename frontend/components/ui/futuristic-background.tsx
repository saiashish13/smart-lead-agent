"use client"

import React, { useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Star, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Particle Network Component (Canvas)
 */
const ParticleNetwork = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 120
        const connectionDistance = 150
        const mouse = { x: -1000, y: -1000 }

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number

            constructor(width: number, height: number) {
                this.x = Math.random() * width
                this.y = Math.random() * height
                this.vx = (Math.random() - 0.5) * 0.5
                this.vy = (Math.random() - 0.5) * 0.5
                this.size = Math.random() * 2 + 1
            }

            update(width: number, height: number) {
                this.x += this.vx
                this.y += this.vy

                if (this.x < 0 || this.x > width) this.vx *= -1
                if (this.y < 0 || this.y > height) this.vy *= -1
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = "rgba(147, 197, 253, 0.5)" // blue-300
                ctx.fill()
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            particles = Array.from({ length: particleCount }, () => new Particle(canvas.width, canvas.height))
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            particles.forEach(p => {
                p.update(canvas.width, canvas.height)
                p.draw(ctx)

                // Draw lines
                particles.forEach(p2 => {
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionDistance) {
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        const opacity = 1 - (distance / connectionDistance)
                        ctx.strokeStyle = `rgba(147, 197, 253, ${opacity * 0.2})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        window.addEventListener("resize", resize)
        resize()
        animate()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none opacity-40"
        />
    )
}

/**
 * Aurora Wave Component
 */
const AuroraWave = ({ className, color }: { className?: string; color: string }) => (
    <motion.div
        animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
        }}
        transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
        }}
        className={cn(
            "absolute -z-10 blur-[120px] opacity-30 pointer-events-none",
            color,
            className
        )}
    />
)

/**
 * Shooting Star Component
 */
const ShootingStar = () => {
    const [stars, setStars] = React.useState<any[]>([])

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const id = Date.now()
                const startX = Math.random() * 100
                const startY = Math.random() * 50
                setStars(prev => [...prev, { id, x: startX, y: startY }])
                setTimeout(() => {
                    setStars(prev => prev.filter(s => s.id !== id))
                }, 1000)
            }
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {stars.map(star => (
                <motion.div
                    key={star.id}
                    initial={{ x: `${star.x}%`, y: `${star.y}%`, opacity: 0, scale: 0 }}
                    animate={{ 
                        x: `${star.x + 20}%`, 
                        y: `${star.y + 20}%`, 
                        opacity: [0, 1, 0], 
                        scale: [0, 1.2, 0] 
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute w-[100px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent rotate-45 blur-[1px]"
                />
            ))}
        </div>
    )
}

/**
 * Floating decorative Icon
 */
const FloatingIcon = ({ icon: Icon, delay = 0 }: { icon: any; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
            duration: 8 + Math.random() * 4, 
            repeat: Infinity, 
            delay,
            ease: "easeInOut"
        }}
        className="absolute pointer-events-none z-10"
        style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
        }}
    >
        <Icon className="text-blue-300 w-4 h-4" />
    </motion.div>
)

export const FuturisticBackground = () => {
    const [hasMounted, setHasMounted] = React.useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return <div className="fixed inset-0 -z-50 bg-[#020617]" />
    }

    return (
        <div className="fixed inset-0 -z-50 bg-[#020617] overflow-hidden">
            {/* Base Gradient Layer */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_#020617_100%)] opacity-50" />
            
            {/* Aurora Waves */}
            <AuroraWave color="bg-blue-600 w-[500px] h-[500px] top-[-10%] left-[-10%]" />
            <AuroraWave color="bg-purple-600 w-[600px] h-[600px] bottom-[-20%] right-[-10%]" />
            <AuroraWave color="bg-pink-600 w-[400px] h-[400px] top-[40%] right-[10%]" />
            <AuroraWave color="bg-cyan-600 w-[300px] h-[300px] bottom-[30%] left-[20%]" />

            {/* Particle Network */}
            <ParticleNetwork />

            {/* Floating Orbs (Framer Motion) */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        x: [0, (Math.random() - 0.5) * 100, 0],
                        y: [0, (Math.random() - 0.5) * 100, 0],
                    }}
                    transition={{
                        duration: 20 + i * 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute w-[250px] h-[250px] rounded-full blur-[80px] bg-indigo-500/10"
                    style={{
                        left: `${20 + i * 20}%`,
                        top: `${20 + i * 15}%`,
                    }}
                />
            ))}

            {/* Light Rays */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-blue-400 to-transparent blur-[20px] origin-top rotate-[20deg]" />
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-purple-400 to-transparent blur-[30px] origin-top -rotate-[15deg]" />
            </div>

            {/* Shooting Stars */}
            <ShootingStar />

            {/* Decorative Icons */}
            <FloatingIcon icon={Star} delay={0} />
            <FloatingIcon icon={Sparkles} delay={2} />
            <FloatingIcon icon={Crown} delay={4} />
            <FloatingIcon icon={Star} delay={6} />

            {/* Vignette effect */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none" />
        </div>
    )
}
