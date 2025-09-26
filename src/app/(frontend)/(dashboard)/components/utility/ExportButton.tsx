// ===== /utility/ExportButton.tsx =====
"use client";

import React, { useState } from "react";
import { cn } from "@/fe/lib/utils";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Image,
  ChevronDown,
} from "lucide-react";

interface ExportOption {
  key: string;
  label: string;
  icon: React.ReactNode;
  format: "csv" | "xlsx" | "pdf" | "json" | "png" | "jpg";
}

interface ExportButtonProps {
  data: any[];
  filename?: string;
  options?: ExportOption[];
  onExport?: (format: string, data: any[]) => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  single?: boolean; // If true, shows single button with default export
  defaultFormat?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = "export",
  options,
  onExport,
  size = "md",
  variant = "outline",
  disabled = false,
  loading = false,
  className,
  single = false,
  defaultFormat = "csv",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultOptions: ExportOption[] = [
    {
      key: "csv",
      label: "CSV",
      icon: <FileText className="h-4 w-4" />,
      format: "csv",
    },
    {
      key: "xlsx",
      label: "Excel",
      icon: <FileSpreadsheet className="h-4 w-4" />,
      format: "xlsx",
    },
    {
      key: "json",
      label: "JSON",
      icon: <FileText className="h-4 w-4" />,
      format: "json",
    },
    {
      key: "pdf",
      label: "PDF",
      icon: <FileText className="h-4 w-4" />,
      format: "pdf",
    },
  ];

  const exportOptions = options || defaultOptions;

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs h-8",
    md: "px-4 py-2 text-sm h-9",
    lg: "px-6 py-3 text-base h-11",
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "btn-ghost",
  };

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format, data);
    } else {
      // Default export logic
      exportData(format, data, filename);
    }
    setIsOpen(false);
  };

  const exportData = (format: string, exportData: any[], fileName: string) => {
    switch (format) {
      case "csv":
        exportToCSV(exportData, fileName);
        break;
      case "json":
        exportToJSON(exportData, fileName);
        break;
      case "xlsx":
        console.log("Excel export requires additional library (xlsx)");
        break;
      case "pdf":
        console.log("PDF export requires additional library (jsPDF)");
        break;
      default:
        console.log("Unsupported format");
    }
  };

  const exportToCSV = (data: any[], fileName: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    downloadFile(csvContent, `${fileName}.csv`, "text/csv");
  };

  const exportToJSON = (data: any[], fileName: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${fileName}.json`, "application/json");
  };

  const downloadFile = (
    content: string,
    fileName: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (single) {
    return (
      <button
        onClick={() => handleExport(defaultFormat)}
        disabled={disabled || loading}
        className={cn(
          "btn inline-flex items-center gap-2",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      >
        <Download className="h-4 w-4" />
        Export
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={cn(
          "btn inline-flex items-center gap-2",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      >
        <Download className="h-4 w-4" />
        Export
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-elevation-2 z-50 py-1">
          {exportOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => handleExport(option.format)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-muted transition-colors"
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
