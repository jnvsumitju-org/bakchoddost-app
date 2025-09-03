"use client";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { api } from "../../lib/api";
import { renderTemplate } from "../../lib/poem";
import Button from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";

export default function PoemsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const key = useMemo(() => ["/poems", page, limit].join("|"), [page]);
  const { data, isLoading, error } = useSWR(key, () => api.browsePoems({ page, limit }), { revalidateOnFocus: false });

  const items = data?.items || [];
  const pages = data?.pages || 0;
  const windowPages = (current: number, total: number) => {
    const span = 3;
    const start = Math.max(1, current - span);
    const end = Math.min(total, current + span);
    return Array.from({ length: end - start + 1 }, (_v, i) => start + i);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-medium">All Poems</h2>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded border border-border p-3 bg-card animate-pulse h-28" />
              ))}
            </div>
          )}
          {!isLoading && error && <p className="text-sm text-red-600">Failed to load</p>}
          {!isLoading && !error && (
            <>
              {items.length === 0 ? (
                <p className="text-sm text-muted">No poems found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((p) => (
                    <div key={p._id} className="rounded border border-border p-3 bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col md:flex-row items-stretch md:items-start gap-3">
                        <div className="flex-1 order-2 md:order-1">
                          <pre className="whitespace-pre-wrap text-sm leading-6">{renderTemplate(p.text, "आप", ["मोनू", "टिंकू", "बबलू"])}</pre>
                        </div>
                        <div className="w-full md:w-36 shrink-0 text-xs md:border-l md:pl-3 order-1 md:order-2">
                          <div className="text-muted">Used</div>
                          <div className="font-semibold mb-2">{(p as { usageCount?: number }).usageCount ?? 0} times</div>
                          {((p as { ownerUsername?: string }).ownerUsername) && (
                            <div className="mb-2">
                              <span className="text-muted">By</span>{" "}
                              <a href={`/u/${(p as { ownerUsername?: string }).ownerUsername}`} className="font-medium hover:underline">
                                @{(p as { ownerUsername?: string }).ownerUsername}
                              </a>
                            </div>
                          )}
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
                <div className="mt-4 flex items-center justify-center gap-1 flex-wrap">
                  <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                  {windowPages(page, pages).map((n) => (
                    <Button
                      key={n}
                      size="sm"
                      variant={n === page ? "secondary" : "ghost"}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </Button>
                  ))}
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
