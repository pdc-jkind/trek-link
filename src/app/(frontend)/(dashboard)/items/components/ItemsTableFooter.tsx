// src/app/(frontend)/(dashboard)/items/components/ItemsTableFooter.tsx
"use client";

import React from "react";
import { Plus } from "lucide-react";
import { ActionButton } from "@/app/(frontend)/(dashboard)/components/actions/ActionButton"; //../../components/ui/ActionButton

interface ItemsTableFooterProps {
  viewMode: "items" | "masters" | "variants";
  itemsCount: number;
  itemsLength: number;
  mastersCount: number;
  mastersLength: number;
  variantsCount: number;
  variantsLength: number;
  onAddMaster: () => void;
  onAddVariant: () => void;
}

export const ItemsTableFooter: React.FC<ItemsTableFooterProps> = ({
  viewMode,
  itemsCount,
  itemsLength,
  mastersCount,
  mastersLength,
  variantsCount,
  variantsLength,
  onAddMaster,
  onAddVariant,
}) => {
  const getCountText = () => {
    switch (viewMode) {
      case "masters":
        return `Menampilkan ${mastersLength} dari ${mastersCount} kategori`;
      case "variants":
        return `Menampilkan ${variantsLength} dari ${variantsCount} variant`;
      default:
        return `Menampilkan ${itemsLength} dari ${itemsCount} barang`;
    }
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50/50">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{getCountText()}</div>

        {/* Show additional action buttons only for items view */}
        {viewMode === "items" && (
          <div className="flex items-center space-x-3">
            <ActionButton onClick={onAddMaster} variant="success" size="sm">
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori</span>
            </ActionButton>
            <ActionButton onClick={onAddVariant} variant="primary" size="sm">
              <Plus className="w-4 h-4" />
              <span>Tambah Variant</span>
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};
