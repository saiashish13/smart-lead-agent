"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import { DeployButton } from "@/components/ui/interactive-buttons"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Building2, CheckCircle2, User, Sparkles } from "lucide-react"

export default function DiscoveryPage() {
    const [query, setQuery] = useState("")
    const [productName, setProductName] = useState("")
    const [industry, setIndustry] = useState("")
    const [location, setLocation] = useState("")
    const queryClient = useQueryClient()

    const { mutate: searchLeads, isPending, data: searchResults } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/campaign/search", {
                query,
                product_name: productName,
                industry: industry.trim() || undefined,
                location: location.trim() || undefined,
            })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] })
        },
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!query.trim() || !productName.trim()) return
        searchLeads()
    }

    return (
        <div className="p-6 md:p-8 space-y-10 flex flex-col items-center justify-center min-h-screen pt-24 pb-20">
            {/* Elegant Header */}
            <div className="text-center space-y-5 max-w-2xl mb-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
                    Discovery Engine
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
                    Program your agent to securely crawl, identify, and extract correctly-matched prospects.
                </p>
            </div>

            {/* Clean Form Card */}
            <Card className="w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-visible">
                <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-80" />
                <CardContent className="p-8 md:p-12 pt-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-white flex items-center gap-2 tracking-wide">
                                    <Sparkles className="h-4 w-4 text-cyan-400 drop-shadow-md" />
                                    Software Product
                                </label>
                                <Input
                                    placeholder="e.g. Streamlit, Next.js, Stripe"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="h-12 shadow-inner bg-black/20 border-white/10 focus-visible:ring-cyan-500 text-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-white flex items-center gap-2 tracking-wide">
                                    <User className="h-4 w-4 text-indigo-400 drop-shadow-md" />
                                    Target Persona
                                </label>
                                <Input
                                    placeholder="e.g. Data Scientist, VP of Sales"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="h-12 shadow-inner bg-black/20 border-white/10 focus-visible:ring-indigo-500 text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold flex items-center gap-2 text-white tracking-wide">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    Industry <span className="text-[11px] text-muted-foreground font-normal uppercase tracking-wider">(Optional)</span>
                                </label>
                                <Input
                                    placeholder="e.g. Fintech, Healthcare"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="h-12 shadow-inner bg-black/20 border-white/10 focus-visible:ring-blue-500 text-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-semibold flex items-center gap-2 text-white tracking-wide">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    Location <span className="text-[11px] text-muted-foreground font-normal uppercase tracking-wider">(Optional)</span>
                                </label>
                                <Input
                                    placeholder="e.g. San Francisco, London"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="h-12 shadow-inner bg-black/20 border-white/10 focus-visible:ring-blue-500 text-white"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <DeployButton
                                type="submit"
                                isLoading={isPending}
                                disabled={isPending || !query.trim() || !productName.trim()}
                                className="w-full text-base font-semibold tracking-wide"
                            >
                                Run Discovery
                            </DeployButton>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Clean Results Card */}
            {searchResults && (
                <div className="w-full max-w-3xl animate-in zoom-in-95 fade-in duration-500 ease-out mt-8">
                    <Card className="border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-emerald-950/40 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
                        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-full bg-emerald-900/60 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] flex items-center justify-center shrink-0 border border-emerald-500/30">
                                    <CheckCircle2 className="h-7 w-7 text-emerald-400 drop-shadow-md" />
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-xl font-bold text-white text-glow">
                                        Discovery Complete
                                    </h3>
                                    <p className="text-[15px] text-emerald-100/70">
                                        Identified <span className="text-white font-bold">{searchResults.leads_found}</span> target profiles mapping to "{query}".
                                    </p>
                                </div>
                            </div>
                            <a href="/leads" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                                View Pipeline
                            </a>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
