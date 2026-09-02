import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { useState } from "react";
import { FloatingLabelInput } from "./FloatingLabelInput";

function Controlled({ label }: { label: string }) {
  const [v, setV] = useState("");
  return <FloatingLabelInput label={label} value={v} onChange={setV} />;
}

test("labels the input and floats on focus", async () => {
  render(<Controlled label="Username" />);
  const input = screen.getByLabelText("Username");
  expect(input.closest("[data-floated]")).toHaveAttribute("data-floated", "false");
  await userEvent.click(input);
  expect(input.closest("[data-floated]")).toHaveAttribute("data-floated", "true");
  await userEvent.type(input, "abc");
  expect(input).toHaveValue("abc");
});

test("shows an error message with alert semantics", () => {
  render(<FloatingLabelInput label="Password" value="" onChange={() => {}} error="Required" />);
  expect(screen.getByRole("alert")).toHaveTextContent("Required");
});
