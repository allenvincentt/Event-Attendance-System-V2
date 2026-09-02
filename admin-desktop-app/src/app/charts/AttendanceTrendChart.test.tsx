import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { AttendanceTrendChart } from "./AttendanceTrendChart";

test("describes the trend points", () => {
  render(<AttendanceTrendChart width={480} height={240} points={[
    { label: "Jul 18", rate: 0.62 },
    { label: "Jul 24", rate: 0.48 },
    { label: "Jul 30", rate: 0.73 },
  ]} />);
  expect(screen.getByRole("img", { name: /Jul 18 62%.*Jul 24 48%.*Jul 30 73%/i })).toBeInTheDocument();
});
