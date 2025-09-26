// src/app/(frontend)/(dashboard)/items/components/ViewModeToggle.tsx
"use client";

import React from "react";
import { Grid, Layers, Tag } from "lucide-react";
import { ActionButton } from "@/app/(frontend)/(dashboard)/components/actions/ActionButton";

type ViewMode = "items" | "masters" | "variants";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

interface ViewModeOption {
  key: ViewMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "primary" | "success" | "warning";
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = "",
}) => {
  const viewModeOptions: ViewModeOption[] = [
    {
      key: "items",
      label: "Items",
      icon: Grid,
      variant: "primary",
    },
    {
      key: "masters",
      label: "Kategori",
      icon: Layers,
      variant: "success",
    },
    {
      key: "variants",
      label: "Variant",
      icon: Tag,
      variant: "warning",
    },
  ];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tampilan:
      </span>

      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {viewModeOptions.map((option) => (
          <ActionButton
            key={option.key}
            onClick={() => onViewModeChange(option.key)}
            variant={option.variant}
            style={viewMode === option.key ? "solid" : "ghost"}
            active={viewMode === option.key}
            size="sm"
            className={`
              min-w-[80px] justify-center
              ${
                viewMode === option.key
                  ? "shadow-card"
                  : "shadow-none hover:shadow-card"
              }
            `}
          >
            {option.label}
          </ActionButton>
        ))}
      </div>
    </div>
  );
};

export default ViewModeToggle;
