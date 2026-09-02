import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DepartmentBarChart } from "./DepartmentBarChart";

test("describes the bars for assistive tech", () => {
  render(<DepartmentBarChart width={480} height={280} data={[
    { departmentCode: "BED", enrolled: 742, attended: 467 },
    { departmentCode: "CTE", enrolled: 509, attended: 310 },
  ]} />);
  expect(screen.getByRole("img", { name: /BED: 467 of 742.*CTE: 310 of 509/i })).toBeInTheDocument();
});
