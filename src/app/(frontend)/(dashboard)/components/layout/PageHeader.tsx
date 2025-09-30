"use client";

import React from "react";
import { cn } from "@/fe/lib/utils";
import { Calendar } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showLastUpdated?: boolean;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  showLastUpdated = false,
  breadcrumbs,
  className,
}) => {
  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  return (
    <div className={cn("mb-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3">
          <ol className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-2">
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="transition-colors hover:underline"
                    style={{ color: getColor("--on-surface-variant") }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = getColor("--primary");
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = getColor(
                        "--on-surface-variant"
                      );
                    }}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span
                    className="font-medium"
                    style={{ color: getColor("--on-surface") }}
                  >
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span style={{ color: getColor("--on-surface-variant") }}>
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent mb-3 drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-on-surface-variant text-lg">{subtitle}</p>
          )}
        </div>

        {/* Actions or Last Updated */}
        <div className="mt-4 lg:mt-0">
          {actions ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          ) : showLastUpdated ? (
            <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
              <Calendar className="w-4 h-4" />
              <span>
                Last updated:{" "}
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom Border */}
      <div
        className="mt-6 h-[2px]"
        style={{
          background: `linear-gradient(to right, ${getColor(
            "--primary"
          )}, transparent)`,
        }}
      />
    </div>
  );
};
