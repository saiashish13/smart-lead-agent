"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Package } from "lucide-react"

export function RecentSent() {
    const { data, isLoading } = useQuery({
        queryKey: ["recent-sent"],
        queryFn: async () => {
            const res = await api.get("/leads/recent-sent")
            return res.data.leads || []
        },
        refetchInterval: 5000,
    })

    const leads = data || []

    return (
        <Card className="h-[400px] flex flex-col bg-card border-border shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4 text-indigo-500" />
                        Recent Sent
                    </CardTitle>
                    <Badge variant="outline" className="text-xs border-indigo-500/50 text-indigo-600 dark:text-indigo-400">
                        {leads.length} sent
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full overflow-y-auto divide-y divide-border">
                    {isLoading && (
                        <div className="p-4 text-muted-foreground text-sm italic">Loading recent emails...</div>
                    )}
                    {!isLoading && leads.length === 0 && (
                        <div className="p-4 text-muted-foreground text-sm italic">No emails sent yet. Click &quot;Send&quot; on a lead to get started.</div>
                    )}
                    {leads.map((lead) => (
                        <div key={lead.id} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{lead.name || "Unknown"}</p>
                                    <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                                </div>
                                <Badge variant="outline" className="shrink-0 text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                                    Sent
                                </Badge>
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <Package className="h-3 w-3 text-purple-600 dark:text-purple-400 shrink-0" />
                                <span className="truncate">{lead.product_name || "—"}</span>
                                {lead.company && (
                                    <>
                                        <span className="text-muted-foreground/30">·</span>
                                        <span className="truncate">{lead.company}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
