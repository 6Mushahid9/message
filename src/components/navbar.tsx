'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
  const { data: session, status } = useSession()
  const user = session?.user as User | null

  return (
    <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/dashboard" className='text-xl font-bold mb-4 md:mb-0'>Mystery message</Link>

        {
          status === 'authenticated' ? (
            <>
              {user?.username && (
                <span className="font-bold mr-30">Welcome, {user.username}</span>
              )}
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-slate-100 text-black cursor-pointer" variant='outline'>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black cursor-pointer" variant='outline'>
                Login
              </Button>
            </Link>
          )
        }
        
      </div>
    </nav>
  )
}

export default Navbar;
