// src/app/(frontend)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  BarChart3,
  Clock,
  Plus,
  FileText,
  Bell,
  X,
} from "lucide-react";

// Dashboard Stats Card Component
type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: StatsCardProps) => (
  <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 hover:scale-105 transition-transform duration-300 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-700 text-sm font-medium">{title}</p>
        <p className="text-gray-900 text-2xl font-bold mt-1">{value}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div
        className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shadow-md`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
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

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
      <h3 className="text-gray-900 text-lg font-semibold mb-4">
        Aktivitas Terbaru
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
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
    </div>
  );
};

// Quick Actions Component
const QuickActions = () => {
  const handleAddItem = () => {
    console.log("Add item clicked");
    // TODO: Navigate to add item page or open modal
  };

  const handleCreateReport = () => {
    console.log("Create report clicked");
    // TODO: Navigate to create report page or open modal
  };

  const handleManageUsers = () => {
    console.log("Manage users clicked");
    // TODO: Navigate to users page
  };

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
      <h3 className="text-gray-900 text-lg font-semibold mb-4">Aksi Cepat</h3>
      <div className="space-y-3">
        <button
          onClick={handleAddItem}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Tambah Barang</span>
        </button>
        <button
          onClick={handleCreateReport}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Buat Laporan</span>
        </button>
        <button
          onClick={handleManageUsers}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Kelola User</span>
        </button>
      </div>
    </div>
  );
};

// Notification Toast Component
interface NotificationToastProps {
  title: string;
  body: string;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  title,
  body,
  onClose,
}) => (
  <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50 animate-pulse">
    <div className="flex items-start space-x-3">
      <div className="bg-blue-500 rounded-full p-2 flex-shrink-0">
        <Bell className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600 text-sm mt-1">{body}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// FCM Status Component (Mock for now)
const FCMStatus = ({ className }: { className?: string }) => (
  <div
    className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}
  >
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <p className="text-green-700 text-sm">Notifikasi push aktif</p>
    </div>
  </div>
);

// Notification Permission Component (Mock for now)
const NotificationPermission = ({
  onClose,
  showCloseButton,
}: {
  onClose: () => void;
  showCloseButton: boolean;
}) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Bell className="w-5 h-5 text-blue-500" />
        <p className="text-blue-700 text-sm">
          Aktifkan notifikasi push untuk mendapatkan update terbaru
        </p>
      </div>
      {showCloseButton && (
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-blue-600 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

// Custom hook for dashboard logic (simplified for Next.js)
const useDashboard = ({
  autoInitializeFCM,
}: {
  autoInitializeFCM: boolean;
}) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const [showPermissionBanner, setShowPermissionBanner] = useState(true);
  const [showFCMStatus, setShowFCMStatus] = useState(false);

  useEffect(() => {
    if (autoInitializeFCM) {
      setIsInitializing(true);

      // Simulate FCM initialization
      setTimeout(() => {
        setIsInitializing(false);
        setShowFCMStatus(true);
        setShowPermissionBanner(false);

        // Show a demo notification
        setNotificationToast({
          title: "Selamat datang!",
          body: "Dashboard berhasil dimuat dengan fitur notifikasi aktif.",
        });
      }, 2000);
    }
  }, [autoInitializeFCM]);

  const handleClosePermissionBanner = () => {
    setShowPermissionBanner(false);
  };

  const closeNotificationToast = () => {
    setNotificationToast(null);
  };

  return {
    isInitializing,
    error,
    notificationToast,
    handleClosePermissionBanner,
    closeNotificationToast,
    shouldShowFCMStatus: showFCMStatus,
    shouldShowPermissionBanner: showPermissionBanner,
  };
};

// Main Dashboard Page Component
export default function Dashboard() {
  // Use dashboard hook for all logic
  const {
    isInitializing,
    error,
    notificationToast,
    handleClosePermissionBanner,
    closeNotificationToast,
    shouldShowFCMStatus,
    shouldShowPermissionBanner,
  } = useDashboard({
    autoInitializeFCM: true,
  });

  // Dummy data for stats
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* FCM Permission Banner - Only show if permission not granted */}
      {shouldShowPermissionBanner && (
        <div className="mb-6">
          <NotificationPermission
            onClose={handleClosePermissionBanner}
            showCloseButton={true}
          />
        </div>
      )}

      {/* FCM Status - Only show when enabled */}
      {shouldShowFCMStatus && (
        <div className="mb-6">
          <FCMStatus className="" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">Error FCM: {error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isInitializing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-700">Menginisialisasi notifikasi push...</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Barang"
          value={loading ? "..." : "1,234"}
          icon={Package}
          color="bg-blue-500"
          trend="+12%"
        />
        <StatsCard
          title="Barang Masuk Hari Ini"
          value={loading ? "..." : "23"}
          icon={TrendingUp}
          color="bg-green-500"
          trend="+5%"
        />
        <StatsCard
          title="Total User"
          value={loading ? "..." : "45"}
          icon={Users}
          color="bg-purple-500"
          trend="+3%"
        />
        <StatsCard
          title="Laporan Pending"
          value={loading ? "..." : "7"}
          icon={AlertCircle}
          color="bg-orange-500"
          trend="-2%"
        />
      </div>

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
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
        <h3 className="text-gray-900 text-lg font-semibold mb-4">
          Grafik Penerimaan Barang
        </h3>
        <div className="h-64 flex items-center justify-center">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Memuat grafik...</p>
            </div>
          ) : (
            <div className="text-gray-600 text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-2 text-gray-400" />
              <p className="text-lg font-medium">
                Grafik akan ditampilkan di sini
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Integrasi dengan library chart akan dilakukan selanjutnya
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legacy Connection Test Section - Hidden but preserved */}
      <div className="hidden">
        {/* Keep the original connection test functionality for reference */}
        <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
          <h3 className="text-gray-900 text-lg font-semibold mb-4">
            Database Connection Test
          </h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Test Supabase Connection
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationToast && (
        <NotificationToast
          title={notificationToast.title}
          body={notificationToast.body}
          onClose={closeNotificationToast}
        />
      )}
    </div>
  );
}
