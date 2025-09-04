// src/app/(auth)/components/AuthUI.tsx
"use client";

import React from "react";

// ========== ICONS ==========
interface AuthIconProps {
  type: "loading" | "success" | "error" | "logo";
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

export const AuthIcon: React.FC<AuthIconProps> = ({
  type,
  size = "md",
  animated = true,
}) => {
  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-14.4 h-14.4",
    lg: "w-18 h-18",
    xl: "w-21.6 h-21.6",
  };

  const innerSizeClasses = {
    sm: "w-4.5 h-4.5",
    md: "w-7.2 h-7.2",
    lg: "w-10.8 h-10.8",
    xl: "w-14.4 h-14.4",
  };

  const baseClasses = `${
    sizeClasses[size]
  } rounded-xl mx-auto p-2.7 flex items-center justify-center shadow-2xl transform transition-all duration-300 ${
    animated ? "hover:scale-110" : ""
  }`;

  switch (type) {
    case "loading":
      return (
        <div className={`${baseClasses} bg-white/90 backdrop-blur-md`}>
          <div
            className={`${innerSizeClasses[size]} bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg animate-pulse`}
          />
        </div>
      );

    case "success":
      return (
        <div className={`${baseClasses} bg-green-100`}>
          <div
            className={`${innerSizeClasses[size]} bg-green-500 rounded-lg flex items-center justify-center`}
          >
            <svg
              className="w-5.4 h-5.4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      );

    case "error":
      return (
        <div className={`${baseClasses} bg-red-100`}>
          <div
            className={`${innerSizeClasses[size]} bg-red-500 rounded-lg flex items-center justify-center`}
          >
            <svg
              className="w-5.4 h-5.4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      );

    case "logo":
    default:
      return (
        <div
          className={`${baseClasses} bg-white/90 backdrop-blur-md relative h-20 w-35 px-1`}
        >
          <img
            src="/img/icon.png"
            alt="Logo"
            className={`${innerSizeClasses[size]} object-contain`}
          />
        </div>
      );
  }
};

// ========== LOADING COMPONENTS ==========
export const LoadingDots: React.FC<{ color?: string }> = ({
  color = "white",
}) => {
  const colorClass = color === "white" ? "bg-white" : `bg-${color}-500`;

  return (
    <div className="flex justify-center space-x-0.9 mt-5.4">
      <div
        className={`w-1.8 h-1.8 ${colorClass} rounded-full animate-bounce`}
      />
      <div
        className={`w-1.8 h-1.8 ${colorClass} rounded-full animate-bounce`}
        style={{ animationDelay: "0.1s" }}
      />
      <div
        className={`w-1.8 h-1.8 ${colorClass} rounded-full animate-bounce`}
        style={{ animationDelay: "0.2s" }}
      />
    </div>
  );
};

export const LoadingSpinner: React.FC<{
  size?: "sm" | "md" | "lg";
  color?: string;
}> = ({ size = "md", color = "white" }) => {
  const sizeClasses = {
    sm: "h-5.4 w-5.4",
    md: "h-7.2 w-7.2",
    lg: "h-10.8 w-10.8",
  };

  const colorClass = color === "white" ? "border-white" : `border-${color}-500`;

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 ${colorClass}`}
    />
  );
};

// ========== PROGRESS BAR ==========
interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = "",
  showPercentage = false,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1.8">
        {showPercentage && (
          <span className="text-xs text-white/80">{progress}%</span>
        )}
      </div>
      <div className="w-full bg-white/20 rounded-full h-1.8 backdrop-blur-sm">
        <div
          className="bg-gradient-to-r from-indigo-400 to-purple-500 h-1.8 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

// ========== NOTIFICATION COMPONENT ==========
interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const typeStyles = {
    success: "bg-green-500/90 border-green-400/50 text-green-50",
    error: "bg-red-500/90 border-red-400/50 text-red-50",
    warning: "bg-yellow-500/90 border-yellow-400/50 text-yellow-50",
    info: "bg-blue-500/90 border-blue-400/50 text-blue-50",
  };

  const icons = {
    success: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`fixed top-3.6 right-3.6 z-50 ${typeStyles[type]} backdrop-blur-md px-5.4 py-3.6 rounded-xl border font-medium transform transition-all duration-300 flex items-start space-x-2.7 shadow-2xl max-w-xs animate-in slide-in-from-top-2`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="text-xs font-semibold mb-0.9">{title}</p>}
        <p className="text-xs opacity-90">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-1.8 opacity-70 hover:opacity-100 text-base leading-none transition-opacity"
      >
        ×
      </button>
    </div>
  );
};
