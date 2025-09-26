// ===== /form/ImageUpload.tsx =====
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
  maxSize?: number; // in MB
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

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      // Handle error - file too large
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
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
        "border-border hover:border-primary dark:hover:border-primary",
        "bg-background-subtle hover:bg-muted dark:bg-background-muted dark:hover:bg-background-subtle",
        dragOver &&
          "border-primary bg-muted dark:bg-background-subtle shadow-elevation-1",
        error && "border-destructive bg-destructive/5 dark:bg-destructive/10",
        disabled &&
          "opacity-50 cursor-not-allowed hover:border-border hover:bg-background-subtle dark:hover:bg-background-muted",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && fileInputRef.current?.click()}
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
          <div className="relative mx-auto w-32 h-32 rounded-lg overflow-hidden surface">
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
            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:opacity-90 transition-opacity shadow-elevation-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {accept.includes("image") ? (
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          ) : (
            <File className="mx-auto h-12 w-12 text-muted-foreground" />
          )}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              <Upload className="inline h-4 w-4 mr-1" />
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
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
        {label && <label className="label">{label}</label>}
        {renderUploadArea()}
        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }

  return renderUploadArea();
};
