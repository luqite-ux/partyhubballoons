import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "../../components/home/home-page";

describe("PARTY HUB homepage", () => {
  it("presents the approved hero and both primary actions", () => {
    render(<HomePage locale="en" />);
    expect(screen.getByRole("heading", { level: 1, name: /Premium Balloons/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore Products/i })).toHaveAttribute("href", "/en/products");
    expect(screen.getAllByRole("link", { name: /Request a Quote/i })[0]).toHaveAttribute("href", "/en/contact");
  });

  it("shows all supplied product groups and verified production metrics", () => {
    render(<HomePage locale="en" />);
    expect(screen.getAllByTestId("product-card")).toHaveLength(5);
    expect(screen.getByText("40,000 m²")).toBeInTheDocument();
    expect(screen.getByText("5 million")).toBeInTheDocument();
  });
});
