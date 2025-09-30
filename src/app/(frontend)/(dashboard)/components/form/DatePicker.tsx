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

  // Get dynamic colors from CSS variables
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

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
          "cursor-pointer flex items-center justify-between rounded-lg border-2 transition-all",
          sizeClasses[size],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        style={{
          backgroundColor: getColor("--surface"),
          borderColor: error
            ? getColor("--error")
            : isOpen
            ? getColor("--primary")
            : getColor("--outline"),
          color: value
            ? getColor("--on-surface")
            : getColor("--on-surface-variant"),
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={(e) => {
          if (isOpen) {
            e.currentTarget.style.boxShadow = `0 0 0 3px ${getColor(
              "--primary"
            )}40`;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span className="truncate">
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className="h-4 w-4 flex-shrink-0" />
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 shadow-elevation-3 z-50 p-4 rounded-xl min-w-[280px] border-2"
          style={{
            backgroundColor: getColor("--surface"),
            borderColor: getColor("--outline"),
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth("prev")}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: getColor("--on-surface") }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  getColor("--surface-variant");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3
              className="text-sm font-bold"
              style={{ color: getColor("--on-surface") }}
            >
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              type="button"
              onClick={() => navigateMonth("next")}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: getColor("--on-surface") }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  getColor("--surface-variant");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-xs text-center p-2 font-semibold"
                style={{ color: getColor("--on-surface-variant") }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const selected = isDateSelected(date);
              const inMonth = isDateInCurrentMonth(date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectDate(date)}
                  className="p-2 text-sm rounded-lg text-center transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: selected
                      ? getColor("--primary")
                      : "transparent",
                    color: selected
                      ? getColor("--on-primary")
                      : inMonth
                      ? getColor("--on-surface")
                      : getColor("--on-surface-variant"),
                    opacity: inMonth ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.backgroundColor =
                        getColor("--surface-variant");
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${getColor(
                      "--primary"
                    )}60`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
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
        {renderDatePicker()}
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

  return renderDatePicker();
};
