"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function AutomationLog() {
    const scrollRef = useRef<HTMLDivElement>(null)

    const { data: logs } = useQuery({
        queryKey: ["automation-logs"],
        queryFn: async () => {
            const res = await api.get("/automation/logs")
            return res.data
        },
        refetchInterval: 2000, // Poll every 2 seconds
    })

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    return (
        <Card className="h-[400px] flex flex-col bg-card border-border shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Pipeline Pulse</CardTitle>
                    <div className="flex items-center space-x-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-emerald-500 font-mono">LIVE</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative">
                <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto p-4 space-y-2 font-mono text-xs"
                >
                    {logs?.length === 0 && (
                        <div className="text-muted-foreground italic">Waiting for pipeline activity...</div>
                    )}
                    {logs?.map((log: any, i: number) => (
                        <div key={i} className="flex items-start">
                            <span className="text-muted-foreground/50 mr-2">[{log.time}]</span>
                            <span className="text-foreground/80 dark:text-zinc-300">{log.message}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
