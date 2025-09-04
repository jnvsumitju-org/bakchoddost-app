import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates",
  description: "Browse all poem templates and see usage stats.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}


