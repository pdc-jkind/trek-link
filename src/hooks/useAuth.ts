// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthService } from '@/services/auth.service';
import { useUserStore, setupUserAutoRefresh } from '@/store/userStore';
import type { AuthUser, AuthProvider as AuthProviderType } from '@/types/auth.types';

// Create Auth Context
interface AuthContextType {
  user: AuthUser | null;
  fullUserProfile: any; // From Zustand store
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (provider: AuthProviderType) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  handleAuthCallback: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook untuk menggunakan auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom hook untuk auth logic (bisa dipanggil dari AuthProvider)
export const useAuthState = () => {
  // Auth state for session management
  const [authState, setAuthState] = useState({
    user: null as AuthUser | null,
    isLoading: true,
    error: null as string | null,
  });

  // Get user store state
  const userStore = useUserStore();
  const router = useRouter();

  // Initialize auth state dengan session check
  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | null = null;

    const initAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        const supabase = createClient();
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Session error:', error);
          setAuthState({
            user: null,
            isLoading: false,
            error: 'Gagal mendapatkan sesi',
          });
          return;
        }

        if (session?.user) {
          // Set basic auth user
          const authUser = await AuthService.getCurrentUser();
          
          if (mounted) {
            setAuthState({
              user: authUser,
              isLoading: false,
              error: null,
            });

            // Initialize/refresh user profile if needed
            // REMOVED: Don't call this here as it causes infinite loop
            // await AuthService.refreshUserProfileIfNeeded();
          }
        } else {
          // No session
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
          });
          
          // Clear user store if no session
          if (userStore.user) {
            userStore.clearUser();
          }
        }

        // Setup auto-refresh for user profile data
        cleanup = setupUserAutoRefresh();

      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState({
            user: null,
            isLoading: false,
            error: 'Gagal menginisialisasi autentikasi',
          });
        }
      }
    };

    initAuth();

    // Listen to auth changes
    const supabase = createClient();
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, !!session);

        try {
          if (session?.user) {
            const authUser = await AuthService.getCurrentUser();
            
            setAuthState({
              user: authUser,
              isLoading: false,
              error: null,
            });

            // Redirect to dashboard on sign in
            if (event === 'SIGNED_IN') {
              setTimeout(() => {
                router.push('/dashboard');
              }, 100);
            }
          } else {
            setAuthState({
              user: null,
              isLoading: false,
              error: null,
            });

            // Redirect to login on sign out
            if (event === 'SIGNED_OUT') {
              setTimeout(() => {
                router.push('/login');
              }, 100);
            }
          }
        } catch (error: any) {
          console.error('Auth state change error:', error);
          if (mounted) {
            setAuthState(prev => ({
              ...prev,
              error: 'Terjadi kesalahan saat perubahan status auth',
              isLoading: false,
            }));
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (cleanup) cleanup();
    };
  }, [router]); // FIXED: Removed userStore.user from dependencies

  const login = useCallback(async (provider: AuthProviderType = 'google') => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    userStore.setError(null);
    
    try {
      await AuthService.initiateOAuthLogin(provider);
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal melakukan login',
        isLoading: false,
      }));
    }
  }, [userStore]);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log("AuthService.logout called");
      await AuthService.logout();
      // State akan di-clear oleh auth state change listener
    } catch (error: any) {
      console.error('Logout error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal melakukan logout',
        isLoading: false,
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
    userStore.setError(null);
  }, [userStore]);

  const handleAuthCallback = useCallback(async (): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    userStore.setError(null);

    try {
      const success = await AuthService.handleAuthCallback();
      
      if (success) {
        // Auth user akan di-set oleh auth state change listener
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          error: 'Gagal memproses callback',
          isLoading: false,
        }));
        return false;
      }
    } catch (error: any) {
      console.error('Auth callback error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal memproses callback',
        isLoading: false,
      }));
      return false;
    }
  }, [userStore]);

  const refreshProfile = useCallback(async () => {
    try {
      await AuthService.refreshUserProfileIfNeeded();
    } catch (error: any) {
      console.error('Refresh profile error:', error);
      userStore.setError(error.message || 'Gagal merefresh profil');
    }
  }, [userStore]);

  return {
    user: authState.user,
    fullUserProfile: userStore.user, // Complete user profile from Zustand
    isLoading: authState.isLoading || userStore.isLoading,
    isAuthenticated: !!authState.user && userStore.isAuthenticated,
    error: authState.error || userStore.error,
    login,
    logout,
    clearError,
    handleAuthCallback,
    refreshProfile,
  };
};