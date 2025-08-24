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
} from "lucide-react";
// Note: You'll need to create this component or replace with your actual StatusPage component
// import StatusPage, { type StatusType } from "@/components/ui/StatusPage";

// Temporary StatusType definition - replace with your actual type
type StatusType =
  | "loading"
  | "404"
  | "500"
  | "403"
  | "network-error"
  | "maintenance";

// Dummy StatusPage component - replace with your actual component
const StatusPage = ({
  type,
  customConfig,
}: {
  type: StatusType;
  customConfig?: { actionButton?: { text: string; onClick: () => void } };
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Status: {type}</h2>
        <p className="mb-6">This is a preview of the {type} status page</p>
        {customConfig?.actionButton && (
          <button
            onClick={customConfig.actionButton.onClick}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {customConfig.actionButton.text}
          </button>
        )}
      </div>
    </div>
  );
};

const HelpPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);

  const statusTypes: {
    type: StatusType;
    label: string;
    description: string;
    gradient: string;
    color: string;
  }[] = [
    {
      type: "loading",
      label: "Loading",
      description: "Loading umum dengan spinner animasi",
      gradient: "from-blue-500 to-purple-700",
      color: "bg-blue-500",
    },
    {
      type: "404",
      label: "404 Error",
      description: "Halaman tidak ditemukan",
      gradient: "from-orange-500 to-yellow-600",
      color: "bg-orange-500",
    },
    {
      type: "500",
      label: "500 Error",
      description: "Server internal error",
      gradient: "from-red-500 to-pink-700",
      color: "bg-red-500",
    },
    {
      type: "403",
      label: "403 Error",
      description: "Access denied / forbidden",
      gradient: "from-gray-600 to-gray-800",
      color: "bg-gray-600",
    },
    {
      type: "network-error",
      label: "Network Error",
      description: "Koneksi internet bermasalah",
      gradient: "from-cyan-500 to-indigo-700",
      color: "bg-cyan-500",
    },
    {
      type: "maintenance",
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

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
          <h2 className="text-gray-900 text-xl font-semibold mb-6">Bantuan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Book className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-medium text-gray-900 mb-2">
                Panduan Pengguna
              </h3>
              <p className="text-sm text-gray-600">
                Pelajari cara menggunakan sistem
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-medium text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600">Hubungi support langsung</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Mail className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-medium text-gray-900 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600">
                Kirim pertanyaan via email
              </p>
            </div>
          </div>
        </div>

        {/* Development Only - Enhanced Status Page Testing */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-indigo-600" />
            <h3 className="text-indigo-800 text-lg font-semibold">
              Enhanced Status Page Preview
            </h3>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
              Development Only
            </span>
          </div>

          <div className="bg-indigo-100/50 rounded-lg p-4 mb-6">
            <p className="text-indigo-700 text-sm mb-2">
              <strong>✨ Fitur Terbaru:</strong>
            </p>
            <ul className="text-indigo-600 text-sm space-y-1 ml-4">
              <li>• Dynamic gradient backgrounds untuk setiap status</li>
              <li>• Enhanced glassmorphism design</li>
              <li>• Improved animations dan micro-interactions</li>
              <li>• Larger card size dengan better spacing</li>
              <li>• Removed auth-loading dan success variants</li>
            </ul>
          </div>

          {/* Status Type Grid dengan Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {statusTypes.map(
              ({ type, label, description, gradient, color }) => (
                <div
                  key={type}
                  className="bg-white rounded-xl p-5 border border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <h4 className="font-semibold text-gray-900">{label}</h4>
                  </div>

                  {/* Gradient Preview */}
                  <div
                    className={`h-3 bg-gradient-to-r ${gradient} rounded-full mb-3 opacity-80`}
                  ></div>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {description}
                  </p>

                  <button
                    onClick={() => handleStatusTest(type)}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>Preview {label}</span>
                    </div>
                  </button>
                </div>
              )
            )}
          </div>

          {/* Quick Actions dengan Helper Components */}
          <div className="bg-white/70 rounded-xl p-5 border border-indigo-200">
            <h4 className="text-indigo-800 font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Quick Preview - Helper Components
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <button
                onClick={() => setSelectedStatus("loading")}
                className="group bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs opacity-75 group-hover:opacity-100">
                    LoadingPage
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSelectedStatus("404")}
                className="group bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs opacity-75 group-hover:opacity-100">
                    PageNotFound
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSelectedStatus("500")}
                className="group bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs opacity-75 group-hover:opacity-100">
                    ServerError
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSelectedStatus("403")}
                className="group bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs opacity-75 group-hover:opacity-100">
                    AccessDenied
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSelectedStatus("network-error")}
                className="group bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs opacity-75 group-hover:opacity-100">
                    NetworkError
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSelectedStatus("maintenance")}
                className="group bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs opacity-75 group-hover:opacity-100">
                    MaintenancePage
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Info Footer */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-700 text-xs text-center">
              💡 <strong>Note:</strong> Hapus section ini pada environment
              production. Preview ini hanya untuk development testing.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Status Page Overlay */}
      {selectedStatus && (
        <div className="fixed inset-0 z-50">
          {/* Enhanced Close button */}
          <button
            onClick={closeStatusTest}
            className="absolute top-6 right-6 z-60 group bg-black/20 backdrop-blur-md text-white rounded-full p-3 hover:bg-black/30 transition-all duration-300 border border-white/20 hover:scale-110"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Status info badge */}
          <div className="absolute top-6 left-6 z-60 bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
            <span className="text-sm font-medium">
              Preview:{" "}
              {statusTypes.find((s) => s.type === selectedStatus)?.label ||
                selectedStatus}
            </span>
          </div>

          {/* Status Page */}
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
