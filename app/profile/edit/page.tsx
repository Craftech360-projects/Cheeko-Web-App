'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import { supabaseService, type ParentProfile } from '@/lib/supabase/service'
import { Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form fields
  const [parentName, setParentName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentPhoneNumber, setParentPhoneNumber] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      // Get parent profile
      const profile = await supabaseService.getParentProfile()
      
      if (profile) {
        setParentName(profile.parent_name || '')
        setParentEmail(profile.parent_email || user?.email || '')
        setParentPhoneNumber(profile.parent_phone_number || '')
      } else if (user) {
        // Pre-fill with user email if no profile exists
        setParentEmail(user.email || '')
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Validation
    if (!parentName.trim()) {
      setError('Parent name is required')
      return
    }
    if (!parentEmail.trim()) {
      setError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setSaving(true)
      setError(null)

      await supabaseService.updateParentProfile({
        parentName: parentName.trim(),
        parentEmail: parentEmail.trim(),
        parentPhoneNumber: parentPhoneNumber.trim() || undefined,
      })

      // Redirect back to profile
      router.push('/profile')
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar title="Edit Profile" showBackButton />
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Edit Profile" showBackButton />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Error message */}
        {error && (
          <div className="bg-red/10 border border-red text-red rounded-8 p-4 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Parent Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="input-field"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email Address <span className="text-red">*</span>
            </label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={parentPhoneNumber}
              onChange={(e) => setParentPhoneNumber(e.target.value)}
              className="input-field"
              placeholder="Enter your phone number (optional)"
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>

          {/* Cancel button */}
          <button
            onClick={() => router.push('/profile')}
            disabled={saving}
            className="btn-secondary w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}