import { createOgImage, ogAlt, ogContentType, ogSize } from "@/lib/og-image";

export const alt = ogAlt("en");
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return createOgImage("en");
}
