// src/app/(auth)/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const redirectTo = requestUrl.searchParams.get('redirect_to') || '/dashboard'

  console.log('Auth callback received:', { 
    code: !!code, 
    error, 
    errorDescription,
    redirectTo 
  })

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const errorMessage = errorDescription || error
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
    )
  }

  // No code provided
  if (!code) {
    console.error('No authorization code provided')
    return NextResponse.redirect(
      new URL('/login?error=Kode+autentikasi+tidak+ditemukan', request.url)
    )
  }

  try {
    const cookieStore = await cookies()
    
    // Create Supabase server client
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
    })

    // Exchange code for session
    console.log('Exchanging code for session...')
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
      )
    }

    if (!session) {
      console.error('No session created after code exchange')
      return NextResponse.redirect(
        new URL('/login?error=Gagal+membuat+sesi', request.url)
      )
    }

    console.log('Session created successfully:', {
      userId: session.user.id,
      email: session.user.email
    })

    // Create response with redirect
    const response = NextResponse.redirect(new URL(redirectTo, request.url))

    // Set additional security headers
    response.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
    response.headers.set('Pragma', 'no-cache')

    console.log('Redirecting to:', redirectTo)
    return response

  } catch (error: any) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Terjadi+kesalahan+saat+memproses+login')}`, request.url)
    )
  }
}