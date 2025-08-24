"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "../lib/api";

export default function NavBar() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    let mounted = true;
    api
      .me()
      .then(() => mounted && setIsAuthed(true))
      .catch(() => mounted && setIsAuthed(false));
    return () => {
      mounted = false;
    };
  }, [pathname]);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="bakchoddost logo" width={24} height={24} priority />
          <span className="text-lg font-semibold tracking-tight">bakchoddost</span>
        </Link>
        <button className="md:hidden px-2 py-1 rounded hover:bg-muted/10" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          ☰
        </button>
        <div className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/" className="px-2 py-1 rounded hover:bg-muted/10">Home</Link>
          <Link href="/poems" className="px-2 py-1 rounded hover:bg-muted/10">Poems</Link>
          <Link href="/templates" className="px-2 py-1 rounded hover:bg-muted/10">Templates</Link>
          <Link href="/about" className="px-2 py-1 rounded hover:bg-muted/10">About</Link>
          {isAuthed ? (
            <button
              className="px-2 py-1 rounded hover:bg-muted/10"
              onClick={() => {
                api.logout().finally(() => {
                  setIsAuthed(false);
                  window.location.assign("/");
                });
              }}
            >
              Logout
            </button>
          ) : (
            <Link href="/admin/login" className="px-2 py-1 rounded hover:bg-muted/10">Admin</Link>
          )}
          {isAuthed && (
            <Link href="/admin/dashboard" className="px-2 py-1 rounded hover:bg-muted/10">Dashboard</Link>
          )}
        </div>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-2 grid gap-1 text-sm">
            <Link href="/" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-muted/10">Home</Link>
            <Link href="/poems" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-muted/10">Poems</Link>
            <Link href="/templates" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-muted/10">Templates</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-muted/10">About</Link>
            {isAuthed ? (
              <button
                className="text-left px-2 py-2 rounded hover:bg-muted/10"
                onClick={() => {
                  api.logout().finally(() => {
                    setIsAuthed(false);
                    window.location.assign("/");
                  });
                }}
              >
                Logout
              </button>
            ) : (
              <Link href="/admin/login" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-muted/10">Admin</Link>
            )}
            {isAuthed && (
              <Link href="/admin/dashboard" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-muted/10">Dashboard</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


