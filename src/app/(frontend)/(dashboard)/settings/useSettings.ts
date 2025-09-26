// src/app/(frontend)/(dashboard)/settings/useSettings.ts
import { useTheme } from '@/fe/store/theme.store';
import { useEffect, useState } from 'react';

export interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  component?: React.ComponentType<any>;
  action?: () => void;
  value?: any;
  type?: 'toggle' | 'select' | 'action' | 'navigation';
}

export const useSettings = () => {
  const { theme, actualTheme, setTheme, mounted } = useTheme();
  const [isReady, setIsReady] = useState(false);

  // Initialize ready state after theme is mounted
  useEffect(() => {
    if (mounted) {
      setIsReady(true);
    }
  }, [mounted]);

  // Theme options for dropdown - Fixed emoji encoding
  const themeOptions = [
    { value: 'light', label: 'Terang', icon: '☀️' },
    { value: 'dark', label: 'Gelap', icon: '🌙' },
    { value: 'system', label: 'Sistem', icon: '💻' }
  ];

  // Get current theme label
  const getCurrentThemeLabel = () => {
    const option = themeOptions.find(opt => opt.value === theme);
    return option ? `${option.icon} ${option.label}` : '💻 Sistem';
  };

  // Settings sections with theme integration
  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profil Pengguna',
      description: 'Kelola informasi profil Anda',
      color: 'text-purple-600 dark:text-purple-400',
      icon: 'User',
      type: 'navigation',
      action: () => {
        console.log('Navigate to profile');
      }
    },
    {
      id: 'notifications',
      title: 'Notifikasi',
      description: 'Atur preferensi notifikasi',
      color: 'text-blue-600 dark:text-blue-400',
      icon: 'Bell',
      type: 'navigation',
      action: () => {
        console.log('Navigate to notifications');
      }
    },
    {
      id: 'theme',
      title: 'Tema Tampilan',
      description: `Saat ini: ${getCurrentThemeLabel()}`,
      color: 'text-indigo-600 dark:text-indigo-400',
      icon: actualTheme === 'dark' ? 'Moon' : 'Sun',
      type: 'select',
      value: theme,
      action: () => {
        // Cycle through themes
        const currentIndex = themeOptions.findIndex(opt => opt.value === theme);
        const nextIndex = (currentIndex + 1) % themeOptions.length;
        setTheme(themeOptions[nextIndex].value as any);
      }
    },
    {
      id: 'security',
      title: 'Keamanan',
      description: 'Pengaturan keamanan akun',
      color: 'text-green-600 dark:text-green-400',
      icon: 'Shield',
      type: 'navigation',
      action: () => {
        console.log('Navigate to security');
      }
    },
    {
      id: 'language',
      title: 'Bahasa & Region',
      description: 'Pengaturan bahasa dan lokasi',
      color: 'text-orange-600 dark:text-orange-400',
      icon: 'Globe',
      type: 'navigation',
      action: () => {
        console.log('Navigate to language');
      }
    }
  ];

  return {
    // Theme related
    theme,
    actualTheme,
    setTheme,
    mounted: isReady, // Use local ready state instead
    themeOptions,
    getCurrentThemeLabel,
    
    // Settings
    settingsSections,
    
    // Actions
    handleSettingAction: (section: SettingsSection) => {
      if (section.action) {
        section.action();
      }
    },
    
    // Utils
    getIconColorClass: (color: string) => {
      return `w-6 h-6 ${color}`;
    },
    
    // Theme specific actions
    toggleTheme: () => {
      setTheme(actualTheme === 'dark' ? 'light' : 'dark');
    },
    
    setLightTheme: () => setTheme('light'),
    setDarkTheme: () => setTheme('dark'),
    setSystemTheme: () => setTheme('system'),
  };
};