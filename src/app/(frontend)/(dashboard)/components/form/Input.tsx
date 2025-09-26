// ===== /form/Input.tsx =====
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        {/* Search Icon */}
        {variant === "search" && !leftIcon && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            "input",
            sizeClasses[inputSize],
            leftIcon || variant === "search" ? "pl-10" : "",
            rightIcon || clearable || variant === "password" ? "pr-10" : "",
            error &&
              "border-destructive focus:ring-destructive focus:border-destructive",
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
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md
              text-muted-foreground hover:text-foreground hover:bg-muted
              transition-colors"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md
              text-muted-foreground hover:text-foreground hover:bg-muted
              transition-colors"
            onClick={onClear}
            tabIndex={-1}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Right Icon */}
        {rightIcon && !clearable && variant !== "password" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 z-50 max-h-48 overflow-y-auto
            surface rounded-lg shadow-elevation-2 scrollbar-thin"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "w-full text-left px-3 py-2.5 text-sm transition-colors",
                  "text-foreground hover:bg-muted",
                  "first:rounded-t-lg last:rounded-b-lg",
                  "border-b border-border-muted last:border-b-0"
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
          {label && <label className="label">{label}</label>}
          {renderInput()}
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
          {hint && !error && (
            <p className="text-sm text-muted-foreground">{hint}</p>
          )}
        </div>
      );
    }

    return renderInput();
  }
);

Input.displayName = "Input";
