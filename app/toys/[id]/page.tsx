'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import { supabaseService, type Toy } from '@/lib/supabase/service'
import { Save, Wifi, WifiOff } from 'lucide-react'

const roleTypes = ['Story Teller', 'Teacher', 'Friend', 'Coach']
const languages = ['English', 'Hindi', 'Spanish', 'French']
const voices = ['Sparkles for Kids', 'Friendly Voice', 'Warm Narrator', 'Cheerful Guide']
const sensitivities = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
]

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
  const [language, setLanguage] = useState('')
  const [voice, setVoice] = useState('')
  const [kidName, setKidName] = useState('')
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
        setLanguage(foundToy.language || 'English')
        setVoice(foundToy.voice || 'Sparkles for Kids')
        setKidName(foundToy.kid_name || '')
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

      await supabaseService.updateToyDetails({
        toyId: toy.id,
        name,
        roleType,
        language,
        voice,
        kidName,
        conversationSensitivity: sensitivity,
      })

      // Redirect back to toys list
      router.push('/toys')
    } catch (err: any) {
      setError(err.message || 'Failed to update toy details')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar title="Toy Details" showBackButton />
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!toy) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar title="Toy Details" showBackButton />
        <div className="text-center py-12">
          <p className="text-grey">Toy not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Toy Details" showBackButton />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Toy status */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-black mb-1">Connection Status</h3>
              <p className="text-sm text-grey">
                {toy.is_wifi_provisioned ? 'Connected to WiFi' : 'Not connected'}
              </p>
            </div>
            {toy.is_wifi_provisioned ? (
              <Wifi className="w-6 h-6 text-green" />
            ) : (
              <WifiOff className="w-6 h-6 text-grey" />
            )}
          </div>
          {toy.serial_number && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-grey">Serial Number</p>
              <p className="font-mono text-black">{toy.serial_number}</p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red/10 border border-red text-red rounded-8 p-4 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Edit form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Toy Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter toy name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Child's Name
            </label>
            <input
              type="text"
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              className="input-field"
              placeholder="Enter child's name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Role Type
            </label>
            <select
              value={roleType}
              onChange={(e) => setRoleType(e.target.value)}
              className="input-field"
            >
              {roleTypes.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Voice
            </label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="input-field"
            >
              {voices.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Conversation Sensitivity
            </label>
            <div className="grid grid-cols-3 gap-4">
              {sensitivities.map((sens) => (
                <button
                  key={sens.value}
                  onClick={() => setSensitivity(sens.value)}
                  className={`py-3 px-4 rounded-8 font-medium transition-all ${
                    sensitivity === sens.value
                      ? 'bg-orange text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {sens.label}
                </button>
              ))}
            </div>
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
        </div>
      </div>
    </div>
  )
}