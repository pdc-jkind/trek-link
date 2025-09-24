// src/app/(frontend)/(dashboard)/items/components/ItemsTable.tsx
"use client";

import React from "react";
import { Package, Tag, ChevronDown, ChevronRight } from "lucide-react";
import { EmptyState } from "@/items/components/ui/EmptyState";
import { LoadingSpinner } from "@/items/components/ui/LoadingSpinner";
import { ItemsTableActions } from "./ItemsTableActions";
import { Tables } from "@/types/database";

type ViewItemsFull = Tables<"view_items_full">;
type ItemMaster = Tables<"item_masters">;
type ItemVariant = Tables<"item_variants">;

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

interface ItemsTableProps {
  viewMode: "items" | "masters" | "variants";
  groupedItems: ItemGroup[];
  itemMasters: ItemMaster[];
  itemVariants: ItemVariant[];
  expandedGroups: Set<string>;
  loading: boolean;
  searchTerm: string;
  selectedCategory: string;
  selectedOffice: string;
  onToggleExpand: (masterId: string) => void;
  onEditItem: (item: ViewItemsFull) => void;
  onDeleteItem: (item: ViewItemsFull) => void;
  onViewItem?: (item: ViewItemsFull) => void;
  onEditMaster: (master: ItemMaster) => void;
  onDeleteMaster: (master: ItemMaster) => void;
  onEditVariant: (variant: ItemVariant) => void;
  onDeleteVariant: (variant: ItemVariant) => void;
}

