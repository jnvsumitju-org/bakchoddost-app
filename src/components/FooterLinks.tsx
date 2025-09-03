"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function FooterLinks() {
  const [isAuthed, setIsAuthed] = useState<null | boolean>(null);

  useEffect(() => {
    let mounted = true;
    // Optimistic cookie presence check (may be cross-site; still confirm via API)
    try {
      const raw = typeof document !== "undefined" ? document.cookie || "" : "";
      if (raw.includes("token=")) setIsAuthed(true);
    } catch {}
    api
      .me()
      .then(() => mounted && setIsAuthed(true))
      .catch(() => mounted && setIsAuthed(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (isAuthed === null) {
    return (
      <div className="flex gap-4">
        <Link href="/about" className="hover:underline">About</Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Link href="/about" className="hover:underline">About</Link>
      {isAuthed ? (
        <>
          <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
          <button
            className="hover:underline"
            onClick={() => {
              api.logout().finally(() => {
                setIsAuthed(false);
                window.location.assign("/");
              });
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <Link href="/admin/login" className="hover:underline">Login</Link>
      )}
    </div>
  );
}


