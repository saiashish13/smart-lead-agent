"use client"

import React from "react"

export const FuturisticBackground = () => {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#0A0F1C] transition-colors duration-500">
            {/* Deep, professional midnight blue base grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.05]" />
            
            {/* Sophisticated Glow Orbs - Designed to complement dark background without overpowering */}
            {/* Top Cyan/Blue Glow */}
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-700/20 blur-[120px] mix-blend-screen hidden md:block" />
            
            {/* Bottom Vivid Purple Glow */}
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-800/20 blur-[130px] mix-blend-screen hidden md:block" />
            
            {/* Center Soft Blue Fill */}
            <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-900/15 blur-[100px] mix-blend-screen pulse-glow-slow hidden md:block" />
            
            {/* Dark gradient vignette over everything to ensure edge contrast */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A0F1C]/50 to-[#0A0F1C] opacity-90" />
        </div>
    )
}
