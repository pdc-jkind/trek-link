// src/app/(dashboard)/users/useUser.ts

import { useState, useEffect, useCallback } from 'react';
import UserService from './user.service';
import type { User, UserResponse } from '@/types/user.types';
import type { Office, Role, UpdateOfficeUserRequest, CreateOfficeUserRequest } from './types';

interface UseUserState {
  users: User[];
  offices: Office[];
  roles: Role[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

interface UseUserActions {
  refreshUsers: () => Promise<void>;
  refreshMasterData: () => Promise<void>;
  searchUsers: (searchTerm: string) => Promise<User[]>;
  updateUserOfficeAssignment: (userId: string, data: UpdateOfficeUserRequest) => Promise<boolean>;
  createOfficeUserAssignment: (data: CreateOfficeUserRequest) => Promise<boolean>;
  deleteUserOfficeAssignment: (userId: string) => Promise<boolean>;
  getUserById: (userId: string) => Promise<User | null>;
  checkUserPermission: (userId: string, permission: string) => Promise<boolean>;
}

export type UseUserReturn = UseUserState & UseUserActions;

export const useUser = (): UseUserReturn => {
  const [state, setState] = useState<UseUserState>({
    users: [],
    offices: [],
    roles: [],
    loading: true,
    error: null,
    refreshing: false,
  });

  // Helper function to update state
  const updateState = useCallback((updates: Partial<UseUserState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Helper function to handle errors
  const handleError = useCallback((error: any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    const errorMessage = error?.message || defaultMessage;
    updateState({ error: errorMessage });
    return false;
  }, [updateState]);

  // Fetch all users
  const refreshUsers = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const { data, error } = await UserService.getAllUsers();
      
      if (error) {
        handleError(error, 'Failed to fetch users');
        return;
      }

      updateState({ users: data || [], loading: false });
    } catch (error) {
      handleError(error, 'Failed to fetch users');
    } finally {
      updateState({ loading: false });
    }
  }, [updateState, handleError]);

  // Fetch master data (offices and roles)
  const refreshMasterData = useCallback(async () => {
    try {
      updateState({ refreshing: true });
      
      const [officesResult, rolesResult] = await Promise.all([
        UserService.getAllOffices(),
        UserService.getAllRoles()
      ]);

      if (officesResult.error) {
        handleError(officesResult.error, 'Failed to fetch offices');
        return;
      }

      if (rolesResult.error) {
        handleError(rolesResult.error, 'Failed to fetch roles');
        return;
      }

      updateState({
        offices: officesResult.data || [],
        roles: rolesResult.data || [],
        refreshing: false
      });
    } catch (error) {
      handleError(error, 'Failed to fetch master data');
    } finally {
      updateState({ refreshing: false });
    }
  }, [updateState, handleError]);

  // Search users
  const searchUsers = useCallback(async (searchTerm: string): Promise<User[]> => {
    try {
      if (!searchTerm.trim()) {
        return state.users;
      }

      const { data, error } = await UserService.searchUsers(searchTerm);
      
      if (error) {
        handleError(error, 'Failed to search users');
        return [];
      }

      return data || [];
    } catch (error) {
      handleError(error, 'Failed to search users');
      return [];
    }
  }, [state.users, handleError]);

  // Get user by ID
  const getUserById = useCallback(async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await UserService.getUserById(userId);
      
      if (error) {
        handleError(error, 'Failed to fetch user');
        return null;
      }

      return data;
    } catch (error) {
      handleError(error, 'Failed to fetch user');
      return null;
    }
  }, [handleError]);

  // Update office assignment
  const updateUserOfficeAssignment = useCallback(async (
    userId: string, 
    updateData: UpdateOfficeUserRequest
  ): Promise<boolean> => {
    try {
      updateState({ refreshing: true, error: null });
      
      const { data, error } = await UserService.updateOfficeUser(userId, updateData);
      
      if (error) {
        handleError(error, 'Failed to update office assignment');
        return false;
      }

      // Refresh users after successful update
      await refreshUsers();
      updateState({ refreshing: false });
      return true;
    } catch (error) {
      handleError(error, 'Failed to update office assignment');
      return false;
    } finally {
      updateState({ refreshing: false });
    }
  }, [updateState, handleError, refreshUsers]);

  // Create office user assignment
  const createOfficeUserAssignment = useCallback(async (
    data: CreateOfficeUserRequest
  ): Promise<boolean> => {
    try {
      updateState({ refreshing: true, error: null });
      
      const { data: result, error } = await UserService.createOfficeUser(data);
      
      if (error) {
        handleError(error, 'Failed to create office assignment');
        return false;
      }

      // Refresh users after successful creation
      await refreshUsers();
      updateState({ refreshing: false });
      return true;
    } catch (error) {
      handleError(error, 'Failed to create office assignment');
      return false;
    } finally {
      updateState({ refreshing: false });
    }
  }, [updateState, handleError, refreshUsers]);

  // Delete office user assignment
  const deleteUserOfficeAssignment = useCallback(async (userId: string): Promise<boolean> => {
    try {
      updateState({ refreshing: true, error: null });
      
      const { data, error } = await UserService.deleteOfficeUser(userId);
      
      if (error) {
        handleError(error, 'Failed to delete office assignment');
        return false;
      }

      // Refresh users after successful deletion
      await refreshUsers();
      updateState({ refreshing: false });
      return true;
    } catch (error) {
      handleError(error, 'Failed to delete office assignment');
      return false;
    } finally {
      updateState({ refreshing: false });
    }
  }, [updateState, handleError, refreshUsers]);

  // Check user permission
  const checkUserPermission = useCallback(async (
    userId: string, 
    permission: string
  ): Promise<boolean> => {
    try {
      const { hasPermission, error } = await UserService.userHasPermission(userId, permission);
      
      if (error) {
        handleError(error, 'Failed to check user permission');
        return false;
      }

      return hasPermission;
    } catch (error) {
      handleError(error, 'Failed to check user permission');
      return false;
    }
  }, [handleError]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        refreshUsers(),
        refreshMasterData()
      ]);
    };

    initializeData();
  }, [refreshUsers, refreshMasterData]);

  return {
    // State
    users: state.users,
    offices: state.offices,
    roles: state.roles,
    loading: state.loading,
    error: state.error,
    refreshing: state.refreshing,

    // Actions
    refreshUsers,
    refreshMasterData,
    searchUsers,
    updateUserOfficeAssignment,
    createOfficeUserAssignment,
    deleteUserOfficeAssignment,
    getUserById,
    checkUserPermission,
  };
};

export default useUser;