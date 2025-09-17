// src/lib/auth/auth.service.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

type UserWithOfficeAssignment = Database['public']['Views']['users_with_office_assignment']['Row']

/**
 * Get current authenticated user from server-side
 */
export async function getCurrentUser() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Unexpected error getting user:', error)
    return null
  }
}

/**
 * Get user with office assignment data
 */
export async function getUserWithOfficeAssignment(accessToken?: string): Promise<UserWithOfficeAssignment[] | null> {
  try {
    let supabase
    
    if (accessToken) {
      // Jika ada access token, buat client dengan token tersebut
      supabase = await createServerSupabaseClient()
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '' // Tidak diperlukan untuk operasi ini
      })
    } else {
      // Gunakan client default
      supabase = await createServerSupabaseClient()
    }

    // Ambil user terlebih dahulu untuk mendapatkan user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return null
    }

    // Query ke view users_with_office_assignment berdasarkan user ID
    const { data, error } = await supabase
      .from('users_with_office_assignment')
      .select('*')
      .eq('id', user.id)

    if (error) {
      console.error('Error getting user with office assignment:', error)
      return null
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error getting user with office assignment:', error)
    return null
  }
}

/**
 * Get access token from HTTP-only cookies
 */
export async function getAccessTokenFromCookies() {
  try {
    const cookieStore = await cookies()
    return cookieStore.get('access_token')?.value || null
  } catch (error) {
    console.error('Error getting access token from cookies:', error)
    return null
  }
}

/**
 * Get refresh token from HTTP-only cookies
 */
export async function getRefreshTokenFromCookies() {
  try {
    const cookieStore = await cookies()
    return cookieStore.get('refresh_token')?.value || null
  } catch (error) {
    console.error('Error getting refresh token from cookies:', error)
    return null
  }
}

/**
 * Verify if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Store tokens as HTTP-only cookies
 */
export async function storeTokensInCookies(tokens: {
  refresh_token: string
  access_token?: string
  expires_in?: number
}) {
  try {
    const cookieStore = await cookies()
    
    // Set refresh token cookie
    cookieStore.set('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Set access token cookie if provided
    if (tokens.access_token) {
      cookieStore.set('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokens.expires_in || 3600,
        path: '/',
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error storing tokens:', error)
    return { success: false, error }
  }
}

/**
 * Clear authentication cookies
 */
export async function clearAuthCookies() {
  try {
    const cookieStore = await cookies()
    
    cookieStore.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    cookieStore.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return { success: true }
  } catch (error) {
    console.error('Error clearing cookies:', error)
    return { success: false, error }
  }
}

/**
 * Client-side utility functions untuk mengirim request ke auth API
 */
export class AuthClient {
  private static baseUrl = '/api/v1/auth'

  /**
   * Simpan tokens dan ambil data user
   */
  static async storeTokensAndGetUser(tokens: {
    refresh_token: string
    access_token: string
    expires_in?: number
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokens),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error storing tokens and getting user:', error)
      throw error
    }
  }

  /**
   * Request access token baru menggunakan refresh token
   */
  static async refreshAccessToken(refresh_token?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refresh_token ? { refresh_token } : {}),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  /**
   * Logout - hapus tokens dari cookies
   */
  static async logout() {
    try {
      const response = await fetch(`${this.baseUrl}/token`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }
}