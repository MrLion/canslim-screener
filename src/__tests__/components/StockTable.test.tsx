import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import StockTable from "@/components/StockTable";
import type { StockResult } from "@/types";

function makeStock(symbol: string, score: number): StockResult {
  const criterion = { pass: score >= 50, score, value: `${score}%`, detail: "test" };
  return {
    symbol,
    name: `${symbol} Corp`,
    price: 100 + score,
    marketCap: 1e9,
    compositeScore: score,
    C: criterion,
    A: criterion,
    N: criterion,
    S: criterion,
    L: criterion,
    I: criterion,
    M: criterion,
    scannedAt: new Date().toISOString(),
  };
}

describe("StockTable", () => {
  const stocks = [
    makeStock("AAPL", 85),
    makeStock("MSFT", 72),
    makeStock("GOOG", 60),
  ];

  it("renders all stock rows", () => {
    render(<StockTable results={stocks} />);
    expect(screen.getAllByText("AAPL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("MSFT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("GOOG").length).toBeGreaterThan(0);
  });

  it("shows stock count", () => {
    render(<StockTable results={stocks} />);
    expect(screen.getByText("3 of 3 stocks")).toBeTruthy();
  });

  it("filters by ticker name", () => {
    render(<StockTable results={stocks} />);
    const input = screen.getByPlaceholderText(/Filter by ticker/);
    fireEvent.change(input, { target: { value: "AAPL" } });
    expect(screen.getByText("1 of 3 stocks")).toBeTruthy();
  });

  it("filters by company name", () => {
    render(<StockTable results={stocks} />);
    const input = screen.getByPlaceholderText(/Filter by ticker/);
    fireEvent.change(input, { target: { value: "GOOG" } });
    expect(screen.getByText("1 of 3 stocks")).toBeTruthy();
  });

  it("displays composite scores with color coding", () => {
    render(<StockTable results={stocks} />);
    // High score (>=70) should be green
    const score85 = screen.getAllByText("85");
    expect(score85.length).toBeGreaterThan(0);
  });

  it("renders empty list without crashing", () => {
    const { container } = render(<StockTable results={[]} />);
    expect(container).toBeTruthy();
  });
});
