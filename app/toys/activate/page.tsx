'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import { supabaseService } from '@/lib/supabase/service'
import { Wifi } from 'lucide-react'

export default function ToyActivationPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pinValues, setPinValues] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    // Focus on first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handlePinChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return

    const newPinValues = [...pinValues]
    newPinValues[index] = value
    setPinValues(newPinValues)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    
    if (/^\d+$/.test(pastedData)) {
      const newPinValues = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
      setPinValues(newPinValues)
      
      if (pastedData.length < 6) {
        inputRefs.current[pastedData.length]?.focus()
      }
    }
  }

  const handleSubmit = async () => {
    const pin = pinValues.join('')
    if (pin.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Check activation code
      const result = await supabaseService.checkActivationCode(pin)
      if (!result) {
        throw new Error('Invalid activation code')
      }

      const macId = result.mac_id

      // Add toy to user account
      await supabaseService.addToyToUserAccount({
        macId,
        activationKey: pin,
      })

      // Set toy as active
      await supabaseService.setToyAsActive(macId)

      // Show success and redirect
      router.push('/toys')
    } catch (err: any) {
      setError(err.message || 'Failed to activate toy')
      setPinValues(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const openWifiSettings = () => {
    // For web, we can't directly open WiFi settings
    // Show an alert with instructions
    alert('Please open your device\'s WiFi settings and connect to "Cheeko" network.')
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Toy Activation" showBackButton />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-base font-bold text-black">
            Follow these steps to activate your Cheeko:
          </h2>
        </div>

        {/* Instructions */}
        <div className="max-w-md mx-auto mb-8">
          <div className="space-y-2">
            {/* Instruction 1 with button */}
            <div className="flex items-start">
              <span className="w-5 font-bold text-sm">1.</span>
              <div className="ml-2 flex-1">
                <span className="text-sm">
                  Open Wi-Fi settings and connect to Cheeko.{' '}
                  <button
                    onClick={openWifiSettings}
                    className="text-orange hover:underline text-sm"
                  >
                    Click here to open settings.
                  </button>
                </span>
              </div>
            </div>

            {/* Instruction 2 */}
            <div className="flex items-start">
              <span className="w-5 font-bold text-sm">2.</span>
              <p className="ml-2 flex-1 text-sm">
                You will be redirected to a website.<br />
                Select your Wi-Fi & enter the password.
              </p>
            </div>

            {/* Instruction 3 */}
            <div className="flex items-start">
              <span className="w-5 font-bold text-sm">3.</span>
              <p className="ml-2 flex-1 text-sm">
                Cheeko will beep once connected.
              </p>
            </div>

            {/* Instruction 4 */}
            <div className="flex items-start">
              <span className="w-5 font-bold text-sm">4.</span>
              <p className="ml-2 flex-1 text-sm">
                Hold down the right button and Cheeko will<br />
                start speaking a 6-digit activation code.
              </p>
            </div>

            {/* Instruction 5 */}
            <div className="flex items-start">
              <span className="w-5 font-bold text-sm">5.</span>
              <p className="ml-2 flex-1 text-sm">
                Type the activation code below to connect Cheeko to your account.
              </p>
            </div>
          </div>
        </div>

        {/* Activation Code Section */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-black">Enter Activation Code</h3>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red/10 border border-red text-red rounded-8 p-4 text-sm mb-6 max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* PIN Input */}
        <div className="flex justify-center gap-2 mb-8">
          {pinValues.map((value, index) => (
            <input
              key={index}
              ref={el => {inputRefs.current[index] = el}}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={loading}
              className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-semibold border-2 border-orange rounded-8 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent disabled:opacity-50"
            />
          ))}
        </div>

        {/* Submit button */}
        <div className="max-w-md mx-auto">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full h-14"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'Verify Code'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}