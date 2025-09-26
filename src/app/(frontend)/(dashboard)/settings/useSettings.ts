// src/app/(frontend)/(dashboard)/settings/useSettings.ts
import { useTheme } from '@/fe/store/theme.store';

export interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  type: 'toggle' | 'select' | 'action' | 'navigation';
  action?: () => void;
}

export const useSettings = () => {
  const { theme, effectiveTheme, setTheme, mounted } = useTheme();

  // Theme options with proper icons
  const themeOptions = [
    { value: 'light', label: 'Terang', icon: '☀️' },
    { value: 'dark', label: 'Gelap', icon: '🌙' },
    { value: 'system', label: 'Sistem', icon: '💻' }
  ];

  // Get current theme display info
  const getCurrentThemeInfo = () => {
    const option = themeOptions.find(opt => opt.value === theme);
    return {
      selected: option || themeOptions[2], // fallback to system
      effective: effectiveTheme,
      display: `${option?.icon || '💻'} ${option?.label || 'Sistem'}`
    };
  };

  const themeInfo = getCurrentThemeInfo();

  // Settings sections
  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profil Pengguna',
      description: 'Kelola informasi profil Anda',
      color: 'text-purple-600 dark:text-purple-400',
      icon: 'User',
      type: 'navigation',
      action: () => console.log('Navigate to profile')
    },
    {
      id: 'notifications',
      title: 'Notifikasi',
      description: 'Atur preferensi notifikasi',
      color: 'text-blue-600 dark:text-blue-400',
      icon: 'Bell',
      type: 'navigation',
      action: () => console.log('Navigate to notifications')
    },
    {
      id: 'theme',
      title: 'Tema Tampilan',
      description: `Saat ini: ${themeInfo.display}`,
      color: 'text-indigo-600 dark:text-indigo-400',
      icon: effectiveTheme === 'dark' ? 'Moon' : 'Sun',
      type: 'select',
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
      action: () => console.log('Navigate to security')
    },
    {
      id: 'language',
      title: 'Bahasa & Region',
      description: 'Pengaturan bahasa dan lokasi',
      color: 'text-orange-600 dark:text-orange-400',
      icon: 'Globe',
      type: 'navigation',
      action: () => console.log('Navigate to language')
    }
  ];

  return {
    // Theme
    theme,
    effectiveTheme,
    setTheme,
    mounted,
    themeOptions,
    themeInfo,
    
    // Settings
    settingsSections,
    
    // Actions
    handleSettingAction: (section: SettingsSection) => {
      section.action?.();
    },
    
    // Theme actions
    toggleTheme: () => {
      setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
    },
    
    cycleTheme: () => {
      const themes: Array<typeof theme> = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      setTheme(themes[nextIndex]);
    }
  };
};