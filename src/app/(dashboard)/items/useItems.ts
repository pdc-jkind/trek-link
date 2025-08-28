// src/app/(dashboard)/items/useItems.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { itemService } from './item.service';
import {
  Item,
  ItemMaster,
  CreateItemPayload,
  UpdateItemPayload,
  CreateItemMasterPayload,
  UpdateItemMasterPayload,
  ItemFilters,
  ItemMasterFilters,
} from './items.type';

// Hook for managing items
export const useItems = (initialFilters: ItemFilters = {}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ItemFilters>({
    page: 1,
    limit: 50,
    ...initialFilters
  });
  
  // Use ref to track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);
  // Track if initial load is done
  const initialLoadDoneRef = useRef(false);
  
  console.log('🔧 useItems hook initialized with filters:', filters);
  
  // Stable fetch function that doesn't depend on filters state
  const fetchItems = useCallback(async (filtersToUse: ItemFilters) => {
    if (!mountedRef.current) {
      console.log('⚠️ Component unmounted, skipping fetch');
      return;
    }
    
    console.log('🔄 fetchItems called with filters:', filtersToUse);
    console.log('🔄 Current loading state before fetch:', loading);
    
    setLoading(true);
    setError(null);

    try {
      const response = await itemService.getItems(filtersToUse);
      
      console.log('📦 API Response:', response);
      
      if (!mountedRef.current) {
        console.log('⚠️ Component unmounted during fetch, skipping state update');
        return;
      }
      
      if (response.error) {
        console.error('❌ API Error:', response.error);
        setError(response.error);
        setItems([]);
        setTotalCount(0);
      } else {
        console.log('✅ Items fetched successfully:', response.data.length, 'items');
        console.log('✅ Total count:', response.count);
        setItems(response.data);
        setTotalCount(response.count);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      if (!mountedRef.current) {
        console.log('⚠️ Component unmounted during error handling');
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      setItems([]);
      setTotalCount(0);
    } finally {
      if (mountedRef.current) {
        console.log('🏁 fetchItems completed, setting loading to false');
        setLoading(false);
        initialLoadDoneRef.current = true;
      }
    }
  }, []); // Empty dependency array for stable reference

  const createItem = useCallback(async (payload: CreateItemPayload) => {
    try {
      const newItem = await itemService.createItem(payload);
      if (newItem && mountedRef.current) {
        setItems(prev => [newItem, ...prev]);
        setTotalCount(prev => prev + 1);
        return { success: true, data: newItem };
      }
      return { success: false, error: 'Failed to create item' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateItem = useCallback(async (payload: UpdateItemPayload) => {
    try {
      const updatedItem = await itemService.updateItem(payload);
      if (updatedItem && mountedRef.current) {
        setItems(prev => 
          prev.map(item => item.id === payload.id ? updatedItem : item)
        );
        return { success: true, data: updatedItem };
      }
      return { success: false, error: 'Failed to update item' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      const success = await itemService.deleteItem(id);
      if (success && mountedRef.current) {
        setItems(prev => prev.filter(item => item.id !== id));
        setTotalCount(prev => Math.max(0, prev - 1));
        return { success: true };
      }
      return { success: false, error: 'Failed to delete item' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const getItem = useCallback(async (id: string) => {
    try {
      const item = await itemService.getItemById(id);
      return item;
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch item');
      }
      return null;
    }
  }, []);

  const checkItemCodeExists = useCallback(async (itemCode: string, excludeId?: string) => {
    return await itemService.checkItemCodeExists(itemCode, excludeId);
  }, []);

  const generateItemCode = useCallback(async (prefix?: string) => {
    return await itemService.generateItemCode(prefix);
  }, []);

  // Fixed updateFilters function - handle empty values properly
  const updateFilters = useCallback((newFilters: Partial<ItemFilters>) => {
    console.log('🎯 updateFilters called with:', newFilters);
    
    setFilters(prev => {
      console.log('🎯 Previous filters:', prev);
      
      const updated = { ...prev };
      
      // Process each filter - remove if empty, otherwise update
      Object.keys(newFilters).forEach(key => {
        const newValue = newFilters[key as keyof ItemFilters];
        
        if (newValue === '' || newValue === null || newValue === undefined) {
          // Remove empty filters
          delete updated[key as keyof ItemFilters];
          console.log('🗑️ Removed empty filter:', key);
        } else {
          // Update with new value
          (updated as any)[key] = newValue;
          console.log('✏️ Updated filter:', key, '=', newValue);
        }
      });
      
      // Always maintain page and limit defaults
      updated.page = updated.page || 1;
      updated.limit = updated.limit || 50;
      
      // Check if filters actually changed by comparing objects
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(updated);
      
      console.log('📊 Filter comparison:', {
        previous: prev,
        updated: updated,
        hasChanged: hasChanged
      });
      
      if (!hasChanged) {
        console.log('📊 No filter changes detected, returning previous state');
        return prev; // Return same reference if no change
      }
      
      // Reset to page 1 when filtering (except when only page changes)
      if (Object.keys(newFilters).some(key => key !== 'page' && newFilters[key as keyof ItemFilters] !== prev[key as keyof ItemFilters])) {
        updated.page = 1;
        console.log('📄 Reset page to 1 due to filter change');
      }
      
      console.log('🎯 Returning updated filters:', updated);
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    console.log('🔄 resetFilters called');
    const defaultFilters: ItemFilters = { page: 1, limit: 50 };
    setFilters(defaultFilters);
  }, []);

  // Stable refetch function that uses current filters
  const refetch = useCallback(() => {
    console.log('🔄 refetch called');
    fetchItems(filters);
  }, [filters, fetchItems]);

  // Main effect to fetch items when filters change
  useEffect(() => {
    console.log('🎯 useEffect triggered - filters:', filters);
    console.log('🎯 initialLoadDoneRef.current:', initialLoadDoneRef.current);
    console.log('🎯 mountedRef.current:', mountedRef.current);
    
    if (mountedRef.current) {
      fetchItems(filters);
    }
  }, [filters, fetchItems]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      console.log('🧹 useItems cleanup - component unmounting');
      mountedRef.current = false;
    };
  }, []);

  console.log('🔍 useItems current state:', {
    loading,
    error,
    itemsCount: items.length,
    totalCount,
    filters,
    initialLoadDone: initialLoadDoneRef.current
  });

  return {
    items,
    loading,
    error,
    totalCount,
    filters,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    checkItemCodeExists,
    generateItemCode,
    updateFilters,
    resetFilters,
    refetch,
  };
};

// Hook for managing item masters
export const useItemMasters = (initialFilters: ItemMasterFilters = {}) => {
  const [itemMasters, setItemMasters] = useState<ItemMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ItemMasterFilters>({
    page: 1,
    limit: 50,
    ...initialFilters
  });
  
  const mountedRef = useRef(true);
  const initialLoadDoneRef = useRef(false);
  
  console.log('🔧 useItemMasters hook initialized with filters:', filters);
  
  const fetchItemMasters = useCallback(async (filtersToUse: ItemMasterFilters) => {
    if (!mountedRef.current) {
      console.log('⚠️ ItemMasters component unmounted, skipping fetch');
      return;
    }
    
    console.log('🔄 fetchItemMasters called with filters:', filtersToUse);
    
    setLoading(true);
    setError(null);

    try {
      const response = await itemService.getItemMasters(filtersToUse);
      
      console.log('📦 ItemMasters API Response:', response);
      
      if (!mountedRef.current) {
        console.log('⚠️ ItemMasters component unmounted during fetch');
        return;
      }
      
      if (response.error) {
        console.error('❌ ItemMasters API Error:', response.error);
        setError(response.error);
        setItemMasters([]);
        setTotalCount(0);
      } else {
        console.log('✅ ItemMasters fetched successfully:', response.data.length, 'masters');
        setItemMasters(response.data);
        setTotalCount(response.count);
        setError(null);
      }
    } catch (err) {
      console.error('❌ ItemMasters fetch error:', err);
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to fetch item masters');
      setItemMasters([]);
      setTotalCount(0);
    } finally {
      if (mountedRef.current) {
        console.log('🏁 fetchItemMasters completed, setting loading to false');
        setLoading(false);
        initialLoadDoneRef.current = true;
      }
    }
  }, []);

  const createItemMaster = useCallback(async (payload: CreateItemMasterPayload) => {
    try {
      const newItemMaster = await itemService.createItemMaster(payload);
      if (newItemMaster && mountedRef.current) {
        setItemMasters(prev => [newItemMaster, ...prev]);
        setTotalCount(prev => prev + 1);
        return { success: true, data: newItemMaster };
      }
      return { success: false, error: 'Failed to create item master' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item master';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateItemMaster = useCallback(async (payload: UpdateItemMasterPayload) => {
    try {
      const updatedItemMaster = await itemService.updateItemMaster(payload);
      if (updatedItemMaster && mountedRef.current) {
        setItemMasters(prev => 
          prev.map(master => master.id === payload.id ? updatedItemMaster : master)
        );
        return { success: true, data: updatedItemMaster };
      }
      return { success: false, error: 'Failed to update item master' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item master';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteItemMaster = useCallback(async (id: string) => {
    try {
      const success = await itemService.deleteItemMaster(id);
      if (success && mountedRef.current) {
        setItemMasters(prev => prev.filter(master => master.id !== id));
        setTotalCount(prev => Math.max(0, prev - 1));
        return { success: true };
      }
      return { success: false, error: 'Failed to delete item master' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item master';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const getItemMaster = useCallback(async (id: string) => {
    try {
      const itemMaster = await itemService.getItemMasterById(id);
      return itemMaster;
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch item master');
      }
      return null;
    }
  }, []);

  const checkItemMasterNameExists = useCallback(async (name: string, excludeId?: string) => {
    return await itemService.checkItemMasterNameExists(name, excludeId);
  }, []);

  const getItemsByMaster = useCallback(async (itemMasterId: string) => {
    return await itemService.getItemsByMaster(itemMasterId);
  }, []);

  // Fixed updateFilters for ItemMasters too
  const updateFilters = useCallback((newFilters: Partial<ItemMasterFilters>) => {
    console.log('🎯 updateFilters (ItemMasters) called with:', newFilters);
    
    setFilters(prev => {
      const updated = { ...prev };
      
      // Process each filter - remove if empty, otherwise update
      Object.keys(newFilters).forEach(key => {
        const newValue = newFilters[key as keyof ItemMasterFilters];
        
        if (newValue === '' || newValue === null || newValue === undefined) {
          delete updated[key as keyof ItemMasterFilters];
        } else {
          (updated as any)[key] = newValue;
        }
      });
      
      // Always maintain page and limit defaults
      updated.page = updated.page || 1;
      updated.limit = updated.limit || 50;
      
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(updated);
      
      if (!hasChanged) {
        return prev;
      }
      
      if (Object.keys(newFilters).some(key => key !== 'page' && newFilters[key as keyof ItemMasterFilters] !== prev[key as keyof ItemMasterFilters])) {
        updated.page = 1;
      }
      
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    console.log('🔄 resetFilters (ItemMasters) called');
    const defaultFilters: ItemMasterFilters = { page: 1, limit: 50 };
    setFilters(defaultFilters);
  }, []);

  const refetch = useCallback(() => {
    console.log('🔄 refetch (ItemMasters) called');
    fetchItemMasters(filters);
  }, [filters, fetchItemMasters]);

  // Main effect to fetch item masters when filters change
  useEffect(() => {
    console.log('🎯 useEffect (ItemMasters) triggered - filters:', filters);
    
    if (mountedRef.current) {
      fetchItemMasters(filters);
    }
  }, [filters, fetchItemMasters]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      console.log('🧹 useItemMasters cleanup - component unmounting');
      mountedRef.current = false;
    };
  }, []);

  console.log('🔍 useItemMasters current state:', {
    loading,
    error,
    itemMastersCount: itemMasters.length,
    totalCount,
    filters,
    initialLoadDone: initialLoadDoneRef.current
  });

  return {
    itemMasters,
    loading,
    error,
    totalCount,
    filters,
    createItemMaster,
    updateItemMaster,
    deleteItemMaster,
    getItemMaster,
    checkItemMasterNameExists,
    getItemsByMaster,
    updateFilters,
    resetFilters,
    refetch,
  };
};

// Combined hook for both items and item masters
export const useItemsWithMasters = () => {
  const itemsHook = useItems();
  const mastersHook = useItemMasters();

  return {
    items: itemsHook,
    masters: mastersHook,
  };
};