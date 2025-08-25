// src/services/auth.service.ts
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/userStore";
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
   * Get redirect URL based on environment configuration
   */
  private static getRedirectUrl(): string {
    const envRedirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL;
    
    if (envRedirectUrl) {
      return envRedirectUrl;
    }

    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';
    
    return `${baseUrl}/auth/callback`;
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
      return session !== null;
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
   * Fetch and store complete user profile setelah login
   */
  static async initializeUserProfile(authUserId: string): Promise<boolean> {
    try {
      console.log('Initializing user profile for:', authUserId);
      
      // Fetch full user profile dari database
      const userProfile = await UserService.getUserProfile(authUserId);
      
      if (userProfile) {
        // Store di Zustand
        useUserStore.getState().setUser(userProfile);
        console.log('User profile initialized and stored:', userProfile);
        return true;
      } else {
        console.error('User profile not found in database');
        useUserStore.getState().setError('Profil pengguna tidak ditemukan');
        return false;
      }
    } catch (error: any) {
      console.error('Error initializing user profile:', error);
      useUserStore.getState().setError(error.message || 'Gagal menginisialisasi profil pengguna');
      return false;
    }
  }

  /**
   * Logs out the user - clear both Supabase session and Zustand store
   */
  static async logout(): Promise<void> {
    try {
      const supabase = this.getClient();
      
      // Clear Zustand store first
      useUserStore.getState().clearUser();
      
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
      useUserStore.getState().clearUser();
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
   * Handle auth callback - verify session and initialize user profile
   */
  static async handleAuthCallback(): Promise<boolean> {
    try {
      console.log('Handling auth callback...');
      
      // Get session from Supabase (yang sudah ada dari cookie)
      const session = await this.getSession();
      
      if (!session?.user) {
        console.error('No session found after callback');
        return false;
      }

      console.log('Session found, initializing user profile...');
      
      // Initialize complete user profile
      const success = await this.initializeUserProfile(session.user.id);
      
      if (success) {
        console.log('Auth callback handled successfully');
        return true;
      } else {
        console.error('Failed to initialize user profile');
        return false;
      }
    } catch (error: any) {
      console.error('Error handling auth callback:', error);
      return false;
    }
  }

  /**
   * Refresh user profile if needed
   */
  static async refreshUserProfileIfNeeded(): Promise<void> {
    const userStore = useUserStore.getState();
    
    // Check if we have authenticated session but no user profile
    const isAuthenticated = await this.isAuthenticated();
    
    if (isAuthenticated && !userStore.user) {
      console.log('Authenticated but no user profile, fetching...');
      const session = await this.getSession();
      if (session?.user) {
        await this.initializeUserProfile(session.user.id);
      }
    } else if (isAuthenticated && userStore.isDataStale(30)) {
      // Refresh if data is stale (older than 30 minutes)
      console.log('User data is stale, refreshing...');
      await userStore.refreshUserProfile();
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = this.getClient();
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Initialize user profile when signed in
        await this.initializeUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        // Clear user store when signed out
        useUserStore.getState().clearUser();
      }
      
      // Call the original callback
      callback(event, session);
    });
  }
}