// src/app/(dashboard)/users/user.service.ts

import { createClient } from '@/lib/supabase/client';
import type { User, UserResponse } from '@/types/user.types';
import type { Office, OfficeResponse,Role, RoleResponse, 
  OfficeUser, 
  UpdateOfficeUserRequest, 
  CreateOfficeUserRequest  } from './user.types';

const supabase = createClient();

export class UserService {
  // READ Operations
  
  /**
   * Get all users with their office assignment and role details
   */
  static async getAllUsers(): Promise<{ data: UserResponse | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user by ID with office assignment and role details
   */
  static async getUserById(userId: string): Promise<{ data: User | null; error: any }> {
    try {
      if (!userId) {
        return { data: null, error: new Error('User ID is required') };
      }

      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .eq('id', userId)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error in getUserById:', error);
      return { data: null, error };
    }
  }

  /**
   * Get users by office ID
   */
  static async getUsersByOfficeId(officeId: string): Promise<{ data: UserResponse | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .eq('office_id', officeId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error in getUsersByOfficeId:', error);
      return { data: null, error };
    }
  }

  /**
   * Get users by role ID
   */
  static async getUsersByRoleId(roleId: string): Promise<{ data: UserResponse | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .eq('role_id', roleId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error in getUsersByRoleId:', error);
      return { data: null, error };
    }
  }

  // OFFICE ASSIGNMENT CRUD Operations

  /**
   * Create new office user assignment - Enhanced validation with logging
   */
  static async createOfficeUser(officeUserData: CreateOfficeUserRequest): Promise<{ data: OfficeUser | null; error: any }> {
    console.log('🔄 [CREATE_OFFICE_ASSIGNMENT] Starting assignment creation', {
      status: 'INITIATED',
      data: {
        user_id: officeUserData.user_id,
        office_id: officeUserData.office_id,
        role_id: officeUserData.role_id,
        timestamp: new Date().toISOString()
      }
    });

    try {
      // Validate required fields
      if (!officeUserData.user_id || !officeUserData.office_id || !officeUserData.role_id) {
        const error = new Error('user_id, office_id, and role_id are required');
        console.log('❌ [CREATE_OFFICE_ASSIGNMENT] Validation failed', {
          status: 'VALIDATION_ERROR',
          data: {
            user_id: officeUserData.user_id || 'MISSING',
            office_id: officeUserData.office_id || 'MISSING',
            role_id: officeUserData.role_id || 'MISSING',
            error: error.message
          }
        });
        return { data: null, error };
      }

      // Check if assignment already exists
      const { data: existingAssignment } = await supabase
        .from('office_users')
        .select('id')
        .eq('user_id', officeUserData.user_id)
        .eq('office_id', officeUserData.office_id)
        .single();

      if (existingAssignment) {
        const error = new Error('User is already assigned to this office');
        console.log('⚠️ [CREATE_OFFICE_ASSIGNMENT] Duplicate assignment detected', {
          status: 'DUPLICATE_ERROR',
          data: {
            user_id: officeUserData.user_id,
            office_id: officeUserData.office_id,
            existing_assignment_id: existingAssignment.id,
            error: error.message
          }
        });
        return { data: null, error };
      }

      const assignmentData = {
        user_id: officeUserData.user_id,
        office_id: officeUserData.office_id,
        role_id: officeUserData.role_id,
        assigned_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('office_users')
        .insert(assignmentData)
        .select()
        .single();

      if (error) {
        console.log('❌ [CREATE_OFFICE_ASSIGNMENT] Database error', {
          status: 'DATABASE_ERROR',
          data: {
            ...assignmentData,
            error: error.message,
            error_details: error.details || 'No additional details',
            error_hint: error.hint || 'No hint provided'
          }
        });
        return { data: null, error };
      }

      console.log('✅ [CREATE_OFFICE_ASSIGNMENT] Assignment created successfully', {
        status: 'SUCCESS',
        data: {
          assignment_id: data.id,
          user_id: data.user_id,
          office_id: data.office_id,
          role_id: data.role_id,
          assigned_at: data.assigned_at
        }
      });

      return { data, error };
    } catch (error) {
      console.log('💥 [CREATE_OFFICE_ASSIGNMENT] Unexpected error', {
        status: 'UNEXPECTED_ERROR',
        data: {
          user_id: officeUserData.user_id,
          office_id: officeUserData.office_id,
          role_id: officeUserData.role_id,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      console.error('Error in createOfficeUser:', error);
      return { data: null, error };
    }
  }

  /**
   * Update office assignment for a specific office user record with logging
   * Updated to handle multiple assignments per user by using record ID
   */
  static async updateOfficeUser(
    recordId: string, 
    updateData: UpdateOfficeUserRequest
  ): Promise<{ data: OfficeUser | null; error: any }> {
    console.log('🔄 [UPDATE_OFFICE_ASSIGNMENT] Starting assignment update', {
      status: 'INITIATED',
      data: {
        record_id: recordId,
        update_data: updateData,
        timestamp: new Date().toISOString()
      }
    });

    try {
      if (!recordId) {
        const error = new Error('Record ID is required');
        console.log('❌ [UPDATE_OFFICE_ASSIGNMENT] Validation failed', {
          status: 'VALIDATION_ERROR',
          data: {
            record_id: recordId || 'MISSING',
            error: error.message
          }
        });
        return { data: null, error };
      }

      // Get existing assignment data for logging
      const { data: existingData } = await supabase
        .from('office_users')
        .select('*')
        .eq('id', recordId)
        .single();

      const { data, error } = await supabase
        .from('office_users')
        .update(updateData)
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        console.log('❌ [UPDATE_OFFICE_ASSIGNMENT] Database error', {
          status: 'DATABASE_ERROR',
          data: {
            record_id: recordId,
            update_data: updateData,
            existing_data: existingData,
            error: error.message,
            error_details: error.details || 'No additional details'
          }
        });
        return { data: null, error };
      }

      console.log('✅ [UPDATE_OFFICE_ASSIGNMENT] Assignment updated successfully', {
        status: 'SUCCESS',
        data: {
          record_id: recordId,
          before: existingData ? {
            office_id: existingData.office_id,
            role_id: existingData.role_id,
            assigned_at: existingData.assigned_at
          } : null,
          after: {
            office_id: data.office_id,
            role_id: data.role_id,
            assigned_at: data.assigned_at
          },
          changes: updateData
        }
      });

      return { data, error };
    } catch (error) {
      console.log('💥 [UPDATE_OFFICE_ASSIGNMENT] Unexpected error', {
        status: 'UNEXPECTED_ERROR',
        data: {
          record_id: recordId,
          update_data: updateData,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      console.error('Error in updateOfficeUser:', error);
      return { data: null, error };
    }
  }

  /**
   * Delete specific office user assignment by record ID with logging
   * Updated to handle deletion of specific assignment record
   */
  static async deleteOfficeUser(recordId: string): Promise<{ data: OfficeUser | null; error: any }> {
    console.log('🔄 [DELETE_OFFICE_ASSIGNMENT] Starting assignment deletion', {
      status: 'INITIATED',
      data: {
        record_id: recordId,
        timestamp: new Date().toISOString()
      }
    });

    try {
      if (!recordId) {
        const error = new Error('Record ID is required');
        console.log('❌ [DELETE_OFFICE_ASSIGNMENT] Validation failed', {
          status: 'VALIDATION_ERROR',
          data: {
            record_id: recordId || 'MISSING',
            error: error.message
          }
        });
        return { data: null, error };
      }

      // Get existing assignment data for logging before deletion
      const { data: existingData } = await supabase
        .from('office_users')
        .select('*')
        .eq('id', recordId)
        .single();

      const { data, error } = await supabase
        .from('office_users')
        .delete()
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        console.log('❌ [DELETE_OFFICE_ASSIGNMENT] Database error', {
          status: 'DATABASE_ERROR',
          data: {
            record_id: recordId,
            existing_data: existingData,
            error: error.message,
            error_details: error.details || 'No additional details'
          }
        });
        return { data: null, error };
      }

      console.log('✅ [DELETE_OFFICE_ASSIGNMENT] Assignment deleted successfully', {
        status: 'SUCCESS',
        data: {
          deleted_record_id: recordId,
          deleted_assignment: existingData ? {
            user_id: existingData.user_id,
            office_id: existingData.office_id,
            role_id: existingData.role_id,
            assigned_at: existingData.assigned_at
          } : null,
          returned_data: data
        }
      });

      return { data, error };
    } catch (error) {
      console.log('💥 [DELETE_OFFICE_ASSIGNMENT] Unexpected error', {
        status: 'UNEXPECTED_ERROR',
        data: {
          record_id: recordId,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      console.error('Error in deleteOfficeUser:', error);
      return { data: null, error };
    }
  }

  /**
   * Delete all office assignments for a user with logging
   * New method to delete all assignments for a specific user
   */
  static async deleteAllUserOfficeAssignments(userId: string): Promise<{ data: OfficeUser[] | null; error: any }> {
    console.log('🔄 [DELETE_ALL_USER_ASSIGNMENTS] Starting bulk deletion', {
      status: 'INITIATED',
      data: {
        user_id: userId,
        timestamp: new Date().toISOString()
      }
    });

    try {
      if (!userId) {
        const error = new Error('User ID is required');
        console.log('❌ [DELETE_ALL_USER_ASSIGNMENTS] Validation failed', {
          status: 'VALIDATION_ERROR',
          data: {
            user_id: userId || 'MISSING',
            error: error.message
          }
        });
        return { data: null, error };
      }

      // Get existing assignments for logging before deletion
      const { data: existingAssignments } = await supabase
        .from('office_users')
        .select('*')
        .eq('user_id', userId);

      console.log('📊 [DELETE_ALL_USER_ASSIGNMENTS] Found existing assignments', {
        status: 'ASSIGNMENTS_FOUND',
        data: {
          user_id: userId,
          assignment_count: existingAssignments?.length || 0,
          assignments: existingAssignments?.map(a => ({
            record_id: a.id,
            office_id: a.office_id,
            role_id: a.role_id,
            assigned_at: a.assigned_at
          })) || []
        }
      });

      const { data, error } = await supabase
        .from('office_users')
        .delete()
        .eq('user_id', userId)
        .select();

      if (error) {
        console.log('❌ [DELETE_ALL_USER_ASSIGNMENTS] Database error', {
          status: 'DATABASE_ERROR',
          data: {
            user_id: userId,
            existing_assignments_count: existingAssignments?.length || 0,
            error: error.message,
            error_details: error.details || 'No additional details'
          }
        });
        return { data: null, error };
      }

      console.log('✅ [DELETE_ALL_USER_ASSIGNMENTS] All assignments deleted successfully', {
        status: 'SUCCESS',
        data: {
          user_id: userId,
          deleted_count: data?.length || 0,
          deleted_assignments: data?.map(a => ({
            record_id: a.id,
            office_id: a.office_id,
            role_id: a.role_id,
            assigned_at: a.assigned_at
          })) || []
        }
      });

      return { data, error };
    } catch (error) {
      console.log('💥 [DELETE_ALL_USER_ASSIGNMENTS] Unexpected error', {
        status: 'UNEXPECTED_ERROR',
        data: {
          user_id: userId,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      console.error('Error in deleteAllUserOfficeAssignments:', error);
      return { data: null, error };
    }
  }

  /**
   * Get office user assignment by user ID
   */
  static async getOfficeUserByUserId(userId: string): Promise<{ data: OfficeUser | null; error: any }> {
    try {
      if (!userId) {
        return { data: null, error: new Error('User ID is required') };
      }

      const { data, error } = await supabase
        .from('office_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error in getOfficeUserByUserId:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all office assignments for a user
   * New method to get all assignments for a specific user
   */
  static async getAllOfficeAssignmentsByUserId(userId: string): Promise<{ data: OfficeUser[] | null; error: any }> {
    try {
      if (!userId) {
        return { data: null, error: new Error('User ID is required') };
      }

      const { data, error } = await supabase
        .from('office_users')
        .select('*')
        .eq('user_id', userId)
        .order('assigned_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error in getAllOfficeAssignmentsByUserId:', error);
      return { data: null, error };
    }
  }

  // MASTER DATA Operations

  /**
   * Get all offices
   */
  static async getAllOffices(): Promise<{ data: OfficeResponse | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('offices')
        .select('*')
        .order('name', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('Error in getAllOffices:', error);
      return { data: null, error };
    }
  }

  /**
   * Get office by ID
   */
  static async getOfficeById(officeId: string): Promise<{ data: Office | null; error: any }> {
    try {
      if (!officeId) {
        return { data: null, error: new Error('Office ID is required') };
      }

      const { data, error } = await supabase
        .from('offices')
        .select('*')
        .eq('id', officeId)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error in getOfficeById:', error);
      return { data: null, error };
    }
  }

  /**
   * Get offices by type
   */
  static async getOfficesByType(type: string): Promise<{ data: OfficeResponse | null; error: any }> {
    try {
      if (!type) {
        return { data: null, error: new Error('Office type is required') };
      }

      const { data, error } = await supabase
        .from('offices')
        .select('*')
        .eq('type', type)
        .order('name', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('Error in getOfficesByType:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all roles
   */
  static async getAllRoles(): Promise<{ data: RoleResponse | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('Error in getAllRoles:', error);
      return { data: null, error };
    }
  }

  /**
   * Get role by ID
   */
  static async getRoleById(roleId: string): Promise<{ data: Role | null; error: any }> {
    try {
      if (!roleId) {
        return { data: null, error: new Error('Role ID is required') };
      }

      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error in getRoleById:', error);
      return { data: null, error };
    }
  }

  /**
   * Get roles by permission
   */
  static async getRolesByPermission(permission: string): Promise<{ data: RoleResponse | null; error: any }> {
    try {
      if (!permission) {
        return { data: null, error: new Error('Permission is required') };
      }

      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .contains('permissions', [permission])
        .order('name', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('Error in getRolesByPermission:', error);
      return { data: null, error };
    }
  }

  // UTILITY Methods

  /**
   * Check if user has specific permission
   */
  static async userHasPermission(userId: string, permission: string): Promise<{ hasPermission: boolean; error: any }> {
    try {
      if (!userId || !permission) {
        return { hasPermission: false, error: new Error('User ID and permission are required') };
      }

      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('role_permissions')
        .eq('id', userId)
        .single();

      if (error) {
        return { hasPermission: false, error };
      }

      const hasPermission = data?.role_permissions?.includes(permission) || false;
      return { hasPermission, error: null };
    } catch (error) {
      console.error('Error in userHasPermission:', error);
      return { hasPermission: false, error };
    }
  }

  /**
   * Get users with specific permission
   */
  static async getUsersWithPermission(permission: string): Promise<{ data: UserResponse | null; error: any }> {
    try {
      if (!permission) {
        return { data: null, error: new Error('Permission is required') };
      }

      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .contains('role_permissions', [permission])
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error in getUsersWithPermission:', error);
      return { data: null, error };
    }
  }

  /**
   * Search users by email or phone
   */
  static async searchUsers(searchTerm: string): Promise<{ data: UserResponse | null; error: any }> {
    try {
      if (!searchTerm || !searchTerm.trim()) {
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .or(`email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error in searchUsers:', error);
      return { data: null, error };
    }
  }
}

// Export untuk convenience
export default UserService;