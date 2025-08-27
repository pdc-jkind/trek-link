// src/services/user.service.ts
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types/user.types";

export class UserService {

  /**
   * Fetch user profile (untuk client components)
   */
  static async getUserProfile(userId: string): Promise<User[] | null> {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .eq('id', userId);

      if (error) {
        console.error('Error fetching user profile from client:', error);
        return null;
      }

      return data as User[];
    } catch (error) {
      console.error('Error in getUserProfileClient:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return null;
      }

      return data as User;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return null;
    }
  }

  /**
   * Check if user has specific permission
   */
  static async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('role_permissions')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.error('Error checking user permission:', error);
        return false;
      }

      return (data.role_permissions as string[]).includes(permission);
    } catch (error) {
      console.error('Error in hasPermission:', error);
      return false;
    }
  }

  /**
   * Get users by office (untuk admin/manager)
   */
  static async getUsersByOffice(officeId: string): Promise<User[]> {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .eq('office_id', officeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users by office:', error);
        return [];
      }

      return data as User[];
    } catch (error) {
      console.error('Error in getUsersByOffice:', error);
      return [];
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(roleId: string): Promise<User[]> {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('users_with_office_assignment')
        .select('*')
        .eq('role_id', roleId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users by role:', error);
        return [];
      }

      return data as User[];
    } catch (error) {
      console.error('Error in getUsersByRole:', error);
      return [];
    }
  }
}