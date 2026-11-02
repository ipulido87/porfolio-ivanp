import { ImageResponse } from "next/og";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getContent } from "@/content";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const headline = (locale: Locale) => getContent(locale).home.hero.headline.map((line) => line.text);

export const ogAlt = (locale: Locale) => `${siteConfig.name}: ${headline(locale).join(" ")}`;

export function createOgImage(locale: Locale) {
  const lines = headline(locale);
  const accent = lines.at(-1);
  const lead = lines.slice(0, -1).join(" ");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#F5F5F7",
        background: "radial-gradient(circle at 92% 110%, #3b2a86 0%, #15122e 38%, #09090F 68%)",
      }}
    >
      <div style={{ fontSize: 32, color: "#22D3EE" }}>{siteConfig.name}</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>
        <div>{lead}</div>
        <div style={{ color: "#B49CFA" }}>{accent}</div>
      </div>
    </div>,
    ogSize,
  );
}
