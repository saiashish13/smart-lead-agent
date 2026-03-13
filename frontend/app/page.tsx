"use client"

import { RecentSent } from "@/components/recent-sent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Send, CheckCircle, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats")
      return res.data
    },
    refetchInterval: 5000
  })

  const { data: recentLeadsData } = useQuery({
    queryKey: ["recent-leads"],
    queryFn: async () => {
      const res = await api.get("/leads/")
      return res.data.leads?.slice(0, 5) || []
    },
    refetchInterval: 5000
  })

  const recentLeads = recentLeadsData || []

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your lead generation pipeline</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_leads || 0}</div>
            <p className="text-xs text-muted-foreground">
              Captured leads
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emails Sent
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.emails_sent || 0}</div>
            <p className="text-xs text-muted-foreground">
              Outreach messages
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.verified_leads || 0}</div>
            <p className="text-xs text-muted-foreground">
              Valid profiles
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_campaigns || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unique products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Recent Activity + Recent Sent */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <div className="col-span-4">
          <Card className="bg-card border-border h-[400px] flex flex-col shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-border">
              <CardTitle className="text-sm font-semibold text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto divide-y divide-border">
                {recentLeads.length === 0 && (
                  <div className="p-4 text-muted-foreground text-sm italic">
                    No leads yet. Run a campaign to get started!
                  </div>
                )}
                {recentLeads.map((lead: any) => (
                  <div key={lead.id} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{lead.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground truncate">{lead.company} {lead.industry ? `· ${lead.industry}` : ""}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-xs ${
                          lead.status === "processed"
                            ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                            : "border-blue-500/50 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {lead.status || "New"}
                      </Badge>
                    </div>
                    {lead.product_name && (
                      <p className="mt-1 text-xs text-purple-600 dark:text-purple-400 truncate">
                        📦 {lead.product_name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sent */}
        <div className="col-span-3">
          <RecentSent />
        </div>
      </div>
    </div>
  )
}
