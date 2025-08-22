"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../../lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "ok" | "nope">("checking");

  const isPublicAdminRoute = pathname === "/admin/login" || pathname === "/admin/register";

  useEffect(() => {
    let mounted = true;
    if (isPublicAdminRoute) {
      if (mounted) setStatus("ok");
      return () => {
        mounted = false;
      };
    }
    api.me()
      .then(() => mounted && setStatus("ok"))
      .catch(() => {
        if (mounted) {
          setStatus("nope");
          router.replace("/admin/login");
        }
      });
    return () => {
      mounted = false;
    };
  }, [router, pathname, isPublicAdminRoute]);

  if (isPublicAdminRoute) {
    return <>{children}</>;
  }

  if (status === "checking") {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="animate-pulse text-sm text-muted">Checking session…</div>
      </div>
    );
  }

  if (status === "nope") return null;

  return <>{children}</>;
}


