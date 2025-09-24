// src/app/(frontend)/components/ThemeProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      let effectiveTheme: "light" | "dark";

      if (theme === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      } else {
        effectiveTheme = theme;
      }

      setActualTheme(effectiveTheme);

      root.classList.remove("light", "dark");
      root.classList.add(effectiveTheme);

      // Store theme preference
      localStorage.setItem("theme", theme);

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          effectiveTheme === "dark" ? "#1f2937" : "#ffffff"
        );
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        updateTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme Toggle Component
import { Sun, Moon, Monitor } from "lucide-react";

export const ThemeToggle: React.FC<{
  variant?: "button" | "dropdown" | "switch";
  className?: string;
}> = ({ variant = "button", className = "" }) => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
      />
    );
  }

  const themes = [
    { key: "light" as const, label: "Light", icon: Sun },
    { key: "dark" as const, label: "Dark", icon: Moon },
    { key: "system" as const, label: "System", icon: Monitor },
  ];

  if (variant === "switch") {
    return (
      <button
        onClick={() => setTheme(actualTheme === "dark" ? "light" : "dark")}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full 
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${
            actualTheme === "dark"
              ? "bg-primary-600 dark:bg-primary-500"
              : "bg-gray-200 dark:bg-gray-700"
          }
          ${className}
        `}
        aria-label="Toggle dark mode"
      >
        <span
          className={`
            h-4 w-4 transform rounded-full 
            bg-white shadow-lg transition-transform duration-200 ease-in-out
            flex items-center justify-center
            ${actualTheme === "dark" ? "translate-x-6" : "translate-x-1"}
          `}
        >
          {actualTheme === "dark" ? (
            <Moon className="h-3 w-3 text-primary-600" />
          ) : (
            <Sun className="h-3 w-3 text-yellow-500" />
          )}
        </span>
      </button>
    );
  }

  if (variant === "dropdown") {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {(() => {
            const currentTheme = themes.find((t) => t.key === theme);
            const Icon = currentTheme?.icon || Monitor;
            return (
              <>
                <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {currentTheme?.label}
                </span>
              </>
            );
          })()}
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-modal border border-gray-200 dark:border-gray-700 z-20 animate-scale-in">
              {themes.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors duration-150
                    ${
                      theme === key
                        ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                        : "text-gray-700 dark:text-gray-200"
                    }
                    ${key === themes[0].key ? "rounded-t-lg" : ""}
                    ${
                      key === themes[themes.length - 1].key
                        ? "rounded-b-lg"
                        : ""
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                  {theme === key && (
                    <div className="ml-auto w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Default button variant
  const Icon = actualTheme === "dark" ? Sun : Moon;

  return (
    <button
      onClick={() => setTheme(actualTheme === "dark" ? "light" : "dark")}
      className={`
        p-2.5 rounded-lg border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800 
        hover:bg-gray-50 dark:hover:bg-gray-700
        text-gray-600 dark:text-gray-300
        hover:text-gray-900 dark:hover:text-gray-100
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        shadow-card hover:shadow-card-hover
        group
        ${className}
      `}
      aria-label={`Switch to ${actualTheme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${actualTheme === "dark" ? "light" : "dark"} mode`}
    >
      <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
    </button>
  );
};

// Theme-aware component wrapper
export const ThemeAware: React.FC<{
  children: (theme: "light" | "dark") => React.ReactNode;
}> = ({ children }) => {
  const { actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children(actualTheme)}</>;
};

// Enhanced ActionButton with theme integration
export const ThemedActionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "secondary"
    | "theme";
  disabled?: boolean;
  active?: boolean;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}> = ({
  onClick,
  children,
  variant = "primary",
  disabled = false,
  active = false,
  size = "md",
  loading = false,
}) => {
  const { actualTheme } = useTheme();

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2";
    }
  };

  const getVariantClasses = () => {
    if (variant === "theme") {
      return actualTheme === "dark"
        ? "bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600"
        : "bg-white hover:bg-gray-50 text-gray-900 border-gray-300";
    }

    const variants = {
      primary:
        "bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-500 dark:hover:bg-primary-600",
      success:
        "bg-success-600 hover:bg-success-700 text-white dark:bg-success-500 dark:hover:bg-success-600",
      warning:
        "bg-warning-600 hover:bg-warning-700 text-white dark:bg-warning-500 dark:hover:bg-warning-600",
      danger:
        "bg-danger-600 hover:bg-danger-700 text-white dark:bg-danger-500 dark:hover:bg-danger-600",
      secondary:
        "bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600",
    };

    return variants[variant as keyof typeof variants] || variants.primary;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        rounded-lg font-medium flex items-center space-x-2
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        shadow-card hover:shadow-card-hover
        ${active ? "ring-2 ring-primary-500" : ""}
        ${loading ? "cursor-wait" : ""}
        animate-fade-in
      `}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
