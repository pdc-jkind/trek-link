// src/app/(frontend)/(dashboard)/components/ui/StatsCard.tsx
"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  description,
  onClick,
}) => {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover 
        transition-all duration-300 ease-out group
        ${
          onClick
            ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transform hover:scale-105 active:scale-95"
            : ""
        }
        ${onClick ? "animate-fade-in hover:animate-pulse" : "animate-fade-in"}
      `}
    >
      {/* Background Gradient */}
      <div className={`bg-gradient-to-r ${color} p-6 text-white relative`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20 animate-pulse" />
          <div
            className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-white/90 text-sm font-medium tracking-wide uppercase">
                {title}
              </p>
              <div className="flex items-baseline space-x-3 mt-2">
                <p className="text-3xl font-bold text-white tracking-tight">
                  {value}
                </p>
                {trend && (
                  <div
                    className={`
                      flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold
                      transition-all duration-200 animate-slide-up
                      ${
                        trend.isPositive
                          ? "bg-white/20 text-white backdrop-blur-sm"
                          : "bg-black/20 text-white/90 backdrop-blur-sm"
                      }
                    `}
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {trend.isPositive ? "+" : ""}
                      {trend.value}%
                    </span>
                  </div>
                )}
              </div>
              {description && (
                <p
                  className="text-white/80 text-xs mt-2 leading-relaxed animate-fade-in"
                  style={{ animationDelay: "200ms" }}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Icon with enhanced styling */}
            <div className="flex-shrink-0 ml-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <div className="text-white/90 group-hover:text-white transition-colors duration-300">
                  {icon}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar (if trend exists) */}
          {trend && (
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`
                    h-full rounded-full transition-all duration-1000 ease-out animate-slide-up
                    ${trend.isPositive ? "bg-white/80" : "bg-white/60"}
                  `}
                  style={{
                    width: `${Math.min(Math.abs(trend.value), 100)}%`,
                    animationDelay: "400ms",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Component>
  );
};

// Enhanced version with more features
export const EnhancedStatsCard: React.FC<
  StatsCardProps & {
    subtitle?: string;
    loading?: boolean;
    error?: boolean;
    children?: React.ReactNode;
  }
> = ({
  title,
  subtitle,
  value,
  icon,
  color,
  trend,
  description,
  loading = false,
  error = false,
  children,
  onClick,
}) => {
  const Component = onClick ? "button" : "div";

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800">
        <div className="p-6 text-center">
          <div className="text-danger-500 mb-2">{icon}</div>
          <p className="text-danger-800 dark:text-danger-200 text-sm font-medium">
            Error loading {title.toLowerCase()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Component
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover 
        transition-all duration-300 ease-out group
        ${
          onClick
            ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transform hover:scale-105 active:scale-95"
            : ""
        }
        animate-fade-in
      `}
    >
      {/* Background with dark mode support */}
      <div className={`bg-gradient-to-r ${color} p-6 text-white relative`}>
        {/* Enhanced animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20 animate-pulse" />
          <div
            className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-white/5 animate-ping"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="mb-3">
                <p className="text-white/90 text-sm font-medium tracking-wide uppercase">
                  {title}
                </p>
                {subtitle && (
                  <p
                    className="text-white/70 text-xs mt-1 animate-fade-in"
                    style={{ animationDelay: "100ms" }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-baseline space-x-3 mb-3">
                <p className="text-4xl font-bold text-white tracking-tight animate-slide-up">
                  {value}
                </p>
                {trend && (
                  <div
                    className={`
                      flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold
                      transition-all duration-300 animate-scale-in backdrop-blur-sm
                      ${
                        trend.isPositive
                          ? "bg-white/25 text-white shadow-soft"
                          : "bg-black/25 text-white/90 shadow-soft"
                      }
                    `}
                    style={{ animationDelay: "300ms" }}
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>
                      {trend.isPositive ? "+" : ""}
                      {trend.value}%
                    </span>
                  </div>
                )}
              </div>

              {description && (
                <p
                  className="text-white/80 text-sm leading-relaxed animate-fade-in"
                  style={{ animationDelay: "200ms" }}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Enhanced icon */}
            <div className="flex-shrink-0 ml-6">
              <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-soft">
                <div className="text-white/90 group-hover:text-white transition-colors duration-300 scale-125">
                  {icon}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          {trend && (
            <div className="mb-4">
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                <div
                  className={`
                    h-full rounded-full transition-all duration-1000 ease-out animate-slide-up
                    ${
                      trend.isPositive
                        ? "bg-gradient-to-r from-white/60 to-white/90"
                        : "bg-gradient-to-r from-white/40 to-white/70"
                    }
                  `}
                  style={{
                    width: `${Math.min(Math.abs(trend.value), 100)}%`,
                    animationDelay: "400ms",
                  }}
                />
              </div>
            </div>
          )}

          {/* Additional content */}
          {children && (
            <div
              className="animate-fade-in"
              style={{ animationDelay: "500ms" }}
            >
              {children}
            </div>
          )}
        </div>

        {/* Enhanced hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
      </div>
    </Component>
  );
};
