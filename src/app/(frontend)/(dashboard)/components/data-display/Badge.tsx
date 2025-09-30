"use client";

import React from "react";
import { cn } from "@/fe/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
  dot = false,
}) => {
  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  const variantClasses = {
    // Default menggunakan surface-variant dari CSS variables
    default: "border-2",

    // Primary menggunakan warna primary dari CSS variables
    primary: "border-2",

    // Secondary menggunakan warna secondary dari CSS variables
    secondary: "border-2",

    // Tertiary menggunakan warna tertiary dari CSS variables
    tertiary: "border-2",

    // Success menggunakan warna success dari CSS variables
    success: "border-2",

    // Warning menggunakan warna warning dari CSS variables
    warning: "border-2",

    // Info menggunakan warna info dari CSS variables
    info: "border-2",

    // Danger menggunakan warna error dari CSS variables
    danger: "border-2",

    // Outline menggunakan border dan foreground variables
    outline: "border-2 bg-transparent",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-2xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  // Dynamic styles based on variant
  const getDynamicStyles = () => {
    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: `${getColor("--surface-variant")}`,
        color: getColor("--on-surface-variant"),
        borderColor: getColor("--outline"),
      },
      primary: {
        backgroundColor: `${getColor("--primary-container")}`,
        color: getColor("--on-primary-container"),
        borderColor: `${getColor("--primary")}40`,
      },
      secondary: {
        backgroundColor: `${getColor("--secondary-container")}`,
        color: getColor("--on-secondary-container"),
        borderColor: `${getColor("--secondary")}40`,
      },
      tertiary: {
        backgroundColor: `${getColor("--tertiary-container")}`,
        color: getColor("--on-tertiary-container"),
        borderColor: `${getColor("--tertiary")}40`,
      },
      success: {
        backgroundColor: `${getColor("--success-container")}`,
        color: getColor("--on-success-container"),
        borderColor: `${getColor("--success")}40`,
      },
      warning: {
        backgroundColor: `${getColor("--warning-container")}`,
        color: getColor("--on-warning-container"),
        borderColor: `${getColor("--warning")}40`,
      },
      info: {
        backgroundColor: `${getColor("--info-container")}`,
        color: getColor("--on-info-container"),
        borderColor: `${getColor("--info")}40`,
      },
      danger: {
        backgroundColor: `${getColor("--error-container")}`,
        color: getColor("--on-error-container"),
        borderColor: `${getColor("--error")}40`,
      },
      outline: {
        backgroundColor: "transparent",
        color: getColor("--on-surface"),
        borderColor: getColor("--outline"),
      },
    };

    return variantStyles[variant] || variantStyles.default;
  };

  if (dot) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5",
          sizeClasses[size],
          "rounded-full font-semibold transition-all duration-200",
          variantClasses[variant],
          className
        )}
        style={getDynamicStyles()}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: getDynamicStyles().color }}
        />
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold transition-all duration-200",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={getDynamicStyles()}
    >
      {children}
    </span>
  );
};
