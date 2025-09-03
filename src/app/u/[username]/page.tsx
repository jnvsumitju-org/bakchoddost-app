"use client";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import React, { useEffect, use } from "react";
import { api, API_BASE_URL } from "../../../lib/api";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";

async function fetchUserPoems(username: string) {
  const base = API_BASE_URL || "";
  const res = await fetch(`${base}/api/poems/by/${encodeURIComponent(username)}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const { data, error } = useSWR(username ? `/u/${username}` : null, () => fetchUserPoems(username));

  useEffect(() => {
    let mounted = true;
    api
      .me()
      .then((me) => {
        if (!mounted) return;
        if (me?.username && me.username.toLowerCase() === username.toLowerCase()) {
          router.replace("/admin/dashboard");
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [username, router]);

  if (error) return <div className="text-sm text-red-600">Failed to load</div>;
  if (!data) return <div className="text-sm text-muted">Loading…</div>;

  const { user, items } = data as { user: { username: string; name?: string }; items: Array<{ _id: string; text: string; instructions?: string }> };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">@{user.username}{user.name ? ` (${user.name})` : ""}</h1>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted">No creations yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((p) => (
                <div key={p._id} className="rounded border border-border p-3 bg-card text-card-foreground shadow-sm">
                  <pre className="whitespace-pre-wrap text-sm leading-6">{p.text}</pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


