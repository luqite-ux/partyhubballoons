import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "../../components/layout/site-header";

describe("site navigation", () => {
  it("keeps public links locale-aware", () => {
    render(<SiteHeader locale="en" />);
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/en/products");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/en/about");
  });

  it("opens and closes the mobile menu with accessible controls", async () => {
    const user = userEvent.setup();
    render(<SiteHeader locale="en" />);
    const button = screen.getByRole("button", { name: /open menu/i });
    await user.click(button);
    expect(screen.getByRole("dialog", { name: /mobile navigation/i })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /mobile navigation/i })).not.toBeInTheDocument();
  });
});
