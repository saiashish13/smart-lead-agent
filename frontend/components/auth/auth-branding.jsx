"use client"

import { motion } from "framer-motion"
import { Sparkles, ShieldCheck, ArrowUpRight, Cpu, MousePointer2 } from "lucide-react"

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Leads",
    desc: "Discover high-intent prospects using advanced AI intelligence.",
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
    glow: "hover:border-emerald-500/50 hover:shadow-emerald-500/20"
  },
  {
    icon: ShieldCheck,
    title: "Verified Data",
    desc: "Accurate, real-time verified contact data with zero bounce rates.",
    gradient: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
    glow: "hover:border-blue-500/50 hover:shadow-blue-500/20"
  },
  {
    icon: MousePointer2,
    title: "Automated Outreach",
    desc: "Run personalized multi-channel campaigns on autopilot.",
    gradient: "from-purple-500 to-fuchsia-500",
    shadow: "shadow-purple-500/20",
    glow: "hover:border-purple-500/50 hover:shadow-purple-500/20"
  }
]

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center p-12 lg:p-20 relative z-10 w-1/2 min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Background Depth Effects */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-xl relative flex flex-col items-center text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12 relative z-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">Next Gen Performance</span>
          </div>

          <h1 className="text-6xl xl:text-7xl font-bold tracking-tighter text-white mb-6 leading-[0.9] font-heading uppercase italic">
            Smart Lead <br />
            <span className="text-white/20">Agent</span>
          </h1>

          <p className="text-lg xl:text-xl text-white/60 font-medium max-w-md mx-auto leading-relaxed">
            Supercharge your sales pipeline with <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent font-bold">AI-driven</span> lead generation and automation.
          </p>
        </motion.div>

        {/* Feature Cards Container - Tight Spacing & Visual Connection */}
        <div className="grid gap-6 w-full relative z-10">
          {/* Subtle glow connector */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 md:hidden" />
          
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ 
                    y: -6,
                    transition: { duration: 0.3 }
                  }}
                  className={`relative group p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-500 premium-easing text-left overflow-hidden ${feature.glow}`}
                >
                  {/* Card Inner Glow */}
                  <div className={`absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.08] blur-2xl transition-opacity duration-500`} />
                  
                  <div className="flex items-start gap-6 relative z-10">
                    <div className={`shrink-0 w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-white/10 shadow-2xl`}>
                      <Icon className={`h-7 w-7 text-white/30 group-hover:text-white transition-colors duration-500`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white tracking-tight font-heading uppercase italic">
                          {feature.title}
                        </h3>
                        <ArrowUpRight className="h-5 w-5 text-white/0 group-hover:text-emerald-400 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500" />
                      </div>
                      <p className="text-white/40 text-sm leading-relaxed font-medium group-hover:text-white/60 transition-colors duration-500 pr-4">
                        {feature.desc}
                      </p>
                    </div>
                  </div>

                  {/* Progress-like subtle line at bottom on hover */}
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient} opacity-50`}
                  />
                </motion.div>
            )
          })}
        </div>

        {/* Footer Accent */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-white/5" />
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic">Elite Sales Intelligence</div>
          <div className="h-px w-12 bg-white/5" />
        </div>
      </div>
    </div>
  )
}
