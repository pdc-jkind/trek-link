// src/app/(dashboard)/help/page.tsx
"use client";

import React, { useState } from "react";
import {
  Book,
  MessageCircle,
  Mail,
  Eye,
  Settings,
  Palette,
  X,
} from "lucide-react";
import { Button } from "@/fe/components/index";
import { ContentWrapper } from "@/fe/components/layout/ContentWrapper";
import { PageHeader } from "@/fe/components/layout/PageHeader";

// Status types for demo
type StatusType =
  | "loading"
  | "404"
  | "500"
  | "403"
  | "network-error"
  | "maintenance";

// Mock StatusPage component
const StatusPage = ({
  type,
  customConfig,
}: {
  type: StatusType;
  customConfig?: { actionButton?: { text: string; onClick: () => void } };
}) => {
  const statusConfig = {
    loading: {
      title: "Loading...",
      description: "Memuat data, mohon tunggu sebentar",
      gradient: "from-blue-500 to-purple-700",
    },
    "404": {
      title: "404 - Halaman Tidak Ditemukan",
      description: "Halaman yang Anda cari tidak dapat ditemukan",
      gradient: "from-orange-500 to-yellow-600",
    },
    "500": {
      title: "500 - Server Error",
      description: "Terjadi kesalahan pada server, coba lagi nanti",
      gradient: "from-red-500 to-pink-700",
    },
    "403": {
      title: "403 - Akses Ditolak",
      description: "Anda tidak memiliki izin untuk mengakses halaman ini",
      gradient: "from-gray-600 to-gray-800",
    },
    "network-error": {
      title: "Network Error",
      description: "Koneksi internet bermasalah, periksa koneksi Anda",
      gradient: "from-cyan-500 to-indigo-700",
    },
    maintenance: {
      title: "Sistem Dalam Pemeliharaan",
      description: "Sistem sedang dalam pemeliharaan, coba lagi nanti",
      gradient: "from-emerald-500 to-cyan-700",
    },
  };

  const config = statusConfig[type];

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br ${config.gradient} flex items-center justify-center z-50`}
    >
      <div className="text-center text-white max-w-md mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4">{config.title}</h2>
        <p className="mb-6 text-lg opacity-90">{config.description}</p>
        {customConfig?.actionButton && (
          <Button
            onClick={customConfig.actionButton.onClick}
            variant="primary"
            size="lg"
          >
            {customConfig.actionButton.text}
          </Button>
        )}
      </div>
    </div>
  );
};

const HelpPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);

  const statusTypes = [
    {
      type: "loading" as StatusType,
      label: "Loading",
      description: "Loading umum dengan spinner animasi",
      gradient: "from-blue-500 to-purple-700",
      color: "bg-blue-500",
    },
    {
      type: "404" as StatusType,
      label: "404 Error",
      description: "Halaman tidak ditemukan",
      gradient: "from-orange-500 to-yellow-600",
      color: "bg-orange-500",
    },
    {
      type: "500" as StatusType,
      label: "500 Error",
      description: "Server internal error",
      gradient: "from-red-500 to-pink-700",
      color: "bg-red-500",
    },
    {
      type: "403" as StatusType,
      label: "403 Error",
      description: "Access denied / forbidden",
      gradient: "from-gray-600 to-gray-800",
      color: "bg-gray-600",
    },
    {
      type: "network-error" as StatusType,
      label: "Network Error",
      description: "Koneksi internet bermasalah",
      gradient: "from-cyan-500 to-indigo-700",
      color: "bg-cyan-500",
    },
    {
      type: "maintenance" as StatusType,
      label: "Maintenance",
      description: "Sistem dalam pemeliharaan",
      gradient: "from-emerald-500 to-cyan-700",
      color: "bg-emerald-500",
    },
  ];

  const handleStatusTest = (type: StatusType) => {
    setSelectedStatus(type);
  };

  const closeStatusTest = () => {
    setSelectedStatus(null);
  };

  // Help sections data
  const helpSections = [
    {
      icon: Book,
      title: "Panduan Pengguna",
      description: "Pelajari cara menggunakan sistem",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Hubungi support langsung",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Kirim pertanyaan via email",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <>
      <ContentWrapper>
        <PageHeader
          title="Bantuan"
          subtitle="Temukan bantuan dan panduan penggunaan sistem"
        />

        <div className="space-y-6">
          {/* Help Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpSections.map((section, index) => (
              <div
                key={index}
                className={`text-center p-6 ${section.bgColor} rounded-xl border-2 ${section.borderColor} hover:shadow-lg transition-all cursor-pointer`}
              >
                <section.icon
                  className={`w-12 h-12 mx-auto mb-4 ${section.iconColor}`}
                />
                <h3 className="font-semibold text-foreground mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-surface-variant-foreground">
                  {section.description}
                </p>
              </div>
            ))}
          </div>

          {/* Development Status Page Testing */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Palette className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-indigo-800 text-lg font-semibold">
                  Enhanced Status Page Preview
                </h3>
                <p className="text-sm text-indigo-600">
                  Development testing environment
                </p>
              </div>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                Dev Only
              </span>
            </div>

            <div className="bg-indigo-100/50 rounded-lg p-4 mb-6">
              <p className="text-indigo-700 text-sm font-semibold mb-2">
                Fitur Preview:
              </p>
              <ul className="text-indigo-600 text-sm space-y-1">
                <li>• Dynamic gradient backgrounds untuk setiap status</li>
                <li>• Enhanced glassmorphism design</li>
                <li>• Improved animations dan micro-interactions</li>
                <li>• Larger card size dengan better spacing</li>
              </ul>
            </div>

            {/* Status Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {statusTypes.map(
                ({ type, label, description, gradient, color }) => (
                  <div
                    key={type}
                    className="bg-white rounded-xl p-5 border-2 border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${color}`}></div>
                      <h4 className="font-semibold text-foreground">{label}</h4>
                    </div>

                    <div
                      className={`h-3 bg-gradient-to-r ${gradient} rounded-full mb-3 opacity-80`}
                    ></div>

                    <p className="text-sm text-surface-variant-foreground mb-4 leading-relaxed">
                      {description}
                    </p>

                    <Button
                      onClick={() => handleStatusTest(type)}
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye className="w-4 h-4" />}
                      className="w-full"
                    >
                      Preview {label}
                    </Button>
                  </div>
                )
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 rounded-xl p-5 border-2 border-indigo-200">
              <h4 className="text-indigo-800 font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Quick Preview - Helper Components
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {statusTypes.map(({ type, label, color }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedStatus(type)}
                    className={`${color} hover:opacity-90 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95`}
                  >
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Footer */}
            <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-200 rounded-lg">
              <p className="text-amber-700 text-xs text-center">
                <strong>Note:</strong> Hapus section ini pada environment
                production. Preview ini hanya untuk development testing.
              </p>
            </div>
          </div>
        </div>
      </ContentWrapper>

      {/* Status Page Overlay */}
      {selectedStatus && (
        <div className="fixed inset-0 z-50">
          {/* Close button */}
          <button
            onClick={closeStatusTest}
            className="absolute top-6 right-6 z-[60] group bg-black/20 backdrop-blur-md text-white rounded-full p-3 hover:bg-black/30 transition-all duration-300 border border-white/20 hover:scale-110"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Status info badge */}
          <div className="absolute top-6 left-6 z-[60] bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
            <span className="text-sm font-medium">
              Preview:{" "}
              {statusTypes.find((s) => s.type === selectedStatus)?.label ||
                selectedStatus}
            </span>
          </div>

          <StatusPage
            type={selectedStatus}
            customConfig={{
              actionButton:
                selectedStatus !== "loading"
                  ? {
                      text: "Tutup Preview",
                      onClick: closeStatusTest,
                    }
                  : undefined,
            }}
          />
        </div>
      )}
    </>
  );
};

export default HelpPage;
