// src\app\(frontend)\(dashboard)\components\actions\SearchFilter.tsx
import React from "react";
import { Search } from "lucide-react";

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
  className?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  filters = [],
  searchPlaceholder = "Cari...",
  className = "",
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 mb-5 ${className}`}>
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 transition-colors duration-200" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                     placeholder-gray-500 dark:placeholder-gray-400
                     transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
        />
      </div>

      {/* Filter Dropdowns */}
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500
                     min-w-[120px] cursor-pointer"
        >
          {filter.options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 py-1"
            >
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};
