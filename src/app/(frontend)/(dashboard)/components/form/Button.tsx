"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/fe/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "ghost"
  | "outline"
  | "danger"
  | "warning"
  | "info";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Get dynamic colors from CSS variables
    const getColor = (variable: string) => {
      if (typeof window === "undefined") return "";
      const style = getComputedStyle(document.documentElement);
      return `rgb(${style.getPropertyValue(variable).trim()})`;
    };

    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold " +
      "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 " +
      "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "px-4 py-2 text-xs h-9",
      md: "px-6 py-2.5 text-sm h-11",
      lg: "px-8 py-3 text-base h-12",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    // Dynamic styles per variant
    const getVariantStyles = (): React.CSSProperties => {
      const variantConfig: Record<
        string,
        {
          bg: string;
          text: string;
          border?: string;
        }
      > = {
        primary: {
          bg: "--primary",
          text: "--on-primary",
        },
        secondary: {
          bg: "--secondary",
          text: "--on-secondary",
        },
        tertiary: {
          bg: "--tertiary",
          text: "--on-tertiary",
        },
        success: {
          bg: "--success",
          text: "--on-success",
        },
        warning: {
          bg: "--warning",
          text: "--on-warning",
        },
        info: {
          bg: "--info",
          text: "--on-info",
        },
        danger: {
          bg: "--error",
          text: "--on-error",
        },
        ghost: {
          bg: "transparent",
          text: "--on-surface",
        },
        outline: {
          bg: "transparent",
          text: "--on-surface",
          border: "--outline",
        },
      };

      const config = variantConfig[variant];

      if (variant === "ghost") {
        return {
          backgroundColor: "transparent",
          color: getColor(config.text),
        };
      }

      if (variant === "outline") {
        return {
          backgroundColor: "transparent",
          color: getColor(config.text),
          border: `2px solid ${getColor(config.border!)}`,
        };
      }

      return {
        backgroundColor: getColor(config.bg),
        color: getColor(config.text),
      };
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      if (variant === "ghost") {
        e.currentTarget.style.backgroundColor = getColor("--surface-variant");
      } else if (variant === "outline") {
        e.currentTarget.style.backgroundColor = getColor("--surface-variant");
        e.currentTarget.style.borderColor = getColor("--primary");
      } else {
        const config: Record<string, string> = {
          primary: "--primary",
          secondary: "--secondary",
          tertiary: "--tertiary",
          success: "--success",
          warning: "--warning",
          info: "--info",
          danger: "--error",
        };

        const colorVar = config[variant];
        e.currentTarget.style.backgroundColor = `${getColor(colorVar)}e6`; // 90% opacity
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 4px 8px -2px ${getColor(
          colorVar
        )}40`;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      if (variant === "ghost") {
        e.currentTarget.style.backgroundColor = "transparent";
      } else if (variant === "outline") {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.borderColor = getColor("--outline");
      } else {
        const config: Record<string, string> = {
          primary: "--primary",
          secondary: "--secondary",
          tertiary: "--tertiary",
          success: "--success",
          warning: "--warning",
          info: "--info",
          danger: "--error",
        };

        e.currentTarget.style.backgroundColor = getColor(config[variant]);
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      e.currentTarget.style.transform = "translateY(0) scale(0.98)";
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      e.currentTarget.style.transform = "translateY(-2px) scale(1)";
    };

    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], widthStyles, className)}
        style={getVariantStyles()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={(e) => {
          const config: Record<string, string> = {
            primary: "--primary",
            secondary: "--secondary",
            tertiary: "--tertiary",
            success: "--success",
            warning: "--warning",
            info: "--info",
            danger: "--error",
            ghost: "--primary",
            outline: "--primary",
          };
          e.currentTarget.style.boxShadow = `0 0 0 3px ${getColor(
            config[variant]
          )}40`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
