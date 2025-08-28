// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { useUserStore } from '@/store/user.store';
import type { AuthUser, AuthProvider as AuthProviderType } from '@/types/auth.types';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  // Auth state for session management only
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Get user store actions and state
  const {
    currentUser,
    isAuthenticated: userStoreAuthenticated,
    setUsers,
    clearUser,
    setLastFetched
  } = useUserStore();

  const router = useRouter();
  
  // Ref to track initialization and prevent loops
  const initializingRef = useRef(false);
  const authListenerRef = useRef<{ unsubscribe: () => void } | null>(null);
  const profileLoadingRef = useRef(false);

  // Load user profile after authentication
  const loadUserProfile = useCallback(async (userId: string) => {
    // Prevent concurrent profile loading
    if (profileLoadingRef.current) {
      console.log('Profile already loading, skipping...');
      return;
    }

    profileLoadingRef.current = true;
    
    try {
      console.log('Loading user profile for:', userId);
      
      const userProfiles = await AuthService.getUserProfile(userId);
      
      if (userProfiles && userProfiles.length > 0) {
        setUsers(userProfiles);
        setLastFetched();
        console.log('User profiles loaded and stored');
      } else {
        console.warn('No user profiles found');
        clearUser();
      }
    } catch (error: any) {
      console.error('Error loading user profile:', error);
      // Don't clear auth state, just log the error
      // The user is still authenticated, just couldn't load profile
    } finally {
      profileLoadingRef.current = false;
    }
  }, [setUsers, clearUser, setLastFetched]);

  // Setup auth state listener (extracted to separate function)
  const setupAuthListener = useCallback(() => {
    if (authListenerRef.current) {
      authListenerRef.current.unsubscribe();
    }

    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);

        try {
          if (session?.user) {
            // User signed in
            const authUser = await AuthService.getCurrentUser();
            
            if (authUser) {
              setAuthState({
                user: authUser,
                isLoading: false,
                error: null,
              });

              // Only load profile on specific events to prevent loops
              // Don't load profile on every SIGNED_IN event
              if (event === 'SIGNED_IN' && !currentUser) {
                console.log('Auth listener: Loading profile for new sign in');
                await loadUserProfile(authUser.id);
              } else if (event === 'TOKEN_REFRESHED') {
                // Don't reload profile on token refresh, user data should persist
                console.log('Auth listener: Token refreshed, keeping existing profile');
              } else {
                console.log('Auth listener: Auth state updated, profile already exists');
              }
            }

          } else {
            // User signed out
            setAuthState({
              user: null,
              isLoading: false,
              error: null,
            });

            // Clear user store
            clearUser();

            // Redirect to login on sign out
            if (event === 'SIGNED_OUT') {
              setTimeout(() => {
                router.push('/login');
              }, 100);
            }
          }
        } catch (error: any) {
          console.error('Auth state change error:', error);
          setAuthState(prev => ({
            ...prev,
            error: 'Terjadi kesalahan saat perubahan status auth',
            isLoading: false,
          }));
        }
      }
    );

    authListenerRef.current = subscription;
    return subscription;
  }, [router, currentUser, loadUserProfile, clearUser]);

  // Initialize auth state (only once)
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // Prevent multiple initializations
      if (initializingRef.current) {
        console.log('Auth already initializing, skipping...');
        return;
      }

      initializingRef.current = true;

      try {
        console.log('Initializing auth state...');
        
        // Check current session
        const authUser = await AuthService.getCurrentUser();
        
        if (!mounted) return;

        if (authUser) {
          // User is authenticated
          setAuthState({
            user: authUser,
            isLoading: false,
            error: null,
          });

          // Load user profile only if it doesn't exist
          // This prevents unnecessary API calls during dashboard navigation
          if (!currentUser) {
            console.log('Init: Loading profile - no current user');
            await loadUserProfile(authUser.id);
          } else {
            console.log('Init: Profile already exists, skipping load');
          }
        } else {
          // No session
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
          });
          
          // Clear user store if no session
          clearUser();
        }

      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState({
            user: null,
            isLoading: false,
            error: 'Gagal menginisialisasi autentikasi',
          });
        }
      } finally {
        initializingRef.current = false;
      }
    };

    // Initialize auth and setup listener
    initAuth().then(() => {
      if (mounted) {
        setupAuthListener();
      }
    });

    return () => {
      mounted = false;
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
      // Reset refs on cleanup
      initializingRef.current = false;
      profileLoadingRef.current = false;
    };
  }, []); // Empty dependency to prevent re-initialization

  // Login function
  const login = useCallback(async (provider: AuthProviderType = 'google') => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await AuthService.initiateOAuthLogin(provider);
      // State will be updated by auth state change listener
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal melakukan login',
        isLoading: false,
      }));
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log("Logging out...");
      await AuthService.logout();
      // State will be cleared by auth state change listener
    } catch (error: any) {
      console.error('Logout error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal melakukan logout',
        isLoading: false,
      }));
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh profile function
  const refreshProfile = useCallback(async () => {
    if (!authState.user) {
      console.warn('No authenticated user to refresh profile for');
      return;
    }

    try {
      console.log('Refreshing user profile...');
      await loadUserProfile(authState.user.id);
    } catch (error: any) {
      console.error('Refresh profile error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal merefresh profil',
      }));
    }
  }, [authState.user, loadUserProfile]);

  // Check if user is fully authenticated (has auth session and user profile)
  const isFullyAuthenticated = !!authState.user && userStoreAuthenticated;

  return {
    // Auth session data
    user: authState.user,
    // Full user profile from store
    userProfile: currentUser,
    // Loading states
    isLoading: authState.isLoading,
    // Authentication status
    isAuthenticated: !!authState.user, // Has valid session
    isFullyAuthenticated, // Has session + user profile loaded
    // Error state
    error: authState.error,
    // Actions
    login,
    logout,
    clearError,
    refreshProfile,
  };
};