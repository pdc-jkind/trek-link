// src/app/(frontend)/(dashboard)/items/components/ItemsErrorState.tsx
"use client";

import React from "react";
import { Package, RefreshCw } from "lucide-react";
import { ActionButton } from "@/fe/(dashboard)/components/ui/ActionButton"; //../../components/ui/ActionButton

interface ItemsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ItemsErrorState: React.FC<ItemsErrorStateProps> = ({
  error,
  onRetry,
}) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center">
      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-4">Gagal memuat data: {error}</p>
      <ActionButton onClick={onRetry} variant="primary">
        <RefreshCw className="w-4 h-4" />
        <span>Coba Lagi</span>
      </ActionButton>
    </div>
  </div>
);
