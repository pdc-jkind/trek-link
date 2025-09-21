// src\app\(dashboard)\components\ui\StatsCard.tsx
import React from "react";
import { Card } from "./Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}) => (
  <Card className="hover:scale-105 transition-transform duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-700 text-xs font-medium">{title}</p>
        <p className="text-gray-900 text-xl font-bold mt-1">{value}</p>
        {trend && (
          <div className="flex items-center mt-1">
            <span className="text-green-600 text-xs font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div
        className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shadow-md`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </Card>
);
