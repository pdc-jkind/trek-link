// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { useUserStore, setupUserAutoRefresh } from '@/store/userStore';
import type { AuthUser, AuthProvider as AuthProviderType } from '@/types/auth.types';

// Main auth hook for internal use and AuthProvider
export const useAuth = () => {
  // Auth state for session management
  const [authState, setAuthState] = useState({
    user: null as AuthUser | null,
    isLoading: true,
    error: null as string | null,
  });

  // Get user store state
  const userStore = useUserStore();
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | null = null;

    const initAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Get current session and user
        const authUser = await AuthService.getCurrentUser();
        
        if (!mounted) return;

        if (authUser) {
          setAuthState({
            user: authUser,
            isLoading: false,
            error: null,
          });
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

          } else {
            setAuthState({
              user: null,
              isLoading: false,
              error: null,
            });

            // Clear user store
            userStore.clearUser();

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
  }, [router]);

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

  // Check auth status helper
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      const authStatus = await AuthService.checkAuthStatus();
      
      setAuthState(prev => ({
        ...prev,
        user: authStatus.user,
        isLoading: false,
        error: null,
      }));

      return authStatus.isAuthenticated;
    } catch (error: any) {
      console.error('Check auth status error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal memeriksa status autentikasi',
        isLoading: false,
      }));
      return false;
    }
  }, []);

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
    checkAuthStatus,
    refreshProfile,
  };
};