// src/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../../types/user.types';
import { AuthUser, AuthProvider as AuthProviderType } from '../../../types/auth.types';

interface UserState {
  // Auth session data
  authUser: AuthUser | null;
  
  // User profile data
  allUserOffices: User[];
  currentUser: User | null;
  
  // Authentication states
  isAuthenticated: boolean;
  isFullyAuthenticated: boolean;
  isLoading: boolean;
  
  // Error handling
  error: string | null;
  
  // Data freshness
  lastFetched: string | null;

  // Auth Actions
  login: (provider?: AuthProviderType) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
  
  // Session CRUD operations
  setUsers: (users: User[]) => void;
  setAuthUser: (authUser: AuthUser | null) => void;
  switchOffice: (officeId: string) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLastFetched: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Helper functions
  hasPermission: (permission: string) => boolean;
  isDataStale: (maxAgeMinutes?: number) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      authUser: null,
      allUserOffices: [],
      currentUser: null,
      isAuthenticated: false,
      isFullyAuthenticated: false,
      isLoading: false,
      error: null,
      lastFetched: null,

      // Auth Actions (these would call your actual auth service)
      login: async (provider?: AuthProviderType) => {
        set({ isLoading: true, error: null });
        try {
          // Call your auth service here
          // const authResult = await authService.login(provider);
          // set({ authUser: authResult.user, isAuthenticated: true });
          
          // After successful auth, you might want to fetch user profile
          // await get().refreshProfile();
          
          console.log('Login implementation needed');
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          // Call your auth service here
          // await authService.logout();
          
          // Clear all user data
          set({
            authUser: null,
            allUserOffices: [],
            currentUser: null,
            isAuthenticated: false,
            isFullyAuthenticated: false,
            lastFetched: null,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Logout failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      refreshProfile: async () => {
        const authUser = get().authUser;
        if (!authUser) return;

        set({ isLoading: true, error: null });
        try {
          // Call your user profile service here
          // const userProfile = await userService.getProfile(authUser.id);
          // get().setUsers([userProfile]); // or multiple offices
          
          console.log('Profile refresh implementation needed');
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Profile refresh failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Session CRUD Actions
      setAuthUser: (authUser: AuthUser | null) => {
        set({ 
          authUser,
          isAuthenticated: !!authUser,
        });
      },

      setUsers: (users: User[]) => {
        const currentUser = users.length > 0 ? users[0] : null;
        set({
          allUserOffices: users,
          currentUser,
          isFullyAuthenticated: !!currentUser && get().isAuthenticated,
          lastFetched: new Date().toISOString(),
        });
      },

      switchOffice: (officeId: string) => {
        const users = get().allUserOffices;
        const selectedUser = users.find(user => user.office_id === officeId);
        
        if (selectedUser) {
          set({ currentUser: selectedUser });
        }
      },

      updateCurrentUser: (updates: Partial<User>) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updates };
        const allUsers = get().allUserOffices;
        const updatedAllUsers = allUsers.map(user => 
          user.office_id === updatedUser.office_id ? updatedUser : user
        );
        
        set({
          allUserOffices: updatedAllUsers,
          currentUser: updatedUser,
          lastFetched: new Date().toISOString(),
        });
      },

      clearUser: () => {
        set({
          authUser: null,
          allUserOffices: [],
          currentUser: null,
          isAuthenticated: false,
          isFullyAuthenticated: false,
          lastFetched: null,
          error: null,
        });
      },

      setLastFetched: () => {
        set({ lastFetched: new Date().toISOString() });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Helper functions
      hasPermission: (permission: string) => {
        const user = get().currentUser;
        if (!user || !user.role_permissions) return false;
        return user.role_permissions.includes(permission);
      },

      isDataStale: (maxAgeMinutes: number = 30) => {
        const lastFetched = get().lastFetched;
        if (!lastFetched) return true;
        
        const lastFetchedTime = new Date(lastFetched).getTime();
        const now = new Date().getTime();
        const diffMinutes = (now - lastFetchedTime) / (1000 * 60);
        
        return diffMinutes > maxAgeMinutes;
      },
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: (name: string) => {
          if (typeof window === 'undefined') return null;
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name: string, value: any) => {
          if (typeof window === 'undefined') return;
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          if (typeof window === 'undefined') return;
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        authUser: state.authUser,
        allUserOffices: state.allUserOffices,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        isFullyAuthenticated: state.isFullyAuthenticated,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Selector hooks - equivalent to AuthProvider helper hooks
export const useAuthUser = () => useUserStore((state) => state.authUser);
export const useUserProfile = () => useUserStore((state) => state.currentUser);
export const useUser = () => useUserStore((state) => state.currentUser);
export const useAllUserOffices = () => useUserStore((state) => state.allUserOffices);

export const useAuthStatus = () => useUserStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isFullyAuthenticated: state.isFullyAuthenticated,
  isLoading: state.isLoading,
}));

export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useAuthError = () => useUserStore((state) => state.error);

// Auth actions hooks
export const useAuthActions = () => useUserStore((state) => ({
  login: state.login,
  logout: state.logout,
  clearError: state.clearError,
  refreshProfile: state.refreshProfile,
}));

// Helper functions
export const getUserOfficeInfo = () => {
  const user = useUserStore.getState().currentUser;
  if (!user) return null;
  
  return {
    officeId: user.office_id,
    officeName: user.office_name,
    officeType: user.office_type,
    officeLocation: user.office_location,
  };
};

export const getUserRole = () => {
  const user = useUserStore.getState().currentUser;
  if (!user) return null;
  
  return {
    roleId: user.role_id,
    roleName: user.role_name,
    roleDescription: user.role_description,
    rolePermissions: user.role_permissions,
  };
};

export const hasPermission = (permission: string) => {
  return useUserStore.getState().hasPermission(permission);
};