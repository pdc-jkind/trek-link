"use client";

import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "muted";
  className?: string;
  text?: string;
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className,
  text,
}) => {
  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[3px]",
    xl: "w-12 h-12 border-[3px]",
  };

  // Color mapping berdasarkan CSS variables
  const colorConfig: Record<string, { border: string; spinner: string }> = {
    primary: {
      border: "--outline-variant",
      spinner: "--primary",
    },
    secondary: {
      border: "--outline-variant",
      spinner: "--secondary",
    },
    tertiary: {
      border: "--outline-variant",
      spinner: "--tertiary",
    },
    success: {
      border: "--outline-variant",
      spinner: "--success",
    },
    warning: {
      border: "--outline-variant",
      spinner: "--warning",
    },
    info: {
      border: "--outline-variant",
      spinner: "--info",
    },
    danger: {
      border: "--outline-variant",
      spinner: "--error",
    },
    muted: {
      border: "--outline-variant",
      spinner: "--on-surface-variant",
    },
  };

  const currentColor = colorConfig[color];

  const spinnerStyle = {
    borderColor: getColor(currentColor.border),
    borderTopColor: getColor(currentColor.spinner),
  };

  if (text) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div
          className={cn("animate-spin rounded-full", sizeClasses[size])}
          style={spinnerStyle}
          role="status"
          aria-label="Loading"
        />
        <span
          className="text-sm font-medium"
          style={{ color: getColor(currentColor.spinner) }}
        >
          {text}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("animate-spin rounded-full", sizeClasses[size], className)}
      style={spinnerStyle}
      role="status"
      aria-label="Loading"
    />
  );
};
