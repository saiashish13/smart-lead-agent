"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Package, ArrowUpRight } from "lucide-react"

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
        <Card className="h-[430px] flex flex-col">
            <CardHeader className="py-5 px-6 border-b border-border/40">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Outreach Log
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs font-medium px-2 py-0.5 rounded-full">
                        {leads.length} sent
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full overflow-y-auto divide-y divide-border/40">
                    {isLoading && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            Loading logs...
                        </div>
                    )}
                    {!isLoading && leads.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full gap-3">
                            <Mail className="h-6 w-6 text-muted-foreground/30" />
                            <span className="text-sm font-medium">No emails sent yet</span>
                        </div>
                    )}
                    {leads.map((lead: any) => (
                        <div key={lead.id} className="p-4 hover:bg-muted/30 transition-colors duration-200 cursor-default group">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 shadow-inner flex items-center justify-center text-xs font-bold shrink-0">
                                        {(lead.name || "U")[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{lead.name || "Unknown"}</p>
                                        <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 ml-11">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-[11px] font-medium text-muted-foreground">
                                    <Package className="h-3 w-3" />
                                    <span className="truncate max-w-[150px]">{lead.product_name || "—"}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
