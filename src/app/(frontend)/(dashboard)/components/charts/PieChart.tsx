"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/fe/lib/utils";

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color?: string;
  }[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
  centerLabel?: {
    value: string | number;
    label: string;
  };
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  outerRadius,
  className,
  centerLabel,
}) => {
  // Enhanced color palette with high contrast and accessibility
  const defaultColors = [
    "#3b82f6", // Primary blue - highly visible
    "#ec4899", // Secondary pink - eye-catching
    "#22c55e", // Success green - clear signal
    "#f59e0b", // Accent amber - warm and energetic
    "#ef4444", // Destructive red - strong warning
    "#8b5cf6", // Purple - additional variety
    "#06b6d4", // Cyan - cool accent
    "#84cc16", // Lime - fresh accent
    "#f97316", // Orange - vibrant
    "#14b8a6", // Teal - professional
  ];

  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length],
  }));

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    if (percent < 0.05) return null; // Don't show label for slices smaller than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
        style={{
          textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderCenterLabel = () => {
    if (!centerLabel || innerRadius === 0) return null;

    return (
      <g>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground"
        >
          <tspan
            x="50%"
            dy="-0.5em"
            fontSize="28"
            fontWeight="700"
            className="fill-foreground"
          >
            {centerLabel.value}
          </tspan>
          <tspan
            x="50%"
            dy="1.5em"
            fontSize="14"
            fontWeight="500"
            className="fill-muted-foreground"
          >
            {centerLabel.label}
          </tspan>
        </text>
      </g>
    );
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {payload.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-foreground-muted">
              {entry.value}
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              ({entry.payload.value.toLocaleString()})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <defs>
            {dataWithColors.map((entry, index) => (
              <filter key={`shadow-${index}`} id={`shadow-${index}`}>
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodOpacity="0.15"
                />
              </filter>
            ))}
          </defs>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={outerRadius || height * 0.35}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            stroke="hsl(var(--card))"
            strokeWidth={3}
            paddingAngle={2}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {dataWithColors.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{
                  filter: `url(#shadow-${index})`,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Pie>
          {renderCenterLabel()}
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "2px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                color: "hsl(var(--card-foreground))",
                padding: "12px 16px",
                fontSize: "13px",
                fontWeight: "500",
              }}
              formatter={(value: number, name: string) => [
                <span
                  key="value"
                  style={{ fontWeight: "700", fontSize: "15px" }}
                >
                  {value.toLocaleString()}
                </span>,
                <span
                  key="name"
                  style={{ color: "hsl(var(--foreground-muted))" }}
                >
                  {name}
                </span>,
              ]}
              labelStyle={{
                color: "hsl(var(--foreground))",
                fontWeight: "600",
                marginBottom: "4px",
                fontSize: "14px",
              }}
            />
          )}
          {showLegend && (
            <Legend
              content={<CustomLegend />}
              verticalAlign="bottom"
              height={60}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