export const ItemsTable: React.FC<ItemsTableProps> = ({
  viewMode,
  groupedItems,
  itemMasters,
  itemVariants,
  expandedGroups,
  loading,
  searchTerm,
  selectedCategory,
  selectedOffice,
  onToggleExpand,
  onEditItem,
  onDeleteItem,
  onViewItem,
  onEditMaster,
  onDeleteMaster,
  onEditVariant,
  onDeleteVariant,
}) => {
  const getTableHeaders = () => {
    if (viewMode === "masters") {
      return [
        "Image",
        "Nama Kategori",
        "Tanggal Dibuat",
        "Tanggal DiUpdate",
        "Aksi",
      ];
    } else if (viewMode === "variants") {
      return [
        "Icon",
        "Nama Variant",
        "Tanggal Dibuat",
        "Tanggal DiUpdate",
        "Aksi",
      ];
    } else {
      return ["Image", "PDC", "Kategori (KF/INV)", "Nama Barang", "Aksi"];
    }
  };

  const getDisplayName = (itemName: string | null): string => {
    if (!itemName) return "";
    const nameMap: { [key: string]: string } = {
      BD: "Backdoor",
      FD: "Full Depan",
    };
    return nameMap[itemName] || itemName;
  };

  const getBadgeClasses = (type: string) => {
    switch (type) {
      case "regular":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200";
      case "inventory":
        return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const renderTableContent = () => {
    if (viewMode === "masters") {
      return (
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {itemMasters.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-0">
                <EmptyState
                  icon={<Package className="w-12 h-12 mx-auto" />}
                  title="Belum ada data kategori"
                  description="Mulai dengan menambahkan kategori barang baru."
                />
              </td>
            </tr>
          ) : (
            itemMasters.map((master, index) => (
              <tr
                key={master.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 px-6">
                  <div className="relative group">
                    <img
                      src={master.img_url || "/img/mobil.webp"}
                      alt={master.name || "Item Master"}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-card group-hover:shadow-card-hover transition-all duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200" />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {master.name}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${getBadgeClasses(
                        master.type
                      )}`}
                    >
                      {master.type?.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(master.created_at || "").toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(master.updated_at || "").toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <ItemsTableActions
                    onEdit={() => onEditMaster(master)}
                    onDelete={() => onDeleteMaster(master)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      );
    }

    if (viewMode === "variants") {
      return (
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {itemVariants.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-0">
                <EmptyState
                  icon={<Tag className="w-12 h-12 mx-auto" />}
                  title="Belum ada data variant"
                  description="Mulai dengan menambahkan variant barang baru."
                />
              </td>
            </tr>
          ) : (
            itemVariants.map((variant, index) => (
              <tr
                key={variant.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 px-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-card hover:shadow-card-hover transition-all duration-200 group">
                    <Tag className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {variant.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Variant
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(variant.created_at || "").toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(variant.updated_at || "").toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <ItemsTableActions
                    onEdit={() => onEditVariant(variant)}
                    onDelete={() => onDeleteVariant(variant)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      );
    }

    // Default items view
    return (
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {groupedItems.length === 0 ? (
          <tr>
            <td colSpan={5} className="p-0">
              <EmptyState
                icon={<Package className="w-12 h-12 mx-auto" />}
                title={
                  searchTerm || selectedCategory || selectedOffice
                    ? "Tidak ada barang yang sesuai dengan filter"
                    : "Belum ada data barang"
                }
                description={
                  searchTerm || selectedCategory || selectedOffice
                    ? "Coba ubah filter pencarian atau tambahkan barang baru."
                    : "Mulai dengan menambahkan barang baru ke inventory."
                }
              />
            </td>
          </tr>
        ) : (
          groupedItems.map((group, index) => (
            <tr
              key={group.master.id}
              className={`
                hover:bg-gray-50 dark:hover:bg-gray-700/50 
                transition-all duration-200 animate-fade-in
                ${
                  group.items.length > 1
                    ? "cursor-pointer hover:shadow-soft"
                    : ""
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => {
                if (group.items.length > 1) {
                  onToggleExpand(group.master.id);
                }
              }}
            >
              {/* Image */}
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <img
                      src={group.master.img_url || "/img/mobil.webp"}
                      alt={group.master.name || "Item"}
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-card group-hover:shadow-card-hover transition-all duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200" />
                  </div>
                  {group.items.length > 1 && (
                    <div className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                      {expandedGroups.has(group.master.id) ? (
                        <ChevronDown className="w-5 h-5 animate-pulse" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>
              </td>

              {/* PDC */}
              <td className="py-4 px-6">
                {group.office && (
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {group.office.name}
                    </div>
                    {group.office.location && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {group.office.location}
                      </div>
                    )}
                  </div>
                )}
              </td>

              {/* Kategori */}
              <td className="py-4 px-6">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {group.master.name}
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${getBadgeClasses(
                      group.master.type ?? ""
                    )}`}
                  >
                    {group.master.type?.toUpperCase()}
                  </span>
                </div>
              </td>

              {/* Nama Barang */}
              <td className="py-4 px-6">
                <div className="space-y-3">
                  {/* First item is always shown */}
                  {group.items.slice(0, 1).map((item) => (
                    <div
                      key={item.item_id}
                      className="border-l-4 border-primary-400 dark:border-primary-500 pl-4 bg-primary-50/30 dark:bg-primary-900/10 rounded-r-lg py-2 transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {getDisplayName(item.item_name)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2 mt-1">
                        {item.variant_name && (
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                            {item.variant_name}
                          </span>
                        )}
                        <span className="font-medium">{item.unit}</span>
                        {item.alt_unit && item.conversion_to_base && (
                          <span className="text-gray-400 dark:text-gray-500 text-xs">
                            • {item.alt_unit} ({item.conversion_to_base}:1)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Show remaining items if expanded */}
                  {group.items.length > 1 &&
                    expandedGroups.has(group.master.id) && (
                      <div className="space-y-2 animate-slide-down">
                        {group.items.slice(1).map((item) => (
                          <div
                            key={item.item_id}
                            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-r-lg py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {getDisplayName(item.item_name)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2 mt-1">
                              {item.variant_name && (
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                                  {item.variant_name}
                                </span>
                              )}
                              <span className="font-medium">{item.unit}</span>
                              {item.alt_unit && item.conversion_to_base && (
                                <span className="text-gray-400 dark:text-gray-500 text-xs">
                                  • {item.alt_unit} ({item.conversion_to_base}
                                  :1)
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Show count if collapsed and more than 1 item */}
                  {group.items.length > 1 &&
                    !expandedGroups.has(group.master.id) && (
                      <div className="text-xs text-primary-600 dark:text-primary-400 font-medium cursor-pointer hover:text-primary-800 dark:hover:text-primary-200 transition-colors duration-200 bg-primary-50 dark:bg-primary-900/20 px-3 py-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40">
                        +{group.items.length - 1} item lainnya (klik untuk
                        expand)
                      </div>
                    )}
                </div>
              </td>

              {/* Actions */}
              <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-3">
                  {/* First item actions */}
                  <ItemsTableActions
                    onView={
                      onViewItem ? () => onViewItem(group.items[0]) : undefined
                    }
                    onEdit={() => onEditItem(group.items[0])}
                    onDelete={() => onDeleteItem(group.items[0])}
                    showView={!!onViewItem}
                  />

                  {/* Actions for remaining items if expanded */}
                  {group.items.length > 1 &&
                    expandedGroups.has(group.master.id) && (
                      <div className="space-y-2 animate-slide-down">
                        {group.items.slice(1).map((item) => (
                          <div
                            key={item.item_id}
                            className="pt-2 border-t border-gray-100 dark:border-gray-700"
                          >
                            <ItemsTableActions
                              onView={
                                onViewItem ? () => onViewItem(item) : undefined
                              }
                              onEdit={() => onEditItem(item)}
                              onDelete={() => onDeleteItem(item)}
                              showView={!!onViewItem}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-card">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-20 animate-fade-in">
          <div className="flex flex-col items-center space-y-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Memuat data...
            </p>
          </div>
        </div>
      )}

      {/* Enhanced scrollable table */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scrollbar-thumb-rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <colgroup>
            <col className="w-40" />
            <col className="w-36" />
            <col className="w-58" />
            <col />
            <col className="w-32" />
          </colgroup>
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <tr>
              {getTableHeaders().map((header, index) => (
                <th
                  key={index}
                  className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-gray-100 text-sm tracking-wide uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          {renderTableContent()}
        </table>
      </div>
    </div>
  );
};
