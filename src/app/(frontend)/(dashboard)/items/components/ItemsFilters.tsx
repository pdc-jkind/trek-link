// src/app/(frontend)/(dashboard)/items/components/ItemsFilters.tsx
"use client";

import React from "react";
import { Search } from "lucide-react";

type ViewMode = "items" | "masters" | "variants";

interface ItemMaster {
  id: string;
  name: string;
}

interface Office {
  id: string;
  name: string;
}

interface ItemsFiltersProps {
  viewMode: ViewMode;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedOffice: string;
  onOfficeChange: (value: string) => void;
  itemMasters: ItemMaster[];
  offices: Office[];
}

export const ItemsFilters: React.FC<ItemsFiltersProps> = ({
  viewMode,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedOffice,
  onOfficeChange,
  itemMasters,
  offices,
}) => {
  const getSearchPlaceholder = () => {
    switch (viewMode) {
      case "masters":
        return "Cari nama kategori...";
      case "variants":
        return "Cari nama variant...";
      default:
        return "Cari kode barang, nama barang...";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white transition-all"
        />
      </div>

      {/* Filters for Items view only */}
      {viewMode === "items" && (
        <>
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white min-w-[180px]"
          >
            <option value="">Semua Kategori</option>
            {itemMasters.map((master) => (
              <option key={master.id} value={master.id}>
                {master.name}
              </option>
            ))}
          </select>

          {/* Office Filter */}
          <select
            value={selectedOffice}
            onChange={(e) => onOfficeChange(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white min-w-[180px]"
          >
            <option value="">Semua Office</option>
            {offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.name}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
