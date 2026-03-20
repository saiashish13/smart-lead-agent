"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-zinc-400">Configure your agent parameters.</p>
            </div>

            <div className="grid gap-8">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle>API Configuration</CardTitle>
                        <CardDescription>Manage your external service keys.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none text-zinc-400">OpenAI API Key</label>
                            <Input type="password" placeholder="sk-..." className="bg-black/20 border-zinc-800" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none text-zinc-400">SendGrid API Key</label>
                            <Input type="password" placeholder="SG..." className="bg-black/20 border-zinc-800" />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle>Product Context</CardTitle>
                        <CardDescription>Tell the agent about what you are selling.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none text-zinc-400">Product Name</label>
                            <Input placeholder="e.g. Lead Agent" className="bg-black/20 border-zinc-800" />
                        </div>
                        <Button variant="secondary">Update Context</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
