// src/app/(frontend)/(dashboard)/items/page.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Plus,
  Filter,
  Package,
  Grid,
  List,
  Search,
  Loader2,
  Trash2,
  Edit,
} from "lucide-react";
import { ItemModal } from "@/items/components/ItemModal";
import { ItemMasterModal } from "@/items/components/ItemMasterModal";
import { ItemVariantModal } from "@/items/components/ItemVariantModal";
import { ConfirmModal } from "@/items/components/ConfirmModal";
import {
  ContentWrapper,
  PageHeader,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Select,
  Badge,
  MetricCard,
} from "@/fe/components/index";
import {
  useItemsPage,
  useItemMasters,
  useItemVariants,
  useItems,
} from "./useItems";
import { useModalManager } from "./useModalManager";
import type { Tables } from "@/types/database";

// Type definitions
type ViewItemsFull = Tables<"view_items_full">;
type ItemMaster = Tables<"item_masters">;
type ItemVariant = Tables<"item_variants">;
type ViewMode = "items" | "masters" | "variants";

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

const ItemsPage: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("items");
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal Manager Hook
  const modalManager = useModalManager();

  // Memoize filters
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

  // Hooks
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

  const itemMastersHook = useItemMasters();
  const itemVariantsHook = useItemVariants();
  const itemsHook = useItems();

  // Update filters with debounce
  const updateFilters = useCallback(() => {
    const newFilters: any = { page: 1, limit: 50 };
    if (searchTerm.trim()) newFilters.search = searchTerm.trim();
    if (selectedCategory) newFilters.item_master_id = selectedCategory;
    if (selectedOffice) newFilters.office_id = selectedOffice;
    updateItemsFilters(newFilters);
  }, [searchTerm, selectedCategory, selectedOffice, updateItemsFilters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => updateFilters(), 300);
    return () => clearTimeout(timeoutId);
  }, [updateFilters]);

  // Group items by category
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
          office: { id: item.office_id, name: item.office_name },
        };
      }
      if (masterId) groups[masterId].items.push(item);
    });

    Object.values(groups).forEach((group) => {
      if (group.office.id) {
        const office = offices.find((o) => o.id === group.office.id);
        if (office) group.office.location = office.location;
      }
    });

    return Object.values(groups);
  }, [items, offices]);

  // Handlers
  const handleToggleExpand = useCallback((masterId: string) => {
    setExpandedGroups((prev) => {
      const newExpanded = new Set(prev);
      newExpanded.has(masterId)
        ? newExpanded.delete(masterId)
        : newExpanded.add(masterId);
      return newExpanded;
    });
  }, []);

  const generateSequentialCodes = useCallback(
    async (baseCode: string, count: number): Promise<string[]> => {
      const codes: string[] = [];
      const parts = baseCode.split("-");
      const prefix = parts.slice(0, -1).join("-");
      const startNumber = parseInt(parts[parts.length - 1]) || 1;

      for (let i = 0; i < count; i++) {
        const number = startNumber + i;
        codes.push(`${prefix}-${number.toString().padStart(3, "0")}`);
      }
      return codes;
    },
    []
  );

  // Modal open handlers - simplified using modal manager
  const handleAddItem = useCallback(() => {
    modalManager.openItemModal("create");
  }, [modalManager]);

  const handleAddMaster = useCallback(() => {
    modalManager.openMasterModal("create");
  }, [modalManager]);

  const handleAddVariant = useCallback(() => {
    modalManager.openVariantModal("create");
  }, [modalManager]);

  // Handlers for opening master/variant from ItemModal (with parent tracking)
  const handleAddMasterFromItemModal = useCallback(() => {
    modalManager.openMasterModal("create", undefined, "item");
  }, [modalManager]);

  const handleAddVariantFromItemModal = useCallback(() => {
    modalManager.openVariantModal("create", undefined, "item");
  }, [modalManager]);

  // Edit handlers - simplified
  const handleEditItem = useCallback(
    (item: ViewItemsFull, e: React.MouseEvent) => {
      e.stopPropagation();
      modalManager.openItemModal("edit", item);
    },
    [modalManager]
  );

  const handleEditMaster = useCallback(
    (master: ItemMaster, e: React.MouseEvent) => {
      e.stopPropagation();
      modalManager.openMasterModal("edit", master);
    },
    [modalManager]
  );

  const handleEditVariant = useCallback(
    (variant: ItemVariant, e: React.MouseEvent) => {
      e.stopPropagation();
      modalManager.openVariantModal("edit", variant);
    },
    [modalManager]
  );

  // Delete handlers - simplified
  const handleDeleteItem = useCallback(
    (item: ViewItemsFull, e: React.MouseEvent) => {
      e.stopPropagation();
      modalManager.openDeleteModal({
        type: "item",
        id: item.item_id,
        name: item.item_name,
      });
    },
    [modalManager]
  );

  const handleDeleteMaster = useCallback(
    (master: ItemMaster, e: React.MouseEvent) => {
      e.stopPropagation();
      modalManager.openDeleteModal({
        type: "master",
        id: master.id,
        name: master.name,
      });
    },
    [modalManager]
  );

  const handleDeleteVariant = useCallback(
    (variant: ItemVariant, e: React.MouseEvent) => {
      e.stopPropagation();
      modalManager.openDeleteModal({
        type: "variant",
        id: variant.id,
        name: variant.name,
      });
    },
    [modalManager]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!modalManager.deletePayload?.id) return;

    const { type, id } = modalManager.deletePayload;
    setIsDeleting(true);
    try {
      let success = false;

      switch (type) {
        case "item":
          success = await itemsHook.deleteItem(id);
          break;
        case "master":
          success = await itemMastersHook.deleteItemMaster(id);
          break;
        case "variant":
          success = await itemVariantsHook.deleteItemVariant(id);
          break;
      }

      if (success) {
        refetchItems();
        modalManager.closeModal();
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [
    modalManager,
    itemsHook,
    itemMastersHook,
    itemVariantsHook,
    refetchItems,
  ]);

  const handleSaveItem = useCallback(
    async (data: any) => {
      try {
        let result;
        if (
          modalManager.modalMode === "edit" &&
          modalManager.itemPayload?.item_id
        ) {
          result = await itemsHook.updateItem({
            id: modalManager.itemPayload.item_id,
            ...data,
          });
        } else {
          if (data.items && Array.isArray(data.items)) {
            const baseCode = data.baseItemCode || (await generateItemCode());
            const codes = await generateSequentialCodes(
              baseCode,
              data.items.length
            );
            const results = await Promise.all(
              data.items.map((itemData: any, index: number) =>
                itemsHook.createItem({
                  ...itemData,
                  item_code: codes[index],
                  item_master_id: data.item_master_id,
                })
              )
            );
            result = results.every((r) => r !== null);
          } else {
            result = await itemsHook.createItem({
              ...data,
              item_master_id: data.item_master_id,
            });
          }
        }

        if (result) {
          modalManager.closeModal();
          refetchItems();
          return { success: true };
        }
        return { success: false, error: "Gagal menyimpan item" };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        };
      }
    },
    [
      modalManager,
      itemsHook,
      generateItemCode,
      generateSequentialCodes,
      refetchItems,
    ]
  );

  const handleSaveMaster = useCallback(
    async (data: any) => {
      try {
        const result =
          modalManager.modalMode === "edit" && modalManager.masterPayload
            ? await itemMastersHook.updateItemMaster(data)
            : await itemMastersHook.createItemMaster(data);

        if (result) {
          modalManager.closeModal();
          refetchItems();
          return { success: true };
        }
        return { success: false, error: "Gagal menyimpan kategori" };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        };
      }
    },
    [modalManager, itemMastersHook, refetchItems]
  );

  const handleSaveVariant = useCallback(
    async (data: any) => {
      try {
        const result =
          modalManager.modalMode === "edit" && modalManager.variantPayload
            ? await itemVariantsHook.updateItemVariant(data)
            : await itemVariantsHook.createItemVariant(data);

        if (result) {
          modalManager.closeModal();
          refetchItems();
          return { success: true };
        }
        return { success: false, error: "Gagal menyimpan variant" };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Terjadi kesalahan",
        };
      }
    },
    [modalManager, itemVariantsHook, refetchItems]
  );

  // Transform data for selects
  const categoryOptions = itemMastersHook.data
    .filter((m) => m.name)
    .map((m) => ({
      value: m.id,
      label: m.name as string,
    }));

  const officeOptions = offices
    .filter((o) => o.name)
    .map((o) => ({
      value: o.id,
      label: o.location ? `${o.name} - ${o.location}` : (o.name as string),
    }));

  // Transform itemMasters for ItemModal (exclude offices property)
  const itemMastersForModal = useMemo(
    () =>
      itemMastersHook.data.map((m) => {
        const { offices, ...itemMaster } = m;
        return itemMaster as ItemMaster;
      }),
    [itemMastersHook.data]
  );

  // Get delete confirmation message
  const getDeleteMessage = () => {
    if (!modalManager.deletePayload) return "";
    const { type, name } = modalManager.deletePayload;

    switch (type) {
      case "item":
        return `Item "${name}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`;
      case "master":
        return `Kategori "${name}" dan semua item terkait akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`;
      case "variant":
        return `Variant "${name}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`;
      default:
        return "Data akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.";
    }
  };

  // Loading state
  if (mainLoading && items.length === 0) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-lg text-surface-variant-foreground">
            Memuat data items...
          </p>
        </div>
      </ContentWrapper>
    );
  }

  // Error state
  if (mainError && items.length === 0) {
    return (
      <ContentWrapper>
        <Card variant="outline">
          <CardContent className="text-center py-20">
            <div className="text-error text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-surface-variant-foreground mb-6">{mainError}</p>
            <Button variant="primary" onClick={() => refetchItems()}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper maxWidth="full">
      {/* Page Header */}
      <PageHeader
        title="Item Management"
        subtitle="Kelola kategori, variant, dan item barang"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={() => console.log("Filter")}
            >
              Filter
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleAddItem}
            >
              Tambah Item
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>Item Data</CardTitle>
              <CardDescription>
                {viewMode === "items" && `${itemsCount} items total`}
                {viewMode === "masters" &&
                  `${itemMastersHook.count} categories`}
                {viewMode === "variants" &&
                  `${itemVariantsHook.count} variants`}
              </CardDescription>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-surface-variant p-1 rounded-lg border-2 border-outline">
              <Button
                variant={viewMode === "items" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("items")}
              >
                Items
              </Button>
              <Button
                variant={viewMode === "masters" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("masters")}
              >
                Categories
              </Button>
              <Button
                variant={viewMode === "variants" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("variants")}
              >
                Variants
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="search"
              clearable
              onClear={() => setSearchTerm("")}
            />

            {viewMode === "items" && (
              <>
                <Select
                  placeholder="All Categories"
                  options={categoryOptions}
                  value={selectedCategory}
                  onValueChange={(val) => setSelectedCategory(val as string)}
                  clearable
                />
                <Select
                  placeholder="All Offices"
                  options={officeOptions}
                  value={selectedOffice}
                  onValueChange={(val) => setSelectedOffice(val as string)}
                  clearable
                />
              </>
            )}
          </div>

          {/* Content based on view mode */}
          {itemsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : viewMode === "items" ? (
            <div className="space-y-4">
              {groupedItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-surface-variant-foreground mx-auto mb-4" />
                  <p className="text-lg text-foreground font-medium mb-2">
                    No items found
                  </p>
                  <p className="text-surface-variant-foreground mb-6">
                    Start by adding your first item
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleAddItem}
                    leftIcon={<Plus />}
                  >
                    Add Item
                  </Button>
                </div>
              ) : (
                groupedItems.map((group) => (
                  <Card key={group.master.id} variant="outline" hoverable>
                    <CardContent>
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => handleToggleExpand(group.master.id)}
                      >
                        <div className="flex items-center gap-4">
                          {group.master.img_url && (
                            <img
                              src={group.master.img_url}
                              alt={group.master.name || ""}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-outline"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {group.master.name}
                            </h3>
                            <p className="text-sm text-surface-variant-foreground">
                              {group.items.length} items • {group.office.name}
                            </p>
                          </div>
                        </div>
                        <Badge variant="primary">{group.master.type}</Badge>
                      </div>

                      {expandedGroups.has(group.master.id) && (
                        <div className="mt-4 space-y-2 border-t-2 border-outline pt-4">
                          {group.items.map((item) => (
                            <div
                              key={item.item_id}
                              className="flex items-center justify-between p-3 bg-surface-variant rounded-lg group hover:bg-surface-variant/80 transition-colors"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-foreground">
                                  {item.item_name}
                                </p>
                                <p className="text-sm text-surface-variant-foreground">
                                  {item.item_code} • {item.unit}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                {item.variant_name && (
                                  <Badge variant="info" size="sm">
                                    {item.variant_name}
                                  </Badge>
                                )}

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleEditItem(item, e)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="w-4 h-4 text-warning" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleDeleteItem(item, e)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="w-4 h-4 text-error" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : viewMode === "masters" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itemMastersHook.data.map((master) => (
                <Card
                  key={master.id}
                  variant="outline"
                  hoverable
                  clickable
                  className="group"
                >
                  <CardContent>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground flex-1">
                        {master.name}
                      </h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity me-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEditMaster(master, e)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4 text-warning" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteMaster(master, e)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4 text-error" />
                        </Button>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col items-end gap-2">
                          {master.type && (
                            <Badge variant="primary" size="sm">
                              {master.type}
                            </Badge>
                          )}
                          {master.offices?.name && (
                            <Badge variant="info" size="sm">
                              {master.offices.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {master.img_url && (
                      <img
                        src={master.img_url}
                        alt={master.name || "Item Master"}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}

              <Card
                variant="outline"
                hoverable
                clickable
                onClick={handleAddMaster}
                className="border-dashed"
              >
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Plus className="w-12 h-12 text-surface-variant-foreground mb-2" />
                  <p className="text-sm text-surface-variant-foreground">
                    Add Category
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {itemVariantsHook.data.map((variant) => (
                <Card
                  key={variant.id}
                  variant="outline"
                  hoverable
                  className="group"
                >
                  <CardContent className="text-center pt-4 relative">
                    <p className="font-semibold text-foreground mb-2">
                      {variant.name}
                    </p>

                    <div className="flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleEditVariant(variant, e)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4 text-warning" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteVariant(variant, e)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card
                variant="outline"
                hoverable
                clickable
                onClick={handleAddVariant}
                className="border-dashed"
              >
                <CardContent className="flex flex-col items-center justify-center py-1">
                  <Plus className="w-8 h-8 text-surface-variant-foreground mb-1" />
                  <p className="text-sm text-surface-variant-foreground">
                    Add Variant
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <MetricCard
          title="Total Items"
          value={statistics?.totalItems || 0}
          icon={Package}
          color="primary"
          subtitle="items"
        />
        <MetricCard
          title="Categories"
          value={statistics?.totalItemMasters || 0}
          icon={Grid}
          color="success"
          subtitle="categories"
        />
        <MetricCard
          title="Variants"
          value={statistics?.totalVariants || 0}
          icon={List}
          color="warning"
          subtitle="variants"
        />
      </div>

      {/* Modals */}
      <ItemModal
        isOpen={modalManager.isItemModalOpen}
        onClose={modalManager.closeModal}
        onSave={handleSaveItem}
        onCreateMaster={handleAddMasterFromItemModal}
        onCreateVariant={handleAddVariantFromItemModal}
        item={modalManager.itemPayload}
        itemMasters={itemMastersForModal}
        itemVariants={itemVariantsHook.data}
        mode={modalManager.modalMode || "create"}
        checkItemCodeExists={itemsHook.checkItemCodeExists}
        generateItemCode={generateItemCode}
        generateSequentialCodes={generateSequentialCodes}
      />

      <ItemMasterModal
        isOpen={modalManager.isMasterModalOpen}
        onClose={modalManager.closeModal}
        onSave={handleSaveMaster}
        itemMaster={modalManager.masterPayload}
        mode={modalManager.modalMode || "create"}
        checkNameExists={itemMastersHook.checkNameExists}
        offices={offices}
        officesLoading={false}
      />

      <ItemVariantModal
        isOpen={modalManager.isVariantModalOpen}
        onClose={modalManager.closeModal}
        onSave={handleSaveVariant}
        itemVariant={modalManager.variantPayload}
        mode={modalManager.modalMode || "create"}
        checkNameExists={itemVariantsHook.checkNameExists}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={modalManager.isDeleteModalOpen}
        onClose={modalManager.closeModal}
        onConfirm={handleConfirmDelete}
        title="Hapus Data"
        message={getDeleteMessage()}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </ContentWrapper>
  );
};

export default ItemsPage;
