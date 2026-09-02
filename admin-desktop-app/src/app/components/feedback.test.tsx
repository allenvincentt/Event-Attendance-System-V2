import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";
test("EmptyState shows a title and hint", () => {
  render(<EmptyState title="No events yet" hint="Create your first event" />);
  expect(screen.getByText("No events yet")).toBeInTheDocument();
  expect(screen.getByText("Create your first event")).toBeInTheDocument();
});
test("Skeleton is decorative", () => {
  const { container } = render(<Skeleton width={120} height={16} />);
  expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
});
