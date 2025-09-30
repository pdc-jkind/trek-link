"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: (id: string) => void;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = "info",
  duration = 5000,
  onClose,
  closable = true,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  useEffect(() => {
    setIsVisible(true);

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.(id);
    }, 200);
  };

  // Dynamic type configuration dengan CSS variables
  const typeConfig: Record<
    string,
    {
      icon: React.FC<{ className?: string }>;
      container: string;
      onContainer: string;
      border: string;
    }
  > = {
    success: {
      icon: CheckCircle,
      container: "--success-container",
      onContainer: "--on-success-container",
      border: "--success",
    },
    error: {
      icon: XCircle,
      container: "--error-container",
      onContainer: "--on-error-container",
      border: "--error",
    },
    warning: {
      icon: AlertCircle,
      container: "--warning-container",
      onContainer: "--on-warning-container",
      border: "--warning",
    },
    info: {
      icon: Info,
      container: "--info-container",
      onContainer: "--on-info-container",
      border: "--info",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const toastStyle = {
    backgroundColor: getColor(config.container),
    borderColor: `${getColor(config.border)}60`, // 38% opacity
    color: getColor(config.onContainer),
  };

  const iconStyle = {
    color: getColor(config.border),
  };

  const actionStyle = {
    color: getColor(config.border),
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg shadow-elevation-3",
        "transition-all duration-200 max-w-md min-w-[320px] border-2",
        isVisible && !isExiting && "animate-fade-in",
        isExiting && "opacity-0 scale-95"
      )}
      style={toastStyle}
      role="alert"
    >
      {/* Icon */}
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div
            className="font-bold text-sm mb-1"
            style={{ color: getColor(config.onContainer) }}
          >
            {title}
          </div>
        )}
        <div
          className="text-sm leading-relaxed"
          style={{ color: getColor(config.onContainer) }}
        >
          {message}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-semibold underline hover:no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            style={actionStyle}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 3px ${getColor(
                config.border
              )}40`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      {closable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ color: getColor(config.onContainer) }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${getColor(
              config.border
            )}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 3px ${getColor(
              config.border
            )}40`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = "top-right",
}) => {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-3",
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
