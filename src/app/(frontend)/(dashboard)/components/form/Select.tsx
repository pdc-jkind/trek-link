// ===== /form/Select.tsx =====
"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/fe/lib/utils";
import { ChevronDown, Check, X } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  label,
  error,
  hint,
  multiple = false,
  searchable = false,
  clearable = false,
  size = "md",
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  };

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Handle scroll and resize to update position
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOptions = multiple
    ? options.filter((option) => (value as string[])?.includes(option.value))
    : options.find((option) => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = (value as string[]) || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onValueChange?.(newValues);
    } else {
      onValueChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.(multiple ? [] : "");
  };

  const renderValue = () => {
    if (multiple && selectedOptions) {
      const selected = selectedOptions as SelectOption[];
      if (selected.length === 0) return placeholder;
      if (selected.length === 1) return selected[0].label;
      return `${selected.length} items selected`;
    }

    if (selectedOptions) {
      return (selectedOptions as SelectOption).label;
    }

    return placeholder;
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    const dropdown = (
      <div
        ref={dropdownRef}
        style={{
          position: "absolute",
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 9999,
        }}
        className="max-h-60 overflow-hidden surface rounded-lg shadow-elevation-3 border border-outline"
      >
        {/* Search Box */}
        {searchable && (
          <div className="p-2 border-b-2 border-border bg-background-subtle">
            <input
              type="text"
              placeholder="Search options..."
              className="input w-full text-sm py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Options List */}
        <div className="max-h-48 overflow-y-auto scrollbar-thin">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-6 text-sm text-center text-muted-foreground">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = multiple
                ? (value as string[])?.includes(option.value)
                : value === option.value;

              return (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors",
                    "border-b border-border-muted last:border-b-0",
                    "text-foreground",
                    option.disabled && "opacity-50 cursor-not-allowed",
                    !option.disabled && !isSelected && "hover:bg-muted",
                    isSelected && "bg-primary/10 font-semibold"
                  )}
                  onClick={() =>
                    !option.disabled && handleOptionClick(option.value)
                  }
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 flex-shrink-0 ml-2 text-primary" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );

    // Use portal to render outside the modal
    return typeof document !== "undefined"
      ? createPortal(dropdown, document.body)
      : null;
  };

  const renderSelect = () => (
    <div ref={selectRef} className="relative">
      {/* Select Trigger */}
      <div
        ref={triggerRef}
        className={cn(
          "flex items-center justify-between cursor-pointer rounded-lg border-2 transition-all duration-200",
          "surface",
          sizeClasses[size],
          error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed bg-muted",
          isOpen && "ring-2 ring-primary border-primary",
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className={cn(
            "truncate",
            !value || (multiple && !(value as string[])?.length)
              ? "text-foreground-subtle"
              : "text-foreground"
          )}
        >
          {renderValue()}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {clearable &&
            value &&
            (multiple ? (value as string[]).length > 0 : value) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown rendered via Portal */}
      {renderDropdown()}
    </div>
  );

  if (label || error || hint) {
    return (
      <div className="space-y-2">
        {label && <label className="label">{label}</label>}
        {renderSelect()}
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }

  return renderSelect();
};
