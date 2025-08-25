// src/services/auth.service.ts
import { createClient } from "@/lib/supabase/client";
import type { AuthUser, AuthProvider } from "@/types/auth.types";

export class AuthService {
  /**
   * Get supabase client instance
   */
  private static getClient() {
    return createClient();
  }

  /**
   * Checks if user is currently authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const supabase = this.getClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking authentication:", error);
        return false;
      }
      return session !== null;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  /**
   * Gets current user data from Supabase session
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const supabase = this.getClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return null;
      }

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
      console.error("Error getting current user:", error);
      return null;
    }
  }

  /**
   * Gets current session from Supabase
   */
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

  /**
   * Logs out the user using Supabase auth
   */
  static async logout(): Promise<void> {
    try {
      const supabase = this.getClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error);
        throw new Error(error.message || 'Gagal logout');
      }
    } catch (error: any) {
      console.error("Error logging out:", error);
      throw new Error(error.message || 'Gagal logout');
    }
  }

  /**
   * Initiates OAuth login flow with Supabase
   */
  static async initiateOAuthLogin(provider: AuthProvider = 'google'): Promise<void> {
    try {
      const supabase = this.getClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error("OAuth login error:", error);
        throw new Error(error.message || 'Gagal melakukan login');
      }
    } catch (error: any) {
      console.error("OAuth login error:", error);
      throw new Error(error.message || 'Gagal melakukan login');
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = this.getClient();
    return supabase.auth.onAuthStateChange(callback);
  }
}