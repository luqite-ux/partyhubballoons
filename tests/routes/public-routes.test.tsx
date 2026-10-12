import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductDetail } from "../../components/products/product-detail";
import { ProductsGrid } from "../../components/products/products-grid";
import { publicPages } from "../../content/pages";
import { products } from "../../content/products";

describe("independent public pages", () => {
  it("defines every confirmed standalone information route", () => {
    expect(Object.keys(publicPages)).toEqual(expect.arrayContaining([
      "custom-solutions", "manufacturing", "quality-compliance", "about", "faq", "contact", "privacy",
    ]));
    expect(Object.values(publicPages).every((page) => page.title && page.description)).toBe(true);
  });

  it("renders all supplied products as independent links", () => {
    render(<ProductsGrid locale="en" products={products} />);
    expect(screen.getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("link", { name: /Agate Star Foil Balloon/i })).toHaveAttribute("href", "/en/products/agate-star-foil-balloon");
  });

  it("renders a product detail with one primary heading and quote context", () => {
    render(<ProductDetail locale="en" product={products[0]} />);
    expect(screen.getByRole("heading", { level: 1, name: products[0].name })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Request a Quote/i })).toHaveAttribute("href", `/en/contact?product=${products[0].slug}`);
  });

  it("renders saved backend detail fields and omits invented sales claims", () => {
    render(<ProductDetail locale="en" product={{
      ...products[0], overview: "<p>Customer supplied detail</p>",
      model: "GJPQ+MNYJ", specs: { Material: "Foil" },
      features: ["Five pieces"], applications: ["Birthday parties"],
      customization: [],
    }} />);
    expect(screen.getByText("Customer supplied detail")).toBeInTheDocument();
    expect(screen.getByText("GJPQ+MNYJ", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Foil")).toBeInTheDocument();
    expect(screen.getByText("Five pieces")).toBeInTheDocument();
    expect(screen.queryByText(/Reference MOQ/)).not.toBeInTheDocument();
  });
});
