// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/app/(frontend)/services/auth.service";
import { useUserStore } from "@/app/(frontend)/store/user.store";
import type {
  AuthUser,
  AuthProvider as AuthProviderType,
} from "@/types/auth.types";

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
    isDataStale,
    setLastFetched,
  } = useUserStore();

  const router = useRouter();

  // Refs to prevent multiple operations
  const initializingRef = useRef(false);
  const loadingProfileRef = useRef(false);
  const authListenerRef = useRef<{ unsubscribe: () => void } | null>(null);
  const mountedRef = useRef(true);

  // Load user profile after authentication
  const loadUserProfile = useCallback(
    async (userId: string, forceReload = false) => {
      if (!mountedRef.current || loadingProfileRef.current) {
        return;
      }

      // Check if we need to load profile
      if (!forceReload && currentUser && !isDataStale()) {
        console.log("Profile is fresh, skipping reload");
        return;
      }

      loadingProfileRef.current = true;

      try {
        console.log("Loading profile for:", userId);

        const userProfiles = await AuthService.getUserProfile(userId);

        if (!mountedRef.current) return;

        if (userProfiles && userProfiles.length > 0) {
          console.log("Profile loaded, updating store");
          setUsers(userProfiles);
          setLastFetched();
        } else {
          console.warn("No user profiles found");
          clearUser();
        }
      } catch (error: any) {
        console.error("Error loading user profile:", error);
      } finally {
        if (mountedRef.current) {
          loadingProfileRef.current = false;
        }
      }
    },
    [currentUser, isDataStale, setUsers, clearUser, setLastFetched]
  );

  // Setup auth state listener
  const setupAuthListener = useCallback(() => {
    if (!mountedRef.current || authListenerRef.current) {
      return;
    }

    console.log("Setting up auth listener");

    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;

      console.log(
        new Date().toISOString(),
        "Auth state changed:",
        event,
        !!session?.user
      );

      try {
        if (session?.user) {
          const authUser = await AuthService.getCurrentUser();

          if (authUser && mountedRef.current) {
            setAuthState({
              user: authUser,
              isLoading: false,
              error: null,
            });

            // Load profile based on event type
            if (event === "SIGNED_IN") {
              await loadUserProfile(authUser.id, true);
            } else if (event === "INITIAL_SESSION") {
              const storeState = useUserStore.getState();
              if (!storeState.currentUser || storeState.isDataStale()) {
                await loadUserProfile(authUser.id);
              }
            }
          }
        } else {
          // User signed out
          if (mountedRef.current) {
            setAuthState({
              user: null,
              isLoading: false,
              error: null,
            });
            clearUser();

            if (event === "SIGNED_OUT") {
              setTimeout(() => {
                if (mountedRef.current) {
                  router.push("/login");
                }
              }, 100);
            }
          }
        }
      } catch (error: any) {
        console.error("Auth state change error:", error);
        if (mountedRef.current) {
          setAuthState((prev) => ({
            ...prev,
            error: "Terjadi kesalahan saat perubahan status auth",
            isLoading: false,
          }));
        }
      }
    });

    authListenerRef.current = subscription;
  }, [router, loadUserProfile, clearUser]);

  // Initialize auth state
  useEffect(() => {
    mountedRef.current = true;

    const initAuth = async () => {
      if (initializingRef.current) return;

      initializingRef.current = true;

      try {
        console.log("Initializing auth...");

        const authUser = await AuthService.getCurrentUser();

        if (!mountedRef.current) return;

        if (authUser) {
          console.log("User authenticated:", authUser.id);
          setAuthState({
            user: authUser,
            isLoading: false,
            error: null,
          });

          // Load profile if needed
          if (!currentUser || isDataStale()) {
            await loadUserProfile(authUser.id);
          }
        } else {
          console.log("No authenticated user");
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
          });
          clearUser();
        }

        // Setup listener after initial auth check
        if (mountedRef.current) {
          setupAuthListener();
        }
      } catch (error: any) {
        console.error("Auth initialization error:", error);
        if (mountedRef.current) {
          setAuthState({
            user: null,
            isLoading: false,
            error: "Gagal menginisialisasi autentikasi",
          });
        }
      } finally {
        initializingRef.current = false;
      }
    };

    initAuth();

    return () => {
      mountedRef.current = false;
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
      // Reset refs on cleanup
      initializingRef.current = false;
    };
  }, []); // No dependencies

  // Login function
  const login = useCallback(async (provider: AuthProviderType = "google") => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await AuthService.initiateOAuthLogin(provider);
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthState((prev) => ({
        ...prev,
        error: error.message || "Gagal melakukan login",
        isLoading: false,
      }));
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await AuthService.logout();
    } catch (error: any) {
      console.error("Logout error:", error);
      setAuthState((prev) => ({
        ...prev,
        error: error.message || "Gagal melakukan logout",
        isLoading: false,
      }));
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  // Refresh profile function
  const refreshProfile = useCallback(async () => {
    if (!authState.user) return;

    try {
      await loadUserProfile(authState.user.id, true);
    } catch (error: any) {
      console.error("Refresh profile error:", error);
      setAuthState((prev) => ({
        ...prev,
        error: error.message || "Gagal merefresh profil",
      }));
    }
  }, [authState.user, loadUserProfile]);

  const isFullyAuthenticated = !!authState.user && userStoreAuthenticated;

  return {
    user: authState.user,
    userProfile: currentUser,
    isLoading: authState.isLoading,
    isAuthenticated: !!authState.user,
    isFullyAuthenticated,
    error: authState.error,
    login,
    logout,
    clearError,
    refreshProfile,
  };
};
