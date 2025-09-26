// src/app/(frontend)/(dashboard)/components/ThemeComponents.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "@/fe/store/theme.store";

// Theme Initializer Component
export const ThemeInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { initializeTheme, setMounted } = useTheme();

  useEffect(() => {
    // Initialize theme and get cleanup function
    const cleanup = initializeTheme();
    setMounted(true);

    // Return cleanup function for useEffect
    return cleanup;
  }, [initializeTheme, setMounted]);

  return <>{children}</>;
};

// Theme Toggle Switch Component
interface ThemeToggleProps {
  variant?: "switch" | "dropdown" | "buttons";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "switch",
  className = "",
  size = "md",
}) => {
  const { theme, actualTheme, setTheme, mounted } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div
        className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${getSizeClasses(
          size
        )} ${className}`}
      />
    );
  }

  function getSizeClasses(size: string) {
    switch (size) {
      case "sm":
        return "h-6 w-10";
      case "lg":
        return "h-8 w-16";
      default:
        return "h-7 w-12";
    }
  }

  // Theme options
  const themeOptions = [
    { value: "light", label: "Terang", icon: Sun },
    { value: "dark", label: "Gelap", icon: Moon },
    { value: "system", label: "Sistem", icon: Monitor },
  ];

  // Switch variant
  if (variant === "switch") {
    const isDark = actualTheme === "dark";

    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative inline-flex items-center rounded-full transition-all duration-300 ease-in-out
          ${
            isDark
              ? "bg-primary-600 dark:bg-primary-500"
              : "bg-gray-300 dark:bg-gray-600"
          }
          ${getSizeClasses(size)}
          ${className}
          focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          hover:shadow-md
        `}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <span
          className={`
            inline-block rounded-full bg-white dark:bg-gray-100 shadow-lg transform transition-all duration-300 ease-in-out
            ${size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"}
            ${
              isDark
                ? size === "sm"
                  ? "translate-x-4"
                  : size === "lg"
                  ? "translate-x-8"
                  : "translate-x-5"
                : "translate-x-1"
            }
            flex items-center justify-center
          `}
        >
          {isDark ? (
            <Moon
              className={`${
                size === "sm"
                  ? "w-2 h-2"
                  : size === "lg"
                  ? "w-4 h-4"
                  : "w-3 h-3"
              } text-primary-600`}
            />
          ) : (
            <Sun
              className={`${
                size === "sm"
                  ? "w-2 h-2"
                  : size === "lg"
                  ? "w-4 h-4"
                  : "w-3 h-3"
              } text-yellow-500`}
            />
          )}
        </span>
      </button>
    );
  }

  // Dropdown variant
  if (variant === "dropdown") {
    const currentOption = themeOptions.find((option) => option.value === theme);
    const CurrentIcon = currentOption?.icon || Monitor;

    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <CurrentIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {currentOption?.label || "Sistem"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 animate-slide-down">
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = theme === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value as any);
                      setIsDropdownOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200
                      ${
                        isActive
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }
                      first:rounded-t-lg last:rounded-b-lg
                    `}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span>{option.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Button group variant
  if (variant === "buttons") {
    return (
      <div
        className={`flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 ${className}`}
      >
        {themeOptions.map((option) => {
          const IconComponent = option.icon;
          const isActive = theme === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value as any)}
              className={`
                flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }
                focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800
              `}
              title={option.label}
            >
              <IconComponent className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    );
  }

  return null;
};

// Theme Status Indicator
export const ThemeStatus: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { theme, actualTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-20 rounded ${className}`}
      />
    );
  }

  const getStatusText = () => {
    if (theme === "system") {
      return `Sistem (${actualTheme === "dark" ? "Gelap" : "Terang"})`;
    }
    return theme === "dark" ? "Mode Gelap" : "Mode Terang";
  };

  const getStatusColor = () => {
    if (actualTheme === "dark") {
      return "text-blue-600 dark:text-blue-400";
    }
    return "text-yellow-600 dark:text-yellow-400";
  };

  return (
    <span className={`text-sm ${getStatusColor()} ${className}`}>
      {getStatusText()}
    </span>
  );
};

export default ThemeToggle;
