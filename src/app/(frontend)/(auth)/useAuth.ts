// src/app/(auth)/useAuth.ts
"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/app/(frontend)/services/auth.service";
import { useUserStore } from "@/app/(frontend)/store/user.store";
import type {
  AuthUser,
  AuthProvider as AuthProviderType,
} from "@/types/auth.types";

export const useAuth = () => {
  const router = useRouter();
  const mountedRef = useRef(true);
  const authListenerRef = useRef<{ unsubscribe: () => void } | null>(null);

  // Get everything from Zustand store
  const {
    authUser,
    currentUser,
    allUserOffices,
    isAuthenticated,
    isFullyAuthenticated,
    isLoading,
    error,
    
    // Actions from store
    setAuthUser,
    setUsers,
    clearUser,
    setLoading,
    setError,
    isDataStale,
  } = useUserStore();

  // Load user profile using store actions
  const loadUserProfile = useCallback(
    async (userId: string, forceReload = false) => {
      if (!mountedRef.current) return;

      // Skip if data is fresh and not forcing reload
      if (!forceReload && currentUser && !isDataStale()) {
        console.log("User profile is fresh, skipping reload");
        return;
      }

      try {
        console.log("Loading user profile for:", userId);
        const profile = await AuthService.getUserProfile(userId);

        if (!mountedRef.current) return;

        if (profile && profile.length > 0) {
          console.log("User profile loaded, updating store");
          setUsers(profile);
        } else {
          console.warn("No user profile found");
          clearUser();
        }
      } catch (error: any) {
        console.error("Error loading user profile:", error);
        if (mountedRef.current) {
          setError("Gagal memuat profil pengguna");
        }
      }
    },
    [currentUser, isDataStale, setUsers, clearUser, setError]
  );

  // Auth state listener using store actions
  const setupAuthListener = useCallback(() => {
    if (!mountedRef.current || authListenerRef.current) return;

    console.log("Setting up auth listener");

    const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;

      console.log("Auth state changed:", event, !!session?.user);

      try {
        if (session?.user) {
          // User is authenticated
          const authUser = await AuthService.getCurrentUser();

          if (authUser && mountedRef.current) {
            setAuthUser(authUser);
            setLoading(false);
            setError(null);

            // Load profile based on event
            if (event === "SIGNED_IN") {
              // Always reload on sign in
              await loadUserProfile(authUser.id, true);
            } else if (event === "INITIAL_SESSION") {
              // Check if profile data is stale
              await loadUserProfile(authUser.id, false);
            }
          }
        } else {
          // User signed out
          if (mountedRef.current) {
            setAuthUser(null);
            setLoading(false);
            setError(null);
            clearUser();

            if (event === "SIGNED_OUT") {
              router.push("/login");
            }
          }
        }
      } catch (error: any) {
        console.error("Auth state change error:", error);
        if (mountedRef.current) {
          setError("Terjadi kesalahan saat perubahan status auth");
          setLoading(false);
        }
      }
    });

    authListenerRef.current = subscription;
  }, [router, loadUserProfile, clearUser, setAuthUser, setLoading, setError]);

  // Initialize auth using store actions
  useEffect(() => {
    mountedRef.current = true;

    const initAuth = async () => {
      try {
        console.log("Initializing auth...");
        setLoading(true);

        const authUser = await AuthService.getCurrentUser();

        if (!mountedRef.current) return;

        if (authUser) {
          console.log("User authenticated:", authUser.id);
          setAuthUser(authUser);
          setError(null);

          // Load profile if needed
          await loadUserProfile(authUser.id, false);
        } else {
          console.log("No authenticated user");
          setAuthUser(null);
          setError(null);
          clearUser();
        }

        // Setup listener after initial check
        if (mountedRef.current) {
          setupAuthListener();
        }
      } catch (error: any) {
        console.error("Auth initialization error:", error);
        if (mountedRef.current) {
          setAuthUser(null);
          setError("Gagal menginisialisasi autentikasi");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mountedRef.current = false;
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
    };
  }, []); // Empty dependency array - run once

  // Auth actions using store
  const login = useCallback(async (provider: AuthProviderType = "google") => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.initiateOAuthLogin(provider);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Gagal melakukan login");
      setLoading(false);
    }
  }, [setLoading, setError]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.logout();
      // State will be updated by auth listener
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(error.message || "Gagal melakukan logout");
      setLoading(false);
    }
  }, [setLoading, setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Refresh user profile using store
  const refreshUserData = useCallback(async () => {
    if (!authUser) return;

    try {
      await loadUserProfile(authUser.id, true);
    } catch (error: any) {
      console.error("Refresh user data error:", error);
      setError(error.message || "Gagal merefresh data pengguna");
    }
  }, [authUser, loadUserProfile, setError]);

  // Get access token from current session
  const getAccessToken = useCallback(async () => {
    if (!authUser) return null;
    
    try {
      const session = await AuthService.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  }, [authUser]);

  // Refresh access token by refreshing the session
  const refreshAccessToken = useCallback(async () => {
    if (!authUser) return false;
    
    try {
      // Supabase handles token refresh automatically
      // We just need to get a fresh session
      const session = await AuthService.getSession();
      return !!session?.access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return false;
    }
  }, [authUser]);

  // Return the same interface as before for compatibility
  return {
    // Auth state from Zustand store
    user: authUser,
    userProfile: currentUser,
    accessToken: null, // No longer stored client-side
    isLoading,
    isAuthenticated,
    isFullyAuthenticated,
    error,
    
    // Additional state from store
    allUserOffices,
    
    // Actions
    login,
    logout,
    clearError,
    refreshUserData,
    getAccessToken,
    refreshAccessToken,
  };
};