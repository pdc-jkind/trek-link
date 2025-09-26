// src/app/(frontend)/(dashboard)/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import {
  Users,
  BarChart3,
  Clock,
  Plus,
  FileText,
  Package,
  TrendingUp,
  Building,
  UserCheck,
  Activity,
  CheckCircle,
  Info,
  Calendar,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  ContentWrapper,
  MetricCard,
  Card,
  CardHeader,
  CardContent,
  Badge,
  Button,
  LineChart,
} from "@/fe/components/index";

// Mock data for dashboard
const metricsData = [
  {
    id: "1",
    title: "Total Barang",
    value: "1,234",
    subtitle: "Items in inventory",
    trend: { value: 8.2, direction: "up" as const },
    icon: Package,
    change: "+23 dari minggu lalu",
    color: "primary" as const,
  },
  {
    id: "2",
    title: "Barang Masuk",
    value: "23",
    subtitle: "Today's entries",
    trend: { value: 15.3, direction: "up" as const },
    icon: TrendingUp,
    change: "+15.3% dari kemarin",
    color: "success" as const,
  },
  {
    id: "3",
    title: "Total User",
    value: "45",
    subtitle: "Active users",
    trend: { value: 2.1, direction: "up" as const },
    icon: Users,
    change: "+2 user baru",
    color: "accent" as const,
  },
  {
    id: "4",
    title: "Laporan Pending",
    value: "7",
    subtitle: "Awaiting review",
    trend: { value: -1.2, direction: "down" as const },
    icon: FileText,
    change: "-2 dari kemarin",
    color: "secondary" as const,
  },
];

const userInfo = {
  office_name: "Kantor Pusat Jakarta",
  office_type: "Pusat",
  office_location: "Jakarta Selatan",
  role_name: "Administrator",
};

const recentActivities = [
  {
    id: 1,
    title: "Barang masuk: Laptop Dell",
    description: "Laptop Dell Latitude 7420 telah ditambahkan ke inventory",
    time: "2 jam yang lalu",
    type: "input",
    status: "success" as const,
    user: "Admin Jakarta",
  },
  {
    id: 2,
    title: "User baru ditambahkan",
    description: "Andi Prasetyo telah ditambahkan sebagai Staff Gudang",
    time: "4 jam yang lalu",
    type: "user",
    status: "primary" as const,
    user: "Super Admin",
  },
  {
    id: 3,
    title: "Laporan disparitas dibuat",
    description: "Laporan ketidaksesuaian stock bulan Oktober",
    time: "6 jam yang lalu",
    type: "report",
    status: "warning" as const,
    user: "Manager Ops",
  },
  {
    id: 4,
    title: "Backup sistem berhasil",
    description: "Backup otomatis database telah selesai",
    time: "1 hari yang lalu",
    type: "system",
    status: "success" as const,
    user: "System",
  },
  {
    id: 5,
    title: "Update sistem pending",
    description: "Update versi 2.1.0 menunggu persetujuan",
    time: "2 hari yang lalu",
    type: "system",
    status: "secondary" as const,
    user: "Dev Team",
  },
];

const quickActions = [
  {
    id: 1,
    title: "Tambah Barang",
    description: "Tambah item baru ke inventory",
    icon: Plus,
    variant: "primary" as const,
  },
  {
    id: 2,
    title: "Buat Laporan",
    description: "Generate laporan inventory",
    icon: FileText,
    variant: "success" as const,
  },
  {
    id: 3,
    title: "Kelola User",
    description: "Manajemen user dan permissions",
    icon: Users,
    variant: "accent" as const,
  },
  {
    id: 4,
    title: "Lihat Analytics",
    description: "Dashboard analytics lengkap",
    icon: BarChart3,
    variant: "secondary" as const,
  },
];

// Mock chart data
const chartData = [
  { month: "Jan", barangMasuk: 45, barangKeluar: 32 },
  { month: "Feb", barangMasuk: 52, barangKeluar: 41 },
  { month: "Mar", barangMasuk: 61, barangKeluar: 38 },
  { month: "Apr", barangMasuk: 58, barangKeluar: 45 },
  { month: "May", barangMasuk: 67, barangKeluar: 52 },
  { month: "Jun", barangMasuk: 73, barangKeluar: 48 },
];

