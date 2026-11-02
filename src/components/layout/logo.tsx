import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Wordmark with a small orbit mark that echoes the hero globe. */
export function Logo({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-2.5 font-display text-lg font-medium tracking-tight"
      aria-label={label}
    >
      <svg viewBox="0 0 32 32" className="size-7" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="url(#logo-mark)" strokeWidth="1.5" />
        <ellipse
          cx="16"
          cy="16"
          rx="6.5"
          ry="14"
          stroke="url(#logo-mark)"
          strokeWidth="1.2"
          className="origin-center transition-transform duration-700 ease-out-expo group-hover:scale-x-[1.6]"
        />
        <path d="M2.6 12h26.8M2.6 20h26.8" stroke="url(#logo-mark)" strokeWidth="1.2" />
        <circle cx="22" cy="9.5" r="2.4" fill="#22d3ee" />
        <defs>
          <linearGradient id="logo-mark" x1="2" y1="4" x2="30" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      {siteConfig.name}
    </Link>
  );
}
