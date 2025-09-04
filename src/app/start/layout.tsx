import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start",
  description: "Generate a personalized dosti poem by entering your and friends' names.",
  alternates: { canonical: "/start" },
};

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return children;
}


