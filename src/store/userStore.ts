// src/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user.types';
import { UserService } from '../services/user.service';

interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastFetched: string | null; // untuk cache management
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  fetchUserProfile: (userId: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Helper actions
  refreshUserProfile: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isDataStale: (maxAgeMinutes?: number) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastFetched: null,
      error: null,

      // Actions
      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          lastFetched: new Date().toISOString(),
          error: null,
        });
      },

      fetchUserProfile: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const userProfile = await UserService.getUserProfile(userId);
          
          if (userProfile) {
            set({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
              lastFetched: new Date().toISOString(),
              error: null,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Gagal mengambil profil user',
            });
          }
        } catch (error: any) {
          console.error('Error fetching user profile:', error);
          set({
            isLoading: false,
            error: error.message || 'Gagal mengambil profil user',
          });
        }
      },

      updateUser: async (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) {
          set({ error: 'No user to update' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const updatedUser = await UserService.updateUserProfile(currentUser.id, updates);
          
          if (updatedUser) {
            set({
              user: updatedUser,
              isLoading: false,
              lastFetched: new Date().toISOString(),
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: 'Gagal mengupdate profil user',
            });
          }
        } catch (error: any) {
          console.error('Error updating user profile:', error);
          set({
            isLoading: false,
            error: error.message || 'Gagal mengupdate profil user',
          });
        }
      },

      refreshUserProfile: async () => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        await get().fetchUserProfile(currentUser.id);
      },

      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          lastFetched: null,
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Helper functions
      hasPermission: (permission: string) => {
        const user = get().user;
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
      name: 'user-storage', // key untuk sessionStorage
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
      // Hanya persist data yang diperlukan, tidak persist isLoading
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Selector hooks untuk kemudahan penggunaan
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserError = () => useUserStore((state) => state.error);

// Helper functions
export const getUserOfficeInfo = () => {
  const user = useUserStore.getState().user;
  if (!user) return null;
  
  return {
    officeId: user.office_id,
    officeName: user.office_name,
    officeType: user.office_type,
    officeLocation: user.office_location,
  };
};

export const getUserRole = () => {
  const user = useUserStore.getState().user;
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

// Auto-refresh handler
export const setupUserAutoRefresh = () => {
  const store = useUserStore.getState();
  
  // Setup interval untuk auto-refresh jika data stale
  const interval = setInterval(async () => {
    if (store.isAuthenticated && store.isDataStale(30)) { // 30 minutes
      console.log('User data is stale, refreshing...');
      await store.refreshUserProfile();
    }
  }, 5 * 60 * 1000); // Check every 5 minutes

  return () => clearInterval(interval);
};