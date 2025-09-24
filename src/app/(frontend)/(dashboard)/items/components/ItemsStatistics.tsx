// src/app/(frontend)/(dashboard)/items/components/ItemsStatistics.tsx
"use client";

import React from "react";
import { Package, Box, Archive, Layers } from "lucide-react";
import { Card } from "@/fe/(dashboard)/components/ui/Card"; //../../components/ui/Card
import { StatsCard } from "@/items/components/ui/StatsCard"; //../../components/ui/Card

interface ItemsStatisticsProps {
  statistics: {
    totalItems: number;
    totalItemMasters: number;
    itemsByType: Array<{
      type: string;
      count: number;
    }>;
  };
}

export const ItemsStatistics: React.FC<ItemsStatisticsProps> = ({
  statistics,
}) => {
  const regularItems =
    statistics.itemsByType.find((t) => t.type === "regular")?.count || 0;
  const inventoryItems =
    statistics.itemsByType.find((t) => t.type === "inventory")?.count || 0;

  const stats = [
    {
      title: "Total Items",
      value: statistics.totalItems.toString(),
      icon: <Package className="w-8 h-8" />,
      color: "from-primary-500 to-primary-600",
    },
    {
      title: "Regular Items",
      value: regularItems.toString(),
      icon: <Box className="w-8 h-8" />,
      color: "from-success-500 to-success-600",
    },
    {
      title: "Inventory Items",
      value: inventoryItems.toString(),
      icon: <Archive className="w-8 h-8" />,
      color: "from-warning-500 to-warning-600",
    },
    {
      title: "Categories",
      value: statistics.totalItemMasters.toString(),
      icon: <Layers className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Statistik Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </Card>
  );
};
