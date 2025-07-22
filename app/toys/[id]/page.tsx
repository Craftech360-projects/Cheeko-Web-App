'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import { supabaseService, type Toy } from '@/lib/supabase/service'
import { Save, Wifi, WifiOff, Unlink } from 'lucide-react'

const roleTypes = ['Math Tutor', 'Science Tutor', 'Story Teller', 'Puzzle Solver']
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese']
const voices = ['Sparkles for Kids', 'Deep Voice', 'Soft Calm Voice']

const ComingSoonBadge = () => (
  <div className="bg-orange/10 border border-orange/30 text-orange text-xs font-medium px-2 py-0.5 rounded-full">
    Coming Soon
  </div>
)

export default function ToyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [toy, setToy] = useState<Toy | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form fields
  const [name, setName] = useState('')
  const [roleType, setRoleType] = useState('')
  const [instruction, setInstruction] = useState('')
  const [language, setLanguage] = useState('')
  const [voice, setVoice] = useState('')
  const [sensitivity, setSensitivity] = useState('MEDIUM')

  useEffect(() => {
    loadToyDetails()
  }, [params.id])

  const loadToyDetails = async () => {
    try {
      setLoading(true)
      const toys = await supabaseService.getToys()
      const foundToy = toys.find(t => t.id === params.id)
      
      if (foundToy) {
        setToy(foundToy)
        // Initialize form fields
        setName(foundToy.name || '')
        setRoleType(foundToy.role_type || 'Story Teller')
        setInstruction(foundToy.instruction || '')
        setLanguage(foundToy.language || 'English')
        setVoice(foundToy.voice || 'Sparkles for Kids')
        setSensitivity(foundToy.conversation_sensitivity || 'MEDIUM')
      } else {
        setError('Toy not found')
      }
    } catch (error) {
      console.error('Failed to load toy details:', error)
      setError('Failed to load toy details')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!toy) return

    try {
      setSaving(true)
      setError(null)

      // Only name can be updated for now
      await supabaseService.updateToyDetails({
        toyId: toy.id,
        name,
        roleType,
        language,
        voice,
      })

      // Show success message and redirect
      alert('Toy details updated successfully!')
      router.push('/toys')
    } catch (err: any) {
      setError(err.message || 'Failed to update toy details')
    } finally {
      setSaving(false)
    }
  }

  const handleUnbind = async () => {
    if (!toy) return

    const confirm = window.confirm(
      'Are you sure you want to unbind this toy? This action cannot be undone.'
    )

    if (confirm) {
      try {
        setLoading(true)
        await supabaseService.unbindToy(toy.id, toy.toy_mac_id)
        alert('Toy has been unbound successfully!')
        router.push('/toys')
      } catch (err: any) {
        setError(err.message || 'Failed to unbind toy')
        setLoading(false)
      }
    }
  }

  if (loading && !toy) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar title="Customize Your Toy" showBackButton />
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!toy) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar title="Customize Your Toy" showBackButton />
        <div className="text-center py-12">
          <p className="text-grey">Toy not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Customize Your Toy" showBackButton />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Error message */}
        {error && (
          <div className="bg-red/10 border border-red text-red rounded-lg p-4 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Edit form */}
        <div className="space-y-6">
          {/* Toy Name */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Toy Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter your Toy Name"
            />
          </div>

          {/* Role/Category */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-bold text-black">
                Role/Category
              </label>
              <ComingSoonBadge />
            </div>
            <input
              type="text"
              value={roleType}
              disabled
              className="input-field-disabled"
            />
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
              {roleTypes.map((role) => (
                <button
                  key={role}
                  disabled
                  className={`btn-chip-disabled ${roleType === role ? 'active' : ''}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Instructions */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-bold text-black">
                Additional Instructions
              </label>
              <ComingSoonBadge />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Cheeko is already skilled to interact with your kid. If you want to mention anything specific to cheeko, write it down.
            </p>
            <textarea
              value={instruction}
              disabled
              rows={4}
              className="input-field-disabled w-full"
              placeholder="Help my child learn addition and subtraction through fun quizzes and simple explanations..."
            />
          </div>

          {/* Language */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-bold text-black">
                Language
              </label>
              <ComingSoonBadge />
            </div>
            <select
              value={language}
              disabled
              className="input-field-disabled appearance-none"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || loading}
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

          {/* Unbind Toy button */}
          <button
            onClick={handleUnbind}
            disabled={loading || saving}
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            <Unlink className="w-5 h-5" />
            Unbind Toy
          </button>
        </div>
      </div>
    </div>
  )
}