// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trek Link - Link the Route",
  description: "Modern inventory management and tracking system",
  icons: {
    icon: "/img/favicon.ico",
    shortcut: "/img/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className="scheme-light-dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getStoredTheme() {
                  try {
                    const stored = localStorage.getItem('theme');
                    if (!stored) return 'system';
                    
                    // Handle both formats: "light" dan {"state":{"theme":"light"},"version":0}
                    let themeValue;
                    if (stored.startsWith('{')) {
                      const parsed = JSON.parse(stored);
                      themeValue = parsed?.state?.theme || 'system';
                    } else {
                      themeValue = stored;
                    }
                    
                    return ['light', 'dark', 'system'].includes(themeValue) ? themeValue : 'system';
                  } catch {
                    return 'system';
                  }
                }
                
                function getSystemPreference() {
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                
                function applyTheme(theme) {
                  const html = document.documentElement;
                  const effectiveTheme = theme === 'system' ? getSystemPreference() : theme;
                  
                  // Toggle dark class
                  html.classList.toggle('dark', effectiveTheme === 'dark');
                  
                  // Update meta theme-color
                  const metaTheme = document.querySelector('meta[name="theme-color"]');
                  if (metaTheme) {
                    metaTheme.setAttribute('content', effectiveTheme === 'dark' ? '#0F0F11' : '#F5F7FA');
                  }
                }
                
                const theme = getStoredTheme();
                applyTheme(theme);
                
                // Listen for system theme changes when using 'system'
                if (theme === 'system') {
                  window.matchMedia('(prefers-color-scheme: dark)')
                    .addEventListener('change', () => applyTheme('system'));
                }
              })();
            `,
          }}
        />
        <meta name="theme-color" content="#F5F7FA" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
