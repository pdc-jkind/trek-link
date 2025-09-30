"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/fe/lib/utils";

interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  trigger?: "click" | "hover";
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end";
  className?: string;
  contentClassName?: string;
  offset?: number;
  arrow?: boolean;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  trigger = "click",
  placement = "bottom",
  className,
  contentClassName,
  offset = 8,
  arrow = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (trigger === "click") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [trigger]);

  const handleTriggerClick = () => {
    if (trigger === "click") {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setIsOpen(false);
    }
  };

  const getPlacementClasses = () => {
    const placementClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
      "top-start": "bottom-full left-0 mb-2",
      "top-end": "bottom-full right-0 mb-2",
      "bottom-start": "top-full left-0 mt-2",
      "bottom-end": "top-full right-0 mt-2",
    };
    return placementClasses[placement];
  };

  const getArrowStyles = () => {
    if (!arrow) return {};

    const surfaceColor = getColor("--surface");
    const borderColor = getColor("--outline");

    const arrowPositions = {
      top: {
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        borderTop: `8px solid ${surfaceColor}`,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
      },
      bottom: {
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        borderBottom: `8px solid ${surfaceColor}`,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
      },
      left: {
        left: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        borderLeft: `8px solid ${surfaceColor}`,
        borderTop: "8px solid transparent",
        borderBottom: "8px solid transparent",
      },
      right: {
        right: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        borderRight: `8px solid ${surfaceColor}`,
        borderTop: "8px solid transparent",
        borderBottom: "8px solid transparent",
      },
      "top-start": {
        top: "100%",
        left: "1rem",
        borderTop: `8px solid ${surfaceColor}`,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
      },
      "top-end": {
        top: "100%",
        right: "1rem",
        borderTop: `8px solid ${surfaceColor}`,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
      },
      "bottom-start": {
        bottom: "100%",
        left: "1rem",
        borderBottom: `8px solid ${surfaceColor}`,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
      },
      "bottom-end": {
        bottom: "100%",
        right: "1rem",
        borderBottom: `8px solid ${surfaceColor}`,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
      },
    };

    return arrowPositions[placement];
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isOpen && (
        <div
          ref={contentRef}
          className={cn(
            "absolute z-50 rounded-lg border-2 shadow-elevation-3 p-4 min-w-max",
            "animate-in fade-in slide-in-from-bottom-2 duration-200",
            getPlacementClasses(),
            contentClassName
          )}
          style={{
            backgroundColor: getColor("--surface"),
            borderColor: getColor("--outline"),
            color: getColor("--on-surface"),
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          {arrow && (
            <div className="absolute w-0 h-0" style={getArrowStyles()} />
          )}

          <div className="text-sm">{content}</div>
        </div>
      )}
    </div>
  );
};
