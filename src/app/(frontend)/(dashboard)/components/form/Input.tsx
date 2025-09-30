"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "@/fe/lib/utils";
import { Eye, EyeOff, Search, X } from "lucide-react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: "default" | "search" | "password";
  inputSize?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      variant = "default",
      inputSize = "md",
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      suggestions = [],
      onSuggestionSelect,
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setShowSuggestions(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setTimeout(() => setShowSuggestions(false), 150);
      onBlur?.(e);
    };

    const handleSuggestionClick = (suggestion: string) => {
      onSuggestionSelect?.(suggestion);
      setShowSuggestions(false);
    };

    const filteredSuggestions = suggestions
      .filter((suggestion) =>
        suggestion
          .toLowerCase()
          .includes((value as string)?.toLowerCase() || "")
      )
      .slice(0, 5);

    const renderInput = () => (
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-variant-foreground">
            {leftIcon}
          </div>
        )}

        {/* Search Icon */}
        {variant === "search" && !leftIcon && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-variant-foreground" />
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={
            variant === "password" && !showPassword
              ? "password"
              : props.type || "text"
          }
          className={cn(
            // Base styles - menggunakan elevation-1 untuk kontras lebih baik
            "flex w-full rounded-lg transition-all duration-200",
            "surface border-2 border-outline",
            "text-foreground placeholder:text-surface-variant-foreground",
            "shadow-sm hover:shadow-md",
            // Focus styles - menggunakan primary untuk highlight
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "focus:bg-background focus:shadow-elevation-2",
            // Disabled styles
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-disabled",
            // Size
            sizeClasses[inputSize],
            // Icon padding
            leftIcon || variant === "search" ? "pl-10" : "",
            rightIcon || clearable || variant === "password" ? "pr-10" : "",
            // Error state - menggunakan secondary sebagai error
            error &&
              "border-secondary focus:ring-secondary/20 focus:border-secondary bg-secondary-container/20",
            className
          )}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {/* Password Toggle */}
        {variant === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md
              text-surface-variant-foreground hover:text-primary hover:bg-primary/10
              transition-all duration-200"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Clear Button */}
        {clearable && value && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md
              text-surface-variant-foreground hover:text-secondary hover:bg-secondary/10
              transition-all duration-200"
            onClick={onClear}
            tabIndex={-1}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Right Icon */}
        {rightIcon && !clearable && variant !== "password" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-variant-foreground">
            {rightIcon}
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-2 z-50 max-h-48 overflow-y-auto
            surface border-2 border-outline-variant rounded-lg shadow-elevation-3 scrollbar-thin"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "w-full text-left px-4 py-3 text-sm transition-all duration-200",
                  "text-foreground hover:bg-primary/10 hover:text-primary",
                  "first:rounded-t-lg last:rounded-b-lg",
                  "border-b border-outline-variant last:border-b-0",
                  "font-medium"
                )}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );

    if (label || error || hint) {
      return (
        <div className="space-y-2">
          {label && (
            <label className="text-sm font-semibold text-foreground block">
              {label}
            </label>
          )}
          {renderInput()}
          {error && (
            <p className="text-sm font-medium text-secondary flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-secondary"></span>
              {error}
            </p>
          )}
          {hint && !error && (
            <p className="text-sm text-surface-variant-foreground">{hint}</p>
          )}
        </div>
      );
    }

    return renderInput();
  }
);

Input.displayName = "Input";
