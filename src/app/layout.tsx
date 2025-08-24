import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import Link from "next/link";

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
      { url: "/favicon.ico" },
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
        <NavBar />
        <main className="flex-1 mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t border-gray-200">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
            <span>© {new Date().getFullYear()} bakchoddost</span>
            <div className="flex gap-4">
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/admin/login" className="hover:underline">Admin</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
