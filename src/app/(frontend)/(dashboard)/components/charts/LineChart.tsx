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
  // Dynamic color palette using CSS variables from config
  // Menggunakan warna dari theme dengan rasio yang seimbang
  const getDynamicColors = () => {
    const style = getComputedStyle(document.documentElement);

    return [
      `rgb(${style.getPropertyValue("--primary").trim()})`, // Primary - dominan
      `rgb(${style.getPropertyValue("--secondary").trim()})`, // Secondary - aksen kuat
      `rgb(${style.getPropertyValue("--success").trim()})`, // Success - positif
      `rgb(${style.getPropertyValue("--tertiary").trim()})`, // Tertiary - warm accent
      `rgb(${style.getPropertyValue("--info").trim()})`, // Info - cool accent
      `rgb(${style.getPropertyValue("--warning").trim()})`, // Warning - perhatian
      `rgb(${style.getPropertyValue("--error").trim()})`, // Error - critical
      `rgb(${style.getPropertyValue("--inverse-primary").trim()})`, // Variant primary
    ];
  };

  const [defaultColors, setDefaultColors] = React.useState<string[]>([]);

  React.useEffect(() => {
    setDefaultColors(getDynamicColors());
  }, []);

  // Get CSS variable colors for UI elements
  const getColor = (variable: string) => {
    if (typeof window === "undefined") return "transparent";
    const style = getComputedStyle(document.documentElement);
    return `rgb(${style.getPropertyValue(variable).trim()})`;
  };

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
              stroke={getColor("--outline-variant")}
              opacity={0.4}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke={getColor("--on-surface-variant")}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
            tick={{ fill: getColor("--on-surface-variant") }}
          />
          <YAxis
            stroke={getColor("--on-surface-variant")}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
            tick={{ fill: getColor("--on-surface-variant") }}
            tickFormatter={(value) => {
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
                backgroundColor: getColor("--surface"),
                border: `2px solid ${getColor("--outline")}`,
                borderRadius: "0.75rem",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                color: getColor("--on-surface"),
                padding: "12px 16px",
                fontSize: "13px",
                fontWeight: "500",
              }}
              labelStyle={{
                color: getColor("--on-surface"),
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px",
                borderBottom: `2px solid ${getColor("--outline-variant")}`,
                paddingBottom: "8px",
              }}
              itemStyle={{
                padding: "4px 0",
                color: getColor("--on-surface-variant"),
                fontWeight: "500",
              }}
              cursor={{
                stroke: getColor("--primary"),
                strokeWidth: 2,
                strokeOpacity: 0.3,
                strokeDasharray: "5 5",
              }}
              formatter={(value: any) => {
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
                color: getColor("--on-surface"),
              }}
              iconType="line"
              iconSize={16}
            />
          )}
          {lines.map((line, index) => {
            const lineColor =
              line.color ||
              defaultColors[index % defaultColors.length] ||
              getColor("--primary");

            return (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name || line.key}
                stroke={lineColor}
                strokeWidth={line.strokeWidth || 3}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: getColor("--surface"),
                  stroke: lineColor,
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 3,
                  fill: lineColor,
                  stroke: getColor("--surface"),
                  style: {
                    filter: "drop-shadow(0 4px 6px rgb(0 0 0 / 0.3))",
                  },
                }}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
