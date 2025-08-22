"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { api } from "../../../../lib/api";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";
import { Card, CardContent, CardHeader } from "../../../../components/ui/Card";
import { poemSchema, type PoemForm } from "../../../../lib/validation";

export default function EditPoemPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const poemId = params?.id as string;
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<PoemForm>({
    resolver: zodResolver(poemSchema),
    defaultValues: { text: "", instructions: "" },
    mode: "onBlur",
  });

  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [friendCount, setFriendCount] = useState<number>(2);

  useEffect(() => {
    let mounted = true;
    api.getPoem(poemId).then((p) => {
      if (!mounted) return;
      setValue("text", p.text || "");
      setValue("instructions", p.instructions || "");
    }).catch((e: any) => setError(e.message || "Failed to load"));
    return () => { mounted = false; };
  }, [poemId, setValue]);

  function insertAtCursor(token: string) {
    const el = textRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const value = (el as HTMLTextAreaElement).value || "";
    const next = value.slice(0, start) + token + value.slice(end);
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
    nativeInputValueSetter?.call(el, next);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    const caret = start + token.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }

  const update = handleSubmit(async (values) => {
    setError(null);
    try {
      await api.updatePoem(poemId, values);
      router.push("/admin/dashboard");
    } catch (e: any) {
      setError(e.message || "Failed to update");
    }
  });

  return (
    <div className="grid place-items-center">
      <Card className="w-full min-w-5xl relative">
        <CardHeader>
          <h1 className="text-xl font-semibold">Update poem</h1>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <Textarea
                className="h-[32rem] font-mono text-base"
                error={errors.text?.message}
                {...(() => { const r = register("text"); return { ...r, ref: (el: HTMLTextAreaElement | null) => { textRef.current = el; r.ref(el); } }; })()}
              />
              <Input placeholder="Instructions (optional)" error={errors.instructions?.message} {...register("instructions")} />
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button disabled={!!errors.text} loading={isSubmitting} onClick={update}>Update</Button>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <aside className="space-y-3 md:sticky md:top-20">
              <div className="rounded-md border p-3 bg-muted/10 text-sm">
                <p className="mb-2"><strong>How to write templates:</strong></p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Use <code className="px-1 rounded bg-muted/30">{'{{userName}}'}</code> for the user's name.</li>
                  <li>Use <code className="px-1 rounded bg-muted/30">{'{{friendName1}}'}</code> .. <code className="px-1 rounded bg-muted/30">{`{{friendName${friendCount}}}`}</code> for friends.</li>
                </ul>
              </div>
              <div className="rounded-md border p-3 bg-background text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">Friends count:</span>
                  <Button size="sm" variant="ghost" onClick={() => setFriendCount((c) => Math.max(1, c - 1))}>-</Button>
                  <span className="px-2 py-1 rounded border text-sm">{friendCount}</span>
                  <Button size="sm" variant="ghost" onClick={() => setFriendCount((c) => Math.min(10, c + 1))}>+</Button>
                </div>
                <div className="max-h-64 overflow-auto">
                  <button className="block w-full text-left hover:bg-muted/20 px-2 py-1 rounded" onClick={() => insertAtCursor("{{userName}}")}>{'{{userName}}'}</button>
                  {Array.from({ length: friendCount }).map((_, i) => (
                    <button key={`btn-${i}`} className="block w-full text-left hover:bg-muted/20 px-2 py-1 rounded" onClick={() => insertAtCursor(`{{friendName${i + 1}}}`)}>
                      {`{{friendName${i + 1}}}`}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
