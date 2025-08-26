// src/app/(frontend)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useUserStore } from "@/store/userStore";
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
  LogOut,
} from "lucide-react";

// Auth Guard Hook
const useAuthGuard = () => {
  const router = useRouter();
  const userStore = useUserStore();

  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeDashboard = async () => {
      try {
        console.log("Initializing dashboard...");

        // Check authentication status
        const authStatus = await AuthService.checkAuthStatus();
        console.log("Auth status:", authStatus);

        if (!mounted) return;

        if (!authStatus.isAuthenticated) {
          console.log("User not authenticated, redirecting to login...");
          router.replace("/login");
          return;
        }

        // If user is authenticated but profile not loaded, load it
        if (!authStatus.hasProfile) {
          console.log("Loading user profile to store...");
          userStore.setLoading(true);

          const profileLoaded = await AuthService.loadUserProfileToStore();

          if (!mounted) return;

          if (!profileLoaded) {
            console.error("Failed to load user profile");
            setError("Gagal memuat profil pengguna");
            userStore.setLoading(false);
            return;
          }
        }

        // Success - user is authenticated and profile is loaded
        console.log("Dashboard initialization complete");
        setIsInitializing(false);
        userStore.setLoading(false);
      } catch (err: any) {
        console.error("Dashboard initialization error:", err);
        if (mounted) {
          setError(
            err.message || "Terjadi kesalahan saat menginisialisasi dashboard"
          );
          setIsInitializing(false);
          userStore.setLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, [router, userStore]);

  return {
    isInitializing: isInitializing || userStore.isLoading,
    error: error || userStore.error,
    user: userStore.user,
  };
};

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

// Header Component
const DashboardHeader = ({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) => (
  <header className="bg-white/90 backdrop-blur-lg shadow-sm border-b sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          {user && (
            <p className="text-sm text-gray-600">
              Selamat datang di {user.office_name}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.office_name}
              </p>
              <p className="text-xs text-gray-600">{user.role_name}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

// Loading Component
const DashboardLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Memuat Dashboard
      </h2>
      <p className="text-gray-500">Mengambil data profil pengguna...</p>
    </div>
  </div>
);

// Error Component
const DashboardError = ({
  error,
  onRetry,
  onBackToLogin,
}: {
  error: string;
  onRetry: () => void;
  onBackToLogin: () => void;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
    <div className="text-center max-w-md mx-auto">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <h3 className="font-medium mb-2">Terjadi Kesalahan</h3>
        <p className="text-sm">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mr-2 transition-colors"
      >
        Coba Lagi
      </button>
      <button
        onClick={onBackToLogin}
        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Kembali ke Login
      </button>
    </div>
  </div>
);

// Main Dashboard Page Component
export default function Dashboard() {
  const router = useRouter();
  const { isInitializing, error, user } = useAuthGuard();
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    if (!isInitializing && !error && user) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitializing, error, user]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push("/login");
    } catch (err: any) {
      console.error("Logout error:", err);
      // Force redirect even if logout fails
      router.push("/login");
    }
  };

  // Loading state
  if (isInitializing) {
    return <DashboardLoading />;
  }

  // Error state
  if (error) {
    return (
      <DashboardError
        error={error}
        onRetry={() => window.location.reload()}
        onBackToLogin={() => router.push("/login")}
      />
    );
  }

  // Main dashboard content
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
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

          {/* User Info Card */}
          {user && (
            <div className="bg-white/80 backdrop-blur-lg overflow-hidden shadow-lg rounded-2xl border border-white/40">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Pengguna
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Kantor
                    </dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {user.office_name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Tipe Kantor
                    </dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {user.office_type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Lokasi
                    </dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {user.office_location}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {user.role_name}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          )}

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
        </div>
      </main>
    </div>
  );
}
