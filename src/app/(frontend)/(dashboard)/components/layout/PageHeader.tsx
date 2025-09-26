// src/fe/components/layout/PageHeader.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  actions,
  breadcrumbs,
  className = "",
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4" aria-label="Breadcrumb">
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="text-gray-400 dark:text-gray-500">/</span>
                )}
                {crumb.href && !crumb.active ? (
                  <a
                    href={crumb.href}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span
                    className={
                      crumb.active
                        ? "text-gray-900 dark:text-gray-100 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>
      )}

      {/* Main Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title Section */}
          <div className="flex items-center space-x-3 mb-2">
            {Icon && (
              <div className="flex-shrink-0">
                <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex-shrink-0 ml-4">
            <div className="flex items-center space-x-3">{actions}</div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mt-6 border-b border-gray-200 dark:border-gray-700"></div>
    </div>
  );
};
