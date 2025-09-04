// src/app/(dashboard)/disparity/page.tsx
"use client";

import React, { useState } from "react";
import { Calendar, Download, Filter } from "lucide-react";
import {
  Card,
  StatsGrid,
  ActionButton,
  Table,
  StatusBadge,
  PageHeader,
} from "@/app/(dashboard)/components/ui";

// Dummy data
const statsData = [
  {
    title: "Total Target",
    value: "405",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Total Actual",
    value: "395",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Achievement",
    value: "97.5%",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Variance",
    value: "-10",
    color: "from-purple-500 to-purple-600",
  },
];

const disparityData = [
  {
    id: 1,
    region: "Jakarta",
    target: 100,
    actual: 85,
    percentage: 85,
    status: "Below Target",
  },
  {
    id: 2,
    region: "Bandung",
    target: 80,
    actual: 95,
    percentage: 119,
    status: "Exceeded",
  },
  {
    id: 3,
    region: "Surabaya",
    target: 90,
    actual: 78,
    percentage: 87,
    status: "On Track",
  },
  {
    id: 4,
    region: "Medan",
    target: 75,
    actual: 82,
    percentage: 109,
    status: "Exceeded",
  },
  {
    id: 5,
    region: "Yogyakarta",
    target: 60,
    actual: 55,
    percentage: 92,
    status: "On Track",
  },
];

// Chart Component
const DisparityChart = () => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Disparitas by Region
      </h3>
      <Filter className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
    </div>

    <div className="space-y-4">
      {disparityData.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-20 text-sm font-medium text-gray-700">
            {item.region}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                <div
                  className={`h-3 rounded-full ${
                    item.percentage >= 100
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : item.percentage >= 80
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                      : "bg-gradient-to-r from-red-400 to-red-600"
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="w-16 text-sm font-medium text-gray-700 text-right">
                {item.percentage}%
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Target: {item.target}</span>
              <span>Actual: {item.actual}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Summary Table Component
const SummaryTable = () => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Exceeded":
        return "success";
      case "On Track":
        return "warning";
      case "Below Target":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    { key: "region", label: "Region" },
    { key: "target", label: "Target", className: "text-right" },
    { key: "actual", label: "Actual", className: "text-right" },
    {
      key: "variance",
      label: "Variance",
      className: "text-right",
      render: (value: any, row: any) => row.actual - row.target,
    },
    {
      key: "percentage",
      label: "Achievement (%)",
      className: "text-right font-medium",
      render: (value: any) => `${value}%`,
    },
    {
      key: "status",
      label: "Status",
      className: "text-center",
      render: (value: any) => (
        <StatusBadge status={value} variant={getStatusVariant(value)} />
      ),
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ringkasan Detail
      </h3>
      <Table
        columns={columns}
        data={disparityData}
        emptyMessage="Tidak ada data disparitas"
      />
    </Card>
  );
};

const DisparityPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handlePeriodChange = () => {
    console.log("Opening period selector");
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Exporting disparity report");
    setIsExporting(false);
  };

  const headerActions = (
    <>
      <ActionButton onClick={handlePeriodChange} variant="green">
        <Calendar className="w-4 h-4" />
        <span>Periode</span>
      </ActionButton>

      <ActionButton
        onClick={handleExport}
        variant="purple"
        disabled={isExporting}
      >
        <Download className={`w-4 h-4 ${isExporting ? "animate-pulse" : ""}`} />
        <span>{isExporting ? "Exporting..." : "Export"}</span>
      </ActionButton>
    </>
  );

  return (
    <div className="space-y-6">
      <Card>
        <PageHeader title="Laporan Disparitas" actions={headerActions} />

        {/* Stats Overview */}
        <StatsGrid stats={statsData} />

        {/* Chart */}
        <div className="mb-6">
          <DisparityChart />
        </div>

        {/* Summary Table */}
        <SummaryTable />
      </Card>
    </div>
  );
};

export default DisparityPage;
