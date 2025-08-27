// src/hooks/useDashboardInit.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { useUserStore } from '@/store/userStore';

interface DashboardInitState {
  isInitializing: boolean;
  isReady: boolean;
  error: string | null;
}

export const useDashboardInit = () => {
  const router = useRouter();
  const userStore = useUserStore();
  
  const [state, setState] = useState<DashboardInitState>({
    isInitializing: true,
    isReady: false,
    error: null,
  });

  const initializeDashboard = useCallback(async () => {
    try {
      console.log('🚀 Initializing dashboard...');
      
      setState(prev => ({ ...prev, isInitializing: true, error: null }));

      // Check authentication status
      const authStatus = await AuthService.checkAuthStatus();
      console.log('🔐 Auth status:', { 
        isAuthenticated: authStatus.isAuthenticated, 
        hasUser: !!authStatus.user 
      });

      if (!authStatus.isAuthenticated || !authStatus.user) {
        console.log('❌ User not authenticated, redirecting to login...');
        router.replace('/login');
        return;
      }

      // Check if user profile is already loaded and not stale
      if (userStore.isAuthenticated && 
          userStore.currentUser && 
          !userStore.isDataStale(30)) {
        console.log('✅ User profile already loaded and fresh');
        setState({
          isInitializing: false,
          isReady: true,
          error: null,
        });
        return;
      }

      // Load user profile to store
      console.log('📥 Loading user profile to store...');
      await userStore.fetchUserProfile(authStatus.user.id);

      // Check if profile was loaded successfully
      if (!userStore.currentUser) {
        throw new Error('Failed to load user profile');
      }

      console.log('✅ Dashboard initialization complete:', {
        officeCount: userStore.allUserOffices.length,
        currentOffice: userStore.currentUser.office_name
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
  }, [router, userStore]);

  // Initialize once on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (mounted) {
        await initializeDashboard();
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - initialize only once

  // Retry function
  const retry = useCallback(async () => {
    await initializeDashboard();
  }, [initializeDashboard]);

  return {
    isInitializing: state.isInitializing || userStore.isLoading,
    isReady: state.isReady && !userStore.isLoading,
    error: state.error || userStore.error,
    user: userStore.currentUser,
    allOffices: userStore.allUserOffices,
    switchOffice: userStore.switchOffice,
    retry,
  };
};