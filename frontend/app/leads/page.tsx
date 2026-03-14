"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SendButton, ClearButton } from "@/components/ui/interactive-buttons"
import { Users, Loader2, Link2, SearchX, Trash2 } from "lucide-react"
import { useState } from "react"

export default function LeadsPage() {
    const queryClient = useQueryClient()
    const [sendingId, setSendingId] = useState<number | null>(null)

    const { data: leads, isLoading, isError } = useQuery({
        queryKey: ["leads"],
        queryFn: async () => {
            const res = await api.get("/leads/")
            return res.data.leads || []
        },
    })

    const { mutate: sendEmail } = useMutation({
        mutationFn: async (leadId: number) => {
            setSendingId(leadId)
            const res = await api.post(`/leads/${leadId}/send-email`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] })
            setSendingId(null)
        },
        onError: () => {
            setSendingId(null)
        }
    })

    const { mutate: deleteLead } = useMutation({
        mutationFn: async (leadId: number) => {
            await api.delete(`/leads/${leadId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] })
        },
    })

    const { mutate: clearAllLeads } = useMutation({
        mutationFn: async () => {
            await api.delete("/leads/clear")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] })
        },
    })

    if (isLoading) {
        return (
            <div className="p-10 flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span>Loading leads...</span>
                </div>
            </div>
        )
    }

    if (isError) {
        return <div className="p-10 text-destructive text-center mt-24">Error loading leads. Please try again.</div>
    }

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-[1200px] mx-auto pt-24">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Pipeline</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">Manage and act on your discovered prospects.</p>
                    </div>
                </div>
                {leads && leads.length > 0 && (
                    <ClearButton onClick={() => clearAllLeads()}>
                        Clear All
                    </ClearButton>
                )}
            </div>

            {/* Table Card */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/40 py-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base text-foreground">Matched Leads</CardTitle>
                        <CardDescription>{leads?.length || 0} results total</CardDescription>
                    </div>
                </CardHeader>
                
                {/* Data Table */}
                <div className="overflow-x-auto pb-2">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="border-border/40 hover:bg-transparent bg-transparent">
                                <TableHead className="w-[300px] font-medium text-foreground py-3 pl-6">Prospect Info</TableHead>
                                <TableHead className="font-medium text-foreground">Company</TableHead>
                                <TableHead className="font-medium text-foreground">Status</TableHead>
                                <TableHead className="font-medium text-foreground">Profile</TableHead>
                                <TableHead className="text-right font-medium text-foreground pr-6">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(!leads || leads.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-48 text-muted-foreground border-0 hover:bg-transparent">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <SearchX className="h-8 w-8 text-muted-foreground/30" />
                                            <span>Pipeline is empty</span>
                                            <a href="/discovery" className="text-sm text-primary hover:underline mt-1">Run a discovery search</a>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {leads?.map((lead: any) => (
                                <TableRow key={lead.id} className="border-border/40 hover:bg-muted/30 transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-indigo-900/30 text-indigo-400 shadow-inner flex items-center justify-center text-sm font-semibold shrink-0">
                                                {(lead.name || "U")[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-foreground text-sm truncate">{lead.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{lead.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-sm">
                                        <div className="font-medium text-foreground truncate">{lead.company}</div>
                                        {lead.industry && <div className="text-xs text-muted-foreground truncate mt-0.5">{lead.industry}</div>}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant="secondary" className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 pointer-events-none border ${
                                            lead.status === 'processed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/20' :
                                            lead.status === 'error' ? 'bg-red-900/30 text-red-400 border-red-500/20' :
                                            'bg-blue-900/30 text-blue-400 border-blue-500/20'
                                        }`}>
                                            {lead.status || 'new'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        {lead.source_url ? (
                                            <a href={lead.source_url} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                                                <Link2 className="h-3.5 w-3.5" />
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-xs text-muted-foreground/50">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {lead.status !== 'processed' && (
                                                <SendButton
                                                    onClick={() => sendEmail(lead.id)}
                                                    disabled={sendingId === lead.id}
                                                    isLoading={sendingId === lead.id}
                                                    size="sm"
                                                >
                                                    Send
                                                </SendButton>
                                            )}
                                            <Button
                                                onClick={() => deleteLead(lead.id)}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <span className="sr-only">Delete</span>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
