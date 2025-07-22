import { createClient } from './client'
import type { SupabaseClient, User } from '@supabase/supabase-js'

export interface Toy {
  id: string
  name: string
  role_type: string
  serial_number: string
  last_wifi_update?: string
  kid_name?: string
  language?: string
  voice?: string
  conversation_sensitivity?: string
  is_wifi_provisioned: boolean
  activation_code?: string
  toy_mac_id?: string
  parent_name?: string
  parent_email?: string
  parent_mobile?: string
  kid_dob?: string
  kid_gender?: string
  notification_updates?: boolean
  instruction?: string
  user_id?: string
  created_at?: string
}

export interface ParentProfile {
  id?: string
  user_id: string
  parent_name: string
  parent_email: string
  parent_phone_number?: string
}

class SupabaseService {
  private client: SupabaseClient

  constructor(client?: SupabaseClient) {
    this.client = client || createClient()
  }

  async getToys(): Promise<Toy[]> {
    try {
      const { data: { user } } = await this.client.auth.getUser()
      if (!user) return []

      const { data, error } = await this.client
        .from('toys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to get toys:', error)
      return []
    }
  }

  async signInWithGoogle() {
    // Determine the correct redirect URL based on environment
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'https://tools.cheekoai.in/auth/callback';

    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    // The OAuth flow will redirect the user, so we don't need to handle the response here
    return data
  }

  async checkActivationCode(activationCode: string): Promise<{ is_active: boolean; mac_id: string } | null> {
    try {
      const { data, error } = await this.client
        .from('mqtt_auth')
        .select('is_active, mac_id')
        .eq('activation_code', activationCode)
        .maybeSingle()

      if (error) throw new Error('Invalid activation code.')
      if (data?.is_active === true) {
        throw new Error('This toy has already been activated.')
      }

      return data
    } catch (error: any) {
      throw error
    }
  }

  async addToyToUserAccount({
    macId,
    activationKey,
    toyName = 'Cheeko',
  }: {
    macId: string
    activationKey: string
    toyName?: string
  }): Promise<boolean> {
    try {
      const { data: { user } } = await this.client.auth.getUser()
      if (!user) throw new Error('You are not logged in.')

      const { error } = await this.client.from('toys').insert({
        user_id: user.id,
        name: toyName,
        toy_mac_id: macId,
        activation_code: activationKey,
        role_type: 'Story Teller',
        language: 'English',
        voice: 'Sparkles for Kids',
        conversation_sensitivity: 'MEDIUM',
        is_wifi_provisioned: true,
      })

      if (error) {
        if (error.message.includes('duplicate key value violates unique constraint')) {
          throw new Error('This toy is already registered to an account.')
        }
        throw new Error('A database error occurred while adding the toy.')
      }

      return true
    } catch (error: any) {
      console.error('Failed to add toy to user account:', error)
      throw error
    }
  }

  async setToyAsActive(macId: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('mqtt_auth')
        .update({ is_active: true })
        .eq('mac_id', macId)

      if (error) throw error
      console.log(`Toy with mac ID ${macId} has been set to active.`)
    } catch (error) {
      console.error('Failed to set toy as active:', error)
      throw new Error('Could not finalize toy activation in the database.')
    }
  }

  async updateToyDetails({
    toyId,
    name,
    roleType,
    language,
    voice,
    kidName,
    conversationSensitivity,
  }: {
    toyId: string
    name: string
    roleType: string
    language: string
    voice: string
    kidName?: string
    conversationSensitivity?: string
  }): Promise<boolean> {
    try {
      const { data: { user } } = await this.client.auth.getUser()
      if (!user) throw new Error('You must be logged in to update a toy.')

      const updateData: any = {
        name,
        role_type: roleType,
        language,
        voice,
      }

      if (kidName !== undefined) updateData.kid_name = kidName
      if (conversationSensitivity !== undefined) updateData.conversation_sensitivity = conversationSensitivity

      const { error } = await this.client
        .from('toys')
        .update(updateData)
        .eq('id', toyId)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Failed to update toy details:', error)
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }

  async getParentProfile(): Promise<ParentProfile | null> {
    try {
      const { data: { user } } = await this.client.auth.getUser()
      if (!user) return null

      const { data, error } = await this.client
        .from('parent_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get parent profile:', error)
      return null
    }
  }

  async updateParentProfile({
    parentName,
    parentEmail,
    parentPhoneNumber,
  }: {
    parentName: string
    parentEmail: string
    parentPhoneNumber?: string
  }): Promise<boolean> {
    try {
      const { data: { user } } = await this.client.auth.getUser()
      if (!user) throw new Error('You must be logged in to update profile.')

      const existingProfile = await this.getParentProfile()

      if (existingProfile) {
        // Update existing profile
        const { error } = await this.client
          .from('parent_profiles')
          .update({
            parent_name: parentName,
            parent_email: parentEmail,
            parent_phone_number: parentPhoneNumber,
          })
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Create new profile
        const { error } = await this.client.from('parent_profiles').insert({
          user_id: user.id,
          parent_name: parentName,
          parent_email: parentEmail,
          parent_phone_number: parentPhoneNumber,
        })

        if (error) throw error
      }

      return true
    } catch (error) {
      console.error('Failed to update parent profile:', error)
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }

  async unbindToy(toyId: string, toyMacId?: string): Promise<void> {
    try {
      const { data: { user } } = await this.client.auth.getUser()
      if (!user) throw new Error('You must be logged in to unbind a toy.')

      // Delete the toy from the toys table
      const { error: toyError } = await this.client
        .from('toys')
        .delete()
        .eq('id', toyId)
        .eq('user_id', user.id)

      if (toyError) throw toyError

      // If toy has a MAC ID, set it as inactive in mqtt_auth
      if (toyMacId) {
        const { error: mqttError } = await this.client
          .from('mqtt_auth')
          .update({ is_active: false })
          .eq('mac_id', toyMacId)

        if (mqttError) throw mqttError
      }
    } catch (error) {
      console.error('Failed to unbind toy:', error)
      throw new Error('An unexpected error occurred while unbinding the toy.')
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut()
    if (error) throw error
  }

  getCurrentUser(): User | null {
    const { data: { user } } = this.client.auth.getUser() as any
    return user
  }
}

export const supabaseService = new SupabaseService()