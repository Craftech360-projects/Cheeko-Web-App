'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import { supabaseService, type ParentProfile } from '@/lib/supabase/service'
import { User, Mail, Phone, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
      }
      
      // Get parent profile
      const profileData = await supabaseService.getParentProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar title="Parent Profile" />
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Parent Profile" />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-orange/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-orange" />
          </div>
          <h2 className="text-2xl font-bold text-black">
            {profile?.parent_name || 'Parent'}
          </h2>
          <p className="text-grey">{userEmail}</p>
        </div>

        {/* Profile Information */}
        <div className="card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black">Profile Information</h3>
            <button
              onClick={() => router.push('/profile/edit')}
              className="p-2 hover:bg-gray-100 rounded-8 transition-colors"
            >
              <Edit className="w-5 h-5 text-orange" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-grey mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-grey">Parent Name</p>
                <p className="text-black">{profile?.parent_name || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-grey mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-grey">Email</p>
                <p className="text-black">{profile?.parent_email || userEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-grey mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-grey">Phone Number</p>
                <p className="text-black">{profile?.parent_phone_number || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.push('/profile/edit')}
            className="btn-primary w-full"
          >
            Edit Profile
          </button>
          
          <div className="text-center">
            <p className="text-sm text-grey">
              Need help? Visit our{' '}
              <a
                href="https://www.cheekoai.in/support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange font-semibold hover:underline"
              >
                support page
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}