// src/app/(dashboard)/items/page.tsx
"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Package, Plus, Filter, Eye, Edit, Trash2 } from "lucide-react";
import {
  Card,
  ActionButton,
  PageHeader,
  SearchFilter,
  StatsGrid,
  Table,
  StatusBadge,
} from "@/app/(frontend)/(dashboard)/components/ui";
import { useItems, useItemMasters, useOffices } from "./useItems";
import { Item, ItemFilters, ItemMaster } from "./items.type";
import { ItemModal } from "./components/ItemModal";
import { ItemMasterModal } from "./components/ItemMasterModal";

const ItemsPage: React.FC = () => {
  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal states
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingMaster, setEditingMaster] = useState<ItemMaster | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Initialize hooks
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
  } = useItems();

  const {
    itemMasters,
    loading: mastersLoading,
    createItemMaster,
    updateItemMaster,
    deleteItemMaster,
    checkItemMasterNameExists,
    refetch: refetchMasters,
  } = useItemMasters();

  const {
    offices,
    loading: officesLoading,
    error: officesError,
  } = useOffices();

  // Debug logging for state changes
  useEffect(() => {
    console.log("📊 Items Page State Update:", {
      itemsCount: items.length,
      loading,
      error,
      totalCount,
      mastersCount: itemMasters.length,
      mastersLoading,
      officesCount: offices.length,
      officesLoading,
      officesError,
      currentFilters: filters,
    });
  }, [
    items,
    loading,
    error,
    totalCount,
    itemMasters,
    mastersLoading,
    filters,
    offices,
    officesLoading,
    officesError,
  ]);

  // Simplified debounced update - removed complex debounce logic
  const updateFiltersWithDebounce = useCallback(
    (newFilters: Partial<ItemFilters>) => {
      console.log("🔧 Updating filters from UI:", newFilters);
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  // Simplified filter sync - no debouncing, direct update
  useEffect(() => {
    const newFilters: Partial<ItemFilters> = {
      search: searchTerm || undefined,
      item_master_id: selectedCategory || undefined,
    };

    console.log("🎯 Syncing UI filters to hook:", {
      searchTerm,
      selectedCategory,
      newFilters,
    });

    updateFiltersWithDebounce(newFilters);
  }, [searchTerm, selectedCategory, updateFiltersWithDebounce]);

  // Categories options from item masters
  const categories = useMemo(() => {
    const options = [
      { value: "", label: "Semua Kategori" },
      ...itemMasters.map((master) => ({
        value: master.id,
        label: `${master.name} (${master.type})`,
      })),
    ];

    console.log("📋 Categories options generated:", options);
    return options;
  }, [itemMasters]);

  const statuses = [
    { value: "", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Tidak Aktif" },
    { value: "discontinued", label: "Dihentikan" },
  ];

  // Memoized stats calculation
  const statsData = useMemo(() => {
    const stats = [
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

    console.log("📈 Stats calculated:", stats);
    return stats;
  }, [items, totalCount]);

  // Modal handlers
  const handleAddItem = useCallback(() => {
    console.log("➕ Opening add item modal");
    setEditingItem(null);
    setModalMode("create");
    setIsItemModalOpen(true);
  }, []);

  const handleAddMaster = useCallback(() => {
    console.log("➕ Opening add master modal");
    setEditingMaster(null);
    setModalMode("create");
    setIsMasterModalOpen(true);
  }, []);

  const handleCreateMasterFromItemModal = useCallback(() => {
    console.log("🔄 Switching from item modal to master modal");
    setIsItemModalOpen(false);
    handleAddMaster();
  }, [handleAddMaster]);

  const handleViewItem = useCallback(
    async (id: string) => {
      console.log("👁️ Viewing item:", id);
      const item = await getItem(id);
      if (item) {
        console.log("📋 Item details:", JSON.stringify(item, null, 2));
      }
    },
    [getItem]
  );

  const handleEditItem = useCallback(
    async (id: string) => {
      console.log("✏️ Editing item:", id);
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
      console.log("🗑️ Attempting to delete item:", id);
      if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
        console.log("🗑️ Deleting item:", id);
        const result = await deleteItem(id);
        if (result.success) {
          console.log("✅ Item deleted successfully");
        } else {
          console.error("❌ Failed to delete item:", result.error);
        }
      }
    },
    [deleteItem]
  );

  // Save handlers
  const handleSaveItem = useCallback(
    async (data: any) => {
      console.log("💾 Saving item:", { mode: modalMode, data });

      if (modalMode === "create") {
        const result = await createItem(data);
        console.log("✅ Create item result:", result);
        return result;
      } else {
        const result = await updateItem(data);
        console.log("✅ Update item result:", result);
        return result;
      }
    },
    [modalMode, createItem, updateItem]
  );

  const handleSaveMaster = useCallback(
    async (data: any) => {
      console.log("💾 Saving item master:", { mode: modalMode, data });

      if (modalMode === "create") {
        const result = await createItemMaster(data);
        console.log("✅ Create master result:", result);
        if (result.success) {
          refetchMasters();
        }
        return result;
      } else {
        const result = await updateItemMaster(data);
        console.log("✅ Update master result:", result);
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
    console.log("🔄 Resetting all filters");
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    resetFilters();
  }, [resetFilters]);

  // Table columns
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

  console.log("🎭 About to render - Final state check:", {
    loading,
    error,
    itemsLength: items.length,
    showLoadingSpinner: loading,
  });

  // Show error state if there's an error
  if (error) {
    console.error("💥 Rendering error state:", error);
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

  console.log("🎨 Rendering items page with state:", {
    loading,
    itemsLength: items.length,
    mastersLoading,
    mastersLength: itemMasters.length,
    officesLoading,
    officesLength: offices.length,
  });

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
            <p className="mt-1 text-xs text-gray-500">
              Check console for detailed logs
            </p>
          </div>
        ) : (
          <>
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
            <div className="text-xs text-gray-400 text-center mt-2">
              Debug: Showing table with {items.length} items (loading ={" "}
              {loading.toString()})
            </div>
          </>
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
          console.log("❌ Closing item modal");
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
          console.log("❌ Closing master modal");
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
        offices={offices}
        officesLoading={officesLoading}
      />
    </div>
  );
};

export default ItemsPage;
