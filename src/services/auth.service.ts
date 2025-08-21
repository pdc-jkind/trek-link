// src/services/auth.service.ts
import { supabase } from "@/lib/supabase/supabase";
import type { AuthUser, AuthProvider } from "@/types/auth.types";

export class AuthService {
  /**
   * Checks if user is currently authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return session !== null;
  }

  /**
   * Gets current user data from Supabase session
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { session } } = await supabase.auth.getSession();

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
  }

  /**
   * Gets current session from Supabase
   */
  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    return session;
  }

  /**
   * Logs out the user using Supabase auth
   */
  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error);
      throw new Error(error.message || 'Gagal logout');
    }
  }

  /**
   * Initiates OAuth login flow with Supabase
   */
  static async initiateOAuthLogin(provider: AuthProvider = 'google'): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
   * Sign in with email and password
   */
  static async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Sign in error:", error);
      throw new Error(error.message || 'Email atau password salah');
    }

    return data;
  }

  /**
   * Sign up with email and password
   */
  static async signUpWithEmail(email: string, password: string, options?: {
    name?: string;
    redirectTo?: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: options?.name
        },
        emailRedirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error("Sign up error:", error);
      throw new Error(error.message || 'Gagal mendaftar');
    }

    return data;
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) {
      console.error("Reset password error:", error);
      throw new Error(error.message || 'Gagal reset password');
    }
  }

  /**
   * Update password
   */
  static async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      console.error("Update password error:", error);
      throw new Error(error.message || 'Gagal update password');
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Get user profile from database (if you have users table)
   */
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error("Error getting user profile:", error);
      return null;
    }

    return data;
  }

  /**
   * Update user profile in database
   */
  static async updateUserProfile(userId: string, profile: Partial<AuthUser>) {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      throw new Error(error.message || 'Gagal update profil');
    }

    return data;
  }
}