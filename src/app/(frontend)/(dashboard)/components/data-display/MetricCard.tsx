"use client";

import React from "react";
import { cn } from "@/fe/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "./Card";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  icon: LucideIcon;
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
  className?: string;
  hoverable?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend,
  icon: Icon,
  color = "primary",
  className,
  hoverable = true,
}) => {
  const TrendIcon = trend?.direction === "up" ? ArrowUpRight : ArrowDownRight;

  const colorClasses = {
    primary: {
      bg: "bg-gradient-to-br from-primary-500 to-primary-600",
      bgLight: "bg-primary-50 dark:bg-primary-950/30",
      text: "text-primary-700 dark:text-primary-300",
      border: "border-primary-200 dark:border-primary-800",
      shadow: "shadow-primary-500/20",
    },
    secondary: {
      bg: "bg-gradient-to-br from-secondary-500 to-secondary-600",
      bgLight: "bg-secondary-50 dark:bg-secondary-950/30",
      text: "text-secondary-700 dark:text-secondary-300",
      border: "border-secondary-200 dark:border-secondary-800",
      shadow: "shadow-secondary-500/20",
    },
    accent: {
      bg: "bg-gradient-to-br from-accent-500 to-accent-600",
      bgLight: "bg-accent-50 dark:bg-accent-950/30",
      text: "text-accent-700 dark:text-accent-300",
      border: "border-accent-200 dark:border-accent-800",
      shadow: "shadow-accent-500/20",
    },
    success: {
      bg: "bg-gradient-to-br from-success-500 to-success-600",
      bgLight: "bg-success-50 dark:bg-success-950/30",
      text: "text-success-700 dark:text-success-300",
      border: "border-success-200 dark:border-success-800",
      shadow: "shadow-success-500/20",
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-500 to-amber-600",
      bgLight: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
      shadow: "shadow-amber-500/20",
    },
    danger: {
      bg: "bg-gradient-to-br from-red-500 to-red-600",
      bgLight: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
      shadow: "shadow-red-500/20",
    },
  };

  return (
    <Card
      variant="default"
      className={cn(
        "relative overflow-hidden transition-all duration-300 group border-2",
        colorClasses[color].border,
        hoverable && "hover:shadow-elevation-3 hover:-translate-y-1",
        className
      )}
    >
      {/* Background Gradient Decoration */}
      <div
        className={cn(
          "absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 blur-2xl transition-opacity duration-300",
          colorClasses[color].bgLight,
          hoverable && "group-hover:opacity-10"
        )}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div
            className={cn(
              "p-3.5 rounded-xl shadow-lg transition-all duration-300",
              colorClasses[color].bg,
              hoverable && "group-hover:scale-110 group-hover:rotate-3"
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border-2",
                trend.direction === "up"
                  ? "bg-success-50 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-300 dark:border-success-800"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800"
              )}
            >
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{trend.value}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-foreground tracking-tight">
              {value}
            </p>
            {subtitle && (
              <span className="text-sm font-medium text-foreground-muted">
                {subtitle}
              </span>
            )}
          </div>
          {change && (
            <p className="text-sm text-muted-foreground font-medium mt-3 flex items-center gap-1">
              <span
                className={cn(
                  "inline-block w-2 h-2 rounded-full",
                  colorClasses[color].bg
                )}
              />
              {change}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
