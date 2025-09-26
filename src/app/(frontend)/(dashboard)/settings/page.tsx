// src/app/(frontend)/(dashboard)/settings/page.tsx
"use client";

import {
  User,
  Bell,
  Shield,
  Globe,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/fe/components/layout/Card";
import { PageHeader } from "@/fe/components/layout/PageHeader";
import {
  ThemeToggle,
  ThemeInitializer,
} from "@/app/(frontend)/(dashboard)/components/ThemeComponents";
import { useSettings } from "./useSettings";

const SettingsPageContent: React.FC = () => {
  const {
    settingsSections,
    handleSettingAction,
    mounted,
    themeOptions,
    theme,
    setTheme,
  } = useSettings();

  // Icon mapping
  const iconMap = {
    User,
    Bell,
    Shield,
    Globe,
    Sun,
    Moon,
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Card>
          <PageHeader title="Pengaturan" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
              >
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Settings Card */}
      <Card>
        <PageHeader title="Pengaturan" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section) => {
            const IconComponent = iconMap[section.icon as keyof typeof iconMap];

            return (
              <div
                key={section.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                onClick={() => handleSettingAction(section)}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-6 h-6 ${section.color}`} />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Special handling for theme section */}
                {section.id === "theme" ? (
                  <div className="flex items-center space-x-2">
                    <ThemeToggle variant="switch" className="scale-75" />
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                )}
              </div>
            );
          })}
        </div>

        {/* Theme Options Panel */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-blue-100 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Pilihan Tema
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pilih tema yang sesuai dengan preferensi Anda
              </p>
            </div>
            <ThemeToggle variant="dropdown" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value as any)}
                className={`
                  flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200
                  ${
                    theme === option.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary-300 hover:bg-primary-25 dark:hover:bg-gray-700"
                  }
                `}
              >
                <span className="text-2xl mb-1">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

// Main component with ThemeInitializer wrapper
const SettingsPage: React.FC = () => {
  return (
    <ThemeInitializer>
      <SettingsPageContent />
    </ThemeInitializer>
  );
};

export default SettingsPage;
