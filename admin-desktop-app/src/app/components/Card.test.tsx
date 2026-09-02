import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Card } from "./Card";
test("renders children", () => {
  render(<Card><p>content</p></Card>);
  expect(screen.getByText("content")).toBeInTheDocument();
});
