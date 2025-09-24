// src/app/(frontend)/dashboard/page.tsx
"use client";

import { Users, BarChart3, Clock, Plus, FileText } from "lucide-react";
import {
  Card,
  StatsGrid,
  ActionButton,
} from "@/app/(frontend)/(dashboard)/components/ui";

// Dummy data
const statsData = [
  {
    title: "Total Barang",
    value: "1,234",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Barang Masuk Hari Ini",
    value: "23",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Total User",
    value: "45",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Laporan Pending",
    value: "7",
    color: "from-orange-500 to-orange-600",
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
    description: "Barang masuk: Laptop Dell",
    time: "2 jam yang lalu",
    type: "input",
  },
  {
    id: 2,
    description: "User baru ditambahkan",
    time: "4 jam yang lalu",
    type: "user",
  },
  {
    id: 3,
    description: "Laporan disparitas dibuat",
    time: "6 jam yang lalu",
    type: "report",
  },
  {
    id: 4,
    description: "Pengaturan sistem diperbarui",
    time: "1 hari yang lalu",
    type: "settings",
  },
];

// Recent Activity Component
const RecentActivity = () => (
  <Card>
    <h3 className="text-gray-900 text-lg font-semibold mb-4">
      Aktivitas Terbaru
    </h3>
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-gray-800 text-sm font-medium">
              {activity.description}
            </p>
            <div className="flex items-center mt-1">
              <Clock className="w-4 h-4 text-gray-500 mr-1" />
              <p className="text-gray-500 text-xs">{activity.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Quick Actions Component
const QuickActions = () => {
  const handleAddItem = () => console.log("Add item clicked");
  const handleCreateReport = () => console.log("Create report clicked");
  const handleManageUsers = () => console.log("Manage users clicked");

  return (
    <Card>
      <h3 className="text-gray-900 text-lg font-semibold mb-4">Aksi Cepat</h3>
      <div className="space-y-3">
        <ActionButton onClick={handleAddItem} variant="purple">
          <Plus className="w-5 h-5" />
          <span>Tambah Barang</span>
        </ActionButton>

        <ActionButton onClick={handleCreateReport} variant="blue">
          <FileText className="w-5 h-5" />
          <span>Buat Laporan</span>
        </ActionButton>

        <ActionButton onClick={handleManageUsers} variant="green">
          <Users className="w-5 h-5" />
          <span>Kelola User</span>
        </ActionButton>
      </div>
    </Card>
  );
};

// User Info Card Component
const UserInfoCard = () => (
  <Card>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Informasi Pengguna
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <dt className="text-sm font-medium text-gray-500">Kantor</dt>
        <dd className="text-sm text-gray-900 mt-1">{userInfo.office_name}</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">Tipe Kantor</dt>
        <dd className="text-sm text-gray-900 mt-1">{userInfo.office_type}</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">Lokasi</dt>
        <dd className="text-sm text-gray-900 mt-1">
          {userInfo.office_location}
        </dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">Role</dt>
        <dd className="text-sm text-gray-900 mt-1">{userInfo.role_name}</dd>
      </div>
    </div>
  </Card>
);

// Chart Section Component
const ChartSection = () => (
  <Card>
    <h3 className="text-gray-900 text-lg font-semibold mb-4">
      Grafik Penerimaan Barang
    </h3>
    <div className="h-64 flex items-center justify-center">
      <div className="text-gray-600 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-2 text-gray-400" />
        <p className="text-lg font-medium">Grafik akan ditampilkan di sini</p>
        <p className="text-sm text-gray-500 mt-1">
          Integrasi dengan library chart akan dilakukan selanjutnya
        </p>
      </div>
    </div>
  </Card>
);

// Main Dashboard Page Component
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Stats Grid */}
          <StatsGrid stats={statsData} />

          {/* User Info Card */}
          <UserInfoCard />

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Chart Section */}
          <ChartSection />
        </div>
      </main>
    </div>
  );
}
