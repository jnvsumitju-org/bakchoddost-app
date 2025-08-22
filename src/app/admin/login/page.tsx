"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { authSchema, type AuthForm } from "../../../lib/validation";

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  // If already logged in, redirect to dashboard
  useEffect(() => {
    let mounted = true;
    api.me().then(() => {
      if (mounted) router.replace("/admin/dashboard");
    }).catch(() => {});
    return () => { mounted = false; };
  }, [router]);

  const submit = handleSubmit(async (values) => {
    setMessage(null);
    try {
      await api.login(values);
      router.push("/admin/dashboard");
    } catch (e: any) {
      setMessage(e.message || "Failed");
    }
  });

  return (
    <div className="grid place-items-center w-full min-w-2xl h-screen">
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-xl font-semibold">Admin Login</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <Input placeholder="Email" type="email" error={errors.email?.message} {...register("email")} />
            <Input placeholder="Password" type="password" error={errors.password?.message} {...register("password")} />
            <Button disabled={!!errors.email || !!errors.password} loading={isSubmitting} type="submit">
              Login
            </Button>
            {message && <p className="text-sm text-red-600">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


