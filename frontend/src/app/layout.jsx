import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import ThemeWrapper from "./theme-wrapper"; // NEW client wrapper
import ToastProvider from "../components/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "DEVOUR TO CRUSH - JAMB Exam Prep",
  description: "Comprehensive JAMB exam preparation platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ThemeWrapper>
          <ReduxProvider>
            {children}
            <ToastProvider />
          </ReduxProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
