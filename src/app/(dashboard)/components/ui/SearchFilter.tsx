// src\app\(dashboard)\components\ui\SearchFilter.tsx
import React from "react";
import { Search, Filter } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: Array<{
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
  }>;
  searchPlaceholder?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  filters = [],
  searchPlaceholder = "Cari...",
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};
