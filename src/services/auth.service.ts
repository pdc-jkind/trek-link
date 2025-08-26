// src/services/auth.service.ts
import { createClient } from "@/lib/supabase/client";
import { UserService } from "@/services/user.service";
import type { AuthUser, AuthProvider } from "@/types/auth.types";

export class AuthService {
  /**
   * Get supabase client instance
   */
  private static getClient() {
    return createClient();
  }

  /**
   * Get redirect URL for OAuth callback
   */
  private static getRedirectUrl(): string {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    return `${baseUrl}/callback`;
  }

  /**
   * Checks if user is currently authenticated (berdasarkan Supabase session)
   */
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

  /**
   * Gets current user data from Supabase session (minimal data from auth)
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
   * Load user profile to Zustand store (client-side only)
   */
  static async loadUserProfileToStore(): Promise<boolean> {
    try {
      console.log('Loading user profile to Zustand store...');
      
      // Get current session first
      const session = await this.getSession();
      if (!session?.user) {
        console.log('No active session found');
        return false;
      }

      // Get user profile from database
      const userProfile = await UserService.getUserProfile(session.user.id);
      
      if (!userProfile) {
        console.error('User profile not found in database');
        return false;
      }

      // Import store dynamically to avoid SSR issues
      const { useUserStore } = await import('@/store/userStore');
      const store = useUserStore.getState();
      
      // Set user in store
      store.setUser(userProfile);
      
      console.log('User profile loaded to store successfully:', userProfile.office_name);
      return true;
      
    } catch (error: any) {
      console.error('Error loading user profile to store:', error);
      return false;
    }
  }

  /**
   * Check auth status and profile status
   */
  static async checkAuthStatus(): Promise<{
    isAuthenticated: boolean;
    user: AuthUser | null;
    hasProfile: boolean;
  }> {
    try {
      const session = await this.getSession();
      const user = await this.getCurrentUser();
      
      const isAuthenticated = !!session && !!user;
      
      // Check if user profile exists in store (client-side only)
      let hasProfile = false;
      if (typeof window !== 'undefined') {
        const { useUserStore } = await import('@/store/userStore');
        hasProfile = !!useUserStore.getState().user;
      }
      
      return {
        isAuthenticated,
        user,
        hasProfile
      };
    } catch (error: any) {
      console.error('Check auth status error:', error);
      return {
        isAuthenticated: false,
        user: null,
        hasProfile: false
      };
    }
  }

  /**
   * Logs out the user - clear both Supabase session and Zustand store
   */
  static async logout(): Promise<void> {
    try {
      const supabase = this.getClient();
      
      // Clear Zustand store first (client-side only)
      if (typeof window !== 'undefined') {
        const { useUserStore } = await import('@/store/userStore');
        useUserStore.getState().clearUser();
      }
      
      // Then clear Supabase session (ini akan menghapus HTTP-only cookie)
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error);
        throw new Error(error.message || 'Gagal logout');
      }
      
      console.log('Logout successful');
    } catch (error: any) {
      console.error("Error logging out:", error);
      
      // Even if logout fails, ensure local state is cleared
      if (typeof window !== 'undefined') {
        const { useUserStore } = await import('@/store/userStore');
        useUserStore.getState().clearUser();
      }
      
      throw new Error(error.message || 'Gagal logout');
    }
  }

  /**
   * Initiates OAuth login flow with Supabase
   */
  static async initiateOAuthLogin(provider: AuthProvider = 'google'): Promise<void> {
    try {
      const supabase = this.getClient();
      const redirectUrl = this.getRedirectUrl();
      
      console.log(`Initiating OAuth login with ${provider}, redirectTo: ${redirectUrl}`);

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
        console.error("OAuth login error:", error);
        throw new Error(error.message || 'Gagal melakukan login');
      }
    } catch (error: any) {
      console.error("OAuth login error:", error);
      throw new Error(error.message || 'Gagal melakukan login');
    }
  }

  /**
   * Refresh user profile if needed (client-side only)
   */
  static async refreshUserProfileIfNeeded(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const { useUserStore } = await import('@/store/userStore');
      const store = useUserStore.getState();
      
      // Check if data is stale or user is not loaded
      if (!store.user || store.isDataStale(30)) { // 30 minutes
        console.log('User profile data is stale or missing, refreshing...');
        await this.loadUserProfileToStore();
      }
    } catch (error: any) {
      console.error('Error refreshing user profile:', error);
    }
  }

  /**
   * Listen to auth state changes (client-side only)
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = this.getClient();
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (event === 'SIGNED_OUT') {
        // Clear user store when signed out (client-side only)
        if (typeof window !== 'undefined') {
          const { useUserStore } = await import('@/store/userStore');
          useUserStore.getState().clearUser();
        }
      }
      
      // Call the original callback
      callback(event, session);
    });
  }
}