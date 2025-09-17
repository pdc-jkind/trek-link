// src/app/api/v1/auth/token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { 
  storeTokensInCookies, 
  getUserWithOfficeAssignment, 
  clearAuthCookies 
} from '@/lib/auth/auth.service'

/**
 * POST - Store tokens in HTTP-only cookies and return user data
 * Body: { access_token: string, refresh_token: string, expires_in?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { access_token, refresh_token, expires_in } = body

    // Validasi input
    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { 
          error: 'Access token dan refresh token diperlukan',
          success: false 
        },
        { status: 400 }
      )
    }

    // Store tokens in HTTP-only cookies
    const storeResult = await storeTokensInCookies({
      access_token,
      refresh_token,
      expires_in
    })

    if (!storeResult.success) {
      return NextResponse.json(
        { 
          error: 'Gagal menyimpan tokens',
          success: false 
        },
        { status: 500 }
      )
    }

    // Get user data with office assignments using the access token
    const userData = await getUserWithOfficeAssignment(access_token)

    if (!userData) {
      // Clear cookies if user data retrieval fails
      await clearAuthCookies()
      return NextResponse.json(
        { 
          error: 'Gagal mengambil data user',
          success: false 
        },
        { status: 401 }
      )
    }

    // Return user data array
    return NextResponse.json({
      success: true,
      message: 'Tokens berhasil disimpan dan data user berhasil diambil',
      data: userData,
      user_count: userData.length,
      expires_in
    })

  } catch (error) {
    console.error('Error in POST /api/v1/auth/token:', error)
    
    // Clear cookies on error
    await clearAuthCookies()
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan server',
        success: false 
      },
      { status: 500 }
    )
  }
}

/**
 * GET - Get current user data from stored tokens
 */
export async function GET(request: NextRequest) {
  try {
    // Get user data using stored cookies
    const userData = await getUserWithOfficeAssignment()

    if (!userData) {
      return NextResponse.json(
        { 
          error: 'User tidak terautentikasi atau data tidak ditemukan',
          success: false 
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: userData,
      user_count: userData.length
    })

  } catch (error) {
    console.error('Error in GET /api/v1/auth/token:', error)
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan server',
        success: false 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Logout, clear all auth cookies
 */
export async function DELETE(request: NextRequest) {
  try {
    const clearResult = await clearAuthCookies()

    if (!clearResult.success) {
      return NextResponse.json(
        { 
          error: 'Gagal menghapus cookies',
          success: false 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Logout berhasil, cookies telah dihapus'
    })

  } catch (error) {
    console.error('Error in DELETE /api/v1/auth/token:', error)
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan server',
        success: false 
      },
      { status: 500 }
    )
  }
}