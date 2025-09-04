import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import { ToastProvider } from "../components/ui/Toast";
import FooterLinks from "../components/FooterLinks";
import { FE_ENV } from "../lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(FE_ENV.SITE_URL),
  title: {
    default: "Bakchoddost — Personalized Dosti Poems",
    template: "%s | Bakchoddost",
  },
  description:
    "Generate fun Hindi/Hinglish poems for friends. Create personalized shayari with your friends' names.",
  keywords: [
    "shayari",
    "poems",
    "friends",
    "hinglish",
    "hindi",
    "dosti",
    "generator",
    "bakchoddost",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: FE_ENV.SITE_URL,
    title: "Bakchoddost — Personalized Dosti Poems",
    description: "Generate fun Hindi/Hinglish poems for friends.",
    siteName: "Bakchoddost",
    images: [
      { url: "/logo.svg" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bakchoddost — Personalized Dosti Poems",
    description: "Generate fun Hindi/Hinglish poems for friends.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
