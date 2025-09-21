// src\lib\auth\auth.server.ts
import { createServerSupabaseClient, createMiddlewareSupabaseClient } from '@/lib/supabase/server';
import { type NextRequest, type NextResponse } from 'next/server';
import type { AuthUser } from '@/types/auth.types';
import type { User } from '@/types/user.types';

export class AuthServerService {
  /**
   * Mengambil session yang sedang aktif menggunakan server component client
   * Digunakan di server components dan API routes
   * @returns Session object atau null jika tidak ada session
   */
  static async getServerSession() {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting server session:', error);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error in getServerSession:', error);
      return null;
    }
  }

  /**
   * Mengambil session menggunakan middleware client
   * Khusus digunakan di middleware untuk handling request/response cookies
   * @param request - NextRequest object dari middleware
   * @param response - NextResponse object dari middleware  
   * @returns Session object atau null jika tidak ada session
   */
  static async getMiddlewareSession(request: NextRequest, response: NextResponse) {
    try {
      const supabase = createMiddlewareSupabaseClient(request, response);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting middleware session:', error);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error in getMiddlewareSession:', error);
      return null;
    }
  }

  /**
   * Mengambil current user dari server session dan mapping ke AuthUser DTO
   * Memastikan Single Source of Truth untuk user data di server-side
   * @returns AuthUser object atau null jika tidak ada session
   */
  static async getCurrentServerUser(): Promise<AuthUser | null> {
    try {
      const session = await this.getServerSession();
      
      if (!session?.user) {
        return null;
      }

      const { user } = session;

      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name || 
              user.user_metadata?.name || 
              user.email?.split('@')[0] || 
              "User",
        photo: user.user_metadata?.avatar_url || 
               user.user_metadata?.picture ||
               user.user_metadata?.photo_url,
        role: user.user_metadata?.role || user.app_metadata?.role || "user",
      };
    } catch (error) {
      console.error('Error getting current server user:', error);
      return null;
    }
  }

  /**
   * Mengambil current user dari middleware session dan mapping ke AuthUser DTO
   * Khusus untuk digunakan di middleware context
   * @param request - NextRequest object dari middleware
   * @param response - NextResponse object dari middleware
   * @returns AuthUser object atau null jika tidak ada session
   */
  static async getCurrentMiddlewareUser(request: NextRequest, response: NextResponse): Promise<AuthUser | null> {
    try {
      const session = await this.getMiddlewareSession(request, response);
      
      if (!session?.user) {
        return null;
      }

      const { user } = session;

      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name || 
              user.user_metadata?.name || 
              user.email?.split('@')[0] || 
              "User",
        photo: user.user_metadata?.avatar_url || 
               user.user_metadata?.picture ||
               user.user_metadata?.photo_url,
        role: user.user_metadata?.role || user.app_metadata?.role || "user",
      };
    } catch (error) {
      console.error('Error getting current middleware user:', error);
      return null;
    }
  }

  /**
   * Mengecek apakah user sedang authenticated di server-side
   * @returns boolean - true jika ada session aktif
   */
  static async isServerAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getServerSession();
      return !!session;
    } catch (error) {
      console.error('Error checking server authentication:', error);
      return false;
    }
  }

  /**
   * Mengecek apakah user sedang authenticated di middleware
   * @param request - NextRequest object dari middleware
   * @param response - NextResponse object dari middleware
   * @returns boolean - true jika ada session aktif
   */
  static async isMiddlewareAuthenticated(request: NextRequest, response: NextResponse): Promise<boolean> {
    try {
      const session = await this.getMiddlewareSession(request, response);
      return !!session;
    } catch (error) {
      console.error('Error checking middleware authentication:', error);
      return false;
    }
  }

  /**
   * Mengambil user profile lengkap dari database di server-side
   * @param userId - ID user yang ingin diambil datanya
   * @returns Array User data atau null jika tidak ditemukan
   */
  static async getServerUserProfile(userId: string): Promise<User[] | null> {
    try {
      const supabase = await createServerSupabaseClient();
      
      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .eq('id', userId);

      if (error) {
        console.error('Error fetching server user profile:', error);
        return null;
      }

      return data as User[];
    } catch (error) {
      console.error('Error in getServerUserProfile:', error);
      return null;
    }
  }

  /**
   * Refresh session di middleware - membantu menjaga session tetap aktif
   * @param request - NextRequest object dari middleware
   * @param response - NextResponse object dari middleware
   * @returns boolean - true jika berhasil refresh session
   */
  static async refreshMiddlewareSession(request: NextRequest, response: NextResponse): Promise<boolean> {
    try {
      const supabase = createMiddlewareSupabaseClient(request, response);
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Error refreshing middleware session:', error);
        return false;
      }

      return !!data.session;
    } catch (error) {
      console.error('Error in refreshMiddlewareSession:', error);
      return false;
    }
  }
}