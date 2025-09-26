// ===== /utility/SearchBar.tsx =====
"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/fe/lib/utils";
import { Search, X, Filter, ArrowRight } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  suggestions?: string[];
  recentSearches?: string[];
  filters?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  activeFilters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showFilters?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value = "",
  onValueChange,
  onSearch,
  suggestions = [],
  recentSearches = [],
  filters = [],
  activeFilters = {},
  onFiltersChange,
  size = "md",
  className,
  showFilters = false,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-9 text-sm",
    md: "h-11 text-sm",
    lg: "h-12 text-base",
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowFiltersDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange?.(newValue);
    setShowDropdown(newValue.length > 0 || recentSearches.length > 0);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowDropdown(inputValue.length > 0 || recentSearches.length > 0);
  };

  const handleSearch = (searchValue?: string) => {
    const valueToSearch = searchValue || inputValue;
    onSearch?.(valueToSearch);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setInputValue("");
    onValueChange?.("");
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onValueChange?.(suggestion);
    handleSearch(suggestion);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value) {
      newFilters[filterKey] = value;
    } else {
      delete newFilters[filterKey];
    }
    onFiltersChange?.(newFilters);
  };

  const filteredSuggestions = suggestions
    .filter((suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    )
    .slice(0, 5);

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      {/* Search Input */}
      <div
        className={cn(
          "relative flex items-center border border-border rounded-lg bg-background",
          sizeClasses[size],
          isFocused && "ring-2 ring-primary-500 border-primary-500"
        )}
      >
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyPress={handleKeyPress}
          className="flex-1 px-10 py-0 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-1 text-muted-foreground hover:text-foreground rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {showFilters && (
            <button
              onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
              className={cn(
                "p-1 rounded transition-colors relative",
                showFiltersDropdown
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elevation-2 z-50 max-h-64 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && inputValue === "" && (
            <div className="p-2">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Recent Searches
              </p>
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm flex items-center justify-between group"
                >
                  <span>{search}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="p-2">
              {inputValue !== "" && (
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Suggestions
                </p>
              )}
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm flex items-center justify-between group"
                >
                  <span>{suggestion}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {inputValue !== "" &&
            filteredSuggestions.length === 0 &&
            recentSearches.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No suggestions found
              </div>
            )}
        </div>
      )}

      {/* Filters Dropdown */}
      {showFiltersDropdown && showFilters && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-elevation-2 z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-foreground">Filters</h4>
            {activeFilterCount > 0 && (
              <button
                onClick={() => onFiltersChange?.({})}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-xs font-medium text-foreground mb-1">
                  {filter.label}
                </label>
                <select
                  value={activeFilters[filter.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(filter.key, e.target.value)
                  }
                  className="w-full text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">All</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
