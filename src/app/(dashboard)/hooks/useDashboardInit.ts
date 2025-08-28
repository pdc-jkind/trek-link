// src/app/(dashboard)/hooks/useDashboardInit.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, getUserOfficeInfo, getUserRole } from '@/store/user.store';

interface DashboardInitState {
  isInitializing: boolean;
  isReady: boolean;
  error: string | null;
}

interface OfficeOption {
  id: string;
  name: string;
  type?: string;
  location?: string;
}

export const useDashboardInit = () => {
  const router = useRouter();
  
  // Get user store state and actions
  const {
    currentUser,
    allUserOffices,
    isAuthenticated,
    lastFetched,
    switchOffice,
    isDataStale,
    hasPermission,
  } = useUserStore();

  const [state, setState] = useState<DashboardInitState>({
    isInitializing: true,
    isReady: false,
    error: null,
  });

  // Initialize dashboard by checking session data
  const initializeDashboard = useCallback(() => {
    console.log('🚀 Initializing dashboard from session...');
    
    setState(prev => ({ ...prev, isInitializing: true, error: null }));

    try {
      // Check if user is authenticated via session
      if (!isAuthenticated) {
        console.log('❌ User not authenticated in session, redirecting to login...');
        router.replace('/login');
        return;
      }

      // Check if current user exists in session
      if (!currentUser) {
        console.log('❌ No current user found in session, redirecting to login...');
        router.replace('/login');
        return;
      }

      // Check if user offices data exists
      if (!allUserOffices || allUserOffices.length === 0) {
        console.log('⚠️ No user offices found in session');
        setState({
          isInitializing: false,
          isReady: false,
          error: 'Data kantor tidak ditemukan. Silakan login ulang.',
        });
        return;
      }

      // Check if data is stale (older than 30 minutes)
      if (isDataStale(30)) {
        console.log('⚠️ Session data is stale, might need refresh');
        // Don't block dashboard, but log warning
        console.warn('Session data is older than 30 minutes, consider refreshing');
      }

      console.log('✅ Dashboard initialization complete from session:', {
        userId: currentUser.id,
        userEmail: currentUser.email,
        officeCount: allUserOffices.length,
        currentOffice: currentUser.office_name,
        lastFetched,
      });

      setState({
        isInitializing: false,
        isReady: true,
        error: null,
      });

    } catch (error: any) {
      console.error('❌ Dashboard initialization error:', error);
      setState({
        isInitializing: false,
        isReady: false,
        error: error.message || 'Terjadi kesalahan saat menginisialisasi dashboard',
      });
    }
  }, [isAuthenticated, currentUser, allUserOffices, isDataStale, lastFetched, router]);

  // Initialize on mount and when authentication state changes
  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  // Handle office switching
  const handleOfficeSwitch = useCallback((officeId: string) => {
    try {
      console.log('🔄 Switching office to:', officeId);
      switchOffice(officeId);
      
      // Optionally redirect to dashboard home after office switch
      // router.push('/dashboard');
      
    } catch (error: any) {
      console.error('❌ Error switching office:', error);
      setState(prev => ({
        ...prev,
        error: 'Gagal mengganti kantor',
      }));
    }
  }, [switchOffice]);

  // Get available offices in the format expected by UI components
  const availableOffices = useMemo((): OfficeOption[] => {
    return allUserOffices.map(user => ({
      id: user.office_id,
      name: user.office_name,
      type: user.office_type,
      location: user.office_location,
    }));
  }, [allUserOffices]);

  // Get current selected office
  const selectedOffice = useMemo((): OfficeOption | null => {
    if (!currentUser) return null;
    
    return {
      id: currentUser.office_id,
      name: currentUser.office_name,
      type: currentUser.office_type,
      location: currentUser.office_location,
    };
  }, [currentUser]);

  // Get user info for UI
  const userInfo = useMemo(() => {
    if (!currentUser) return null;
    
    return {
      id: currentUser.id,
      name: currentUser.email.split('@')[0], // Extract name from email if no separate name field
      email: currentUser.email,
      role: {
        id: currentUser.role_id,
        name: currentUser.role_name,
        description: currentUser.role_description,
        permissions: currentUser.role_permissions,
      },
      office: {
        id: currentUser.office_id,
        name: currentUser.office_name,
        type: currentUser.office_type,
        location: currentUser.office_location,
      },
    };
  }, [currentUser]);

  // Check if data needs refresh (but don't force it)
  const isDataStaleWarning = useMemo(() => {
    return isDataStale(30);
  }, [isDataStale]);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Retry initialization
  const retry = useCallback(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  // Force redirect to login (useful for error scenarios)
  const redirectToLogin = useCallback(() => {
    console.log('🔄 Forcing redirect to login...');
    router.replace('/login');
  }, [router]);

  return {
    // Loading states
    isInitializing: state.isInitializing,
    isReady: state.isReady,
    
    // Error state
    error: state.error,
    
    // User data from session
    user: userInfo,
    currentUser, // Raw current user object
    
    // Office data
    availableOffices,
    selectedOffice,
    
    // Data freshness
    isDataStale: isDataStaleWarning,
    lastFetched,
    
    // Actions
    switchOffice: handleOfficeSwitch,
    hasPermission,
    clearError,
    retry,
    redirectToLogin,
    
    // Helper functions (re-exported from store)
    getUserOfficeInfo,
    getUserRole,
  };
};