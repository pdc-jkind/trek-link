// src/app/(dashboard)/users/user.service.ts

import { createClient } from '@/lib/supabase/client';
import type { User, UserResponse } from '@/types/user.types';
import type { Office, OfficeResponse,Role, RoleResponse, 
  OfficeUser, 
  UpdateOfficeUserRequest, 
  CreateOfficeUserRequest  } from './types';

const supabase = createClient();

export class UserService {
  // READ Operations
  
  /**
   * Get all users with their office assignment and role details
   */
  static async getAllUsers(): Promise<{ data: UserResponse | null; error: any }> {
    const { data, error } = await supabase
      .from('users_with_office_assignment')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  }

  /**
   * Get user by ID with office assignment and role details
   */
  static async getUserById(userId: string): Promise<{ data: User | null; error: any }> {
    const { data, error } = await supabase
      .from('users_with_office_assignment')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }

  /**
   * Get users by office ID
   */
  static async getUsersByOfficeId(officeId: string): Promise<{ data: UserResponse | null; error: any }> {
    const { data, error } = await supabase
      .from('users_with_office_assignment')
      .select('*')
      .eq('office_id', officeId)
      .order('created_at', { ascending: false });

    return { data, error };
  }

  /**
   * Get users by role ID
   */
  static async getUsersByRoleId(roleId: string): Promise<{ data: UserResponse | null; error: any }> {
    const { data, error } = await supabase
      .from('users_with_office_assignment')
      .select('*')
      .eq('role_id', roleId)
      .order('created_at', { ascending: false });

    return { data, error };
  }

  // OFFICE ASSIGNMENT CRUD Operations

  /**
   * Create new office user assignment
   */
  static async createOfficeUser(officeUserData: CreateOfficeUserRequest): Promise<{ data: OfficeUser | null; error: any }> {
    const { data, error } = await supabase
      .from('office_users')
      .insert({
        user_id: officeUserData.user_id,
        office_id: officeUserData.office_id,
        role_id: officeUserData.role_id,
        assigned_at: new Date().toISOString()
      })
      .select()
      .single();

    return { data, error };
  }

  /**
   * Update office assignment for a user
   */
  static async updateOfficeUser(
    userId: string, 
    updateData: UpdateOfficeUserRequest
  ): Promise<{ data: OfficeUser | null; error: any }> {
    const { data, error } = await supabase
      .from('office_users')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    return { data, error };
  }

  /**
   * Delete office user assignment
   */
  static async deleteOfficeUser(userId: string): Promise<{ data: OfficeUser | null; error: any }> {
    const { data, error } = await supabase
      .from('office_users')
      .delete()
      .eq('user_id', userId)
      .select()
      .single();

    return { data, error };
  }

  /**
   * Get office user assignment by user ID
   */
  static async getOfficeUserByUserId(userId: string): Promise<{ data: OfficeUser | null; error: any }> {
    const { data, error } = await supabase
      .from('office_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  }

  // MASTER DATA Operations

  /**
   * Get all offices
   */
  static async getAllOffices(): Promise<{ data: OfficeResponse | null; error: any }> {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .order('name', { ascending: true });

    return { data, error };
  }

  /**
   * Get office by ID
   */
  static async getOfficeById(officeId: string): Promise<{ data: Office | null; error: any }> {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .eq('id', officeId)
      .single();

    return { data, error };
  }

  /**
   * Get offices by type
   */
  static async getOfficesByType(type: string): Promise<{ data: OfficeResponse | null; error: any }> {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .eq('type', type)
      .order('name', { ascending: true });

    return { data, error };
  }

  /**
   * Get all roles
   */
  static async getAllRoles(): Promise<{ data: RoleResponse | null; error: any }> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name', { ascending: true });

    return { data, error };
  }

  /**
   * Get role by ID
   */
  static async getRoleById(roleId: string): Promise<{ data: Role | null; error: any }> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', roleId)
      .single();

    return { data, error };
  }

  /**
   * Get roles by permission
   */
  static async getRolesByPermission(permission: string): Promise<{ data: RoleResponse | null; error: any }> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .contains('permissions', [permission])
      .order('name', { ascending: true });

    return { data, error };
  }

  // UTILITY Methods

  /**
   * Check if user has specific permission
   */
  static async userHasPermission(userId: string, permission: string): Promise<{ hasPermission: boolean; error: any }> {
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
  }

  /**
   * Get users with specific permission
   */
  static async getUsersWithPermission(permission: string): Promise<{ data: UserResponse | null; error: any }> {
    const { data, error } = await supabase
      .from('users_with_office_assignment')
      .select('*')
      .contains('role_permissions', [permission])
      .order('created_at', { ascending: false });

    return { data, error };
  }

  /**
   * Search users by email or phone
   */
  static async searchUsers(searchTerm: string): Promise<{ data: UserResponse | null; error: any }> {
    const { data, error } = await supabase
      .from('users_with_office_assignment')
      .select('*')
      .or(`email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    return { data, error };
  }
}

// Export untuk convenience
export default UserService;