// src/app/(frontend)/(dashboard)/dashboard/page.tsx
"use client";

import React from "react";
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
  PageHeader,
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
    color: "tertiary" as const,
  },
  {
    id: "4",
    title: "Laporan Pending",
    value: "7",
    subtitle: "Awaiting review",
    trend: { value: 1.2, direction: "down" as const },
    icon: FileText,
    change: "-2 dari kemarin",
    color: "warning" as const,
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
    status: "info" as const,
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
    colorClass: "from-primary to-primary/80",
    bgClass: "bg-primary-container",
    textClass: "text-on-primary-container",
  },
  {
    id: 2,
    title: "Buat Laporan",
    description: "Generate laporan inventory",
    icon: FileText,
    colorClass: "from-success to-success/80",
    bgClass: "bg-success-container",
    textClass: "text-on-success-container",
  },
  {
    id: 3,
    title: "Kelola User",
    description: "Manajemen user dan permissions",
    icon: Users,
    colorClass: "from-tertiary to-tertiary/80",
    bgClass: "bg-tertiary-container",
    textClass: "text-on-tertiary-container",
  },
  {
    id: 4,
    title: "Lihat Analytics",
    description: "Dashboard analytics lengkap",
    icon: BarChart3,
    colorClass: "from-secondary to-secondary/80",
    bgClass: "bg-secondary-container",
    textClass: "text-on-secondary-container",
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
      case "info":
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

  const getStatusColors = () => {
    switch (activity.status) {
      case "success":
        return "bg-success-container text-on-success-container";
      case "info":
        return "bg-info-container text-on-info-container";
      case "warning":
        return "bg-warning-container text-on-warning-container";
      case "secondary":
        return "bg-secondary-container text-on-secondary-container";
      default:
        return "bg-primary-container text-on-primary-container";
    }
  };

  return (
    <div className="group p-4 rounded-xl hover:bg-surface-variant/30 transition-all duration-300 border border-transparent hover:border-outline-variant">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className={`p-2.5 rounded-xl ${getStatusColors()}`}>
            <StatusIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors duration-300">
            {activity.title}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            {activity.description}
          </p>
          <div className="flex items-center mt-2 space-x-3">
            <div className="flex items-center text-xs text-on-surface-variant">
              <Clock className="w-3 h-3 mr-1" />
              {activity.time}
            </div>
            <div className="flex items-center text-xs text-on-surface-variant">
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
        <div
          className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center ${action.bgClass}`}
        >
          <IconComponent className={`w-6 h-6 ${action.textClass}`} />
        </div>
        <div>
          <p className="font-semibold text-sm text-on-surface">
            {action.title}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
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
      <div className="space-y-6">
        {/* Welcome Header */}
        <PageHeader
          title="Dashboard Overview"
          subtitle="Selamat datang kembali! Berikut adalah ringkasan aktivitas dan metrics terbaru."
          showLastUpdated={true}
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
        />

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
        <Card variant="default" className="border-2 border-outline">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-container rounded-xl">
                <Building className="w-6 h-6 text-on-primary-container" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-on-surface">
                  Informasi Pengguna
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Detail kantor dan role saat ini
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <dt className="text-sm font-medium text-on-surface-variant">
                  Kantor
                </dt>
                <dd className="text-lg font-semibold text-on-surface">
                  {userInfo.office_name}
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="text-sm font-medium text-on-surface-variant">
                  Tipe Kantor
                </dt>
                <dd className="text-lg font-semibold text-on-surface">
                  {userInfo.office_type}
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="text-sm font-medium text-on-surface-variant">
                  Lokasi
                </dt>
                <dd className="text-lg font-semibold text-on-surface">
                  {userInfo.office_location}
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="text-sm font-medium text-on-surface-variant">
                  Role
                </dt>
                <dd>
                  <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-success-container text-on-success-container">
                    <UserCheck className="w-4 h-4 mr-2" />
                    {userInfo.role_name}
                  </div>
                </dd>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card variant="default" className="border-2 border-outline">
              <CardHeader className="border-b border-outline bg-surface-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-container rounded-xl">
                      <Activity className="w-5 h-5 text-on-primary-container" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-on-surface">
                        Aktivitas Terbaru
                      </h3>
                      <p className="text-sm text-on-surface-variant">
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
                <div className="divide-y divide-outline">
                  {recentActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card variant="default" className="border-2 border-outline">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-tertiary-container rounded-xl">
                    <Plus className="w-5 h-5 text-on-tertiary-container" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-on-surface">
                      Aksi Cepat
                    </h3>
                    <p className="text-sm text-on-surface-variant">
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
        <Card variant="default" className="border-2 border-outline">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-info-container rounded-xl">
                  <BarChart3 className="w-5 h-5 text-on-info-container" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-on-surface">
                    Analytics Overview
                  </h3>
                  <p className="text-sm text-on-surface-variant">
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
                  color: "rgb(var(--success))",
                  strokeWidth: 3,
                },
                {
                  key: "barangKeluar",
                  name: "Barang Keluar",
                  color: "rgb(var(--error))",
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
