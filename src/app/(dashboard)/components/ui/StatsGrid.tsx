// src\app\(dashboard)\components\ui\StatsGrid.tsx
import React from "react";

interface StatItem {
  title: string;
  value: string | number;
  color: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 4 }) => {
  const gridCols =
    {
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
    }[columns] || "md:grid-cols-4";

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-3 mb-5`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${stat.color} rounded-lg p-3 text-white`}
        >
          <h3 className="text-xs font-medium opacity-90">{stat.title}</h3>
          <p className="text-xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
