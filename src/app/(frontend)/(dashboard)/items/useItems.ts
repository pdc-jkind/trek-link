// src/app/(frontend)/(dashboard)/items/useItems.ts

import { useState, useEffect, useCallback, useRef } from "react";
import {
  itemService,
  type Office,
  type ItemMaster,
  type ItemMasterWithOffice,
  type ItemVariant,
  type Item,
  type ViewItemsFull,
  type CreateItemMasterPayload,
  type UpdateItemMasterPayload,
  type CreateItemVariantPayload,
  type UpdateItemVariantPayload,
  type CreateItemPayload,
  type UpdateItemPayload,
  type ItemMasterFilters,
  type ItemVariantFilters,
  type ItemFilters,
  type ViewItemsFullFilters,
} from "./item.service";

// ================================
// OFFICES HOOKS
// ================================

export const useOffices = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await itemService.getOffices();
      setOffices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch offices");
    } finally {
      setLoading(false);
    }
  }, []);

  const getOfficeById = useCallback(
    async (id: string): Promise<Office | null> => {
      try {
        return await itemService.getOfficeById(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch office");
        return null;
      }
    },
    []
  );

  useEffect(() => {
    fetchOffices();
  }, []);

  return {
    offices,
    loading,
    error,
    refetch: fetchOffices,
    getOfficeById,
  };
};

// ================================
// VIEW ITEMS FULL HOOKS
// ================================

