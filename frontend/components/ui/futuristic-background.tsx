"use client"

import React from "react"
import { cn } from "@/lib/utils"

export const FuturisticBackground = () => {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-background transition-colors duration-500">
            {/* Professional Gradient Layer */}
            <div className={cn(
                "absolute inset-0 opacity-40 dark:opacity-60",
                "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
                "from-blue-100/20 via-transparent to-transparent dark:from-blue-900/20"
            )} />
            
            {/* Subtle Grid Pattern for professional look */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] dark:opacity-[0.05]" />
            
            {/* Ambient Base Layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
            
            {/* Soft decorative blur */}
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-600/10" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-600/10" />
        </div>
    )
}
