export default function Stepper({ steps, active }: { steps: string[]; active: number }) {
  return (
    <ol className="flex items-center gap-3 text-sm">
      {steps.map((label, i) => {
        const idx = i + 1;
        const isActive = idx === active;
        const isDone = idx < active;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`h-6 w-6 inline-flex items-center justify-center rounded-full border text-xs ${
                isActive ? "bg-foreground text-background border-foreground" : isDone ? "bg-foreground/90 text-background border-foreground/90" : "bg-background text-foreground border-border"
              }`}
            >
              {idx}
            </span>
            <span className={`${isActive ? "font-semibold" : "text-muted"}`}>{label}</span>
            {i !== steps.length - 1 && <span className="w-8 h-px bg-border mx-2" />}
          </li>
        );
      })}
    </ol>
  );
}


