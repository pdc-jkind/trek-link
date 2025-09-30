// src/app/(dashboard)/disparity/page.tsx
"use client";

import React, { useState } from "react";
import {
  Calendar,
  Download,
  Filter,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button, Badge, Table, Card } from "@/fe/components/index";
import { ContentWrapper } from "@/fe/components/layout/ContentWrapper";
import { PageHeader } from "@/fe/components/layout/PageHeader";

// Dummy data
const statsData = [
  {
    title: "Total Target",
    value: "405",
    trend: "+5%",
    icon: TrendingUp,
  },
  {
    title: "Total Actual",
    value: "395",
    trend: "-2.5%",
    icon: TrendingDown,
  },
  {
    title: "Achievement",
    value: "97.5%",
    trend: "+1.2%",
    icon: TrendingUp,
  },
  {
    title: "Variance",
    value: "-10",
    trend: "-5",
    icon: TrendingDown,
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
const DisparityChart: React.FC = () => (
  <div className="bg-surface rounded-xl p-6 border border-outline">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-foreground">
        Disparitas by Region
      </h3>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Filter className="w-4 h-4" />}
      >
        Filter
      </Button>
    </div>

    <div className="space-y-4">
      {disparityData.map((item) => (
        <div key={item.id} className="flex items-center space-x-4">
          <div className="w-24 text-sm font-medium text-foreground">
            {item.region}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-surface-variant rounded-full h-3 relative overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    item.percentage >= 100
                      ? "bg-gradient-to-r from-success to-success/80"
                      : item.percentage >= 80
                      ? "bg-gradient-to-r from-warning to-warning/80"
                      : "bg-gradient-to-r from-error to-error/80"
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
              <div className="w-16 text-sm font-semibold text-foreground text-right">
                {item.percentage}%
              </div>
            </div>
            <div className="flex justify-between text-xs text-surface-variant-foreground mt-2">
              <span>Target: {item.target}</span>
              <span>Actual: {item.actual}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Summary Table Component
const SummaryTable: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const variants = {
      Exceeded: "success",
      "On Track": "warning",
      "Below Target": "error",
    };
    return variants[status as keyof typeof variants] || "default";
  };

  const columns = [
    {
      key: "region",
      title: "Region",
      sortable: true,
    },
    {
      key: "target",
      title: "Target",
      align: "right" as const,
      sortable: true,
    },
    {
      key: "actual",
      title: "Actual",
      align: "right" as const,
      sortable: true,
    },
    {
      key: "variance",
      title: "Variance",
      align: "right" as const,
      sortable: true,
      render: (_: any, row: any) => {
        const variance = row.actual - row.target;
        return (
          <span className={variance >= 0 ? "text-success" : "text-error"}>
            {variance > 0 ? "+" : ""}
            {variance}
          </span>
        );
      },
    },
    {
      key: "percentage",
      title: "Achievement (%)",
      align: "right" as const,
      sortable: true,
      render: (value: any) => <span className="font-semibold">{value}%</span>,
    },
    {
      key: "status",
      title: "Status",
      align: "center" as const,
      render: (value: any) => (
        <Badge variant={getStatusBadge(value) as any}>{value}</Badge>
      ),
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden">
      <div className="py-1">
        <Card>
          <h3 className="text-lg font-semibold text-foreground">
            Ringkasan Detail
          </h3>
        </Card>
      </div>

      <Table
        columns={columns}
        data={disparityData}
        emptyText="Tidak ada data disparitas"
        hoverable
        striped
        size="md"
      />
    </div>
  );
};

const DisparityPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handlePeriodChange = () => {
    console.log("Opening period selector");
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Exporting disparity report");
    setIsExporting(false);
  };

  return (
    <ContentWrapper>
      <PageHeader
        title="Laporan Disparitas"
        subtitle="Analisis perbandingan target dan actual per region"
        actions={
          <>
            <Button
              onClick={handlePeriodChange}
              variant="ghost"
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Periode
            </Button>
            <Button
              onClick={handleExport}
              variant="primary"
              disabled={isExporting}
              isLoading={isExporting}
              leftIcon={<Download className="w-4 h-4" />}
            >
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="surface rounded-xl p-5 border-2 border-outline hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-surface-variant-foreground">
                  {stat.title}
                </span>
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-surface-variant-foreground">
                Trend: {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <DisparityChart />

        {/* Summary Table */}
        <SummaryTable />
      </div>
    </ContentWrapper>
  );
};

export default DisparityPage;
