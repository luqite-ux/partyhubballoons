import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NewsList } from "../../components/news/news-list";

describe("news list", () => {
  it("shows a formal empty state without demo articles", () => {
    render(<NewsList locale="en" articles={[]} />);
    expect(screen.getByText(/Insights are being prepared/i)).toBeInTheDocument();
  });

  it("links published articles to independent detail routes", () => {
    render(<NewsList locale="en" articles={[{slug:"balloon-design",title:"Balloon Design",excerpt:"Ideas",content:"Body"}]} />);
    expect(screen.getByRole("link", { name: /Balloon Design/i })).toHaveAttribute("href", "/en/news/balloon-design");
  });
});
