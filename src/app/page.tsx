// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Dashboard Analytics",
      description:
        "Real-time monitoring dan analytics untuk semua aktivitas inventory",
      href: "/dashboard",
      color: "bg-blue-500",
    },
    {
      icon: Package,
      title: "Inventory Management",
      description:
        "Kelola stock barang, penerimaan, dan distribusi dengan mudah",
      href: "/inventory",
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Kontrol akses pengguna dengan role-based permissions",
      href: "/users",
      color: "bg-purple-500",
    },
    {
      icon: BarChart3,
      title: "Laporan & Analytics",
      description: "Generate laporan komprehensif dan analisis disparitas",
      href: "/reports",
      color: "bg-orange-500",
    },
  ];

  const apiEndpoints = [
    { method: "GET", path: "/api/v1/dashboard", status: "active" },
    { method: "GET", path: "/api/v1/users", status: "active" },
    { method: "POST", path: "/api/v1/users", status: "active" },
    { method: "GET", path: "/api/v1/inventory", status: "active" },
    { method: "POST", path: "/api/v1/inventory", status: "active" },
    { method: "GET", path: "/api/v1/reports", status: "active" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="relative min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl border border-white border-opacity-30">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Trek Link
            </h1>
            <p className="text-xl lg:text-2xl text-white text-opacity-90 mb-2 font-medium">
              Link the Route
            </p>
            <p className="text-lg text-white text-opacity-70 max-w-2xl mx-auto">
              Modern inventory management and tracking system dengan interface
              yang intuitif dan fitur analytics yang powerful
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-opacity-100 text-opacity-90">
                    {feature.title}
                  </h3>
                  <p className="text-white text-opacity-70 text-sm mb-4 group-hover:text-opacity-90">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-white text-opacity-80 group-hover:text-opacity-100 text-sm font-medium">
                    Akses{" "}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Main Dashboard Link */}
          <div className="text-center mb-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur-lg text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-opacity-30 transition-all duration-300 shadow-xl border border-white border-opacity-30 hover:scale-105"
            >
              <LayoutDashboard className="w-6 h-6" />
              Masuk ke Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* System Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* API Status */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
              <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                API Status
              </h3>
              <div className="space-y-3">
                {apiEndpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 bg-white bg-opacity-5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-white bg-opacity-20 text-white px-2 py-1 rounded">
                        {endpoint.method}
                      </span>
                      <code className="text-white text-opacity-80 text-sm">
                        {endpoint.path}
                      </code>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* System Features */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
              <h3 className="text-white text-xl font-semibold mb-4">
                Fitur Sistem
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white text-opacity-80">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Real-time inventory tracking</span>
                </div>
                <div className="flex items-center gap-3 text-white text-opacity-80">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Multi-office support</span>
                </div>
                <div className="flex items-center gap-3 text-white text-opacity-80">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Role-based access control</span>
                </div>
                <div className="flex items-center gap-3 text-white text-opacity-80">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Automated reporting</span>
                </div>
                <div className="flex items-center gap-3 text-white text-opacity-80">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Push notifications</span>
                </div>
                <div className="flex items-center gap-3 text-white text-opacity-80">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Analytics dashboard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Information */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
            <h3 className="text-white text-xl font-semibold mb-4">
              Architecture Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-3">
                  <h4 className="text-white font-medium mb-2">Frontend</h4>
                  <p className="text-white text-opacity-70 text-sm">
                    Next.js 14 dengan TypeScript dan Tailwind CSS
                  </p>
                </div>
                <code className="text-xs text-white text-opacity-60">
                  src/app/(frontend)/
                </code>
              </div>

              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-3">
                  <h4 className="text-white font-medium mb-2">API Routes</h4>
                  <p className="text-white text-opacity-70 text-sm">
                    RESTful API dengan versioning support
                  </p>
                </div>
                <code className="text-xs text-white text-opacity-60">
                  src/app/api/v1/ & v2/
                </code>
              </div>

              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-3">
                  <h4 className="text-white font-medium mb-2">Database</h4>
                  <p className="text-white text-opacity-70 text-sm">
                    Supabase PostgreSQL dengan real-time features
                  </p>
                </div>
                <code className="text-xs text-white text-opacity-60">
                  lib/supabase/
                </code>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 pt-8 border-t border-white border-opacity-20">
            <p className="text-white text-opacity-60 text-sm">
              © 2025 Trek Link. Built with Next.js, TypeScript, and Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
