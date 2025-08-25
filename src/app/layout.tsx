// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/app/(auth)/components/AuthProvider";
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
    <html lang="id">
      <body className={`${poppins.variable} ${poppins.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
