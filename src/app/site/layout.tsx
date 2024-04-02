import Navigation from '@/components/site/navigation'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>

        <main className='h-full'>
            <Navigation />
            {children}

        </main>
        </ClerkProvider>
    )
}
