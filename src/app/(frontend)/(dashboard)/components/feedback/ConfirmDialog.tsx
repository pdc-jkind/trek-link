// src/app/(frontend)/(dashboard)/components/ConfirmDialog.tsx
"use client";

import React from "react";
import { AlertTriangle, X, Trash2, Check } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Hapus",
  cancelText = "Batal",
  variant = "danger",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <Trash2 className="w-6 h-6 text-danger-500" />,
          iconBg: "bg-danger-100 dark:bg-danger-900/30",
          confirmBtn:
            "bg-danger-600 hover:bg-danger-700 focus:ring-danger-500 dark:bg-danger-500 dark:hover:bg-danger-600",
          titleColor: "text-danger-800 dark:text-danger-200",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-warning-500" />,
          iconBg: "bg-warning-100 dark:bg-warning-900/30",
          confirmBtn:
            "bg-warning-600 hover:bg-warning-700 focus:ring-warning-500 dark:bg-warning-500 dark:hover:bg-warning-600",
          titleColor: "text-warning-800 dark:text-warning-200",
        };
      case "info":
        return {
          icon: <Check className="w-6 h-6 text-primary-500" />,
          iconBg: "bg-primary-100 dark:bg-primary-900/30",
          confirmBtn:
            "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600",
          titleColor: "text-primary-800 dark:text-primary-200",
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-danger-500" />,
          iconBg: "bg-danger-100 dark:bg-danger-900/30",
          confirmBtn:
            "bg-danger-600 hover:bg-danger-700 focus:ring-danger-500 dark:bg-danger-500 dark:hover:bg-danger-600",
          titleColor: "text-danger-800 dark:text-danger-200",
        };
    }
  };

  const styles = getVariantStyles();

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in dark:bg-black/70"
        onClick={handleClose}
      />

      {/* Modal with dark mode support and enhanced animations */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-modal max-w-md w-full animate-scale-in border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${styles.iconBg}`}>
              {styles.icon}
            </div>
            <h3 className={`text-lg font-semibold ${styles.titleColor}`}>
              {title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 rounded-b-xl">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2.5 text-gray-700 dark:text-gray-200 font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2.5 text-white font-medium rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 shadow-lg ${styles.confirmBtn}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : variant === "danger" ? (
              <Trash2 className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{isLoading ? "Memproses..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
