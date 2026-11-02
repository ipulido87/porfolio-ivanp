import { notFound } from "next/navigation";

// With one root layout per language, unmatched URLs need a route inside each
// layout to reach that language's not-found page.
export default function Missing() {
  notFound();
}
