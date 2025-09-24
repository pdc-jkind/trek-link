// src/app/(frontend)/(dashboard)/components/ui/EmptyState.tsx
"use client";

import React from "react";
import { ActionButton } from "@/fe/(dashboard)/components/ui/ActionButton";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "success" | "warning" | "danger" | "secondary";
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => (
  <div className={`text-center py-12 px-6 ${className}`}>
    <div className="text-gray-400 dark:text-gray-500 mb-4 flex justify-center animate-fade-in">
      {icon}
    </div>
    <h3
      className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-2 animate-slide-up"
      style={{ animationDelay: "100ms" }}
    >
      {title}
    </h3>
    {description && (
      <p
        className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed animate-slide-up"
        style={{ animationDelay: "200ms" }}
      >
        {description}
      </p>
    )}
    {action && (
      <div className="animate-scale-in" style={{ animationDelay: "300ms" }}>
        <ActionButton
          onClick={action.onClick}
          variant={action.variant || "primary"}
          size="md"
        >
          {action.label}
        </ActionButton>
      </div>
    )}
  </div>
);
