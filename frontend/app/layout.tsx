import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Poppins } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import Providers from '@/components/providers'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins' 
})

export const metadata: Metadata = {
  title: 'Lead Agent',
  description: 'AI-Powered Lead Generation Agent',
}

import { FuturisticBackground } from '@/components/ui/futuristic-background'
import { AtmosphericBackground } from '@/components/ui/atmospheric-background'
import { AuthGuard } from '@/components/auth-guard'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Providers>
            <AuthGuard>
              <div className="h-full relative font-sans">
                <FuturisticBackground />
                <AtmosphericBackground />
                <Navbar />
                <main className="pt-20 h-full min-h-screen transition-colors duration-300 relative z-10">
                  {children}
                </main>
              </div>
            </AuthGuard>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
