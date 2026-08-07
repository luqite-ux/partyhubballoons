import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "../../components/motion/reveal";

describe("viewport reveal", () => {
  it("renders content before client observation and exposes the reveal hook", () => {
    render(<Reveal as="section"><h2>Visible content</h2></Reveal>);
    expect(screen.getByRole("heading", { name: "Visible content" })).toBeVisible();
    expect(screen.getByRole("heading").closest("section")).toHaveAttribute("data-reveal");
  });
});
