"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/fe/lib/utils";
import { Upload, X, Image as ImageIcon, File } from "lucide-react";

interface ImageUploadProps {
  value?: File | string;
  onValueChange?: (file: File | null) => void;
  label?: string;
  error?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  preview?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onValueChange,
  label,
  error,
  hint,
  accept = "image/*",
  multiple = false,
  maxSize = 5,
  preview = true,
  disabled = false,
  className,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  React.useEffect(() => {
    if (value && typeof value !== "string") {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      setPreviewUrl(value);
    } else {
      setPreviewUrl("");
    }
  }, [value]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > maxSize * 1024 * 1024) {
      return;
    }

    onValueChange?.(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    onValueChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderUploadArea = () => (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        borderColor: error
          ? getColor("--error")
          : dragOver
          ? getColor("--primary")
          : getColor("--outline"),
        backgroundColor: error
          ? `${getColor("--error-container")}40`
          : dragOver
          ? `${getColor("--primary-container")}60`
          : getColor("--surface-variant"),
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && fileInputRef.current?.click()}
      onMouseEnter={(e) => {
        if (!disabled && !dragOver) {
          e.currentTarget.style.borderColor = getColor("--primary");
          e.currentTarget.style.backgroundColor = `${getColor("--surface-2")}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !dragOver) {
          e.currentTarget.style.borderColor = error
            ? getColor("--error")
            : getColor("--outline");
          e.currentTarget.style.backgroundColor = getColor("--surface-variant");
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={disabled}
      />

      {previewUrl && preview ? (
        <div className="relative">
          <div
            className="relative mx-auto w-32 h-32 rounded-lg overflow-hidden border-2"
            style={{
              backgroundColor: getColor("--surface"),
              borderColor: getColor("--outline"),
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="absolute -top-2 -right-2 rounded-full p-1.5 hover:opacity-90 transition-opacity shadow-elevation-2"
            style={{
              backgroundColor: getColor("--error"),
              color: getColor("--on-error"),
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {accept.includes("image") ? (
            <ImageIcon
              className="mx-auto h-12 w-12"
              style={{ color: getColor("--on-surface-variant") }}
            />
          ) : (
            <File
              className="mx-auto h-12 w-12"
              style={{ color: getColor("--on-surface-variant") }}
            />
          )}
          <div className="space-y-1">
            <p
              className="text-sm font-semibold flex items-center justify-center gap-1"
              style={{ color: getColor("--on-surface") }}
            >
              <Upload className="h-4 w-4" />
              Click to upload or drag and drop
            </p>
            <p
              className="text-xs"
              style={{ color: getColor("--on-surface-variant") }}
            >
              Max size: {maxSize}MB
            </p>
          </div>
        </div>
      )}
    </div>
  );

  if (label || error || hint) {
    return (
      <div className="space-y-2">
        {label && (
          <label
            className="text-sm font-semibold leading-none"
            style={{ color: getColor("--on-surface") }}
          >
            {label}
          </label>
        )}
        {renderUploadArea()}
        {error && (
          <p
            className="text-sm font-medium"
            style={{ color: getColor("--error") }}
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            className="text-sm"
            style={{ color: getColor("--on-surface-variant") }}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }

  return renderUploadArea();
};
