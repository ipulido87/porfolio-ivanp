"use client";

import { RadioGroup } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ChoiceGroupProps = Omit<ComponentProps<typeof RadioGroup.Root>, "children"> & {
  options: readonly { value: string; label: string }[];
};

/** Radio group styled as chips, so every option is visible and one tap away. */
export function ChoiceGroup({ options, className, ...props }: ChoiceGroupProps) {
  return (
    <RadioGroup.Root className={cn("flex flex-wrap gap-2", className)} {...props}>
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "min-h-11 rounded-lg border border-line-strong bg-ink-2 px-4 py-2 text-left text-[0.9375rem] text-muted transition-colors duration-200",
            "hover:border-text/30 hover:text-text",
            "data-[state=checked]:border-cyan data-[state=checked]:bg-cyan/10 data-[state=checked]:text-text",
          )}
        >
          {option.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
