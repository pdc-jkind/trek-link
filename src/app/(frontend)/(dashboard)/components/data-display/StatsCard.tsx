"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { Card, InteractiveCard } from "../layout/Card";

// Base StatsCard props
interface BaseStatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "minimal" | "glass";
}

// Trend configuration
interface Trend {
  value: number;
  type?: "up" | "down" | "neutral";
  label?: string;
  isPositive?: boolean; // For backward compatibility
}

// Standard StatsCard props
interface StatsCardProps extends BaseStatsCardProps {
  description?: string;
  subtitle?: string;
  trend?: Trend;
  color?: "primary" | "success" | "warning" | "danger" | "secondary" | string;
  onClick?: () => void;
  loading?: boolean;
  error?: boolean;
  children?: React.ReactNode;
}

// Color configurations
const colorConfigs = {
  primary: {
    gradient: "from-primary-500 to-primary-600",
    solid: "bg-primary-500",
    text: "text-primary-600 dark:text-primary-400",
    bg: "bg-primary-50 dark:bg-primary-900/20",
    border: "border-primary-200 dark:border-primary-800",
  },
  success: {
    gradient: "from-success-500 to-success-600",
    solid: "bg-success-500",
    text: "text-success-600 dark:text-success-400",
    bg: "bg-success-50 dark:bg-success-900/20",
    border: "border-success-200 dark:border-success-800",
  },
  warning: {
    gradient: "from-warning-500 to-warning-600",
    solid: "bg-warning-500",
    text: "text-warning-600 dark:text-warning-400",
    bg: "bg-warning-50 dark:bg-warning-900/20",
    border: "border-warning-200 dark:border-warning-800",
  },
  danger: {
    gradient: "from-danger-500 to-danger-600",
    solid: "bg-danger-500",
    text: "text-danger-600 dark:text-danger-400",
    bg: "bg-danger-50 dark:bg-danger-900/20",
    border: "border-danger-200 dark:border-danger-800",
  },
  secondary: {
    gradient: "from-gray-500 to-gray-600",
    solid: "bg-gray-500",
    text: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  subtitle,
  value,
  description,
  icon,
  trend,
  color = "primary",
  variant = "default",
  size = "md",
  loading = false,
  error = false,
  onClick,
  children,
  className = "",
}) => {
  // Get color configuration
  const colorConfig =
    typeof color === "string" && color in colorConfigs
      ? colorConfigs[color as keyof typeof colorConfigs]
      : colorConfigs.primary;

  // Normalize trend data for backward compatibility
  const normalizedTrend = trend
    ? {
        ...trend,
        type:
          trend.type ||
          (trend.isPositive !== undefined
            ? trend.isPositive
              ? "up"
              : "down"
            : trend.value > 0
            ? "up"
            : trend.value < 0
            ? "down"
            : "neutral"),
      }
    : null;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          padding: "p-4",
          titleSize: "text-xs",
          valueSize: "text-xl",
          iconSize: "w-8 h-8",
          iconContainer: "w-12 h-12",
        };
      case "lg":
        return {
          padding: "p-8",
          titleSize: "text-base",
          valueSize: "text-4xl",
          iconSize: "w-8 h-8",
          iconContainer: "w-20 h-20",
        };
      default:
        return {
          padding: "p-6",
          titleSize: "text-sm",
          valueSize: "text-3xl",
          iconSize: "w-6 h-6",
          iconContainer: "w-16 h-16",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getTrendIcon = () => {
    if (!normalizedTrend) return null;

    switch (normalizedTrend.type) {
      case "up":
        return <TrendingUp className="w-3 h-3" />;
      case "down":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = () => {
    if (!normalizedTrend) return "";

    switch (normalizedTrend.type) {
      case "up":
        return "text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20";
      case "down":
        return "text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800";
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card
        variant="default"
        size={size}
        className={`animate-pulse ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
            <div
              className={`h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 ${
                size === "lg" ? "h-10" : size === "sm" ? "h-6" : "h-8"
              }`}
            />
            {description && (
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            )}
          </div>
          <div
            className={`bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses.iconContainer}`}
          />
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card
        variant="outlined"
        size={size}
        className={`${colorConfigs.danger.bg} ${colorConfigs.danger.border} ${className}`}
      >
        <div className="text-center">
          <AlertCircle
            className={`mx-auto mb-2 ${sizeClasses.iconSize} ${colorConfigs.danger.text}`}
          />
          <p
            className={`${colorConfigs.danger.text} ${sizeClasses.titleSize} font-medium`}
          >
            Error loading {title.toLowerCase()}
          </p>
        </div>
      </Card>
    );
  }

  const renderIcon = () => {
    if (!icon) return null;

    // Handle both component and element icons
    if (React.isValidElement(icon)) {
      // Type-safe cloneElement with proper typing
      return React.cloneElement(icon as React.ReactElement<any>, {
        className: `${sizeClasses.iconSize} text-white`,
      });
    }

    if (typeof icon === "function") {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className={`${sizeClasses.iconSize} text-white`} />;
    }

    return icon;
  };

  const renderContent = () => (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        {/* Header */}
        <div className="mb-3">
          <p
            className={`${sizeClasses.titleSize} font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide`}
          >
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 animate-fade-in">
              {subtitle}
            </p>
          )}
        </div>

        {/* Value and Trend */}
        <div className="flex items-baseline space-x-3 mb-2">
          <p
            className={`${sizeClasses.valueSize} font-bold text-gray-900 dark:text-white animate-slide-up`}
          >
            {value}
          </p>
          {normalizedTrend && (
            <div
              className={`
              flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
              transition-all duration-200 animate-scale-in
              ${getTrendColor()}
            `}
            >
              {getTrendIcon()}
              <span>
                {normalizedTrend.value > 0 ? "+" : ""}
                {normalizedTrend.value}%
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed animate-fade-in">
            {description}
          </p>
        )}

        {/* Trend Label */}
        {normalizedTrend?.label && (
          <p
            className={`text-xs mt-2 font-medium animate-fade-in ${
              getTrendColor().split(" ")[0]
            } ${getTrendColor().split(" ")[1]}`}
          >
            {normalizedTrend.label}
          </p>
        )}

        {/* Additional Content */}
        {children && <div className="mt-4 animate-fade-in">{children}</div>}
      </div>

      {/* Icon */}
      {icon && (
        <div className="flex-shrink-0 ml-4">
          <div
            className={`
            ${
              sizeClasses.iconContainer
            } flex items-center justify-center rounded-xl 
            ${
              variant === "gradient"
                ? `bg-gradient-to-r ${colorConfig.gradient}`
                : colorConfig.solid
            }
            shadow-card hover:shadow-card-hover transition-all duration-300
            ${onClick ? "group-hover:scale-110 group-hover:rotate-3" : ""}
          `}
          >
            {renderIcon()}
          </div>
        </div>
      )}
    </div>
  );

  const renderGradientContent = () => (
    <div
      className={`bg-gradient-to-r ${colorConfig.gradient} ${sizeClasses.padding} text-white relative overflow-hidden rounded-lg`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20 animate-pulse" />
        <div
          className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="mb-4">
              <p
                className={`${sizeClasses.titleSize} font-medium text-white/90 uppercase tracking-wide`}
              >
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-white/70 mt-1 animate-fade-in">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Value and Trend */}
            <div className="flex items-baseline space-x-3 mb-3">
              <p
                className={`${sizeClasses.valueSize} font-bold text-white animate-slide-up`}
              >
                {value}
              </p>
              {normalizedTrend && (
                <div
                  className={`
                  flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-300 animate-scale-in backdrop-blur-sm
                  ${
                    normalizedTrend.type === "up"
                      ? "bg-white/25 text-white shadow-soft"
                      : normalizedTrend.type === "down"
                      ? "bg-black/25 text-white/90 shadow-soft"
                      : "bg-white/20 text-white/80 shadow-soft"
                  }
                `}
                >
                  {getTrendIcon()}
                  <span>
                    {normalizedTrend.value > 0 ? "+" : ""}
                    {normalizedTrend.value}%
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-white/80 text-sm leading-relaxed animate-fade-in mb-3">
                {description}
              </p>
            )}

            {/* Progress Bar */}
            {normalizedTrend && (
              <div className="mb-4">
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                  <div
                    className={`
                      h-full rounded-full transition-all duration-1000 ease-out animate-slide-up
                      ${
                        normalizedTrend.type === "up"
                          ? "bg-gradient-to-r from-white/60 to-white/90"
                          : "bg-gradient-to-r from-white/40 to-white/70"
                      }
                    `}
                    style={{
                      width: `${Math.min(
                        Math.abs(normalizedTrend.value),
                        100
                      )}%`,
                      animationDelay: "400ms",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Additional Content */}
            {children && <div className="animate-fade-in">{children}</div>}
          </div>

          {/* Icon */}
          {icon && (
            <div className="flex-shrink-0 ml-6">
              <div
                className={`
                ${
                  sizeClasses.iconContainer
                } flex items-center justify-center rounded-2xl 
                bg-white/20 backdrop-blur-md border border-white/30 shadow-soft
                ${
                  onClick
                    ? "group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-6"
                    : ""
                }
                transition-all duration-300
              `}
              >
                <div className="text-white/90 scale-125">{renderIcon()}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
    </div>
  );

  // Render based on variant and interactivity
  if (variant === "gradient") {
    if (onClick) {
      return (
        <InteractiveCard
          onClick={onClick}
          variant="minimal"
          size="sm"
          className={`group ${className}`}
        >
          {renderGradientContent()}
        </InteractiveCard>
      );
    }
    return (
      <Card variant="minimal" size="sm" className={className}>
        {renderGradientContent()}
      </Card>
    );
  }

  // Standard variants
  if (onClick) {
    return (
      <InteractiveCard
        onClick={onClick}
        variant={variant === "default" ? "elevated" : variant}
        size={size}
        hover
        className={`group ${className}`}
      >
        {renderContent()}
      </InteractiveCard>
    );
  }

  return (
    <Card
      variant={variant === "default" ? "elevated" : variant}
      size={size}
      hover
      className={className}
    >
      {renderContent()}
    </Card>
  );
};

// Specialized StatsCard variants
export const CompactStatsCard: React.FC<
  Omit<StatsCardProps, "size" | "variant">
> = (props) => <StatsCard {...props} size="sm" variant="minimal" />;

export const GradientStatsCard: React.FC<Omit<StatsCardProps, "variant">> = (
  props
) => <StatsCard {...props} variant="gradient" />;

export const InteractiveStatsCard: React.FC<
  StatsCardProps & { onClick: () => void }
> = (props) => <StatsCard {...props} variant="glass" />;

export default StatsCard;
