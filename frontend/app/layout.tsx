import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import Providers from '@/components/providers'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Lead Agent',
  description: 'AI-Powered Smart Lead Generation Agent',
}

import { FuturisticBackground } from '@/components/ui/futuristic-background'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Providers>
            <div className="h-full relative font-sans">
              <FuturisticBackground />
              <Navbar />
              <main className="pt-[104px] h-full min-h-screen transition-colors duration-300 relative z-10">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
