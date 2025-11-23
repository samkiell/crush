import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import ThemeWrapper from "./theme-wrapper"; // NEW client wrapper
import ToastProvider from "../components/ToastProvider";
import PWAInstallPrompt from "../components/PWAInstallPrompt";
import OfflineIndicator from "../components/OfflineIndicator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "DEVOUR TO CRUSH - JAMB Exam Prep",
  description: "Comprehensive JAMB exam preparation platform",
  manifest: '/manifest.json',
  themeColor: '#FFC107',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'D2C',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFC107" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="D2C" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <OfflineIndicator />
        <ThemeWrapper>
          <ReduxProvider>
            {children}
            <ToastProvider />
            <PWAInstallPrompt />
          </ReduxProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
