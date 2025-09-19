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
  const isInitializedRef = useRef(false);
  const lastEventRef = useRef<string | null>(null); // Track last event for debugging

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

  // Enhanced debug logging function
  const debugLog = useCallback((message: string, data?: any) => {
    console.log(`🐛 [AUTH_DEBUG] ${message}`, {
      timestamp: new Date().toISOString(),
      authUser: authUser ? { id: authUser.id, email: authUser.email } : null,
      isAuthenticated,
      isFullyAuthenticated,
      currentUser: currentUser ? { id: currentUser.id } : null,
      isInitialized: isInitializedRef.current,
      lastEvent: lastEventRef.current,
      ...data
    });
  }, [authUser, isAuthenticated, isFullyAuthenticated, currentUser]);

  // Convert Supabase session user to AuthUser format
  const sessionUserToAuthUser = useCallback((sessionUser: any): AuthUser => {
    const authUser = {
      id: sessionUser.id,
      email: sessionUser.email || "",
      name:
        sessionUser.user_metadata?.full_name ||
        sessionUser.user_metadata?.name ||
        sessionUser.email?.split("@")[0] ||
        "User",
      photo:
        sessionUser.user_metadata?.avatar_url ||
        sessionUser.user_metadata?.picture ||
        sessionUser.user_metadata?.photo_url,
      role:
        sessionUser.user_metadata?.role ||
        sessionUser.app_metadata?.role ||
        "user",
    };
    
    debugLog("Session user converted to AuthUser", { 
      sessionUserId: sessionUser.id, 
      convertedUser: authUser 
    });
    
    return authUser;
  }, [debugLog]);

  // Load user profile using store actions
  const loadUserProfile = useCallback(
    async (userId: string, forceReload = false) => {
      if (!mountedRef.current) return;

      debugLog("Loading user profile requested", { 
        userId, 
        forceReload, 
        hasCurrentUser: !!currentUser,
        isDataStale: isDataStale()
      });

      // Skip if data is fresh and not forcing reload
      if (!forceReload && currentUser && !isDataStale()) {
        debugLog("User profile is fresh, skipping reload");
        return;
      }

      try {
        debugLog("Calling AuthService.getUserProfile", { userId });
        const profile = await AuthService.getUserProfile(userId);

        if (!mountedRef.current) {
          debugLog("Component unmounted during profile fetch");
          return;
        }

        debugLog("Profile fetch completed", { 
          profileCount: profile?.length || 0,
          profileData: profile ? profile.map(p => ({ id: p.id, office_id: p.office_id })) : null
        });

        if (profile && profile.length > 0) {
          debugLog("Updating store with user profile");
          setUsers(profile);
        } else {
          debugLog("No user profile found, clearing user");
          clearUser();
        }
      } catch (error: any) {
        debugLog("Error loading user profile", { error: error.message });
        if (mountedRef.current) {
          setError("Gagal memuat profil pengguna");
        }
      }
    },
    [currentUser, isDataStale, setUsers, clearUser, setError, debugLog]
  );

  // Auth state listener using store actions
  const setupAuthListener = useCallback(() => {
    if (!mountedRef.current || authListenerRef.current) return;

    debugLog("Setting up auth listener");

    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;

      lastEventRef.current = event; // Track last event
      
      debugLog("Auth state change received", {
        event,
        hasSession: !!session,
        hasSessionUser: !!session?.user,
        sessionUserId: session?.user?.id,
        previousAuthUser: authUser ? authUser.id : null
      });

      try {
        if (session?.user) {
          // Enhanced logic for different events
          let shouldProcessEvent = true;
          let shouldReloadProfile = false;
          
          switch (event) {
            case "INITIAL_SESSION":
              debugLog("Processing INITIAL_SESSION");
              shouldReloadProfile = isDataStale();
              isInitializedRef.current = true;
              break;
              
            case "SIGNED_IN":
              debugLog("Processing SIGNED_IN", {
                isInitialized: isInitializedRef.current,
                hasExistingAuthUser: !!authUser,
                existingUserId: authUser?.id,
                newUserId: session.user.id
              });
              
              // More sophisticated phantom event detection
              if (isInitializedRef.current && authUser && authUser.id === session.user.id) {
                debugLog("Detected potential phantom SIGNED_IN - checking if it's actually a token refresh");
                
                // Check if this is really just a token refresh by comparing user data
                const sessionAuthUser = sessionUserToAuthUser(session.user);
                const isUserDataSame = JSON.stringify(authUser) === JSON.stringify(sessionAuthUser);
                
                if (isUserDataSame && !isDataStale(5)) { // Less than 5 minutes old data
                  debugLog("Ignoring phantom SIGNED_IN - token refresh with same user data");
                  shouldProcessEvent = false;
                } else {
                  debugLog("Processing SIGNED_IN - user data changed or data is stale");
                  shouldReloadProfile = true;
                }
              } else {
                debugLog("Processing SIGNED_IN - new user or not initialized");
                shouldReloadProfile = true;
              }
              break;
              
            case "TOKEN_REFRESHED":
              debugLog("Processing TOKEN_REFRESHED - skipping profile reload");
              shouldReloadProfile = false;
              break;
              
            default:
              debugLog(`Processing ${event}`);
              shouldReloadProfile = false;
          }
          
          if (shouldProcessEvent) {
            // Use session.user directly from callback - more reliable than getCurrentUser()
            const sessionAuthUser = sessionUserToAuthUser(session.user);

            if (mountedRef.current) {
              debugLog("Updating auth user in store", { 
                newUser: sessionAuthUser,
                willReloadProfile: shouldReloadProfile 
              });
              
              setAuthUser(sessionAuthUser);
              setLoading(false);
              setError(null);

              // Load profile based on event and conditions
              if (shouldReloadProfile) {
                await loadUserProfile(sessionAuthUser.id, event === "SIGNED_IN");
              }
            }
          }
        } else {
          // User signed out
          debugLog("User signed out", { event });
          
          if (mountedRef.current) {
            setAuthUser(null);
            setLoading(false);
            setError(null);
            clearUser();
            isInitializedRef.current = false;

            if (event === "SIGNED_OUT") {
              debugLog("Redirecting to login");
              router.push("/login");
            }
          }
        }
      } catch (error: any) {
        debugLog("Auth state change error", { error: error.message });
        if (mountedRef.current) {
          setError("Terjadi kesalahan saat perubahan status auth");
          setLoading(false);
        }
      }
    });

    authListenerRef.current = subscription;
  }, [
    router,
    loadUserProfile,
    clearUser,
    setAuthUser,
    setLoading,
    setError,
    sessionUserToAuthUser,
    authUser,
    debugLog,
  ]);

  // Initialize auth using store actions
  useEffect(() => {
    mountedRef.current = true;

    const initAuth = async () => {
      try {
        debugLog("Initializing auth");
        setLoading(true);

        // Use AuthService.getCurrentUser() for initial check only
        const authUser = await AuthService.getCurrentUser();

        if (!mountedRef.current) return;

        debugLog("Initial auth check completed", {
          hasAuthUser: !!authUser,
          userId: authUser?.id
        });

        if (authUser) {
          setAuthUser(authUser);
          setError(null);
          await loadUserProfile(authUser.id, false);
        } else {
          setAuthUser(null);
          setError(null);
          clearUser();
        }

        // Setup listener after initial check
        if (mountedRef.current) {
          setupAuthListener();
        }
      } catch (error: any) {
        debugLog("Auth initialization error", { error: error.message });
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
      isInitializedRef.current = false;
      lastEventRef.current = null;
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
    };
  }, []); // Empty dependency array - run once

  // Auth actions using store
  const login = useCallback(
    async (provider: AuthProviderType = "google") => {
      setLoading(true);
      setError(null);

      try {
        await AuthService.initiateOAuthLogin(provider);
      } catch (error: any) {
        console.error("Login error:", error);
        setError(error.message || "Gagal melakukan login");
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

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