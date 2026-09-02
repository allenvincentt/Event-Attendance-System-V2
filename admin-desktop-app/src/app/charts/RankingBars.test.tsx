import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { RankingBars } from "./RankingBars";

test("renders each department row with rate and counts", () => {
  render(<RankingBars rows={[
    { departmentCode: "CAFAE", rate: 0.711, attended: 324, invited: 456 },
    { departmentCode: "BED", rate: 0.629, attended: 467, invited: 742 },
  ]} />);
  expect(screen.getByText("71%")).toBeInTheDocument();
  expect(screen.getByText("324 of 456")).toBeInTheDocument();
  expect(screen.getByText("College of Architecture and Fine Arts Education")).toBeInTheDocument();
});
