"use client";
import useSWR from "swr";
import { api } from "../lib/api";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Home() {
  const { data: trending, isLoading, error } = useSWR("/trending", api.getTrending, { revalidateOnFocus: false });
  const { data: me } = useSWR("/me", api.me, { revalidateOnFocus: false });
  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Personalized Dosti Poems</h1>
        <p className="text-sm sm:text-base text-muted mt-2">Add your and your friends&apos; names to generate fun shayari.</p>
        <div className="mt-4">
          <Link href="/start">
            <Button size="lg">Start →</Button>
          </Link>
        </div>
        <p className="mt-2 inline-block rounded bg-muted/20 px-2 py-1 text-[11px] sm:text-xs text-muted">
          {me ? "Click Start to go through a simple 2-step flow: friends → poem." : "Click Start to go through a simple 3-step flow: your name → friends → poem."}
        </p>
        <p className="mt-2 inline-block rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] sm:text-xs text-amber-800">
          Apni shayari talent ko spotlight do! Register karke apni poems submit karo — agar dhamakedaar hui to trending mein jayegi.
          <Link href="/admin/login" className="ml-1 font-semibold underline decoration-amber-400 hover:decoration-amber-600">Register / Login →</Link>
        </p>
      </section>
      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Trending Poems</h2>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="grid md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded border border-border p-3 bg-card animate-pulse h-32" />
                ))}
              </div>
            )}
            {!isLoading && error && <p className="text-sm text-red-600">Failed to load trending poems</p>}
            {!isLoading && !error && (
              <>
                {!trending || trending.length === 0 ? (
                  <p className="text-sm text-muted">No poems yet. Add some in the Admin Dashboard.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trending.map((p) => (
                      <div key={p.id} className="rounded border border-border p-3 bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-3">
                          <div className="flex-1 order-2 md:order-1">
                            <pre className="whitespace-pre-wrap text-sm leading-6">{p.text}</pre>
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
                            <Link href={`/start?use=${p.id}`}>
                              <Button size="sm">Use →</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