export const useViewItemsFull = (initialFilters: ViewItemsFullFilters = {}) => {
  const [data, setData] = useState<ViewItemsFull[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ViewItemsFullFilters>(initialFilters);
  
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchItems = useCallback(async (newFilters?: ViewItemsFullFilters) => {
    setLoading(true);
    setError(null);
    try {
      const filtersToUse = newFilters || filtersRef.current;
      const response = await itemService.getViewItemsFull(filtersToUse);
      setData(response.data);
      setCount(response.count);
      if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch items");
      setData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters: ViewItemsFullFilters) => {
      setFilters(newFilters);
      fetchItems(newFilters);
    },
    [fetchItems]
  );

  const getItemById = useCallback(
    async (itemId: string): Promise<ViewItemsFull | null> => {
      try {
        return await itemService.getViewItemsFullById(itemId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
        return null;
      }
    },
    []
  );

  const getItemByCode = useCallback(
    async (itemCode: string): Promise<ViewItemsFull | null> => {
      try {
        return await itemService.getViewItemsFullByCode(itemCode);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
        return null;
      }
    },
    []
  );

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    data,
    count,
    loading,
    error,
    filters,
    refetch: fetchItems,
    updateFilters,
    getItemById,
    getItemByCode,
  };
};

// ================================
// ITEM MASTERS HOOKS - FIXED
// ================================

export const useItemMasters = (initialFilters: ItemMasterFilters = {}) => {
  const [data, setData] = useState<ItemMasterWithOffice[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ItemMasterFilters>(initialFilters);
  
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchItemMasters = useCallback(async (newFilters?: ItemMasterFilters) => {
    setLoading(true);
    setError(null);
    try {
      const filtersToUse = newFilters || filtersRef.current;
      const response = await itemService.getItemMasters(filtersToUse);
      setData(response.data);
      setCount(response.count);
      if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch item masters");
      setData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters: ItemMasterFilters) => {
      setFilters(newFilters);
      fetchItemMasters(newFilters);
    },
    [fetchItemMasters]
  );

  const createItemMaster = useCallback(
    async (payload: CreateItemMasterPayload): Promise<ItemMaster | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.createItemMaster(payload);
        if (result) {
          await fetchItemMasters();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create item master");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchItemMasters]
  );

  const updateItemMaster = useCallback(
    async (payload: UpdateItemMasterPayload): Promise<ItemMaster | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.updateItemMaster(payload);
        if (result) {
          await fetchItemMasters();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update item master");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchItemMasters]
  );

  const deleteItemMaster = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.deleteItemMaster(id);
        if (result) {
          await fetchItemMasters();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete item master");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchItemMasters]
  );

  const getItemMasterById = useCallback(
    async (id: string): Promise<ItemMaster | null> => {
      try {
        return await itemService.getItemMasterById(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item master");
        return null;
      }
    },
    []
  );

  const checkNameExists = useCallback(
    async (name: string, excludeId?: string): Promise<boolean> => {
      try {
        return await itemService.checkItemMasterNameExists(name, excludeId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check name existence");
        return false;
      }
    },
    []
  );

  useEffect(() => {
    fetchItemMasters();
  }, []);

  return {
    data,
    count,
    loading,
    error,
    filters,
    refetch: fetchItemMasters,
    updateFilters,
    createItemMaster,
    updateItemMaster,
    deleteItemMaster,
    getItemMasterById,
    checkNameExists,
  };
};

// ================================
// ITEM VARIANTS HOOKS
// ================================

export const useItemVariants = (initialFilters: ItemVariantFilters = {}) => {
  const [data, setData] = useState<ItemVariant[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ItemVariantFilters>(initialFilters);
  
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchItemVariants = useCallback(async (newFilters?: ItemVariantFilters) => {
    setLoading(true);
    setError(null);
    try {
      const filtersToUse = newFilters || filtersRef.current;
      const response = await itemService.getItemVariants(filtersToUse);
      setData(response.data);
      setCount(response.count);
      if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch item variants");
      setData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters: ItemVariantFilters) => {
      setFilters(newFilters);
      fetchItemVariants(newFilters);
    },
    [fetchItemVariants]
  );

  const createItemVariant = useCallback(
    async (payload: CreateItemVariantPayload): Promise<ItemVariant | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.createItemVariant(payload);
        if (result) {
          await fetchItemVariants();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create item variant");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchItemVariants]
  );

  const updateItemVariant = useCallback(
    async (payload: UpdateItemVariantPayload): Promise<ItemVariant | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.updateItemVariant(payload);
        if (result) {
          await fetchItemVariants();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update item variant");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchItemVariants]
  );

  const deleteItemVariant = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.deleteItemVariant(id);
        if (result) {
          await fetchItemVariants();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete item variant");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchItemVariants]
  );

  const getItemVariantById = useCallback(
    async (id: string): Promise<ItemVariant | null> => {
      try {
        return await itemService.getItemVariantById(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item variant");
        return null;
      }
    },
    []
  );

  const checkNameExists = useCallback(
    async (name: string, excludeId?: string): Promise<boolean> => {
      try {
        return await itemService.checkItemVariantNameExists(name, excludeId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check name existence");
        return false;
      }
    },
    []
  );

  useEffect(() => {
    fetchItemVariants();
  }, []);

  return {
    data,
    count,
    loading,
    error,
    filters,
    refetch: fetchItemVariants,
    updateFilters,
    createItemVariant,
    updateItemVariant,
    deleteItemVariant,
    getItemVariantById,
    checkNameExists,
  };
};

// ================================
// ITEMS HOOKS
// ================================

export const useItems = (initialFilters: ItemFilters = {}) => {
  const [data, setData] = useState<Item[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ItemFilters>(initialFilters);
  
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchItems = useCallback(async (newFilters?: ItemFilters) => {
    setLoading(true);
    setError(null);
    try {
      const filtersToUse = newFilters || filtersRef.current;
      const response = await itemService.getItems(filtersToUse);
      setData(response.data);
      setCount(response.count);
      if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch items");
      setData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters: ItemFilters) => {
      setFilters(newFilters);
      fetchItems(newFilters);
    },
    [fetchItems]
  );

  const createItem = useCallback(
    async (payload: CreateItemPayload): Promise<Item | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.createItem(payload);
        if (result) {
          await fetchItems();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create item");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchItems]
  );

  const updateItem = useCallback(
    async (payload: UpdateItemPayload): Promise<Item | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.updateItem(payload);
        if (result) {
          await fetchItems();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update item");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchItems]
  );

  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.deleteItem(id);
        if (result) {
          await fetchItems();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete item");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchItems]
  );

  const getItemById = useCallback(async (id: string): Promise<Item | null> => {
    try {
      return await itemService.getItemById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch item");
      return null;
    }
  }, []);

  const getItemByCode = useCallback(
    async (itemCode: string): Promise<Item | null> => {
      try {
        return await itemService.getItemByCode(itemCode);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
        return null;
      }
    },
    []
  );

  const checkItemCodeExists = useCallback(
    async (itemCode: string, excludeId?: string): Promise<boolean> => {
      try {
        return await itemService.checkItemCodeExists(itemCode, excludeId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check item code existence");
        return false;
      }
    },
    []
  );

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    data,
    count,
    loading,
    error,
    filters,
    refetch: fetchItems,
    updateFilters,
    createItem,
    updateItem,
    deleteItem,
    getItemById,
    getItemByCode,
    checkItemCodeExists,
  };
};

// ================================
// UTILITY HOOKS
// ================================

export const useItemUtilities = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getItemsByMaster = useCallback(
    async (itemMasterId: string): Promise<Item[]> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.getItemsByMaster(itemMasterId);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch items by master");
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getItemsByVariant = useCallback(
    async (variantId: string): Promise<Item[]> => {
      setLoading(true);
      setError(null);
      try {
        const result = await itemService.getItemsByVariant(variantId);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch items by variant");
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateItemCode = useCallback(
    async (prefix: string = "ITM"): Promise<string> => {
      try {
        return await itemService.generateItemCode(prefix);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate item code");
        return `${prefix}-001`;
      }
    },
    []
  );

  const getAvailableUnits = useCallback(async (): Promise<string[]> => {
    try {
      return await itemService.getAvailableUnits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch available units");
      return ["pcs", "kg", "ltr", "box"];
    }
  }, []);

  const getItemMasterTypes = useCallback(async (): Promise<string[]> => {
    try {
      return await itemService.getItemMasterTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch item master types");
      return ["consumable", "equipment", "material", "service"];
    }
  }, []);

  return {
    loading,
    error,
    getItemsByMaster,
    getItemsByVariant,
    generateItemCode,
    getAvailableUnits,
    getItemMasterTypes,
  };
};

// ================================
// STATISTICS HOOKS
// ================================

export const useItemStatistics = () => {
  const [statistics, setStatistics] = useState({
    totalItems: 0,
    totalItemMasters: 0,
    totalVariants: 0,
    itemsByOffice: [] as Array<{
      office_id: string;
      office_name: string;
      count: number;
    }>,
    itemsByType: [] as Array<{ type: string; count: number }>,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await itemService.getItemStatistics();
      setStatistics(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
};

// ================================
// COMBINED HOOK FOR MAIN PAGE
// ================================

export const useItemsPage = (initialFilters: ViewItemsFullFilters = {}) => {
  const itemsHook = useViewItemsFull(initialFilters);
  const officesHook = useOffices();
  const statisticsHook = useItemStatistics();
  const utilitiesHook = useItemUtilities();

  const loading = itemsHook.loading || officesHook.loading || statisticsHook.loading;
  const error = itemsHook.error || officesHook.error || statisticsHook.error || utilitiesHook.error;

  const refetchAll = useCallback(async () => {
    await Promise.all([
      itemsHook.refetch(),
      officesHook.refetch(),
      statisticsHook.refetch(),
    ]);
  }, [itemsHook.refetch, officesHook.refetch, statisticsHook.refetch]);

  return {
    items: itemsHook.data,
    itemsCount: itemsHook.count,
    itemsLoading: itemsHook.loading,
    itemsError: itemsHook.error,
    itemsFilters: itemsHook.filters,
    updateItemsFilters: itemsHook.updateFilters,
    refetchItems: itemsHook.refetch,
    getItemById: itemsHook.getItemById,
    getItemByCode: itemsHook.getItemByCode,
    offices: officesHook.offices,
    officesLoading: officesHook.loading,
    officesError: officesHook.error,
    refetchOffices: officesHook.refetch,
    getOfficeById: officesHook.getOfficeById,
    statistics: statisticsHook.statistics,
    statisticsLoading: statisticsHook.loading,
    statisticsError: statisticsHook.error,
    refetchStatistics: statisticsHook.refetch,
    getItemsByMaster: utilitiesHook.getItemsByMaster,
    getItemsByVariant: utilitiesHook.getItemsByVariant,
    generateItemCode: utilitiesHook.generateItemCode,
    getAvailableUnits: utilitiesHook.getAvailableUnits,
    getItemMasterTypes: utilitiesHook.getItemMasterTypes,
    loading,
    error,
    refetchAll,
  };
};

export type { ItemMasterWithOffice };