// ===== /form/DatePicker.tsx =====
"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/fe/lib/utils";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  format?: "dd/mm/yyyy" | "mm/dd/yyyy" | "yyyy-mm-dd";
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onValueChange,
  placeholder = "Select date...",
  label,
  error,
  hint,
  size = "md",
  disabled = false,
  className,
  format = "dd/mm/yyyy",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value.getFullYear(), value.getMonth()) : new Date()
  );
  const datePickerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    switch (format) {
      case "mm/dd/yyyy":
        return `${month}/${day}/${year}`;
      case "yyyy-mm-dd":
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newMonth;
    });
  };

  const selectDate = (date: Date) => {
    onValueChange?.(date);
    setIsOpen(false);
  };

  const isDateSelected = (date: Date): boolean => {
    if (!value) return false;
    return date.toDateString() === value.toDateString();
  };

  const isDateInCurrentMonth = (date: Date): boolean => {
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const renderDatePicker = () => (
    <div ref={datePickerRef} className="relative">
      <div
        className={cn(
          "input cursor-pointer flex items-center justify-between",
          sizeClasses[size],
          error &&
            "border-destructive focus:ring-destructive focus:border-destructive",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-primary border-primary",
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={cn("truncate", !value ? "text-muted-foreground" : "")}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 surface shadow-elevation-2 z-50 p-4 rounded-lg min-w-[280px]">
          {/* Header dengan kontras yang baik */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth("prev")}
              className="p-1 hover:bg-muted rounded text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-medium text-foreground">
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              type="button"
              onClick={() => navigateMonth("next")}
              className="p-1 hover:bg-muted rounded text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Week Days menggunakan muted-foreground */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-xs text-muted-foreground text-center p-2 font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days dengan CSS variables */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectDate(date)}
                className={cn(
                  "p-2 text-sm hover:bg-muted rounded text-center transition-colors",
                  "text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                  !isDateInCurrentMonth(date) &&
                    "text-muted-foreground opacity-50",
                  isDateSelected(date) &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (label || error || hint) {
    return (
      <div className="space-y-2">
        {label && <label className="label">{label}</label>}
        {renderDatePicker()}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {hint && !error && (
          <p className="text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }

  return renderDatePicker();
};
