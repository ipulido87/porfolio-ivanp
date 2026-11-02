// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typewriter, typingDuration } from "@/components/motion/typewriter";

const TEXT = "¿En qué punto estás?";

describe("Typewriter", () => {
  it("exposes the complete text to assistive technology from the first frame", () => {
    render(
      <h2>
        <Typewriter text={TEXT} delay={10_000} />
      </h2>,
    );

    expect(screen.getByRole("heading", { name: TEXT })).toBeInTheDocument();
  });

  it("hides the growing copy from assistive technology", () => {
    render(<Typewriter text={TEXT} delay={10_000} />);

    expect(screen.getByTestId("typewriter-output")).toHaveAttribute("aria-hidden", "true");
  });

  it("ends as plain text, with the animation layer removed", async () => {
    render(<Typewriter text="Hola" />);

    await waitFor(() => expect(screen.queryByTestId("typewriter-output")).not.toBeInTheDocument());
    expect(screen.getByText("Hola")).toBeInTheDocument();
  });

  it("shows the text at once when told not to animate", () => {
    render(<Typewriter text={TEXT} instant />);

    expect(screen.queryByTestId("typewriter-output")).not.toBeInTheDocument();
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });

  it("gives longer text a longer duration, to chain pieces", () => {
    expect(typingDuration("una frase bastante más larga")).toBeGreaterThan(typingDuration("corta"));
  });
});
