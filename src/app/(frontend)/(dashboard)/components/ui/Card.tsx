"use client";

import React from "react";

// Base card props
interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "glass" | "minimal";
  size?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  shadow?: "none" | "soft" | "card" | "card-hover" | "modal";
  rounded?: "sm" | "md" | "lg" | "xl";
}

// Standard Card props
interface CardProps extends BaseCardProps {
  as?: "div" | "article" | "section";
  role?: string;
  tabIndex?: number;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  "aria-disabled"?: boolean;
}

// Interactive Card props
interface InteractiveCardProps extends BaseCardProps {
  onClick: () => void;
  disabled?: boolean;
  focusable?: boolean;
}

// Scrollable Card props
interface ScrollableCardProps extends BaseCardProps {
  maxHeight?: string;
  scrollbarStyle?: "thin" | "default" | "hidden";
}

// Card Header/Body/Footer props
interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  hover = false,
  shadow = "card",
  rounded = "lg",
  as: Component = "div",
  role,
  tabIndex,
  onClick,
  onKeyDown,
  "aria-disabled": ariaDisabled,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "p-3";
      case "lg":
        return "p-6";
      case "xl":
        return "p-8";
      default:
        return "p-4";
    }
  };

  const getRoundedClasses = () => {
    switch (rounded) {
      case "sm":
        return "rounded-md";
      case "md":
        return "rounded-lg";
      case "xl":
        return "rounded-2xl";
      default:
        return "rounded-lg";
    }
  };

  const getShadowClasses = () => {
    switch (shadow) {
      case "none":
        return "shadow-none";
      case "soft":
        return "shadow-soft";
      case "card-hover":
        return "shadow-card-hover";
      case "modal":
        return "shadow-modal";
      default:
        return "shadow-card";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "elevated":
        return "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-soft";
      case "outlined":
        return "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-none";
      case "glass":
        return "bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 shadow-soft";
      case "minimal":
        return "bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-none";
      default:
        return "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700";
    }
  };

  const getHoverClasses = () => {
    if (!hover) return "";

    switch (variant) {
      case "elevated":
        return "hover:shadow-modal hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out";
      case "outlined":
        return "hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-card transition-all duration-200 ease-out";
      case "glass":
        return "hover:bg-white/90 dark:hover:bg-gray-800/90 hover:backdrop-blur-xl hover:shadow-card-hover transition-all duration-200 ease-out";
      case "minimal":
        return "hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-soft transition-all duration-200 ease-out";
      default:
        return "hover:shadow-card-hover hover:scale-[1.01] transition-all duration-200 ease-out";
    }
  };

  return (
    <Component
      className={`
        ${getSizeClasses()}
        ${getRoundedClasses()}
        ${getVariantClasses()}
        ${getShadowClasses()}
        ${getHoverClasses()}
        ${className}
      `.trim()}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-disabled={ariaDisabled}
    >
      {children}
    </Component>
  );
};

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  disabled = false,
  focusable = true,
  hover = true,
  className = "",
  ...props
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <Card
      children={undefined}
      className={`
        cursor-pointer select-none
        ${
          focusable
            ? "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            : ""
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      hover={hover && !disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={focusable && !disabled ? 0 : -1}
      role="button"
      aria-disabled={disabled}
      {...props}
    />
  );
};

export const ScrollableCard: React.FC<ScrollableCardProps> = ({
  children,
  maxHeight = "max-h-96",
  scrollbarStyle = "thin",
  className = "",
  ...props
}) => {
  const getScrollbarClasses = () => {
    switch (scrollbarStyle) {
      case "hidden":
        return "overflow-y-auto scrollbar-hide";
      case "default":
        return "overflow-y-auto";
      default:
        return "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800";
    }
  };

  return (
    <Card className={className} {...props}>
      <div className={`${maxHeight} ${getScrollbarClasses()}`}>{children}</div>
    </Card>
  );
};

// Card sections for better structure
export const CardHeader: React.FC<CardSectionProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case "none":
        return "";
      case "sm":
        return "p-3";
      case "lg":
        return "p-6";
      default:
        return "p-4";
    }
  };

  return (
    <div
      className={`${getPaddingClasses()} border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardBody: React.FC<CardSectionProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case "none":
        return "";
      case "sm":
        return "p-3";
      case "lg":
        return "p-6";
      default:
        return "p-4";
    }
  };

  return (
    <div className={`${getPaddingClasses()} ${className}`}>{children}</div>
  );
};

export const CardFooter: React.FC<CardSectionProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case "none":
        return "";
      case "sm":
        return "p-3";
      case "lg":
        return "p-6";
      default:
        return "p-4";
    }
  };

  return (
    <div
      className={`${getPaddingClasses()} border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

// Specialized card variants
export const StatsCard: React.FC<{
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className = "",
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success-600 dark:text-success-400";
      case "down":
        return "text-danger-600 dark:text-danger-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <Card variant="elevated" hover className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {value}
          </p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
          {trend && trendValue && (
            <p className={`text-sm font-medium mt-2 ${getTrendColor()}`}>
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
