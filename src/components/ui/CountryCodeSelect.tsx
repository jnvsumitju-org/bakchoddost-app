"use client";
import React from "react";

type Country = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dial: string; // e.g. +91
  flag: string; // emoji flag
};

// Minimal curated list for performance; extendable.
// If you want the full list, we can swap to a data file.
const COUNTRIES: Country[] = [
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
];

export type CountryCodeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  value?: string; // dial code like +91
};

export default function CountryCodeSelect({ value, className = "", ...props }: CountryCodeSelectProps) {
  return (
    <select
      className={`border rounded-md px-3 py-2 bg-background text-foreground border-border ${className}`}
      value={value}
      {...props}
    >
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.dial}>{`${c.flag} ${c.name} (${c.dial})`}</option>
      ))}
    </select>
  );
}


