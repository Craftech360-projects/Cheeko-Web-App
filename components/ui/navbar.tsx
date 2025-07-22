'use client'

import { useRouter } from 'next/navigation'
import { User, LogOut, Home } from 'lucide-react'
import { supabaseService } from '@/lib/supabase/service'
import React from 'react'

interface NavbarProps {
  title?: React.ReactNode
  showBackButton?: boolean
}

export function Navbar({ title, showBackButton = false }: NavbarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabaseService.signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-8 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="text-xl font-bold text-black">{title}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/toys')}
              className="p-2 hover:bg-gray-100 rounded-8 transition-colors"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="p-2 hover:bg-gray-100 rounded-8 transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-gray-100 rounded-8 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}