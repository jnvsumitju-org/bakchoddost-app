"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: string; type: "success" | "error" | "info"; message: string };
type Ctx = { show: (msg: string, type?: Toast["type"]) => void };

const ToastContext = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-[1000] bottom-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md px-3 py-2 shadow text-sm border ${
              t.type === "success"
                ? "bg-green-600 text-white border-green-700"
                : t.type === "error"
                ? "bg-red-600 text-white border-red-700"
                : "bg-foreground text-background border-foreground/20"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}


