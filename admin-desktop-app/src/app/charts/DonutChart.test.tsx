import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DonutChart } from "./DonutChart";

test("summarises turnout for assistive tech", () => {
  render(<DonutChart attended={1101} absent={606} />);
  const fig = screen.getByRole("img", { name: /turnout 64%\. attended 1,101, did not attend 606\./i });
  expect(fig).toBeInTheDocument();
});
