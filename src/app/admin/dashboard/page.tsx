"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";
import Button from "../../../components/ui/Button";
// import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";

type Poem = { _id: string; text: string; instructions?: string };

export default function DashboardPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [text, setText] = useState("Hey {{userName}}, tere yaar {{friendName1}} ke saath masti!\nDosti ki dhun, hasi ki barsaat, yaariyaan non-stop!");
  const [instructions, setInstructions] = useState("Use placeholders like {{userName}} and {{friendName1}}");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listPoems();
      setPoems(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load poems";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.createPoem({ text, instructions });
      setText("");
      setInstructions("");
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, patch: Partial<Poem>) => {
    setLoading(true);
    setError(null);
    try {
      await api.updatePoem(id, { text: patch.text || "", instructions: patch.instructions });
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.deletePoem(id);
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to delete";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full md:min-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>
      <div className="space-y-4">
        <div>
          <Link href="/admin/poems/new" className="inline-block">
            <Button>Add new poem</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 items-start">
        <Card>
          <CardHeader>
            <h2 className="font-medium">Existing poems</h2>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded border border-border p-3 bg-card animate-pulse h-40" />
                ))}
              </div>
            )}
            {!loading && (
              <div className="space-y-3">
                {poems.map((p) => (
                  <div key={p._id} className="border rounded p-3 space-y-2">
                    <Textarea className="h-56 font-mono text-base" defaultValue={p.text} onBlur={(e) => update(p._id, { text: e.target.value })} />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/poems/edit?id=${p._id}`}>
                          <Button size="sm" variant="ghost">Update</Button>
                        </Link>
                        <button className="text-red-600" onClick={() => remove(p._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {poems.length === 0 && <p className="text-sm text-gray-600">No poems.</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


