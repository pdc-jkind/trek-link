// src/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user.types';

interface UserState {
  // State
  allUserOffices: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  lastFetched: string | null;

  // Actions - Session CRUD operations only
  setUsers: (users: User[]) => void;
  switchOffice: (officeId: string) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLastFetched: () => void;
  
  // Helper functions
  hasPermission: (permission: string) => boolean;
  isDataStale: (maxAgeMinutes?: number) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      allUserOffices: [],
      currentUser: null,
      isAuthenticated: false,
      lastFetched: null,

      // Session CRUD Actions
      setUsers: (users: User[]) => {
        const currentUser = users.length > 0 ? users[0] : null;
        set({
          allUserOffices: users,
          currentUser,
          isAuthenticated: !!currentUser,
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
          allUserOffices: [],
          currentUser: null,
          isAuthenticated: false,
          lastFetched: null,
        });
      },

      setLastFetched: () => {
        set({ lastFetched: new Date().toISOString() });
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
        allUserOffices: state.allUserOffices,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Selector hooks
export const useUser = () => useUserStore((state) => state.currentUser);
export const useAllUserOffices = () => useUserStore((state) => state.allUserOffices);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);

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