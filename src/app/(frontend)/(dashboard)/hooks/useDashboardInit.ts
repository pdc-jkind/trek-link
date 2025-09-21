// src/app/(dashboard)/hooks/useDashboardInit.ts
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, getUserOfficeInfo, getUserRole } from '@/app/(frontend)/store/user.store';

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

  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simple initialization effect
  useEffect(() => {
    mountedRef.current = true;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a timeout for initialization
    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      console.log('Dashboard init check:', {
        isAuthenticated,
        hasCurrentUser: !!currentUser,
        hasOffices: allUserOffices?.length > 0,
        userId: currentUser?.id,
        officeCount: allUserOffices?.length,
      });

      // Check if we have all required data
      if (isAuthenticated && currentUser && allUserOffices?.length > 0) {
        console.log('Dashboard ready - all data available');
        setState({
          isInitializing: false,
          isReady: true,
          error: null,
        });
      } else if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        router.replace('/login');
      } else {
        console.log('Waiting for data...', {
          needsUser: !currentUser,
          needsOffices: !allUserOffices?.length,
        });
        // Keep initializing state - data might still be loading
        setState(prev => ({
          ...prev,
          isInitializing: true,
          error: null,
        }));
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, currentUser?.id, allUserOffices?.length, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle office switching
  const handleOfficeSwitch = useCallback((officeId: string) => {
    try {
      console.log('Switching office to:', officeId);
      switchOffice(officeId);
    } catch (error: any) {
      console.error('Error switching office:', error);
      setState(prev => ({
        ...prev,
        error: 'Gagal mengganti kantor',
      }));
    }
  }, [switchOffice]);

  // Get available offices
  const availableOffices = useMemo((): OfficeOption[] => {
    if (!allUserOffices) return [];
    
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

  // Get user info
  const userInfo = useMemo(() => {
    if (!currentUser) return null;
    
    return {
      id: currentUser.id,
      name: currentUser.email.split('@')[0],
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

  // Check if data is stale
  const isDataStaleWarning = useMemo(() => {
    return isDataStale(30);
  }, [isDataStale]);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Retry initialization
  const retry = useCallback(() => {
    console.log('Manual retry triggered');
    setState({
      isInitializing: true,
      isReady: false,
      error: null,
    });
  }, []);

  // Force redirect to login
  const redirectToLogin = useCallback(() => {
    console.log('Forcing redirect to login');
    router.replace('/login');
  }, [router]);

  return {
    // Loading states
    isInitializing: state.isInitializing,
    isReady: state.isReady,
    
    // Error state
    error: state.error,
    
    // User data
    user: userInfo,
    currentUser,
    
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
    
    // Helper functions
    getUserOfficeInfo,
    getUserRole,
  };
};