// src/app/(dashboard)/offices/useOffice.ts
import { useState, useEffect, useCallback } from 'react'
import { OfficeService } from './office.service'
import type { Office, OfficeType } from './office.type'

interface UseOfficeReturn {
  // Data
  offices: Office[]
  loading: boolean
  refreshing: boolean
  error: string | null
  
  // Actions
  createOffice: (officeData: Omit<Office, 'id' | 'created_at'>) => Promise<Office | null>
  updateOffice: (id: string, updates: Partial<Omit<Office, 'id' | 'created_at'>>) => Promise<Office | null>
  deleteOffice: (id: string) => Promise<boolean>
  refreshOffices: () => Promise<void>
  searchOffices: (searchTerm: string) => Promise<Office[]>
  getOfficesByType: (type: OfficeType) => Promise<Office[]>
  checkOfficeNameExists: (name: string, excludeId?: string) => Promise<boolean>
  
  // Statistics
  getOfficeStats: () => {
    totalOffices: number
    pdcCount: number
    distributorCount: number
    grbCount: number
    unsetCount: number
    totalUsers: number
    activeOffices: number
    inactiveOffices: number
  }
}

export const useOffice = (): UseOfficeReturn => {
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial offices data
  const loadOffices = useCallback(async () => {
    try {
      setError(null)
      const data = await OfficeService.getAllOffices()
      setOffices(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load offices'
      setError(errorMessage)
      console.error('Error loading offices:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadOffices()
  }, [loadOffices])

  // Create new office
  const createOffice = useCallback(async (officeData: Omit<Office, 'id' | 'created_at'>): Promise<Office | null> => {
    try {
      setError(null)
      const newOffice = await OfficeService.createOffice(officeData)
      setOffices(prev => [newOffice, ...prev])
      return newOffice
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create office'
      setError(errorMessage)
      console.error('Error creating office:', err)
      return null
    }
  }, [])

  // Update office
  const updateOffice = useCallback(async (id: string, updates: Partial<Omit<Office, 'id' | 'created_at'>>): Promise<Office | null> => {
    try {
      setError(null)
      const updatedOffice = await OfficeService.updateOffice(id, updates)
      setOffices(prev => 
        prev.map(office => 
          office.id === id ? updatedOffice : office
        )
      )
      return updatedOffice
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update office'
      setError(errorMessage)
      console.error('Error updating office:', err)
      return null
    }
  }, [])

  // Delete office
  const deleteOffice = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      const success = await OfficeService.deleteOffice(id)
      if (success) {
        setOffices(prev => prev.filter(office => office.id !== id))
      }
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete office'
      setError(errorMessage)
      console.error('Error deleting office:', err)
      return false
    }
  }, [])

  // Refresh offices data
  const refreshOffices = useCallback(async () => {
    setRefreshing(true)
    try {
      setError(null)
      const data = await OfficeService.getAllOffices()
      setOffices(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh offices'
      setError(errorMessage)
      console.error('Error refreshing offices:', err)
    } finally {
      setRefreshing(false)
    }
  }, [])

  // Search offices
  const searchOffices = useCallback(async (searchTerm: string): Promise<Office[]> => {
    try {
      setError(null)
      const results = await OfficeService.searchOffices(searchTerm)
      return results
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search offices'
      setError(errorMessage)
      console.error('Error searching offices:', err)
      return []
    }
  }, [])

  // Get offices by type
  const getOfficesByType = useCallback(async (type: OfficeType): Promise<Office[]> => {
    try {
      setError(null)
      const results = await OfficeService.getOfficesByType(type)
      return results
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get offices by type'
      setError(errorMessage)
      console.error('Error getting offices by type:', err)
      return []
    }
  }, [])

  // Check if office name exists
  const checkOfficeNameExists = useCallback(async (name: string, excludeId?: string): Promise<boolean> => {
    try {
      setError(null)
      return await OfficeService.isOfficeNameExists(name, excludeId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check office name'
      setError(errorMessage)
      console.error('Error checking office name:', err)
      return false
    }
  }, [])

  // Get office statistics
  const getOfficeStats = useCallback(() => {
    const stats = {
      totalOffices: offices.length,
      pdcCount: offices.filter(office => office.type === 'pdc').length,
      distributorCount: offices.filter(office => office.type === 'distributor').length,
      grbCount: offices.filter(office => office.type === 'grb').length,
      unsetCount: offices.filter(office => office.type === 'unset').length,
      totalUsers: 0, // This would need to be calculated based on user data
      activeOffices: 0, // This would need status field in Office interface
      inactiveOffices: 0, // This would need status field in Office interface
    }

    return stats
  }, [offices])

  return {
    // Data
    offices,
    loading,
    refreshing,
    error,
    
    // Actions
    createOffice,
    updateOffice,
    deleteOffice,
    refreshOffices,
    searchOffices,
    getOfficesByType,
    checkOfficeNameExists,
    
    // Statistics
    getOfficeStats,
  }
}