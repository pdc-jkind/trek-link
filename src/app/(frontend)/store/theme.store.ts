// src/app/(frontend)/store/theme.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  actualTheme: "light" | "dark";
  mounted: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  initializeTheme: () => (() => void) | undefined;
  updateActualTheme: () => void;
  setMounted: (mounted: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      actualTheme: "light",
      mounted: false,

      setTheme: (theme: Theme) => {
        set({ theme });
        
        // Update actual theme based on new theme selection
        get().updateActualTheme();
        
        // Apply theme to DOM
        if (typeof window !== 'undefined') {
          applyThemeToDOM(theme);
        }
      },

      initializeTheme: () => {
        if (typeof window === 'undefined') return;
        
        const { theme } = get();
        get().updateActualTheme();
        applyThemeToDOM(theme);
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemThemeChange = () => {
          const currentTheme = get().theme;
          if (currentTheme === "system") {
            get().updateActualTheme();
            applyThemeToDOM(currentTheme);
          }
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);
        
        // Return cleanup function
        return () => {
          mediaQuery.removeEventListener("change", handleSystemThemeChange);
        };
      },

      updateActualTheme: () => {
        if (typeof window === 'undefined') return;
        
        const { theme } = get();
        let effectiveTheme: "light" | "dark";

        if (theme === "system") {
          effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        } else {
          effectiveTheme = theme;
        }

        set({ actualTheme: effectiveTheme });
      },

      setMounted: (mounted: boolean) => {
        set({ mounted });
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Helper function to apply theme to DOM
function applyThemeToDOM(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  
  let effectiveTheme: "light" | "dark";
  
  if (theme === "system") {
    effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } else {
    effectiveTheme = theme;
  }

  root.classList.remove("light", "dark");
  root.classList.add(effectiveTheme);

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content",
      effectiveTheme === "dark" ? "#1f2937" : "#ffffff"
    );
  }
}

// Hook for easy access to theme store
export const useTheme = () => {
  const store = useThemeStore();
  
  return {
    theme: store.theme,
    actualTheme: store.actualTheme,
    mounted: store.mounted,
    setTheme: store.setTheme,
    initializeTheme: store.initializeTheme,
    updateActualTheme: store.updateActualTheme,
    setMounted: store.setMounted,
  };
};