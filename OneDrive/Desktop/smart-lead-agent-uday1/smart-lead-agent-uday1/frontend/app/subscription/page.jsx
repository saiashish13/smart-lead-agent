import React from "react"
import { Check, Sparkles, Zap, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { FuturisticBackground } from "@/components/ui/futuristic-background"

export default function SubscriptionPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 pt-32 pb-24 relative overflow-hidden">
            <FuturisticBackground />

            {/* Header section with deep contrast */}
            <div className="text-center space-y-5 max-w-3xl mb-16 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-2">
                    <Sparkles className="w-4 h-4" /> Upgrade your Agent
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
                    Simple, transparent pricing
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                    Choose the perfect tier to supercharge your lead generation engine. No hidden fees.
                </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl relative z-10 px-4">
                
                {/* 1. Free Plan */}
                <Card className="flex flex-col relative overflow-hidden group border-white/5 hover:border-white/10 transition-all duration-500 ease-out hover:-translate-y-2">
                    <CardContent className="p-8 flex flex-col h-full z-10">
                        <div className="space-y-4 mb-8">
                            <h3 className="text-xl font-semibold text-white">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white tracking-tight">₹0</span>
                                <span className="text-muted-foreground font-medium">/ month</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Perfect for testing the agent.</p>
                        </div>
                        
                        <div className="space-y-4 flex-grow">
                            <ul className="space-y-4 text-sm text-zinc-300">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    50 leads per month
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    Basic extraction tools
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    Community support
                                </li>
                            </ul>
                        </div>
                        
                        <button className="w-full mt-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors border border-white/10">
                            Start Free
                        </button>
                    </CardContent>
                </Card>

                {/* 2. Pro Plan (Popular) */}
                <Card className="flex flex-col relative overflow-visible group md:-translate-y-4 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.2)] hover:shadow-[0_0_70px_rgba(99,102,241,0.3)] md:hover:-translate-y-6 transition-all duration-500 ease-out z-20 mt-8 md:mt-0">
                    <div className="absolute -top-5 left-0 right-0 flex justify-center z-30">
                        <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
                            Most Popular
                        </span>
                    </div>
                    {/* Inner glowing core for the popular plan */}
                    <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-500 rounded-[1.5rem] pointer-events-none" />
                    
                    <CardContent className="p-8 flex flex-col h-full z-10 relative">
                        <div className="space-y-4 mb-8">
                            <h3 className="text-xl font-semibold text-indigo-300 flex items-center gap-2">
                                <Zap className="w-5 h-5 shrink-0" /> Pro
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white tracking-tight drop-shadow-md">₹299</span>
                                <span className="text-muted-foreground font-medium">/ month</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Supercharge your outbound operations.</p>
                        </div>
                        
                        <div className="space-y-4 flex-grow">
                            <ul className="space-y-4 text-sm text-zinc-300">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center"><Check className="w-3 h-3 text-indigo-400" /></div>
                                    <span className="font-medium text-white">500 leads per month</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center"><Check className="w-3 h-3 text-indigo-400" /></div>
                                    Automation tools
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center"><Check className="w-3 h-3 text-indigo-400" /></div>
                                    Analytics
                                </li>
                            </ul>
                        </div>
                        
                        <button className="w-full mt-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                            Upgrade to Pro
                        </button>
                    </CardContent>
                </Card>

                {/* 3. Business Plan */}
                <Card className="flex flex-col relative overflow-hidden group border-white/5 hover:border-white/10 transition-all duration-500 ease-out hover:-translate-y-2">
                    <CardContent className="p-8 flex flex-col h-full z-10">
                        <div className="space-y-4 mb-8">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 shrink-0 text-zinc-400" /> Business
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white tracking-tight">₹599</span>
                                <span className="text-muted-foreground font-medium">/ month</span>
                            </div>
                            <p className="text-sm text-muted-foreground">For scalable enterprise operations.</p>
                        </div>
                        
                        <div className="space-y-4 flex-grow">
                            <ul className="space-y-4 text-sm text-zinc-300">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    <span className="font-semibold text-white">Unlimited leads</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    Full API Access
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    Custom Integrations
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    24/7 Priority support
                                </li>
                            </ul>
                        </div>
                        
                        <button className="w-full mt-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors border border-white/10">
                            Contact Sales
                        </button>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
