// src/app/(dashboard)/disparity/page.tsx
"use client";

import React, { useState } from "react";
import { BarChart3, Download, Calendar, Filter } from "lucide-react";

const DisparityPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Dummy data for the chart
  const disparityData = [
    { region: "Jakarta", target: 100, actual: 85, percentage: 85 },
    { region: "Bandung", target: 80, actual: 95, percentage: 119 },
    { region: "Surabaya", target: 90, actual: 78, percentage: 87 },
    { region: "Medan", target: 75, actual: 82, percentage: 109 },
    { region: "Yogyakarta", target: 60, actual: 55, percentage: 92 },
  ];

  const handlePeriodChange = () => {
    console.log("Opening period selector");
    // You can add a date picker modal here
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Exporting disparity report");
    setIsExporting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-40 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-900 text-xl font-semibold">
            Laporan Disparitas
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={handlePeriodChange}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Periode</span>
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download
                className={`w-5 h-5 ${isExporting ? "animate-pulse" : ""}`}
              />
              <span>{isExporting ? "Exporting..." : "Export"}</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Target</h3>
            <p className="text-2xl font-bold">405</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Actual</h3>
            <p className="text-2xl font-bold">395</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Achievement</h3>
            <p className="text-2xl font-bold">97.5%</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-medium opacity-90">Variance</h3>
            <p className="text-2xl font-bold">-10</p>
          </div>
        </div>

        {/* Chart Placeholder - You can replace this with actual chart library */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
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
        </div>

        {/* Summary Table */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ringkasan Detail
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-2">Region</th>
                  <th className="text-right py-3 px-2">Target</th>
                  <th className="text-right py-3 px-2">Actual</th>
                  <th className="text-right py-3 px-2">Variance</th>
                  <th className="text-right py-3 px-2">Achievement (%)</th>
                  <th className="text-center py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {disparityData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-white transition-colors"
                  >
                    <td className="py-3 px-2 font-medium">{item.region}</td>
                    <td className="py-3 px-2 text-right">{item.target}</td>
                    <td className="py-3 px-2 text-right">{item.actual}</td>
                    <td className="py-3 px-2 text-right">
                      {item.actual - item.target}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {item.percentage}%
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.percentage >= 100
                            ? "bg-green-100 text-green-800"
                            : item.percentage >= 80
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.percentage >= 100
                          ? "Exceeded"
                          : item.percentage >= 80
                          ? "On Track"
                          : "Below Target"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisparityPage;
