import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { Icon } from "./Icon";

test("decorative icon is hidden from a11y tree", () => {
  const { container } = render(<Icon name="calendar" />);
  const svg = container.querySelector("svg")!;
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg).toHaveAttribute("width", "20");
});

test("titled icon is exposed as an image", () => {
  const { getByRole, getByText } = render(<Icon name="check" title="Done" size={16} />);
  const svg = getByRole("img");
  expect(svg).toHaveAttribute("width", "16");
  expect(getByText("Done")).toBeInTheDocument();
});
