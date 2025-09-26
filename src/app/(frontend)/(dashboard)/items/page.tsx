// src/app/(frontend)/(dashboard)/items/page.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ItemModal } from "@/items/components/ItemModal"; //./components/ItemModal
import { ItemMasterModal } from "@/items/components/ItemMasterModal";
import { ItemVariantModal } from "@/items/components/ItemVariantModal";
import { ItemsHeader } from "@/items/components/ItemsHeader";
import { ItemsFilters } from "@/items/components/ItemsFilters";
import { ViewModeToggle } from "@/items/components/ViewModeToggle";
import { ItemsTable } from "@/items/components/ItemsTable";
import { ItemsTableFooter } from "@/items/components/ItemsTableFooter";
import { ItemsStatistics } from "@/items/components/ItemsStatistics";
import { ItemsLoadingState } from "@/items/components/ItemsLoadingState";
import { ItemsErrorState } from "@/items/components/ItemsErrorState";
import { ConfirmDialog } from "@/app/(frontend)/(dashboard)/components/feedback/ConfirmDialog";
import { Card } from "@/app/(frontend)/(dashboard)/components/layout/Card";
import {
  useItemsPage,
  useItemMasters,
  useItemVariants,
  useItems,
} from "./useItems";
import type { Tables } from "@/types/database";

// Type definitions based on database schema
type ViewItemsFull = Tables<"view_items_full">;
type Office = Tables<"offices">;
type ItemMaster = Tables<"item_masters">;
type ItemVariant = Tables<"item_variants">;
type Item = Tables<"items">;

// View modes
type ViewMode = "items" | "masters" | "variants";

// Interface for grouped items
interface ItemGroup {
  master: {
    id: string;
    name: string | null;
    type: string | null;
    img_url: string | null;
  };
  items: ViewItemsFull[];
  office: {
    id: string | null;
    name: string | null;
    location?: string | null;
  };
}

