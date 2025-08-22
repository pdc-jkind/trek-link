// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/supabase';
import { AuthService } from '@/services/auth.service';
import type { AuthUser, AuthState, AuthProvider as AuthProviderType } from '@/types/auth.types';

// Create Auth Context
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (provider: AuthProviderType) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  handleAuthCallback: () => Promise<boolean>;
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
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const router = useRouter();

  // Initialize auth state with optimized performance
  useEffect(() => {
    let mounted = true;
    let authInitialized = false;

    const initAuth = async () => {
      if (authInitialized) return;
      authInitialized = true;

      try {
        // Get initial session with timeout for faster failure
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (!mounted) return;

        if (error && error.message !== 'Session timeout') {
          console.error('Session error:', error);
          setState(prev => ({
            ...prev,
            error: { message: 'Gagal mendapatkan sesi' },
            isLoading: false,
          }));
          return;
        }

        if (session) {
          // Parallel user fetch for faster loading
          const userPromise = AuthService.getCurrentUser();
          const user = await Promise.race([
            userPromise,
            new Promise((resolve) => setTimeout(() => resolve(null), 3000))
          ]) as AuthUser | null;

          if (mounted) {
            setState(prev => ({
              ...prev,
              user,
              session: session as any,
              isAuthenticated: !!user,
              isLoading: false,
              error: null,
            }));
          }
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            error: { message: 'Gagal menginisialisasi autentikasi' },
            isLoading: false,
          }));
        }
      }
    };

    initAuth();

    // Listen to auth changes with optimized handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session);

        try {
          if (session) {
            // Set session immediately for faster UI updates
            setState(prev => ({
              ...prev,
              session: session as any,
              isLoading: true,
              error: null,
            }));

            // Fetch user data with timeout for faster processing
            const userPromise = AuthService.getCurrentUser();
            const timeoutPromise = new Promise((resolve) => 
              setTimeout(() => resolve(null), 2000)
            );

            const user = await Promise.race([userPromise, timeoutPromise]) as AuthUser | null;

            if (mounted) {
              setState(prev => ({
                ...prev,
                user,
                isAuthenticated: !!user,
                isLoading: false,
              }));

              // Optimized redirect handling - no delay for better UX
              if (event === 'SIGNED_IN' && user) {
                // Use setTimeout to avoid blocking the current execution
                setTimeout(() => {
                  router.push('/dashboard');
                }, 0);
              }
            }
          } else {
            setState(prev => ({
              ...prev,
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            }));

            // Immediate redirect on sign out
            if (event === 'SIGNED_OUT') {
              setTimeout(() => {
                router.push('/login');
              }, 0);
            }
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          if (mounted) {
            setState(prev => ({
              ...prev,
              error: { message: 'Terjadi kesalahan saat perubahan status auth' },
              isLoading: false,
            }));
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const login = useCallback(async (provider: AuthProviderType = 'google') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await AuthService.initiateOAuthLogin(provider);
    } catch (error: any) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        error: { message: error.message || 'Gagal melakukan login' },
        isLoading: false,
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await AuthService.logout();
    } catch (error: any) {
      console.error('Logout error:', error);
      setState(prev => ({
        ...prev,
        error: { message: error.message || 'Gagal melakukan logout' },
        isLoading: false,
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const handleAuthCallback = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Optimized callback handling with reduced waiting time
      let attempts = 0;
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        // Check if there's a session after OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn(`Session check attempt ${attempts + 1} failed:`, error);
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Reduced from 1000ms
            continue;
          }
          throw error;
        }

        if (session) {
          // Fetch user with timeout for faster processing
          const userPromise = AuthService.getCurrentUser();
          const timeoutPromise = new Promise((resolve) => 
            setTimeout(() => resolve(null), 2000)
          );

          const user = await Promise.race([userPromise, timeoutPromise]) as AuthUser | null;
          
          setState(prev => ({
            ...prev,
            user,
            session: session as any,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
          }));
          
          return true;
        }

        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 300)); // Reduced waiting time
        }
      }

      // No session found after all attempts
      setState(prev => ({
        ...prev,
        error: { message: 'Tidak ada sesi yang ditemukan setelah beberapa percobaan' },
        isLoading: false,
      }));
      return false;

    } catch (error: any) {
      console.error('Auth callback error:', error);
      setState(prev => ({
        ...prev,
        error: { message: error.message || 'Gagal memproses callback' },
        isLoading: false,
      }));
      return false;
    }
  }, []);

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error?.message || null,
    login,
    logout,
    clearError,
    handleAuthCallback,
  };
};