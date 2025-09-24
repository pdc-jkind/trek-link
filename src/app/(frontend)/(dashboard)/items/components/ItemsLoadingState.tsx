// src/app/(frontend)/(dashboard)/items/components/ItemsLoadingState.tsx
"use client";

import React from "react";
import { LoadingSpinner } from "@/items/components/ui/LoadingSpinner";

interface ItemsLoadingStateProps {
  message?: string;
}

export const ItemsLoadingState: React.FC<ItemsLoadingStateProps> = ({
  message = "Memuat data...",
}) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);
