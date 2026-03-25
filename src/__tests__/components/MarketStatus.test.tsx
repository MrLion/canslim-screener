import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MarketStatus from "@/components/MarketStatus";
import type { MarketDirection } from "@/types";

describe("MarketStatus", () => {
  const base: MarketDirection = {
    trend: "uptrend",
    sp500Price: 5500,
    ma200: 5200,
    ma50: 5400,
  };

  it("renders nothing when market is null", () => {
    const { container } = render(<MarketStatus market={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("displays uptrend correctly", () => {
    render(<MarketStatus market={base} />);
    expect(screen.getByText(/CONFIRMED UPTREND/)).toBeTruthy();
    expect(screen.getByText("▲")).toBeTruthy();
  });

  it("displays downtrend correctly", () => {
    render(<MarketStatus market={{ ...base, trend: "downtrend" }} />);
    expect(screen.getByText(/CONFIRMED DOWNTREND/)).toBeTruthy();
    expect(screen.getByText("▼")).toBeTruthy();
  });

  it("displays neutral correctly", () => {
    render(<MarketStatus market={{ ...base, trend: "neutral" }} />);
    expect(screen.getByText(/UPTREND UNDER PRESSURE/)).toBeTruthy();
    expect(screen.getByText("►")).toBeTruthy();
  });

  it("shows S&P 500 price", () => {
    render(<MarketStatus market={base} />);
    expect(screen.getByText(/5,500/)).toBeTruthy();
  });
});
