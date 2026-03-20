"use client"

import React from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export const FuturisticBackground = () => {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || resolvedTheme === "dark") return null

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-background transition-colors duration-500">
            {/* Professional Gradient Layer */}
            <div className={cn(
                "absolute inset-0 opacity-40",
                "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
                "from-blue-100/20 via-transparent to-transparent"
            )} />
            
            {/* Subtle Grid Pattern for professional look */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
            
            {/* Ambient Base Layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
            
            {/* Soft decorative blur */}
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        </div>
    )
}
