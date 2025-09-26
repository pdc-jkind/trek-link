// src/app/(frontend)/store/theme.store.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  mounted: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  initialize: () => void;
}

// Simple system theme detection
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Simplified DOM theme application
const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  
  const html = document.documentElement;
  const isDark = theme === 'system' ? getSystemTheme() === 'dark' : theme === 'dark';
  
  // Simple class toggle - Tailwind v4 handles the rest via CSS
  html.classList.toggle('dark', isDark);
  
  // Update meta theme-color for mobile browsers
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', isDark ? '#0F0F11' : '#F5F7FA');
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      mounted: false,

      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
        
        // Sync dengan layout.tsx script - gunakan key yang sama dengan zustand persist
        try {
          const persistData = {
            state: { theme },
            version: 0
          };
          localStorage.setItem('theme', JSON.stringify(persistData));
        } catch (error) {
          console.warn('Failed to sync theme to localStorage');
        }
      },

      initialize: () => {
        if (get().mounted) return;
        
        set({ mounted: true });
        const { theme } = get();
        applyTheme(theme);
        
        // Listen for system changes only if using system theme
        const updateSystemTheme = () => {
          if (get().theme === 'system') {
            applyTheme('system');
          }
        };
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateSystemTheme);
        
        // Cleanup is handled by React's useEffect cleanup
      },
    }),
    {
      name: "theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Simplified hook
export const useTheme = () => {
  const { theme, mounted, setTheme, initialize } = useThemeStore();
  
  // Get actual effective theme
  const getEffectiveTheme = (): "light" | "dark" => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  };
  
  return {
    theme,
    effectiveTheme: getEffectiveTheme(),
    mounted,
    setTheme,
    initialize,
    
    // Convenience methods
    isLight: getEffectiveTheme() === 'light',
    isDark: getEffectiveTheme() === 'dark',
    isSystem: theme === 'system',
    
    // Quick setters
    setLight: () => setTheme('light'),
    setDark: () => setTheme('dark'),
    setSystem: () => setTheme('system'),
    
    // Toggle between light and dark (system becomes light)
    toggle: () => {
      const effective = getEffectiveTheme();
      setTheme(effective === 'dark' ? 'light' : 'dark');
    }
  };
};