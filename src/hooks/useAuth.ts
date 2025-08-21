// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/supabase';
import { AuthService } from '@/services/auth.service';
import type { AuthUser, AuthState, AuthProvider as AuthProviderType } from '@/types/auth.types';
import type { Session } from '@supabase/auth-helpers-nextjs';

// Create Auth Context
const AuthContext = createContext<{
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (provider: AuthProviderType) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  handleAuthCallback: () => Promise<boolean>;
} | null>(null);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session) {
          const user = await AuthService.getCurrentUser();
          setState(prev => ({
            ...prev,
            user,
            session,
            isAuthenticated: !!user,
            isLoading: false,
          }));
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
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

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session);

        if (session) {
          const user = await AuthService.getCurrentUser();
          setState(prev => ({
            ...prev,
            user,
            session,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
          }));

          // Redirect to dashboard if login successful
          if (event === 'SIGNED_IN') {
            router.push('/dashboard');
          }
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          }));

          // Redirect to login if logout
          if (event === 'SIGNED_OUT') {
            router.push('/login');
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
    setState(prev => ({ ...prev, isLoading: true }));
    
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
      // Check if there's a session after OAuth callback
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      if (session) {
        const user = await AuthService.getCurrentUser();
        setState(prev => ({
          ...prev,
          user,
          session,
          isAuthenticated: !!user,
          isLoading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: { message: 'Tidak ada sesi yang ditemukan' },
          isLoading: false,
        }));
        return false;
      }
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

  const value = {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error?.message || null,
    login,
    logout,
    clearError,
    handleAuthCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};