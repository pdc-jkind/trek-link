// src/app/(dashboard)/offices/office.service.ts
import { createClient } from '../../../lib/supabase/client'
import type { Office, OfficeType } from './office.type'

const supabase = createClient()

export class OfficeService {
  private static readonly TABLE_NAME = 'offices'

  // Create a new office
  static async createOffice(officeData: Omit<Office, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert([officeData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create office: ${error.message}`)
    }

    return data as Office
  }

  // Get all offices
  static async getAllOffices(): Promise<Office[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch offices: ${error.message}`)
    }

    return data as Office[]
  }

  // Get office by ID
  static async getOfficeById(id: string): Promise<Office | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw new Error(`Failed to fetch office: ${error.message}`)
    }

    return data as Office
  }

  // Get offices by type
  static async getOfficesByType(type: OfficeType): Promise<Office[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch offices by type: ${error.message}`)
    }

    return data as Office[]
  }

  // Update office
  static async updateOffice(id: string, updates: Partial<Omit<Office, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update office: ${error.message}`)
    }

    return data as Office
  }

  // Delete office
  static async deleteOffice(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete office: ${error.message}`)
    }

    return true
  }

  // Search offices by name or location
  static async searchOffices(searchTerm: string): Promise<Office[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to search offices: ${error.message}`)
    }

    return data as Office[]
  }

  // Count offices by type
  static async countOfficesByType(): Promise<Record<OfficeType, number>> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('type')

    if (error) {
      throw new Error(`Failed to count offices: ${error.message}`)
    }

    const counts: Record<OfficeType, number> = {
      distributor: 0,
      unset: 0,
      grb: 0,
      pdc: 0
    }

    data.forEach((office: { type: OfficeType }) => {
      counts[office.type] = (counts[office.type] || 0) + 1
    })

    return counts
  }

  // Check if office name exists (useful for validation)
  static async isOfficeNameExists(name: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('id')
      .eq('name', name)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to check office name: ${error.message}`)
    }

    return data.length > 0
  }
}

// Export individual functions if you prefer functional approach
export const officeService = {
  create: OfficeService.createOffice,
  getAll: OfficeService.getAllOffices,
  getById: OfficeService.getOfficeById,
  getByType: OfficeService.getOfficesByType,
  update: OfficeService.updateOffice,
  delete: OfficeService.deleteOffice,
  search: OfficeService.searchOffices,
  countByType: OfficeService.countOfficesByType,
  isNameExists: OfficeService.isOfficeNameExists,
}