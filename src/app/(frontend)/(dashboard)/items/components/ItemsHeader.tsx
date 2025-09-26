// src/app/(frontend)/(dashboard)/items/components/ItemsHeader.tsx
"use client";

import React from "react";
import { Package, Filter, Plus } from "lucide-react";
import { ActionButton } from "@/app/(frontend)/(dashboard)/components/actions/ActionButton"; // ../../components/ui/ActionButton

interface ItemsHeaderProps {
  viewMode: "items" | "masters" | "variants";
  onFilter: () => void;
  onAddItem: () => void;
  onAddMaster: () => void;
  onAddVariant: () => void;
}

export const ItemsHeader: React.FC<ItemsHeaderProps> = ({
  viewMode,
  onFilter,
  onAddItem,
  onAddMaster,
  onAddVariant,
}) => {
  const getAddButtonProps = () => {
    switch (viewMode) {
      case "masters":
        return {
          onClick: onAddMaster,
          variant: "success" as const,
          text: "Tambah Kategori",
        };
      case "variants":
        return {
          onClick: onAddVariant,
          variant: "primary" as const,
          text: "Tambah Variant",
        };
      default:
        return {
          onClick: onAddItem,
          variant: "warning" as const,
          text: "Tambah Barang",
        };
    }
  };

  const addButtonProps = getAddButtonProps();

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
          <Package className="w-8 h-8 text-primary-600" />
          <span>Pengelolaan Barang</span>
        </h1>
        <p className="text-gray-600 mt-1">Kelola data barang dan kategori</p>
      </div>
      <div className="flex items-center space-x-3">
        <ActionButton onClick={onFilter} variant="primary">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </ActionButton>
        <ActionButton
          onClick={addButtonProps.onClick}
          variant={addButtonProps.variant}
        >
          <Plus className="w-4 h-4" />
          <span>{addButtonProps.text}</span>
        </ActionButton>
      </div>
    </div>
  );
};
