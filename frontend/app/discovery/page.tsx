"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DeployButton } from "@/components/ui/interactive-buttons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2, Sparkles, Target, RefreshCw } from "lucide-react"

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim() || !productName.trim()) return
        searchLeads()
    }

    return (
        <div className="p-8 space-y-8 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Lead Discovery
                </h2>
                <p className="text-muted-foreground text-lg">
                    Deploy autonomous agents to find fresh, unique leads every run.
                </p>
            </div>

            <Card className="w-full max-w-2xl bg-card border-border backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Row 1: Product + Target Person */}
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Software Product Name</label>
                                <Input
                                    placeholder="e.g. Streamlit, LangChain, Vercel"
                                    className="bg-background border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground/50"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Target Person / Persona</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="e.g. Data Scientist, CTO in Fintech"
                                        className="pl-10 bg-background border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground/50"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Industry + Location */}
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Target className="h-3.5 w-3.5 text-purple-400" />
                                    Industry
                                    <span className="text-muted-foreground/60 font-normal">(optional)</span>
                                </label>
                                <Input
                                    placeholder="e.g. Fintech, Healthcare, SaaS"
                                    className="bg-background border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground/50"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                    Location
                                    <span className="text-muted-foreground/60 font-normal">(optional)</span>
                                </label>
                                <Input
                                    placeholder="e.g. San Francisco, US remote, London"
                                    className="bg-background border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground/50"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>



                        <DeployButton
                            type="submit"
                            className="w-full text-lg"
                            isLoading={isPending}
                            disabled={isPending || !query.trim() || !productName.trim()}
                        >
                            Deploy Fresh Packet Agent
                        </DeployButton>
                    </form>
                </CardContent>
            </Card>

            {searchResults && (
                <div className="w-full max-w-2xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Card className="bg-card border-border overflow-hidden relative shadow-lg">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                        <CardHeader>
                            <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Fresh Packet Complete
                            </CardTitle>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {/* Product */}
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                                    Product: {productName}
                                </span>
                                {/* Niche/Location/Industry (optional if backend includes it, left out for cleanliness unless provided) */}
                                {(searchResults.industry || industry) && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50">
                                        <Target className="h-3 w-3 mr-1" />
                                        Industry: {searchResults.industry || industry}
                                    </span>
                                )}
                                {/* Persona */}
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                                    Persona: {query}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg border border-border">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{searchResults.leads_found}</span> new leads identified and added to your pipeline.
                                <br />
                                <a href="/leads" className="inline-flex items-center mt-3 text-emerald-600 dark:text-emerald-400 hover:underline font-medium transition-colors">
                                    View Leads Dashboard <span className="ml-1">→</span>
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
