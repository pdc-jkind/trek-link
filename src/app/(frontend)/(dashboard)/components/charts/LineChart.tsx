"use client";

import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/fe/lib/utils";

interface LineChartProps {
  data: any[];
  lines: {
    key: string;
    name?: string;
    color?: string;
    strokeWidth?: number;
  }[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
}) => {
  // Enhanced color palette with proper contrast and vibrant colors
  const defaultColors = [
    "#3b82f6", // Primary blue - highly visible
    "#ec4899", // Secondary pink - eye-catching
    "#22c55e", // Success green - clear signal
    "#f59e0b", // Accent amber - warm and energetic
    "#ef4444", // Destructive red - strong warning
    "#8b5cf6", // Purple - additional variety
    "#06b6d4", // Cyan - cool accent
    "#84cc16", // Lime - fresh accent
  ];

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border/30"
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            className="text-muted-foreground"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
            tick={{ fill: "currentColor" }}
          />
          <YAxis
            className="text-muted-foreground"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
            tick={{ fill: "currentColor" }}
            tickFormatter={(value) => {
              // Format large numbers with K, M suffix
              if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              }
              if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}K`;
              }
              return value;
            }}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                color: "hsl(var(--card-foreground))",
                padding: "12px",
                fontSize: "13px",
                fontWeight: "500",
              }}
              labelStyle={{
                color: "hsl(var(--foreground))",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px",
              }}
              itemStyle={{
                padding: "4px 0",
                color: "hsl(var(--foreground-muted))",
              }}
              cursor={{
                stroke: "hsl(var(--border))",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
              formatter={(value: any) => {
                // Format numbers with commas
                if (typeof value === "number") {
                  return value.toLocaleString();
                }
                return value;
              }}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "13px",
                fontWeight: "500",
              }}
              iconType="line"
              iconSize={16}
              formatter={(value) => (
                <span className="text-foreground-muted">{value}</span>
              )}
            />
          )}
          {lines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name || line.key}
              stroke={line.color || defaultColors[index % defaultColors.length]}
              strokeWidth={line.strokeWidth || 2.5}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: "hsl(var(--card))",
              }}
              activeDot={{
                r: 6,
                strokeWidth: 0,
                fill: line.color || defaultColors[index % defaultColors.length],
                style: {
                  filter: "drop-shadow(0 2px 4px rgb(0 0 0 / 0.2))",
                },
              }}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
