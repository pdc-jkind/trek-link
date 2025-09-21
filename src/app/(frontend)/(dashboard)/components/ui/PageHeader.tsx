// src\app\(dashboard)\components\ui\PageHeader.tsx
import React from "react";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  return (
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-gray-900 text-lg font-semibold">{title}</h2>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
  );
};
