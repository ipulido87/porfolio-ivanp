"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

type AccordionItem = { question: string; answer: string };

/**
 * Panels use `forceMount` so answers stay in the server-rendered HTML. The
 * closed state is `visibility: hidden`, which also removes them from the
 * accessibility tree and the tab order.
 */
export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className="border-t border-line">
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.question} value={item.question} className="border-b border-line">
          <AccordionPrimitive.Header asChild>
            <h3 className="tracking-normal">
              <AccordionPrimitive.Trigger className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-display text-lg leading-snug transition-colors hover:text-cyan sm:text-xl">
                {item.question}
                <Plus
                  aria-hidden
                  className="size-5 shrink-0 text-muted transition-transform duration-300 ease-out-expo group-data-[state=open]:rotate-45 group-data-[state=open]:text-cyan"
                />
              </AccordionPrimitive.Trigger>
            </h3>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content forceMount className="accordion-panel">
            <div className="overflow-hidden">
              <p className="max-w-3xl pb-6 text-muted">{item.answer}</p>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
