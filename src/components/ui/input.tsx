import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const fieldClasses = [
  "w-full rounded-lg border border-line-strong bg-ink-2 px-4 py-3 text-base text-text placeholder:text-muted/70",
  "transition-colors duration-200 hover:border-text/30 focus:border-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40",
  "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/40",
];

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClasses, "min-h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClasses, "min-h-40 resize-y", className)} {...props} />;
}
