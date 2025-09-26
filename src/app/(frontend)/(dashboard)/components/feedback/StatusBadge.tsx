// src\app\(dashboard)\components\ui\StatusBadge.tsx
import React from "react";

interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "error" | "info" | "default";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "default",
  className = "",
}) => {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {status}
    </span>
  );
};
