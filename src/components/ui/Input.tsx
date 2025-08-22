import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string };

export function Input({ label, hint, error, className = "", ...props }: InputProps) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-sm text-muted">{label}</span>}
      <input
        className={`border rounded-md px-3 py-2 w-full outline-none bg-background text-foreground placeholder:text-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${error ? "border-red-500" : "border-border"} ${className}`}
        {...props}
      />
      {hint && !error && <span className="text-xs text-muted">{hint}</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}

export default Input;


