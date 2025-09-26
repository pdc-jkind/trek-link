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

  const getArrowClasses = () => {
    if (!arrow) return "";

    const arrowClasses = {
      top: "after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-card",
      bottom:
        "after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-b-card",
      left: "after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-[6px] after:border-transparent after:border-l-card",
      right:
        "after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-[6px] after:border-transparent after:border-r-card",
      "top-start":
        "after:absolute after:top-full after:left-4 after:border-[6px] after:border-transparent after:border-t-card",
      "top-end":
        "after:absolute after:top-full after:right-4 after:border-[6px] after:border-transparent after:border-t-card",
      "bottom-start":
        "after:absolute after:bottom-full after:left-4 after:border-[6px] after:border-transparent after:border-b-card",
      "bottom-end":
        "after:absolute after:bottom-full after:right-4 after:border-[6px] after:border-transparent after:border-b-card",
    };
    return arrowClasses[placement];
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
            "absolute z-50 bg-card border-2 border-border rounded-lg shadow-elevation-3 p-4 min-w-max",
            "animate-in fade-in slide-in-from-bottom-2 duration-200",
            getPlacementClasses(),
            getArrowClasses(),
            contentClassName
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-card-foreground text-sm">{content}</div>
        </div>
      )}
    </div>
  );
};
