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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SendButton, ClearButton } from "@/components/ui/interactive-buttons"
import { Trash2, Send } from "lucide-react"
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
        return <div className="p-8 text-zinc-400">Loading leads...</div>
    }

    if (isError) {
        return <div className="p-8 text-red-400">Error loading leads.</div>
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
                    <p className="text-zinc-400">Manage and track your discovered leads.</p>
                </div>
                <ClearButton
                    onClick={() => clearAllLeads()}
                >
                    Clear All
                </ClearButton>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle>All Leads</CardTitle>
                    <CardDescription>A list of all leads discovered by the agent.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableHead className="w-[200px] text-zinc-400">Name</TableHead>
                                <TableHead className="text-zinc-400">Company</TableHead>
                                <TableHead className="text-zinc-400">Status</TableHead>
                                <TableHead className="text-zinc-400">Research</TableHead>
                                <TableHead className="text-zinc-400">Requested</TableHead>
                                <TableHead className="text-right text-zinc-400">Delete</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(!leads || leads.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-zinc-500">
                                        No leads found. Start a discovery campaign!
                                    </TableCell>
                                </TableRow>
                            )}
                            {leads?.map((lead: any) => (
                                <TableRow key={lead.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell className="font-medium text-zinc-200">
                                        <div>{lead.name}</div>
                                        <div className="text-xs text-zinc-500">{lead.email}</div>
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        {lead.company}
                                        <div className="text-xs text-zinc-500">{lead.industry}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                        ${lead.status === 'processed' ? 'border-emerald-500/50 text-emerald-400' :
                                                lead.status === 'error' ? 'border-red-500/50 text-red-400' :
                                                    'border-blue-500/50 text-blue-400'}
                      `}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                            {lead.source_url ? <a href={lead.source_url} target="_blank" className="hover:text-blue-400 underline">Profile</a> : "No Link"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {lead.status === 'processed' ? (
                                            <span className="text-emerald-400 text-sm">Sent</span>
                                        ) : (
                                            <SendButton
                                                onClick={() => sendEmail(lead.id)}
                                                disabled={sendingId === lead.id}
                                                isLoading={sendingId === lead.id}
                                                size="sm"
                                            >
                                                Send
                                            </SendButton>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            onClick={() => deleteLead(lead.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