// Main Component
const ItemsPage: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("items");

  // Modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ViewItemsFull | null>(null);
  const [editingMaster, setEditingMaster] = useState<ItemMaster | null>(null);
  const [editingVariant, setEditingVariant] = useState<ItemVariant | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // ✅ FIXED: Memoize filter object to prevent infinite re-renders
  const filters = useMemo(
    () => ({
      search: searchTerm || undefined,
      item_master_id: selectedCategory || undefined,
      office_id: selectedOffice || undefined,
      page: 1,
      limit: 50,
    }),
    [searchTerm, selectedCategory, selectedOffice]
  );

  // Main hook for page data
  const {
    items,
    itemsCount,
    itemsLoading,
    updateItemsFilters,
    refetchItems,
    offices,
    statistics,
    generateItemCode,
    loading: mainLoading,
    error: mainError,
  } = useItemsPage(filters);

  // Separate hooks for CRUD operations
  const itemMastersHook = useItemMasters();
  const itemVariantsHook = useItemVariants();
  const itemsHook = useItems();

  // ✅ FIXED: Use stable reference for updateItemsFilters and memoize the effect
  const updateFilters = useCallback(() => {
    const newFilters: any = {
      page: 1,
      limit: 50,
    };

    if (searchTerm.trim()) newFilters.search = searchTerm.trim();
    if (selectedCategory) newFilters.item_master_id = selectedCategory;
    if (selectedOffice) newFilters.office_id = selectedOffice;

    updateItemsFilters(newFilters);
  }, [searchTerm, selectedCategory, selectedOffice, updateItemsFilters]);

  // ✅ FIXED: Debounce the filter updates to prevent excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [updateFilters]);

  // Group items by category (item_master) - Memoized to prevent recalculation
  const groupedItems = useMemo((): ItemGroup[] => {
    const groups: { [key: string]: ItemGroup } = {};

    items.forEach((item) => {
      const masterId = item.item_master_id;
      if (masterId && !groups[masterId]) {
        groups[masterId] = {
          master: {
            id: masterId,
            name: item.item_master_name,
            type: item.item_master_type,
            img_url: item.item_master_img_url,
          },
          items: [],
          office: {
            id: item.office_id,
            name: item.office_name,
          },
        };
      }
      if (masterId) {
        groups[masterId].items.push(item);
      }
    });

    // Enrich office data with location from offices array
    Object.values(groups).forEach((group) => {
      if (group.office.id) {
        const office = offices.find((o) => o.id === group.office.id);
        if (office) {
          group.office.location = office.location;
        }
      }
    });

    return Object.values(groups);
  }, [items, offices]);

  // ✅ FIXED: Memoize callback functions to prevent unnecessary re-renders
  const handleToggleExpand = useCallback((masterId: string) => {
    setExpandedGroups((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(masterId)) {
        newExpanded.delete(masterId);
      } else {
        newExpanded.add(masterId);
      }
      return newExpanded;
    });
  }, []);

  // Generate sequential item codes for multiple items
  const generateSequentialCodes = useCallback(
    async (baseCode: string, count: number): Promise<string[]> => {
      const codes: string[] = [];

      // Extract prefix and number from base code (e.g., "ITM-001" -> "ITM" and 1)
      const parts = baseCode.split("-");
      const prefix = parts.slice(0, -1).join("-");
      const startNumber = parseInt(parts[parts.length - 1]) || 1;

      for (let i = 0; i < count; i++) {
        const number = startNumber + i;
        const paddedNumber = number.toString().padStart(3, "0");
        codes.push(`${prefix}-${paddedNumber}`);
      }

      return codes;
    },
    []
  );

  // ✅ FIXED: Memoize all modal handlers to prevent re-renders
  const handleAddItem = useCallback(() => {
    setEditingItem(null);
    setModalMode("create");
    setIsItemModalOpen(true);
  }, []);

  const handleAddMaster = useCallback(() => {
    setEditingMaster(null);
    setModalMode("create");
    setIsMasterModalOpen(true);
  }, []);

  const handleAddVariant = useCallback(() => {
    setEditingVariant(null);
    setModalMode("create");
    setIsVariantModalOpen(true);
  }, []);

  const handleViewItem = useCallback((item: ViewItemsFull) => {
    console.log("Viewing item:", item);
    // TODO: Implement view item details modal or page
  }, []);

  const handleEditItem = useCallback((item: ViewItemsFull) => {
    setEditingItem(item);
    setModalMode("edit");
    setIsItemModalOpen(true);
  }, []);

  const handleDeleteItem = useCallback(
    (item: ViewItemsFull) => {
      setConfirmDialog({
        isOpen: true,
        title: "Hapus Item",
        message: `Apakah Anda yakin ingin menghapus item "${item.item_name}"? Tindakan ini tidak dapat dibatalkan.`,
        variant: "danger",
        onConfirm: async () => {
          if (item.item_id) {
            const success = await itemsHook.deleteItem(item.item_id);
            if (success) {
              refetchItems();
            }
          }
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    },
    [itemsHook, refetchItems]
  );

  const handleEditMaster = useCallback((master: ItemMaster) => {
    setEditingMaster(master);
    setModalMode("edit");
    setIsMasterModalOpen(true);
  }, []);

  const handleDeleteMaster = useCallback(
    (master: ItemMaster) => {
      setConfirmDialog({
        isOpen: true,
        title: "Hapus Kategori",
        message: `Apakah Anda yakin ingin menghapus kategori "${master.name}"? Semua item dalam kategori ini akan terpengaruh.`,
        variant: "danger",
        onConfirm: async () => {
          const success = await itemMastersHook.deleteItemMaster(master.id);
          if (success) {
            refetchItems();
          }
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    },
    [itemMastersHook, refetchItems]
  );

  const handleEditVariant = useCallback((variant: ItemVariant) => {
    setEditingVariant(variant);
    setModalMode("edit");
    setIsVariantModalOpen(true);
  }, []);

  const handleDeleteVariant = useCallback(
    (variant: ItemVariant) => {
      setConfirmDialog({
        isOpen: true,
        title: "Hapus Variant",
        message: `Apakah Anda yakin ingin menghapus variant "${variant.name}"? Semua item dengan variant ini akan terpengaruh.`,
        variant: "danger",
        onConfirm: async () => {
          const success = await itemVariantsHook.deleteItemVariant(variant.id);
          if (success) {
            refetchItems();
          }
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    },
    [itemVariantsHook, refetchItems]
  );

  // ✅ FIXED: Memoize save handlers to prevent re-renders
  const handleSaveItem = useCallback(
    async (data: any) => {
      try {
        let result;

        if (modalMode === "edit" && editingItem && editingItem.item_id) {
          // Edit single item
          result = await itemsHook.updateItem({
            id: editingItem.item_id,
            ...data,
          });
        } else {
          // Create new item(s)
          if (data.items && Array.isArray(data.items)) {
            // Multiple items - generate sequential codes
            const baseCode = data.baseItemCode || (await generateItemCode());
            const sequentialCodes = await generateSequentialCodes(
              baseCode,
              data.items.length
            );

            const results = await Promise.all(
              data.items.map((itemData: any, index: number) =>
                itemsHook.createItem({
                  ...itemData,
                  item_code: sequentialCodes[index],
                  item_master_id: data.item_master_id,
                })
              )
            );
            result = results.every((r) => r !== null);
          } else {
            // Single item
            result = await itemsHook.createItem({
              ...data,
              item_master_id: data.item_master_id,
            });
          }
        }

        if (result) {
          setIsItemModalOpen(false);
          refetchItems();
          return { success: true };
        } else {
          return { success: false, error: "Gagal menyimpan item" };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        };
      }
    },
    [
      modalMode,
      editingItem,
      itemsHook,
      generateItemCode,
      generateSequentialCodes,
      refetchItems,
    ]
  );

  const handleSaveMaster = useCallback(
    async (data: any) => {
      try {
        let result;

        if (modalMode === "edit" && editingMaster) {
          result = await itemMastersHook.updateItemMaster(data);
        } else {
          result = await itemMastersHook.createItemMaster(data);
        }

        if (result) {
          setIsMasterModalOpen(false);
          refetchItems();
          return { success: true };
        } else {
          return { success: false, error: "Gagal menyimpan kategori" };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        };
      }
    },
    [modalMode, editingMaster, itemMastersHook, refetchItems]
  );

  const handleSaveVariant = useCallback(
    async (data: any) => {
      try {
        let result;

        if (modalMode === "edit" && editingVariant) {
          result = await itemVariantsHook.updateItemVariant(data);
        } else {
          result = await itemVariantsHook.createItemVariant(data);
        }

        if (result) {
          setIsVariantModalOpen(false);
          refetchItems();
          return { success: true };
        } else {
          return { success: false, error: "Gagal menyimpan variant" };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        };
      }
    },
    [modalMode, editingVariant, itemVariantsHook, refetchItems]
  );

  // ✅ FIXED: Memoize filter handlers to prevent re-renders
  const handleFilter = useCallback(() => {
    // TODO: Implement advanced filter modal
    console.log("Advanced filter clicked");
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const handleOfficeChange = useCallback((value: string) => {
    setSelectedOffice(value);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Show loading state for initial load
  if (mainLoading && items.length === 0) {
    return <ItemsLoadingState message="Memuat data items..." />;
  }

  // Show error state for initial load
  if (mainError && items.length === 0) {
    return <ItemsErrorState error={mainError} onRetry={() => refetchItems()} />;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Card */}
      <ItemsStatistics statistics={statistics} />

      {/* Main Content Card */}
      <Card className="relative">
        {/* Header */}
        <ItemsHeader
          viewMode={viewMode}
          onFilter={handleFilter}
          onAddItem={handleAddItem}
          onAddMaster={handleAddMaster}
          onAddVariant={handleAddVariant}
        />

        {/* View Mode Toggle and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 space-y-4">
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />

          <ItemsFilters
            viewMode={viewMode}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedOffice={selectedOffice}
            onOfficeChange={handleOfficeChange}
            itemMasters={itemMastersHook.data}
            offices={offices}
          />
        </div>

        {/* Items Table */}
        <ItemsTable
          viewMode={viewMode}
          groupedItems={groupedItems}
          itemMasters={itemMastersHook.data}
          itemVariants={itemVariantsHook.data}
          expandedGroups={expandedGroups}
          loading={itemsLoading}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedOffice={selectedOffice}
          onToggleExpand={handleToggleExpand}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onViewItem={handleViewItem}
          onEditMaster={handleEditMaster}
          onDeleteMaster={handleDeleteMaster}
          onEditVariant={handleEditVariant}
          onDeleteVariant={handleDeleteVariant}
        />

        {/* Table Footer */}
        <ItemsTableFooter
          viewMode={viewMode}
          itemsCount={itemsCount}
          itemsLength={items.length}
          mastersCount={itemMastersHook.count}
          mastersLength={itemMastersHook.data.length}
          variantsCount={itemVariantsHook.count}
          variantsLength={itemVariantsHook.data.length}
          onAddMaster={handleAddMaster}
          onAddVariant={handleAddVariant}
        />
      </Card>

      {/* Modals */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        onCreateMaster={handleAddMaster}
        onCreateVariant={handleAddVariant}
        item={editingItem}
        itemMasters={itemMastersHook.data}
        itemVariants={itemVariantsHook.data}
        mode={modalMode}
        checkItemCodeExists={itemsHook.checkItemCodeExists}
        generateItemCode={generateItemCode}
        generateSequentialCodes={generateSequentialCodes}
      />

      <ItemMasterModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        onSave={handleSaveMaster}
        itemMaster={editingMaster}
        mode={modalMode}
        checkNameExists={itemMastersHook.checkNameExists}
        offices={offices}
        officesLoading={false}
      />

      <ItemVariantModal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        onSave={handleSaveVariant}
        itemVariant={editingVariant}
        mode={modalMode}
        checkNameExists={itemVariantsHook.checkNameExists}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
      />
    </div>
  );
};

export default ItemsPage;
