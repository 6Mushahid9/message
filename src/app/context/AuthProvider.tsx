'use client'
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
  children
}:{children: React.ReactNode}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
    // because of callback section in options.ts now our session has all info of token
  )
}