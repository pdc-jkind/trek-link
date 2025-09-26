// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
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
    <html lang="id" suppressHydrationWarnings>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Prevent FOUC (Flash of Unstyled Content) by applying theme immediately
                const theme = localStorage.getItem('theme-storage');
                const themeData = theme ? JSON.parse(theme) : null;
                const selectedTheme = themeData?.state?.theme || 'system';
                
                let effectiveTheme;
                if (selectedTheme === 'system') {
                  effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                } else {
                  effectiveTheme = selectedTheme;
                }
                
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(effectiveTheme);
                
                // Update meta theme-color
                const metaThemeColor = document.querySelector('meta[name="theme-color"]');
                if (metaThemeColor) {
                  metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#1f2937' : '#ffffff');
                }
              } catch (e) {
                // Fallback to light theme
                document.documentElement.classList.add('light');
              }
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${poppins.className} transition-colors duration-200`}
      >
        {children}
      </body>
    </html>
  );
}
