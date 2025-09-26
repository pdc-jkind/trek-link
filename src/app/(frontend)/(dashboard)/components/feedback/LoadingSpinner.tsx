// src/app/(frontend)/(dashboard)/components/ui/LoadingSpinner.tsx
"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "gray" | "success" | "warning" | "danger";
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
  text,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-8 h-8";
      case "xl":
        return "w-12 h-12";
      default:
        return "w-6 h-6";
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "white":
        return "border-white border-t-transparent";
      case "gray":
        return "border-gray-300 dark:border-gray-600 border-t-transparent";
      case "success":
        return "border-success-600 dark:border-success-500 border-t-transparent";
      case "warning":
        return "border-warning-600 dark:border-warning-500 border-t-transparent";
      case "danger":
        return "border-danger-600 dark:border-danger-500 border-t-transparent";
      default:
        return "border-primary-600 dark:border-primary-500 border-t-transparent";
    }
  };

  const getTextSizeClass = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      case "xl":
        return "text-lg";
      default:
        return "text-sm";
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div
        className={`${getSizeClasses()} border-2 rounded-full animate-spin ${getColorClasses()}`}
      />
      {text && (
        <p
          className={`text-gray-600 dark:text-gray-400 font-medium animate-pulse ${getTextSizeClass()}`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

// Specialized loading states
export const TableLoadingSpinner: React.FC<{
  message?: string;
}> = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-8 space-y-3">
    <LoadingSpinner size="lg" />
    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">
      {message}
    </p>
  </div>
);

export const InlineLoadingSpinner: React.FC<{
  size?: "sm" | "md";
  color?: "primary" | "white" | "gray";
}> = ({ size = "sm", color = "primary" }) => (
  <LoadingSpinner size={size} color={color} />
);

export const FullPageLoadingSpinner: React.FC<{
  message?: string;
}> = ({ message = "Loading application..." }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center space-y-4">
      <LoadingSpinner size="xl" />
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Please wait
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    </div>
  </div>
);

// Loading overlay component
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  message?: string;
  backdrop?: boolean;
}> = ({ isVisible, message = "Loading...", backdrop = true }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`
      absolute inset-0 z-50 flex items-center justify-center
      ${backdrop ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" : ""}
      animate-fade-in
    `}
    >
      <div className="flex flex-col items-center space-y-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-modal border border-gray-200 dark:border-gray-700">
        <LoadingSpinner size="lg" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};
