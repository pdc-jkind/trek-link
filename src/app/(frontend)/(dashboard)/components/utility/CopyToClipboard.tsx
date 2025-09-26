// ===== /utility/CopyToClipboard.tsx =====
"use client";

import React, { useState } from "react";
import { cn } from "@/fe/lib/utils";
import { Copy, Check } from "lucide-react";

interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
  onCopy?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  showText?: boolean;
  successDuration?: number;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  children,
  onCopy,
  size = "md",
  variant = "ghost",
  className,
  showText = true,
  successDuration = 2000,
}) => {
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "btn-ghost",
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();

      setTimeout(() => {
        setCopied(false);
      }, successDuration);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        onCopy?.();
        setTimeout(() => setCopied(false), successDuration);
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  if (children) {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center gap-2 transition-colors",
          className
        )}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {children}
        {copied ? (
          <Check className="h-4 w-4 text-success-600" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "btn inline-flex items-center gap-2 transition-all",
        variantClasses[variant],
        sizeClasses[size],
        copied && "text-success-600",
        className
      )}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          {showText && "Copied!"}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {showText && "Copy"}
        </>
      )}
    </button>
  );
};
