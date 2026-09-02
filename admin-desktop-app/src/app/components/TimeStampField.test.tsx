import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { TimeStampField } from "./TimeStampField";

test("computes a readable summary from 24h values", () => {
  render(<TimeStampField label="Morning" start="08:00" end="12:00" onChange={() => {}} />);
  expect(screen.getByText("8:00 AM – 12:00 PM")).toBeInTheDocument();
});

test("shows Not scheduled when disabled", () => {
  render(<TimeStampField label="Evening" start="18:00" end="21:00" onChange={() => {}} disabled />);
  expect(screen.getByText("Not scheduled")).toBeInTheDocument();
});
