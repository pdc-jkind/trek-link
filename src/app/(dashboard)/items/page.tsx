// src/app/(dashboard)/items/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Package, Plus, Filter, Eye, Edit, Trash2 } from "lucide-react";
import {
  Card,
  ActionButton,
  PageHeader,
  SearchFilter,
  StatsGrid,
  Table,
  StatusBadge,
} from "@/app/(dashboard)/components/ui";
import { useItems, useItemMasters } from "./useItems";
import { Item, ItemFilters, ItemMaster } from "./items.type";
import { ItemModal } from "./components/ItemModal";
import { ItemMasterModal } from "./components/ItemMasterModal";

const ItemsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingMaster, setEditingMaster] = useState<ItemMaster | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Initialize filters for the hook
  const initialFilters: ItemFilters = {
    search: searchTerm || undefined,
    item_master_id: selectedCategory || undefined,
    page: 1,
    limit: 50,
  };

  // Use the custom hooks for items and masters management
  const {
    items,
    loading,
    error,
    totalCount,
    filters,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    updateFilters,
    resetFilters,
    refetch,
    checkItemCodeExists,
    generateItemCode,
  } = useItems(initialFilters);

  const {
    itemMasters,
    loading: mastersLoading,
    createItemMaster,
    updateItemMaster,
    deleteItemMaster,
    checkItemMasterNameExists,
    refetch: refetchMasters,
  } = useItemMasters();

  // Debounced update function
  const debouncedUpdateFilters = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (newFilters: Partial<ItemFilters>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateFilters(newFilters);
        }, 300);
      };
    })(),
    [updateFilters]
  );

  // Update filters when local state changes
  useEffect(() => {
    const newFilters: Partial<ItemFilters> = {};

    if (searchTerm !== (filters.search || "")) {
      newFilters.search = searchTerm || undefined;
    }

    if (selectedCategory !== (filters.item_master_id || "")) {
      newFilters.item_master_id = selectedCategory || undefined;
    }

    // Only update if there are actual changes
    if (Object.keys(newFilters).length > 0) {
      debouncedUpdateFilters(newFilters);
    }
  }, [
    searchTerm,
    selectedCategory,
    filters.search,
    filters.item_master_id,
    debouncedUpdateFilters,
  ]);

  // Categories options from item masters
  const categories = useMemo(() => {
    return [
      { value: "", label: "Semua Kategori" },
      ...itemMasters.map((master) => ({
        value: master.id,
        label: `${master.name} (${master.type})`,
      })),
    ];
  }, [itemMasters]);

  const statuses = [
    { value: "", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Tidak Aktif" },
    { value: "discontinued", label: "Dihentikan" },
  ];

  // Memoized stats calculation
  const statsData = useMemo(() => {
    return [
      {
        title: "Total Items",
        value: totalCount.toString(),
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Regular Items",
        value: items
          .filter((item) => item.item_master?.type === "regular")
          .length.toString(),
        color: "from-green-500 to-green-600",
      },
      {
        title: "Inventory Items",
        value: items
          .filter((item) => item.item_master?.type === "inventory")
          .length.toString(),
        color: "from-yellow-500 to-yellow-600",
      },
      {
        title: "With Alt Unit",
        value: items.filter((item) => item.alt_unit).length.toString(),
        color: "from-purple-500 to-purple-600",
      },
    ];
  }, [items, totalCount]);

  // Modal handlers
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

  const handleCreateMasterFromItemModal = useCallback(() => {
    setIsItemModalOpen(false);
    handleAddMaster();
  }, [handleAddMaster]);

  const handleViewItem = useCallback(
    async (id: string) => {
      console.log("Viewing item:", id);
      const item = await getItem(id);
      if (item) {
        console.log("Item details:", item);
      }
    },
    [getItem]
  );

  const handleEditItem = useCallback(
    async (id: string) => {
      const item = await getItem(id);
      if (item) {
        setEditingItem(item);
        setModalMode("edit");
        setIsItemModalOpen(true);
      }
    },
    [getItem]
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
        const result = await deleteItem(id);
        if (result.success) {
          console.log("Item deleted successfully");
        } else {
          console.error("Failed to delete item:", result.error);
        }
      }
    },
    [deleteItem]
  );

  // Save handlers
  const handleSaveItem = useCallback(
    async (data: any) => {
      if (modalMode === "create") {
        const result = await createItem(data);
        return result;
      } else {
        const result = await updateItem(data);
        return result;
      }
    },
    [modalMode, createItem, updateItem]
  );

  const handleSaveMaster = useCallback(
    async (data: any) => {
      if (modalMode === "create") {
        const result = await createItemMaster(data);
        if (result.success) {
          refetchMasters();
        }
        return result;
      } else {
        const result = await updateItemMaster(data);
        if (result.success) {
          refetchMasters();
        }
        return result;
      }
    },
    [modalMode, createItemMaster, updateItemMaster, refetchMasters]
  );

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    resetFilters();
  }, [resetFilters]);

  // Table columns - Updated to match actual Item interface
  const columns = [
    {
      key: "item_code",
      label: "Kode Barang",
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: "item_name",
      label: "Nama Barang",
      render: (value: string, row: Item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">
            {row.item_master?.name || "No Category"}
          </div>
        </div>
      ),
    },
    {
      key: "unit",
      label: "Unit",
      render: (value: string, row: Item) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.alt_unit && (
            <div className="text-xs text-gray-500">
              Alt: {row.alt_unit}
              {row.conversion_to_base && ` (${row.conversion_to_base}:1)`}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "item_master",
      label: "Kategori",
      render: (value: ItemMaster | undefined) => (
        <div>
          <div className="font-medium">{value?.name || "No Category"}</div>
          <div className="text-xs text-gray-500 capitalize">{value?.type}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      key: "updated_at",
      label: "Diperbarui",
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      className: "text-center",
      render: (value: any, row: Item) => (
        <div className="flex items-center justify-center space-x-1">
          <button
            onClick={() => handleViewItem(row.id)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditItem(row.id)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
            title="Edit Item"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteItem(row.id)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
            title="Delete Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Page actions
  const headerActions = (
    <>
      <ActionButton
        onClick={() => console.log("Opening filters")}
        variant="blue"
      >
        <Filter className="w-4 h-4" />
        <span>Filter</span>
      </ActionButton>

      <ActionButton
        onClick={handleAddMaster}
        variant="green"
        disabled={mastersLoading}
      >
        <Plus className="w-4 h-4" />
        <span>Tambah Kategori</span>
      </ActionButton>

      <ActionButton onClick={handleAddItem} variant="purple" disabled={loading}>
        <Plus className="w-4 h-4" />
        <span>Tambah Barang</span>
      </ActionButton>
    </>
  );

  const filterOptions = [
    {
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: categories,
      placeholder: "Pilih Kategori",
    },
    {
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: statuses,
      placeholder: "Pilih Status",
    },
  ];

  // Show error state if there's an error
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <Package className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Error Loading Items</h3>
              <p className="text-sm">{error}</p>
            </div>
            <ActionButton onClick={refetch} variant="blue">
              Try Again
            </ActionButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <PageHeader title="Pengelolaan Barang" actions={headerActions} />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterOptions}
          searchPlaceholder="Cari kode barang, nama barang..."
        />

        <StatsGrid stats={statsData} />

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading items...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={items}
            emptyMessage={
              searchTerm || selectedCategory
                ? "Tidak ada barang yang sesuai dengan filter."
                : "Belum ada data barang."
            }
            emptyIcon={Package}
          />
        )}

        {items.length === 0 && !loading && (searchTerm || selectedCategory) && (
          <div className="text-center mt-4">
            <ActionButton onClick={handleResetFilters} variant="blue">
              Reset Filter
            </ActionButton>
          </div>
        )}
      </Card>

      {/* Item Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        onCreateMaster={handleCreateMasterFromItemModal}
        item={editingItem}
        itemMasters={itemMasters}
        mode={modalMode}
        checkItemCodeExists={checkItemCodeExists}
        generateItemCode={generateItemCode}
      />

      {/* Item Master Modal */}
      <ItemMasterModal
        isOpen={isMasterModalOpen}
        onClose={() => {
          setIsMasterModalOpen(false);
          setEditingMaster(null);
          // Reopen item modal if it was previously open
          if (editingItem || modalMode === "create") {
            setIsItemModalOpen(true);
          }
        }}
        onSave={handleSaveMaster}
        itemMaster={editingMaster}
        mode={modalMode}
        checkNameExists={checkItemMasterNameExists}
      />
    </div>
  );
};

export default ItemsPage;
