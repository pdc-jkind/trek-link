// src/app/(dashboard)/users/useUser.ts

import { useState, useEffect, useCallback } from "react";
import UserService from "./user.service";
import type { User } from "@/types/user.types";
import type {
  Office,
  Role,
  UpdateOfficeUserRequest,
  CreateOfficeUserRequest,
} from "./user.types";

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
  updateUserOfficeAssignment: (
    recordId: string,
    data: UpdateOfficeUserRequest
  ) => Promise<boolean>;
  createOfficeUserAssignment: (
    data: CreateOfficeUserRequest
  ) => Promise<boolean>;
  deleteUserOfficeAssignment: (recordId: string) => Promise<boolean>;
  deleteAllUserOfficeAssignments: (userId: string) => Promise<boolean>;
  getUserById: (userId: string) => Promise<User | null>;
  checkUserPermission: (userId: string, permission: string) => Promise<boolean>;
  bulkUpdateUserAssignments: (
    userId: string,
    assignments: Array<{ office_id: string; role_id: string }>
  ) => Promise<boolean>;
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
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Enhanced error handling helper
  const handleError = useCallback(
    (error: any, defaultMessage: string, showAlert: boolean = false) => {
      console.error(defaultMessage, error);

      // Enhanced error message extraction
      let errorMessage = defaultMessage;
      if (error?.message) {
        errorMessage = `${defaultMessage}: ${error.message}`;
      } else if (error?.details) {
        errorMessage = `${defaultMessage}: ${error.details}`;
      } else if (error?.hint) {
        errorMessage = `${defaultMessage}: ${error.hint}`;
      } else if (typeof error === "string") {
        errorMessage = `${defaultMessage}: ${error}`;
      }

      updateState({ error: errorMessage });

      if (showAlert) {
        alert(errorMessage);
      }

      return false;
    },
    [updateState]
  );

  // Fetch all users
  const refreshUsers = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const { data, error } = await UserService.getAllUsers();

      if (error) {
        handleError(error, "Failed to fetch users");
        return;
      }

      updateState({ users: data || [], loading: false });
    } catch (error) {
      handleError(error, "Failed to fetch users");
    } finally {
      updateState({ loading: false });
    }
  }, [updateState, handleError]);

  // Fetch master data (offices and roles)
  const refreshMasterData = useCallback(async () => {
    try {
      updateState({ refreshing: true, error: null });

      const [officesResult, rolesResult] = await Promise.all([
        UserService.getAllOffices(),
        UserService.getAllRoles(),
      ]);

      if (officesResult.error) {
        handleError(officesResult.error, "Failed to fetch offices");
        return;
      }

      if (rolesResult.error) {
        handleError(rolesResult.error, "Failed to fetch roles");
        return;
      }

      updateState({
        offices: officesResult.data || [],
        roles: rolesResult.data || [],
        refreshing: false,
      });
    } catch (error) {
      handleError(error, "Failed to fetch master data");
    } finally {
      updateState({ refreshing: false });
    }
  }, [updateState, handleError]);

  // Search users
  const searchUsers = useCallback(
    async (searchTerm: string): Promise<User[]> => {
      try {
        if (!searchTerm.trim()) {
          return state.users;
        }

        const { data, error } = await UserService.searchUsers(searchTerm);

        if (error) {
          handleError(error, "Failed to search users");
          return [];
        }

        return data || [];
      } catch (error) {
        handleError(error, "Failed to search users");
        return [];
      }
    },
    [state.users, handleError]
  );

  // Get user by ID
  const getUserById = useCallback(
    async (userId: string): Promise<User | null> => {
      try {
        if (!userId) {
          console.warn("getUserById called with empty userId");
          return null;
        }

        const { data, error } = await UserService.getUserById(userId);

        if (error) {
          handleError(error, "Failed to fetch user");
          return null;
        }

        return data;
      } catch (error) {
        handleError(error, "Failed to fetch user");
        return null;
      }
    },
    [handleError]
  );

  // Update office assignment - now uses record ID
  const updateUserOfficeAssignment = useCallback(
    async (
      recordId: string,
      updateData: UpdateOfficeUserRequest
    ): Promise<boolean> => {
      try {
        if (!recordId) {
          handleError(
            new Error("Record ID is required"),
            "Failed to update office assignment",
            true
          );
          return false;
        }

        updateState({ refreshing: true, error: null });

        const { data, error } = await UserService.updateOfficeUser(
          recordId,
          updateData
        );

        if (error) {
          handleError(error, "Failed to update office assignment", true);
          return false;
        }

        // Refresh users after successful update
        await refreshUsers();
        updateState({ refreshing: false });
        return true;
      } catch (error) {
        handleError(error, "Failed to update office assignment", true);
        return false;
      } finally {
        updateState({ refreshing: false });
      }
    },
    [updateState, handleError, refreshUsers]
  );

  // Create office user assignment - Enhanced validation
  const createOfficeUserAssignment = useCallback(
    async (data: CreateOfficeUserRequest): Promise<boolean> => {
      try {
        // Validate required fields
        if (!data.user_id || !data.office_id || !data.role_id) {
          handleError(
            new Error("User ID, Office ID, and Role ID are required"),
            "Failed to create office assignment",
            true
          );
          return false;
        }

        updateState({ refreshing: true, error: null });

        const { data: result, error } = await UserService.createOfficeUser(
          data
        );

        if (error) {
          handleError(error, "Failed to create office assignment", true);
          return false;
        }

        // Refresh users after successful creation
        await refreshUsers();
        updateState({ refreshing: false });
        return true;
      } catch (error) {
        handleError(error, "Failed to create office assignment", true);
        return false;
      } finally {
        updateState({ refreshing: false });
      }
    },
    [updateState, handleError, refreshUsers]
  );

  // Delete single office user assignment - now uses record ID
  const deleteUserOfficeAssignment = useCallback(
    async (recordId: string): Promise<boolean> => {
      try {
        if (!recordId) {
          handleError(
            new Error("Record ID is required"),
            "Failed to delete office assignment",
            true
          );
          return false;
        }

        updateState({ refreshing: true, error: null });

        const { data, error } = await UserService.deleteOfficeUser(recordId);

        if (error) {
          handleError(error, "Failed to delete office assignment", true);
          return false;
        }

        // Refresh users after successful deletion
        await refreshUsers();
        updateState({ refreshing: false });
        return true;
      } catch (error) {
        handleError(error, "Failed to delete office assignment", true);
        return false;
      } finally {
        updateState({ refreshing: false });
      }
    },
    [updateState, handleError, refreshUsers]
  );

  // Delete all office assignments for a user
  const deleteAllUserOfficeAssignments = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        if (!userId) {
          handleError(
            new Error("User ID is required"),
            "Failed to delete user assignments",
            true
          );
          return false;
        }

        updateState({ refreshing: true, error: null });

        const { data, error } =
          await UserService.deleteAllUserOfficeAssignments(userId);

        if (error) {
          handleError(
            error,
            "Failed to delete all user office assignments",
            true
          );
          return false;
        }

        // Refresh users after successful deletion
        await refreshUsers();
        updateState({ refreshing: false });
        return true;
      } catch (error) {
        handleError(
          error,
          "Failed to delete all user office assignments",
          true
        );
        return false;
      } finally {
        updateState({ refreshing: false });
      }
    },
    [updateState, handleError, refreshUsers]
  );

  // Bulk update user assignments (delete all and recreate) - Enhanced with better error handling
  const bulkUpdateUserAssignments = useCallback(
    async (
      userId: string,
      assignments: Array<{ office_id: string; role_id: string }>
    ): Promise<boolean> => {
      try {
        if (!userId) {
          handleError(
            new Error("User ID is required"),
            "Failed to update assignments",
            true
          );
          return false;
        }

        if (!assignments || assignments.length === 0) {
          handleError(
            new Error("At least one assignment is required"),
            "Failed to update assignments",
            true
          );
          return false;
        }

        // Validate assignments
        const invalidAssignments = assignments.filter(
          (a) => !a.office_id || !a.role_id
        );
        if (invalidAssignments.length > 0) {
          handleError(
            new Error("All assignments must have valid office_id and role_id"),
            "Failed to update assignments",
            true
          );
          return false;
        }

        updateState({ refreshing: true, error: null });

        // First, delete all existing assignments for this user (only if user has existing assignments)
        const existingAssignments =
          await UserService.getAllOfficeAssignmentsByUserId(userId);

        if (existingAssignments.error) {
          console.warn(
            "Could not fetch existing assignments, proceeding with creation only:",
            existingAssignments.error
          );
        } else if (
          existingAssignments.data &&
          existingAssignments.data.length > 0
        ) {
          // Only delete if user has existing assignments
          const { error: deleteError } =
            await UserService.deleteAllUserOfficeAssignments(userId);

          if (deleteError) {
            handleError(
              deleteError,
              "Failed to delete existing assignments",
              true
            );
            return false;
          }
        }

        // Create new assignments with enhanced error handling
        const creationResults = await Promise.allSettled(
          assignments.map((assignment) =>
            UserService.createOfficeUser({
              user_id: userId,
              office_id: assignment.office_id,
              role_id: assignment.role_id,
            })
          )
        );

        // Check for any failed creations
        const failedCreations = creationResults.filter((result, index) => {
          if (result.status === "rejected") {
            console.error(
              `Failed to create assignment ${index + 1}:`,
              result.reason
            );
            return true;
          }
          if (result.status === "fulfilled" && result.value.error) {
            console.error(
              `Failed to create assignment ${index + 1}:`,
              result.value.error
            );
            return true;
          }
          return false;
        });

        if (failedCreations.length > 0) {
          handleError(
            new Error(
              `Failed to create ${failedCreations.length} out of ${assignments.length} assignments`
            ),
            "Some assignments could not be created",
            true
          );

          // Still refresh to show partial success
          await refreshUsers();
          updateState({ refreshing: false });
          return false;
        }

        // Refresh users after successful update
        await refreshUsers();
        updateState({ refreshing: false });
        return true;
      } catch (error) {
        handleError(error, "Failed to bulk update user assignments", true);
        return false;
      } finally {
        updateState({ refreshing: false });
      }
    },
    [updateState, handleError, refreshUsers]
  );

  // Check user permission
  const checkUserPermission = useCallback(
    async (userId: string, permission: string): Promise<boolean> => {
      try {
        if (!userId || !permission) {
          console.warn("checkUserPermission called with missing parameters");
          return false;
        }

        const { hasPermission, error } = await UserService.userHasPermission(
          userId,
          permission
        );

        if (error) {
          handleError(error, "Failed to check user permission");
          return false;
        }

        return hasPermission;
      } catch (error) {
        handleError(error, "Failed to check user permission");
        return false;
      }
    },
    [handleError]
  );

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        updateState({ loading: true, error: null });

        // Load master data first, then users
        await refreshMasterData();
        await refreshUsers();
      } catch (error) {
        handleError(error, "Failed to initialize data");
      }
    };

    initializeData();
  }, [updateState, refreshUsers, refreshMasterData, handleError]);

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
    deleteAllUserOfficeAssignments,
    getUserById,
    checkUserPermission,
    bulkUpdateUserAssignments,
  };
};

export default useUser;
