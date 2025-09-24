// src\app\(frontend)\(dashboard)\components\ui\ActionButton.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

// Base button props for single button
interface BaseActionButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  fullWidth?: boolean;
  className?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

// Props for single button mode
interface SingleActionProps extends BaseActionButtonProps {
  mode?: "single";
  style?: "solid" | "outline" | "ghost" | "gradient";
}

// Props for individual actions in multiple mode
interface Action {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?:
    | "view"
    | "edit"
    | "delete"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "secondary";
  disabled?: boolean;
  tooltip?: string;
}

// Props for multiple actions mode
interface MultipleActionsProps {
  mode: "multiple";
  actions: Action[];
  layout?: "horizontal" | "vertical" | "dropdown";
  className?: string;
  size?: "sm" | "md" | "lg";
}

type ActionButtonProps = SingleActionProps | MultipleActionsProps;

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  // Multiple actions mode
  if (props.mode === "multiple") {
    const {
      actions,
      layout = "horizontal",
      className = "",
      size = "md",
    } = props;

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "p-1.5";
        case "lg":
          return "p-2.5";
        default:
          return "p-2";
      }
    };

    const getIconSize = () => {
      switch (size) {
        case "sm":
          return "w-3.5 h-3.5";
        case "lg":
          return "w-5 h-5";
        default:
          return "w-4 h-4";
      }
    };

    const getVariantClasses = (variant?: string) => {
      const variants = {
        view: "text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:hover:text-primary-300 dark:hover:bg-primary-900/20",
        edit: "text-success-600 hover:text-success-700 hover:bg-success-50 dark:text-success-400 dark:hover:text-success-300 dark:hover:bg-success-900/20",
        delete:
          "text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:text-danger-400 dark:hover:text-danger-300 dark:hover:bg-danger-900/20",
        primary:
          "text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:hover:text-primary-300 dark:hover:bg-primary-900/20",
        success:
          "text-success-600 hover:text-success-700 hover:bg-success-50 dark:text-success-400 dark:hover:text-success-300 dark:hover:bg-success-900/20",
        warning:
          "text-warning-600 hover:text-warning-700 hover:bg-warning-50 dark:text-warning-400 dark:hover:text-warning-300 dark:hover:bg-warning-900/20",
        danger:
          "text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:text-danger-400 dark:hover:text-danger-300 dark:hover:bg-danger-900/20",
        secondary:
          "text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800",
      };
      return variants[variant as keyof typeof variants] || variants.secondary;
    };

    const containerClasses =
      layout === "vertical"
        ? "flex flex-col space-y-1"
        : "flex items-center space-x-1";

    return (
      <div className={`${containerClasses} ${className}`}>
        {actions.map((action, index) => {
          const IconComponent = action.icon;

          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                ${getSizeClasses()} 
                rounded-lg transition-all duration-200 ease-out
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                hover:transform hover:scale-105 active:scale-95
                ${getVariantClasses(action.variant)}
              `}
              title={action.tooltip || action.label}
              aria-label={action.label}
            >
              {IconComponent && <IconComponent className={getIconSize()} />}
            </button>
          );
        })}
      </div>
    );
  }

  // Single button mode (default)
  const {
    onClick,
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    active = false,
    fullWidth = false,
    className = "",
    style = "solid",
    icon,
    iconPosition = "left",
  } = props;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-6 py-3.5 text-lg";
      default:
        return "px-4 py-2.5 text-base";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-5 h-5";
    }
  };

  const getStyleClasses = () => {
    const baseClasses =
      "font-medium transition-all duration-200 ease-out transform";

    if (style === "gradient") {
      const gradients = {
        primary: active
          ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-card-hover scale-95"
          : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-card hover:shadow-card-hover hover:scale-105",
        success: active
          ? "bg-gradient-to-r from-success-600 to-success-700 text-white shadow-card-hover scale-95"
          : "bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-card hover:shadow-card-hover hover:scale-105",
        warning: active
          ? "bg-gradient-to-r from-warning-600 to-warning-700 text-white shadow-card-hover scale-95"
          : "bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white shadow-card hover:shadow-card-hover hover:scale-105",
        danger: active
          ? "bg-gradient-to-r from-danger-600 to-danger-700 text-white shadow-card-hover scale-95"
          : "bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white shadow-card hover:shadow-card-hover hover:scale-105",
        secondary: active
          ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-card-hover scale-95"
          : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-card hover:shadow-card-hover hover:scale-105",
      };
      return `${baseClasses} ${gradients[variant]} active:scale-95`;
    }

    if (style === "outline") {
      const outlines = {
        primary: active
          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-2 border-primary-600 shadow-soft scale-95"
          : "bg-transparent text-primary-600 dark:text-primary-400 border-2 border-primary-300 dark:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500 hover:scale-105",
        success: active
          ? "bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 border-2 border-success-600 shadow-soft scale-95"
          : "bg-transparent text-success-600 dark:text-success-400 border-2 border-success-300 dark:border-success-600 hover:bg-success-50 dark:hover:bg-success-900/20 hover:border-success-500 hover:scale-105",
        warning: active
          ? "bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300 border-2 border-warning-600 shadow-soft scale-95"
          : "bg-transparent text-warning-600 dark:text-warning-400 border-2 border-warning-300 dark:border-warning-600 hover:bg-warning-50 dark:hover:bg-warning-900/20 hover:border-warning-500 hover:scale-105",
        danger: active
          ? "bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300 border-2 border-danger-600 shadow-soft scale-95"
          : "bg-transparent text-danger-600 dark:text-danger-400 border-2 border-danger-300 dark:border-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:border-danger-500 hover:scale-105",
        secondary: active
          ? "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-600 shadow-soft scale-95"
          : "bg-transparent text-gray-600 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-500 hover:scale-105",
      };
      return `${baseClasses} ${outlines[variant]} active:scale-95`;
    }

    if (style === "ghost") {
      const ghosts = {
        primary: active
          ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 scale-95"
          : "bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-105",
        success: active
          ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 scale-95"
          : "bg-transparent text-success-600 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/20 hover:scale-105",
        warning: active
          ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 scale-95"
          : "bg-transparent text-warning-600 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/20 hover:scale-105",
        danger: active
          ? "bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 scale-95"
          : "bg-transparent text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:scale-105",
        secondary: active
          ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 scale-95"
          : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105",
      };
      return `${baseClasses} ${ghosts[variant]} active:scale-95`;
    }

    // Solid style (default)
    const solids = {
      primary: active
        ? "bg-primary-700 text-white shadow-card-hover scale-95"
        : "bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-500 dark:hover:bg-primary-600 shadow-card hover:shadow-card-hover hover:scale-105",
      success: active
        ? "bg-success-700 text-white shadow-card-hover scale-95"
        : "bg-success-600 hover:bg-success-700 text-white dark:bg-success-500 dark:hover:bg-success-600 shadow-card hover:shadow-card-hover hover:scale-105",
      warning: active
        ? "bg-warning-700 text-white shadow-card-hover scale-95"
        : "bg-warning-600 hover:bg-warning-700 text-white dark:bg-warning-500 dark:hover:bg-warning-600 shadow-card hover:shadow-card-hover hover:scale-105",
      danger: active
        ? "bg-danger-700 text-white shadow-card-hover scale-95"
        : "bg-danger-600 hover:bg-danger-700 text-white dark:bg-danger-500 dark:hover:bg-danger-600 shadow-card hover:shadow-card-hover hover:scale-105",
      secondary: active
        ? "bg-gray-700 text-white dark:bg-gray-600 shadow-card-hover scale-95"
        : "bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 shadow-card hover:shadow-card-hover hover:scale-105",
    };
    return `${baseClasses} ${solids[variant]} active:scale-95`;
  };

  const getFocusRingClass = () => {
    const focusRings = {
      primary: "focus:ring-primary-500/50",
      success: "focus:ring-success-500/50",
      warning: "focus:ring-warning-500/50",
      danger: "focus:ring-danger-500/50",
      secondary: "focus:ring-gray-500/50",
    };
    return focusRings[variant];
  };

  const IconComponent = icon;
  const hasIcon = !!IconComponent;
  const hasChildren = !!children;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${getSizeClasses()} 
        ${fullWidth ? "w-full" : ""}
        rounded-lg flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        ${getFocusRingClass()}
        ${getStyleClasses()}
        ${loading ? "cursor-wait" : "cursor-pointer"}
        ${className}
      `}
    >
      {loading && (
        <div className="mr-2">
          <div
            className={`border-2 border-current border-t-transparent rounded-full animate-spin ${getIconSize()}`}
          />
        </div>
      )}

      {!loading && hasIcon && iconPosition === "left" && hasChildren && (
        <IconComponent className={`mr-2 ${getIconSize()}`} />
      )}

      {!loading && hasIcon && iconPosition === "left" && !hasChildren && (
        <IconComponent className={getIconSize()} />
      )}

      {children}

      {!loading && hasIcon && iconPosition === "right" && (
        <IconComponent className={`ml-2 ${getIconSize()}`} />
      )}
    </button>
  );
};

export default ActionButton;
