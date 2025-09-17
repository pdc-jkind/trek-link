// src/lib/auth/utils.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

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
 * Client-side utility functions untuk mengirim request ke auth API
 */
export class AuthClient {
  private static baseUrl = '/api/v1/auth'

  /**
   * Simpan refresh token ke HTTP-only cookies
   */
  static async storeTokens(tokens: {
    refresh_token: string
    access_token?: string
    expires_in?: number
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokens),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error storing tokens:', error)
      throw error
    }
  }

  /**
   * Request access token baru menggunakan refresh token
   */
  static async refreshAccessToken(refresh_token?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refresh_token ? { refresh_token } : {}),
        credentials: 'include', // Penting untuk include cookies
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
      const response = await fetch(`${this.baseUrl}/refresh`, {
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