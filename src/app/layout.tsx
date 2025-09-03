import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import { ToastProvider } from "../components/ui/Toast";
import FooterLinks from "../components/FooterLinks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "bakchoddost",
  description: "Generate fun Hindi/Hinglish poems for friends",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ToastProvider>
          <NavBar />
          <main className="flex-1 mx-auto max-w-6xl px-4 py-6">{children}</main>
        </ToastProvider>
        <footer className="border-t border-gray-200">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
            <span>© 2025 bakchoddost.com</span>
            <FooterLinks />
          </div>
        </footer>
      </body>
    </html>
  );
}
