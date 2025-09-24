// src/app/(frontend)/(dashboard)/items/components/ItemsTableActions.tsx
"use client";

import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";

interface ItemsTableActionsProps {
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showView?: boolean;
}

export const ItemsTableActions: React.FC<ItemsTableActionsProps> = ({
  onView,
  onEdit,
  onDelete,
  showView = false,
}) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      {showView && onView && (
        <button
          onClick={onView}
          className="p-1.5 text-primary-600 hover:text-primary-800 hover:bg-primary-100 rounded-md transition-colors"
          title="View Item"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={onEdit}
        className="p-1.5 text-success-600 hover:text-success-800 hover:bg-success-100 rounded-md transition-colors"
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 text-danger-600 hover:text-danger-800 hover:bg-danger-100 rounded-md transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
