import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import ThemeWrapper from "./theme-wrapper"; // NEW client wrapper
import ToastProvider from "../components/ToastProvider";
import PWAInstallPrompt from "../components/PWAInstallPrompt";
import OfflineIndicator from "../components/OfflineIndicator";
import HelpShakeListener from "../components/HelpShakeListener.client";
import Header from "../components/Header";
import AuthInitializer from "../components/AuthInitializer";
import FooterWrapper from "../components/layout/FooterWrapper";
import BottomNav from "../components/layout/BottomNav";
import RegisterSW from "./register-sw";
import Loading from "./loading";
import AnnouncementBar from "../components/AnnouncementBar";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport = {
  themeColor: '#ece9e1ff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "DEVOUR TO CRUSH - JAMB Exam Prep",
  description: "Comprehensive JAMB exam preparation platform",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'D2C',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem("crushedu-theme");
                  var theme = saved || "light";
                  document.documentElement.setAttribute("data-theme", theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e8e7e4ff" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="D2C" />
      </head>
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen`}>
        <OfflineIndicator />
        <ThemeWrapper>
          <ReduxProvider>
            <AuthInitializer />
            <AnnouncementBar />
            <Header />
            <main className="flex-1">
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </main>
            <FooterWrapper />
            <BottomNav />
            <HelpShakeListener />
            <ToastProvider />
            <PWAInstallPrompt />
            <RegisterSW />
          </ReduxProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
