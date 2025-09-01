"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../lib/api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import CountryCodeSelect from "../../../components/ui/CountryCodeSelect";
import { z } from "zod";
import { useToast } from "../../../components/ui/Toast";

const phoneSchema = z.object({
  code: z.string().regex(/^\+\d{1,4}$/i, "Invalid code"),
  phone: z.string().regex(/^[0-9]{6,15}$/i, "Enter digits only (6-15)"),
});
const profileSchema = z.object({ name: z.string().min(1), username: z.string().min(3) });

export default function RegisterPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const { register: regPhone, handleSubmit: submitPhone, formState: { errors: phoneErrors, isSubmitting: starting } } = useForm<{ code: string; phone: string }>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { code: "+91", phone: "" },
    mode: "onBlur",
  });
  const { register: regOtp, handleSubmit: submitOtp, formState: { errors: otpErrors, isSubmitting: confirming } } = useForm<{ code: string }>({
    resolver: zodResolver(z.object({ code: z.string().min(4) })),
    defaultValues: { code: "" },
    mode: "onBlur",
  });
  const { register: regProfile, handleSubmit: submitProfile, watch, formState: { errors: profileErrors, isSubmitting: profiling } } = useForm<{ name: string; username: string }>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", username: "" },
    mode: "onChange",
  });
  const username = watch("username");
  const [available, setAvailable] = useState<boolean | null>(null);
  const { show } = useToast();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    let mounted = true;
    api.me().then(() => {
      if (mounted) window.location.assign("/admin/dashboard");
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (username && username.length >= 3) {
        try {
          const res = await api.usernameAvailable(username);
          setAvailable(res.available);
        } catch {
          setAvailable(null);
        }
      } else {
        setAvailable(null);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [username]);

  const start = submitPhone(async (values) => {
    setMessage(null);
    try {
      const full = `${values.code}${values.phone}`;
      await api.otpStart({ phone: full });
      setPhone(full);
      setStep("otp");
      show("OTP sent", "success");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to start";
      setMessage(msg);
      show(msg, "error");
    }
  });

  const confirm = submitOtp(async (values) => {
    setMessage(null);
    try {
      await api.otpConfirm({ phone, code: values.code });
      setStep("profile");
      show("Phone verified", "success");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to confirm";
      setMessage(msg);
      show(msg, "error");
    }
  });

  const saveProfile = submitProfile(async (values) => {
    setMessage(null);
    try {
      await api.registerProfile(values);
      setMessage("Registered!");
      show("Profile saved", "success");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      setMessage(msg);
      show(msg, "error");
    }
  });

  return (
    <div className="grid place-items-center px-4 py-8">
      <Card className="w-full max-w-md md:max-w-lg">
        <CardHeader>
          <h1 className="text-xl font-semibold">Admin Register</h1>
        </CardHeader>
        <CardContent>
          {step === "phone" && (
            <form onSubmit={start} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <CountryCodeSelect {...regPhone("code")} defaultValue={"+91"} />
                <Input className="flex-1" placeholder="Phone (digits only)" type="tel" error={phoneErrors.phone?.message || phoneErrors.code?.message} {...regPhone("phone")} />
              </div>
              <Button loading={starting} type="submit">Send OTP</Button>
            </form>
          )}
          {step === "otp" && (
            <form onSubmit={confirm} className="space-y-3">
              <Input placeholder="Enter OTP" type="tel" error={otpErrors.code?.message} {...regOtp("code")} />
              <div className="flex items-center gap-2">
                <Button variant="ghost" type="button" onClick={() => setStep("phone")}>Back</Button>
                <Button loading={confirming} type="submit">Verify OTP</Button>
              </div>
            </form>
          )}
          {step === "profile" && (
            <form onSubmit={saveProfile} className="space-y-3">
              <Input placeholder="Full name" error={profileErrors.name?.message} {...regProfile("name")} />
              <div>
                <Input placeholder="Username" error={profileErrors.username?.message} {...regProfile("username")} />
                {available === true && <p className="text-xs text-green-600">Username available</p>}
                {available === false && <p className="text-xs text-red-600">Username taken</p>}
              </div>
              <Button loading={profiling} type="submit">Save profile</Button>
            </form>
          )}
          {message && <p className="text-sm text-red-600 mt-2">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}


