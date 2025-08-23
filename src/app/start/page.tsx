"use client";
import { useState } from "react";
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
  const [result, setResult] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
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

  const onGenerate = handleSubmit(async (values) => {
    const friends = values.friendNames.filter((n) => n.trim().length > 0);
    const data = await api.generatePoem({ userName: values.userName, friendNames: friends });
    setResult(data.text);
    setStep(3);
  });

  return (
    <div className="space-y-6">
      <Stepper steps={["Your Name", "Friends", "Poem"]} active={step} />

      {step === 1 && (
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
              {fields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-2">
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
              <div className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => append("") }>
                  + Add friend
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button disabled={!!errors.friendNames} onClick={onGenerate} loading={isSubmitting}>
                    Generate Poem
                  </Button>
                </div>
              </div>
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
            <div className="mt-4 flex gap-2">
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


