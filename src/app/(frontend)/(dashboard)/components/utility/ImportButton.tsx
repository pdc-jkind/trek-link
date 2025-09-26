// ===== /utility/ImportButton.tsx =====
"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/fe/lib/utils";
import { Upload } from "lucide-react";

interface ImportButtonProps {
  onImport: (data: any[], filename: string) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  supportedFormats?: string[];
  onError?: (error: string) => void;
}

export const ImportButton: React.FC<ImportButtonProps> = ({
  onImport,
  accept = ".csv,.xlsx,.json",
  multiple = false,
  maxSize = 10,
  size = "md",
  variant = "outline",
  disabled = false,
  loading = false,
  className,
  supportedFormats = ["CSV", "Excel", "JSON"],
  onError,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      onError?.(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    try {
      const data = await parseFile(file);
      onImport(data, file.name);
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Failed to parse file"
      );
    }
  };

  const parseFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;

          switch (fileExtension) {
            case "json":
              const jsonData = JSON.parse(content);
              resolve(Array.isArray(jsonData) ? jsonData : [jsonData]);
              break;

            case "csv":
              const csvData = parseCSV(content);
              resolve(csvData);
              break;

            case "xlsx":
              reject(
                new Error(
                  "Excel files require additional library (xlsx) to be installed"
                )
              );
              break;

            default:
              reject(new Error("Unsupported file format"));
          }
        } catch (error) {
          reject(new Error("Failed to parse file content"));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const parseCSV = (content: string): any[] => {
    const lines = content.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().replace(/"/g, ""));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]
        .split(",")
        .map((value) => value.trim().replace(/"/g, ""));
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      data.push(row);
    }

    return data;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || loading) return;
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !loading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled || loading}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={disabled || loading}
        className={cn(
          "btn inline-flex items-center gap-2 relative",
          variantClasses[variant],
          sizeClasses[size],
          dragOver && "bg-primary-50 border-primary-300 dark:bg-primary-900/20",
          className
        )}
      >
        <Upload className="h-4 w-4" />
        Import
        {dragOver && (
          <span className="absolute inset-0 border-2 border-dashed border-primary-400 rounded-lg" />
        )}
      </button>

      {supportedFormats.length > 0 && (
        <div className="absolute top-full left-0 mt-1 text-xs text-muted-foreground whitespace-nowrap">
          Supports: {supportedFormats.join(", ")}
        </div>
      )}
    </div>
  );
};
