// src/app/(frontend)/(dashboard)/settings/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/fe/store/theme.store";
import {
  Sun,
  Moon,
  Monitor,
  Settings as SettingsIcon,
  Plus,
  Download,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Activity,
  LayoutDashboard,
  FileText,
  AlertCircle,
  Check,
  X,
  Clock,
} from "lucide-react";
import ColorPaletteDebug from "./ColorPaletteDebug";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; name: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.name}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="text-red-800 dark:text-red-200 font-semibold">
            Error in {this.props.name}
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {this.state.error?.message || "Something went wrong"}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe component wrapper
const SafeComponent: React.FC<{
  name: string;
  children: React.ReactNode;
}> = ({ name, children }) => (
  <ErrorBoundary name={name}>
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {name}
      </h3>
      {children}
    </div>
  </ErrorBoundary>
);

const SettingsPage = () => {
  const { theme, effectiveTheme, setTheme, mounted, initialize, toggle } =
    useTheme();
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState("theme");

  // Test states
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setIsClient(true);
    initialize();
  }, [initialize]);

  // Theme configuration
  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  // Show loading state
  if (!isClient || !mounted) {
    return (
      <div className="min-h-screen surface p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Loading components...
          </p>
        </div>
      </div>
    );
  }

  // Test sections
  const sections = [
    { id: "theme", label: "Theme Controls" },
    { id: "buttons", label: "Buttons" },
    { id: "cards", label: "Cards" },
    { id: "badges", label: "Status Badges" },
    { id: "spinners", label: "Loading Spinners" },
    { id: "placeholders", label: "Empty States" },
    { id: "images", label: "Images" },
    { id: "forms", label: "Forms" },
  ];

  const renderThemeSection = () => (
    <SafeComponent name="Theme Controls">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Component Theme Testing
            </h1>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                effectiveTheme === "dark"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200"
              }`}
            >
              {effectiveTheme} mode
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value as any)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }
                `}
              >
                <IconComponent className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
          <button
            onClick={toggle}
            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </SafeComponent>
  );

  const renderButtonSection = () => (
    <SafeComponent name="Button Components">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
              Button Variants
            </h4>
            <div className="flex gap-3 flex-wrap">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Primary
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Secondary
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Success
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Error
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Outline
              </button>
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Ghost
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
              Button Sizes
            </h4>
            <div className="flex gap-3 items-center flex-wrap">
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
                Small
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Medium
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg">
                Large
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
              Button States
            </h4>
            <div className="flex gap-3 flex-wrap">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                With Icon
              </button>
              <button
                disabled
                className="px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed flex items-center gap-2"
              >
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading
              </button>
              <button
                disabled
                className="px-4 py-2 bg-gray-400 text-white rounded-lg opacity-50 cursor-not-allowed"
              >
                Disabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </SafeComponent>
  );

  const renderCardSection = () => (
    <SafeComponent name="Card Components">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Default Card
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            This is a default card with standard styling and proper dark mode
            support.
          </p>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Card Footer
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Elevated card with enhanced shadow for better depth perception.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-300 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-400">
            Outlined card with thicker border styling.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
          <p className="text-gray-600 dark:text-gray-400">
            Glass card with translucent background effect.
          </p>
        </div>

        <div className="bg-transparent rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Minimal card with transparent background.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Statistics Card
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  1,234
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sample data
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5%
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                vs last month
              </span>
            </div>
          </div>
        </div>
      </div>
    </SafeComponent>
  );

  const renderBadgeSection = () => (
    <SafeComponent name="Status Badge Components">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
              Status Variants
            </h4>
            <div className="flex gap-3 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <Check className="w-3 h-3 mr-1" />
                Success
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                <X className="w-3 h-3 mr-1" />
                Error
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                <AlertCircle className="w-3 h-3 mr-1" />
                Warning
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                Info
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 relative">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Active
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
              Badge Styles
            </h4>
            <div className="flex gap-3 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white">
                Solid
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                Soft
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-yellow-600 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400">
                Outline
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-red-600 dark:text-red-400">
                Minimal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                Gradient
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
              Badge Sizes
            </h4>
            <div className="flex gap-3 flex-wrap items-center">
              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                XS
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                SM
              </span>
              <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                MD
              </span>
              <span className="px-3 py-1.5 rounded-full text-base font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                LG
              </span>
            </div>
          </div>
        </div>
      </div>
    </SafeComponent>
  );

  const renderSpinnerSection = () => (
    <SafeComponent name="Loading Spinner Components">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
              Spinner Types
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { name: "Default", type: "default" },
                { name: "Dots", type: "dots" },
                { name: "Pulse", type: "pulse" },
                { name: "Bars", type: "bars" },
                { name: "Ring", type: "ring" },
              ].map(({ name, type }) => (
                <div key={type} className="text-center">
                  {type === "default" && (
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  )}
                  {type === "dots" && (
                    <div className="flex justify-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 200}ms` }}
                        ></div>
                      ))}
                    </div>
                  )}
                  {type === "pulse" && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse mx-auto"></div>
                  )}
                  {type === "bars" && (
                    <div className="flex justify-center items-end gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-1 h-4 bg-blue-600 rounded-sm animate-pulse"
                          style={{ animationDelay: `${i * 150}ms` }}
                        ></div>
                      ))}
                    </div>
                  )}
                  {type === "ring" && (
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  )}
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
              With Text
            </h4>
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                ))}
              </div>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                Loading data...
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please wait while we fetch your information
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
              Colors
            </h4>
            <div className="flex gap-4 items-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    </SafeComponent>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case "theme":
        return renderThemeSection();
      case "buttons":
        return renderButtonSection();
      case "cards":
        return renderCardSection();
      case "badges":
        return renderBadgeSection();
      case "spinners":
        return renderSpinnerSection();
      default:
        return renderThemeSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Component Testing
            </h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {renderCurrentSection()}

            <ColorPaletteDebug />

            {/* Debug Information */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Theme Debug Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Selected Theme:
                  </span>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {String(theme)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Effective Theme:
                  </span>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {String(effectiveTheme)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Theme Mounted:
                  </span>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {mounted ? "Yes" : "No"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Client Rendered:
                  </span>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {isClient ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
