import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out-expo",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // Off-white fill: white text on #8B5CF6 would fall under AA contrast.
        primary:
          "bg-text text-ink shadow-[0_0_0_1px_rgb(245_245_247/0.2),0_10px_40px_-14px_rgb(139_92_246/0.8)] hover:bg-white hover:shadow-[0_0_0_1px_rgb(255_255_255/0.5),0_14px_50px_-12px_rgb(34_211_238/0.75)]",
        secondary: "border border-line-strong bg-transparent text-text hover:border-text/50 hover:bg-text/5",
        ghost: "text-muted hover:text-text",
      },
      size: {
        md: "px-5 py-2.5 text-[0.9375rem]",
        lg: "px-7 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
