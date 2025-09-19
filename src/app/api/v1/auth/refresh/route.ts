// // src/app/api/v1/auth/token/refresh/route.ts
// import { createServerSupabaseClient } from '@/lib/supabase/server'
// import { NextRequest, NextResponse } from 'next/server'
// import { cookies } from 'next/headers'
// import { 
//   getUserWithOfficeAssignment, 
//   storeTokensInCookies,
//   clearAuthCookies 
// } from '@/lib/auth/auth.service'

// /**
//  * POST - Refresh access token using refresh token and return updated user data
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const cookieStore = await cookies()
//     const body = await request.json()
    
//     // Ambil refresh token dari request body atau dari cookie
//     const refreshToken = body.refresh_token || cookieStore.get('refresh_token')?.value

//     if (!refreshToken) {
//       return NextResponse.json(
//         { 
//           error: 'Refresh token tidak ditemukan',
//           success: false 
//         },
//         { status: 400 }
//       )
//     }

//     // Buat Supabase client
//     const supabase = await createServerSupabaseClient()

//     // Refresh session menggunakan refresh token
//     const { data, error } = await supabase.auth.refreshSession({
//       refresh_token: refreshToken
//     })

//     if (error) {
//       console.error('Error refreshing session:', error)
//       // Clear cookies if refresh fails
//       await clearAuthCookies()
//       return NextResponse.json(
//         { 
//           error: 'Gagal refresh token', 
//           details: error.message,
//           success: false 
//         },
//         { status: 401 }
//       )
//     }

//     if (!data.session) {
//       await clearAuthCookies()
//       return NextResponse.json(
//         { 
//           error: 'Session tidak valid',
//           success: false 
//         },
//         { status: 401 }
//       )
//     }

//     // Store updated tokens
//     const storeResult = await storeTokensInCookies({
//       access_token: data.session.access_token,
//       refresh_token: data.session.refresh_token,
//       expires_in: data.session.expires_in
//     })

//     if (!storeResult.success) {
//       return NextResponse.json(
//         { 
//           error: 'Gagal menyimpan tokens yang telah diperbarui',
//           success: false 
//         },
//         { status: 500 }
//       )
//     }

//     // Get updated user data
//     const userData = await getUserWithOfficeAssignment(data.session.access_token)

//     if (!userData) {
//       await clearAuthCookies()
//       return NextResponse.json(
//         { 
//           error: 'Gagal mengambil data user setelah refresh',
//           success: false 
//         },
//         { status: 401 }
//       )
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Token berhasil diperbarui',
//       data: userData,
//       user_count: userData.length,
//       expires_at: data.session.expires_at,
//       expires_in: data.session.expires_in,
//     })

//   } catch (error) {
//     console.error('Unexpected error in refresh:', error)
//     await clearAuthCookies()
//     return NextResponse.json(
//       { 
//         error: 'Terjadi kesalahan server',
//         success: false 
//       },
//       { status: 500 }
//     )
//   }
// }