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
  // Dynamic color palette using CSS variables with balanced ratios
  // Primary, Secondary, Tertiary sebagai warna utama (60%)
  // Success, Info, Warning sebagai aksen (30%)
  // Error, Inverse sebagai highlight (10%)
  const getDynamicColors = () => {
    const style = getComputedStyle(document.documentElement);

    return [
      `rgb(${style.getPropertyValue("--primary").trim()})`, // Warna dominan 1
      `rgb(${style.getPropertyValue("--secondary").trim()})`, // Warna dominan 2
      `rgb(${style.getPropertyValue("--tertiary").trim()})`, // Warna dominan 3
      `rgb(${style.getPropertyValue("--success").trim()})`, // Aksen positif
      `rgb(${style.getPropertyValue("--info").trim()})`, // Aksen informatif
      `rgb(${style.getPropertyValue("--warning").trim()})`, // Aksen perhatian
      `rgb(${style.getPropertyValue("--inverse-primary").trim()})`, // Variant
      `rgb(${style.getPropertyValue("--error").trim()})`, // Highlight critical
      // Extended palette untuk data lebih banyak
      `rgb(${style.getPropertyValue("--primary-container").trim()})`,
      `rgb(${style.getPropertyValue("--secondary-container").trim()})`,
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

  const dataWithColors = data.map((item, index) => ({
    ...item,
    color:
      item.color ||
      defaultColors[index % defaultColors.length] ||
      getColor("--primary"),
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
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={getColor("--on-primary")}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="700"
        style={{
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
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
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
          <tspan
            x="50%"
            dy="-0.5em"
            fontSize="32"
            fontWeight="700"
            fill={getColor("--on-surface")}
          >
            {centerLabel.value}
          </tspan>
          <tspan
            x="50%"
            dy="1.8em"
            fontSize="14"
            fontWeight="600"
            fill={getColor("--on-surface-variant")}
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
      <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: getColor("--surface-variant"),
              opacity: 0.9,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = getColor("--surface-3");
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 6px -1px rgb(0 0 0 / 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                getColor("--surface-variant");
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: entry.color,
                boxShadow: `0 0 0 2px ${getColor("--surface")}`,
              }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: getColor("--on-surface") }}
            >
              {entry.value}
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: getColor("--on-surface-variant") }}
            >
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
              <React.Fragment key={`defs-${index}`}>
                <filter id={`shadow-${index}`}>
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="4"
                    floodOpacity="0.2"
                  />
                </filter>
                <linearGradient
                  id={`gradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={entry.color} stopOpacity="1" />
                  <stop
                    offset="100%"
                    stopColor={entry.color}
                    stopOpacity="0.85"
                  />
                </linearGradient>
              </React.Fragment>
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
            dataKey="value"
            stroke={getColor("--surface")}
            strokeWidth={3}
            paddingAngle={2}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {dataWithColors.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#gradient-${index})`}
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
                backgroundColor: getColor("--surface"),
                border: `2px solid ${getColor("--outline")}`,
                borderRadius: "0.75rem",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                color: getColor("--on-surface"),
                padding: "14px 18px",
                fontSize: "13px",
                fontWeight: "500",
              }}
              formatter={(value: number, name: string) => [
                <span
                  key="value"
                  style={{
                    fontWeight: "700",
                    fontSize: "16px",
                    color: getColor("--primary"),
                  }}
                >
                  {value.toLocaleString()}
                </span>,
                <span
                  key="name"
                  style={{
                    color: getColor("--on-surface-variant"),
                    fontWeight: "600",
                  }}
                >
                  {name}
                </span>,
              ]}
              labelStyle={{
                color: getColor("--on-surface"),
                fontWeight: "700",
                marginBottom: "6px",
                fontSize: "15px",
                borderBottom: `2px solid ${getColor("--outline-variant")}`,
                paddingBottom: "6px",
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
