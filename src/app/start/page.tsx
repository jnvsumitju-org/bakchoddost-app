"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../lib/api";
import { generateSchema, type GenerateForm } from "../../lib/validation";
import Stepper from "../../components/ui/Stepper";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";

export default function StartPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    defaultValues: { userName: "", friendNames: [""] },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray<GenerateForm, FieldArrayPath<GenerateForm>>({
    name: "friendNames" as FieldArrayPath<GenerateForm>,
    control,
  });
  const friendNames = watch("friendNames") || [];
  const friendsCount = friendNames.filter((n) => (n || "").trim().length > 0).length;
  const [fitCount, setFitCount] = useState<number | null>(null);
  const [fitStats, setFitStats] = useState<Array<{ friends: number; count: number }> | null>(null);

  // Live fit count with small debounce
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await api.fitCount(friendsCount);
        setFitCount(res.count);
      } catch {
        setFitCount(null);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [friendsCount]);

  useEffect(() => {
    let mounted = true;
    api.fitStats()
      .then((r) => mounted && setFitStats(r.items))
      .catch(() => mounted && setFitStats(null));
    return () => {
      mounted = false;
    };
  }, []);

  // Check session to skip name step and prefill name
  useEffect(() => {
    let mounted = true;
    api
      .me()
      .then((me) => {
        if (!mounted) return;
        setIsAuthed(true);
        const preset = (me?.name || me?.username || "").trim();
        if (preset) setValue("userName", preset, { shouldValidate: true, shouldDirty: false });
        setStep(2);
      })
      .catch(() => setIsAuthed(false));
    return () => {
      mounted = false;
    };
  }, [setValue]);

  const onGenerate = handleSubmit(async (values) => {
    const friends = values.friendNames.filter((n) => n.trim().length > 0);
    const data = await api.generatePoem({ userName: values.userName, friendNames: friends });
    setResult(data.text);
    setStep(3);
  });

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        {isAuthed ? (
          <Stepper steps={["Friends", "Poem"]} active={step === 2 ? 1 : 2} />
        ) : (
          <Stepper steps={["Your Name", "Friends", "Poem"]} active={step} />
        )}
      </div>

      {!isAuthed && step === 1 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Step 1: Enter Your Name</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input placeholder="Your name"
                error={errors.userName?.message}
                {...register("userName")}
              />
              {fitStats && (
                <div className="text-xs text-muted">
                  <div className="font-medium mb-1">Templates by friends count:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                    {fitStats.map((s) => (
                      <div key={s.friends} className="border rounded px-2 py-1 bg-muted/10">
                        <span className="text-muted">{s.friends} friends:</span> <span className="font-semibold">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-right">
                <Button disabled={!!errors.userName || !watch("userName")?.trim()} onClick={() => setStep(2)}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Step 2: Enter Friend(s) Names</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {friendsCount === 0 ? (
                <p className="text-xs text-muted">
                  Tip: Add your friends’ names—each one will appear in the poem. If you don’t add any, default friend placeholders will be used.
                </p>
              ) : (
                <p className="text-xs text-muted">
                  Great! {friendsCount} friend{friendsCount === 1 ? "" : "s"} added. They’ll be woven into your poem.
                </p>
              )}
              {fields.map((field, idx) => (
                <div key={field.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Input placeholder={`Friend #${idx + 1}`}
                    error={errors.friendNames?.[idx]?.message}
                    {...register(`friendNames.${idx}` as const)}
                  />
                  {fields.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => remove(idx)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <Button variant="ghost" size="sm" onClick={() => append("") }>
                  + Add friend
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    disabled={!!errors.friendNames || (fitCount !== null && fitCount === 0)}
                    onClick={onGenerate}
                    loading={isSubmitting}
                  >
                    {fitCount !== null ? `Generate (${fitCount} fits)` : "Generate Poem"}
                  </Button>
                </div>
              </div>
              {fitStats && (
                <div className="text-xs text-muted">
                  <div className="font-medium mb-1">Templates by friends count:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                    {fitStats.map((s) => (
                      <div key={s.friends} className="border rounded px-2 py-1 bg-muted/10">
                        <span className="text-muted">{s.friends} friends:</span> <span className="font-semibold">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.friendNames && typeof errors.friendNames?.message === "string" && (
                <p className="text-red-600 text-sm">{errors.friendNames.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Your Poem</h2>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap leading-7">{result}</pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={onGenerate} loading={isSubmitting}>
                Regenerate
              </Button>
              {result && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(result || "");
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const text = encodeURIComponent(result || "");
                      const url = `https://wa.me/?text=${text}`;
                      window.open(url, "_blank");
                    }}
                  >
                    Share WhatsApp
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


