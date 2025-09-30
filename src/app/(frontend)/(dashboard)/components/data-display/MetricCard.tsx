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
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "warning"
    | "danger"
    | "info";
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

  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  // Color mapping berdasarkan CSS variables
  const colorConfig: Record<
    string,
    {
      main: string;
      container: string;
      onContainer: string;
      border: string;
      onMain: string;
    }
  > = {
    primary: {
      main: "--primary",
      container: "--primary-container",
      onContainer: "--on-primary-container",
      border: "--primary",
      onMain: "--on-primary",
    },
    secondary: {
      main: "--secondary",
      container: "--secondary-container",
      onContainer: "--on-secondary-container",
      border: "--secondary",
      onMain: "--on-secondary",
    },
    tertiary: {
      main: "--tertiary",
      container: "--tertiary-container",
      onContainer: "--on-tertiary-container",
      border: "--tertiary",
      onMain: "--on-tertiary",
    },
    success: {
      main: "--success",
      container: "--success-container",
      onContainer: "--on-success-container",
      border: "--success",
      onMain: "--on-success",
    },
    warning: {
      main: "--warning",
      container: "--warning-container",
      onContainer: "--on-warning-container",
      border: "--warning",
      onMain: "--on-warning",
    },
    info: {
      main: "--info",
      container: "--info-container",
      onContainer: "--on-info-container",
      border: "--info",
      onMain: "--on-info",
    },
    danger: {
      main: "--error",
      container: "--error-container",
      onContainer: "--on-error-container",
      border: "--error",
      onMain: "--on-error",
    },
  };

  const currentColor = colorConfig[color];

  return (
    <Card
      variant="default"
      className={cn(
        "relative overflow-hidden transition-all duration-300 group border-2",
        hoverable && "hover:shadow-elevation-3 hover:-translate-y-1",
        className
      )}
    >
      {/* Background Gradient Decoration */}
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl transition-opacity duration-300 opacity-5 group-hover:opacity-10"
        style={{
          backgroundColor: getColor(currentColor.container),
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div
            className={cn(
              "p-3.5 rounded-xl shadow-lg transition-all duration-300",
              hoverable && "group-hover:scale-110 group-hover:rotate-3"
            )}
            style={{
              backgroundColor: getColor(currentColor.main),
            }}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: getColor(currentColor.onMain) }}
            />
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border-2"
              )}
              style={{
                backgroundColor:
                  trend.direction === "up"
                    ? getColor("--success-container")
                    : getColor("--error-container"),
                color:
                  trend.direction === "up"
                    ? getColor("--on-success-container")
                    : getColor("--on-error-container"),
                borderColor:
                  trend.direction === "up"
                    ? `${getColor("--success")}40`
                    : `${getColor("--error")}40`,
              }}
            >
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{trend.value}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: getColor("--on-surface-variant") }}
          >
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <p
              className="text-4xl font-bold tracking-tight"
              style={{ color: getColor("--on-surface") }}
            >
              {value}
            </p>
            {subtitle && (
              <span
                className="text-sm font-medium"
                style={{ color: getColor("--on-surface-variant") }}
              >
                {subtitle}
              </span>
            )}
          </div>
          {change && (
            <p
              className="text-sm font-medium mt-3 flex items-center gap-1"
              style={{ color: getColor("--on-surface-variant") }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${getColor(
                    currentColor.main
                  )}, ${getColor(currentColor.main)}dd)`,
                }}
              />
              {change}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
