import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RqwSportsPage } from "../../components/rqw-sports/rqw-sports-page";
import { rqwSportsProducts } from "../../content/rqw-sports";

describe("RQW sports catalog page", () => {
  it("renders the complete collection as accessible product cards", () => {
    render(<RqwSportsPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /RQW Sports & Recreation/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("rqw-sports-grid")).toBeInTheDocument();
    expect(screen.getAllByTestId("rqw-sports-card")).toHaveLength(53);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(53);
    expect(images.every((image) => image.getAttribute("loading") === "eager")).toBe(true);
    expect(screen.getByText(rqwSportsProducts[0].name)).toBeInTheDocument();
    expect(
      screen.getByText(rqwSportsProducts[rqwSportsProducts.length - 1].name),
    ).toBeInTheDocument();
  });

  it("uses descriptive alternative text for each supplied product", () => {
    render(<RqwSportsPage />);

    for (const product of rqwSportsProducts) {
      expect(screen.getByAltText(`${product.name} branded RQW product`)).toBeInTheDocument();
    }
  });
});
