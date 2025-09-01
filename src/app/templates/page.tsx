"use client";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { api } from "../../lib/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";

export default function TemplatesPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 1000);
    return () => clearTimeout(t);
  }, [q]);
  const key = useMemo(() => ["/templates", debouncedQ, page, limit].join("|"), [debouncedQ, page]);
  const { data, isLoading, error } = useSWR(key, () => api.browsePoems({ q: debouncedQ, page, limit }), { revalidateOnFocus: false });
  const items = data?.items || [];
  const pages = data?.pages || 0;
  const isDebouncing = q !== debouncedQ;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Browse Templates</h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input placeholder="Search text..." value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
            <div className="flex items-center gap-2">
              {isDebouncing && <span className="text-xs text-muted animate-pulse">Searching…</span>}
              <Button variant="ghost" onClick={() => { setQ(""); setPage(1); }}>Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-medium">Results</h2>
        </CardHeader>
        <CardContent>
          {(isLoading || isDebouncing) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded border border-border p-3 bg-card animate-pulse h-28" />
              ))}
            </div>
          )}
          {!isLoading && !isDebouncing && error && <p className="text-sm text-red-600">Failed to load</p>}
          {!isLoading && !isDebouncing && !error && (
            <>
              {items.length === 0 ? (
                <p className="text-sm text-muted">No templates found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((p) => (
                    <div key={p._id} className="rounded border border-border p-3 bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col md:flex-row items-stretch md:items-start gap-3">
                        <div className="flex-1 order-2 md:order-1">
                          <pre className="whitespace-pre-wrap text-sm leading-6">{p.text}</pre>
                        </div>
                        <div className="w-full md:w-36 shrink-0 text-xs md:border-l md:pl-3 order-1 md:order-2">
                          <div className="text-muted">Used</div>
                          <div className="font-semibold mb-2">{(p as { usageCount?: number }).usageCount ?? 0} times</div>
                          <a href={`/start?use=${p._id}`}>
                            <Button size="sm">Use →</Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {pages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                  <span className="text-sm">Page {page} of {pages}</span>
                  <Button size="sm" variant="ghost" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>Next</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