// Activity Item Component
const ActivityItem: React.FC<{
  activity: (typeof recentActivities)[0];
}> = ({ activity }) => {
  const getStatusIcon = () => {
    switch (activity.status) {
      case "success":
        return CheckCircle;
      case "primary":
        return Info;
      case "warning":
        return AlertCircle;
      case "secondary":
        return Clock;
      default:
        return Activity;
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="group p-4 rounded-xl hover:bg-primary-50/50 transition-all duration-300 border border-transparent hover:border-primary-200/50">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Badge variant={activity.status} size="lg" className="p-2">
            <StatusIcon className="w-5 h-5" />
          </Badge>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary-600 transition-colors duration-300">
            {activity.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {activity.description}
          </p>
          <div className="flex items-center mt-2 space-x-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {activity.time}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <UserCheck className="w-3 h-3 mr-1" />
              {activity.user}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Action Card Component
const QuickActionCard: React.FC<{
  action: (typeof quickActions)[0];
}> = ({ action }) => {
  const IconComponent = action.icon;

  return (
    <Card
      variant="outline"
      hoverable
      clickable
      className="border-2 border-dashed hover:shadow-elevation-2"
    >
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
          <IconComponent className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">
            {action.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {action.description}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Main Dashboard Component
export default function DashboardPage() {
  return (
    <ContentWrapper maxWidth="full" padding="md">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent mb-3">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground text-lg">
              Selamat datang kembali! Berikut adalah ringkasan aktivitas dan
              metrics terbaru.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Last updated:{" "}
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              trend={metric.trend}
              icon={metric.icon}
              change={metric.change}
              color={metric.color}
            />
          ))}
        </div>

        {/* User Info Card */}
        <Card variant="glass" className="border border-primary-200/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl">
                <Building className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Informasi Pengguna
                </h3>
                <p className="text-sm text-muted-foreground">
                  Detail kantor dan role saat ini
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Kantor
                </dt>
                <dd className="text-lg font-semibold text-foreground">
                  {userInfo.office_name}
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Tipe Kantor
                </dt>
                <dd className="text-lg font-semibold text-foreground">
                  {userInfo.office_type}
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Lokasi
                </dt>
                <dd className="text-lg font-semibold text-foreground">
                  {userInfo.office_location}
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  Role
                </dt>
                <dd>
                  <Badge variant="success" size="md">
                    <UserCheck className="w-4 h-4 mr-2" />
                    {userInfo.role_name}
                  </Badge>
                </dd>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card variant="glass" className="border border-primary-200/50">
              <CardHeader className="border-b border-primary-200/50 bg-gradient-to-r from-primary-50/50 to-accent-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                      <Activity className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Aktivitas Terbaru
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        5 aktivitas terakhir dari sistem
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Lihat Semua
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-primary-100/50">
                  {recentActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card variant="glass" className="border border-primary-200/50">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-accent-100 to-secondary-100 rounded-xl">
                    <Plus className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Aksi Cepat
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Shortcut untuk tugas umum
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {quickActions.map((action) => (
                    <QuickActionCard key={action.id} action={action} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chart Section */}
        <Card variant="glass" className="border border-primary-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Analytics Overview
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Inventory trends 6 bulan terakhir
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" leftIcon={<Eye />}>
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              data={chartData}
              lines={[
                {
                  key: "barangMasuk",
                  name: "Barang Masuk",
                  color: "#10b981",
                  strokeWidth: 3,
                },
                {
                  key: "barangKeluar",
                  name: "Barang Keluar",
                  color: "#ef4444",
                  strokeWidth: 3,
                },
              ]}
              xAxisKey="month"
              height={350}
              showGrid={true}
              showLegend={true}
              showTooltip={true}
            />
          </CardContent>
        </Card>
      </div>
    </ContentWrapper>
  );
}
