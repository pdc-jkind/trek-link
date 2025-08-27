// src/services/auth.service.ts
import { createClient } from "@/lib/supabase/client";
import type { AuthUser, AuthProvider } from "@/types/auth.types";

export class AuthService {
  private static getClient() {
    return createClient();
  }

  private static getRedirectUrl(): string {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    return `${baseUrl}/callback`;
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const supabase = this.getClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking authentication:", error);
        return false;
      }
      
      return !!session;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const supabase = this.getClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session?.user) {
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
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static async getSession() {
    try {
      const supabase = this.getClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return null;
      }

      return session;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  }

  static async checkAuthStatus(): Promise<{
    isAuthenticated: boolean;
    user: AuthUser | null;
  }> {
    try {
      const user = await this.getCurrentUser();
      const isAuthenticated = !!user;
      
      return { isAuthenticated, user };
    } catch (error: any) {
      console.error('Check auth status error:', error);
      return { isAuthenticated: false, user: null };
    }
  }

  static async logout(): Promise<void> {
    try {
      const supabase = this.getClient();
      
      // Clear store first
      if (typeof window !== 'undefined') {
        const { useUserStore } = await import('@/store/userStore');
        useUserStore.getState().clearUser();
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error);
        throw new Error(error.message || 'Gagal logout');
      }
      
    } catch (error: any) {
      console.error("Error logging out:", error);
      
      // Ensure local state is cleared
      if (typeof window !== 'undefined') {
        const { useUserStore } = await import('@/store/userStore');
        useUserStore.getState().clearUser();
      }
      
      throw new Error(error.message || 'Gagal logout');
    }
  }

  static async initiateOAuthLogin(provider: AuthProvider = 'google'): Promise<void> {
    try {
      const supabase = this.getClient();
      const redirectUrl = this.getRedirectUrl();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        throw new Error(error.message || 'Gagal melakukan login');
      }
    } catch (error: any) {
      console.error("OAuth login error:", error);
      throw new Error(error.message || 'Gagal melakukan login');
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = this.getClient();
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' && typeof window !== 'undefined') {
        const { useUserStore } = await import('@/store/userStore');
        useUserStore.getState().clearUser();
      }
      
      callback(event, session);
    });
  }
}