"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"

export default function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <GoogleOAuthProvider clientId="914925090788-7slhl6fo40pf0d30cg7quomopv6bnh8n.apps.googleusercontent.com">
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </GoogleOAuthProvider>
    )
}
