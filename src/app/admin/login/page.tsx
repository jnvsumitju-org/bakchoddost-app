"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import CountryCodeSelect from "../../../components/ui/CountryCodeSelect";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { z } from "zod";
import { useToast } from "../../../components/ui/Toast";

const phoneSchema = z.object({
  code: z.string().regex(/^\+\d{1,4}$/i, "Invalid code"),
  phone: z.string().regex(/^[0-9]{6,15}$/i, "Enter digits only (6-15)"),
});
const otpSchema = z.object({ code: z.string().min(4) });

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const { show } = useToast();
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const { register: regPhone, handleSubmit: submitPhone, formState: { errors: phoneErrors, isSubmitting: starting } } = useForm<{ code: string; phone: string}>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { code: "+91", phone: "" },
    mode: "onBlur",
  });
  const { register: regOtp, handleSubmit: submitOtp, formState: { errors: otpErrors, isSubmitting: confirming } } = useForm<{ code: string}>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });
  const [phone, setPhone] = useState("");

  // If already logged in, redirect to dashboard
  useEffect(() => {
    let mounted = true;
    api.me().then(() => {
      if (mounted) router.replace("/admin/dashboard");
    }).catch(() => {});
    return () => { mounted = false; };
  }, [router]);

  const start = submitPhone(async (values) => {
    setMessage(null);
    try {
      const full = `${values.code}${values.phone}`;
      await api.otpStart({ phone: full });
      setPhone(full);
      setStep("otp");
      show("OTP sent", "success");
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Failed to start";
      setMessage(msg);
      show(msg, "error");
    }
  });
  const confirm = submitOtp(async (values) => {
    setMessage(null);
    try {
      await api.otpConfirm({ phone, code: values.code });
      show("Logged in", "success");
      router.push("/admin/dashboard");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to confirm";
      setMessage(msg);
      show(msg, "error");
    }
  });

  return (
    <div className="grid place-items-center w-full min-h-[70vh] px-4 py-8">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Login</h1>
            <a href="/admin/register" className="text-sm hover:underline">Need an account? Register</a>
          </div>
        </CardHeader>
        <CardContent>
          {step === "phone" && (
            <form onSubmit={start} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <CountryCodeSelect {...regPhone("code")} defaultValue={"+91"} />
                <Input className="flex-1" placeholder="Phone (digits only)" type="tel" error={phoneErrors.phone?.message || phoneErrors.code?.message} {...regPhone("phone")} />
              </div>
              <Button loading={starting} type="submit">Send OTP</Button>
              {message && <p className="text-sm text-red-600">{message}</p>}
            </form>
          )}
          {step === "otp" && (
            <form onSubmit={confirm} className="space-y-3">
              <Input placeholder="Enter OTP" type="tel" error={otpErrors.code?.message} {...regOtp("code")} />
              <div className="flex items-center gap-2">
                <Button variant="ghost" type="button" onClick={() => setStep("phone")}>Back</Button>
                <Button loading={confirming} type="submit">Verify & Login</Button>
              </div>
              {message && <p className="text-sm text-red-600">{message}</p>}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


