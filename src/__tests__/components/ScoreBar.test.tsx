import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreBar from "@/components/ScoreBar";

describe("ScoreBar", () => {
  it("renders score text", () => {
    render(<ScoreBar score={75} pass={true} />);
    expect(screen.getByText("75")).toBeTruthy();
  });

  it("uses green color when passing with high score", () => {
    const { container } = render(<ScoreBar score={85} pass={true} />);
    const bar = container.querySelector(".bg-green-500");
    expect(bar).toBeTruthy();
  });

  it("uses yellow color when not passing with medium score", () => {
    const { container } = render(<ScoreBar score={50} pass={false} />);
    const bar = container.querySelector(".bg-yellow-500");
    expect(bar).toBeTruthy();
  });

  it("uses red color when not passing with low score", () => {
    const { container } = render(<ScoreBar score={20} pass={false} />);
    const bar = container.querySelector(".bg-red-500");
    expect(bar).toBeTruthy();
  });

  it("caps width at 100%", () => {
    const { container } = render(<ScoreBar score={150} pass={true} />);
    const bar = container.querySelector("[style]");
    expect(bar?.getAttribute("style")).toContain("width: 100%");
  });

  it("renders 0 score", () => {
    render(<ScoreBar score={0} pass={false} />);
    expect(screen.getByText("0")).toBeTruthy();
  });
});
