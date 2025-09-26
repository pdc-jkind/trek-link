// src/components/form/Button.tsx
import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/fe/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "ghost"
  | "outline"
  | "danger";

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
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold " +
      "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 " +
      "focus-visible:ring-primary focus-visible:ring-offset-2 " +
      "disabled:pointer-events-none disabled:opacity-50";

    // Menggunakan CSS variables dari globals.css dan tailwind.config
    const variantStyles: Record<ButtonVariant, string> = {
      // Primary menggunakan primary variables
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 " +
        "shadow-sm hover:shadow-elevation-2 hover:-translate-y-0.5 active:translate-y-0",

      // Secondary menggunakan secondary variables
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80 " +
        "border border-border hover:border-border/60",

      // Accent menggunakan accent variables dari tailwind.config
      accent:
        "bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80 " +
        "shadow-sm hover:shadow-elevation-2 hover:-translate-y-0.5 active:translate-y-0",

      // Success menggunakan success variables
      success:
        "bg-success text-success-foreground hover:bg-success/90 active:bg-success/80 " +
        "shadow-sm hover:shadow-elevation-2 hover:-translate-y-0.5 active:translate-y-0",

      // Ghost menggunakan muted dan foreground variables
      ghost:
        "text-foreground hover:bg-muted hover:text-foreground active:bg-muted/80",

      // Outline menggunakan border dan foreground variables
      outline:
        "border-2 border-border bg-transparent text-foreground " +
        "hover:bg-muted hover:border-primary active:bg-muted/80",

      // Danger menggunakan destructive variables
      danger:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 " +
        "shadow-sm hover:shadow-elevation-2 hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "px-4 py-2 text-xs h-9",
      md: "px-6 py-2.5 text-sm h-11",
      lg: "px-8 py-3 text-base h-12",
    };

    const widthStyles = fullWidth ? "w-full" : "";

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
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          className
        )}
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
