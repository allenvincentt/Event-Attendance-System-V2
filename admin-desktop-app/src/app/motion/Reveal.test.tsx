import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MotionPreferenceProvider } from "@/app/theme/MotionPreference";
import { Reveal } from "./Reveal";

test("renders its children", () => {
  render(<MotionPreferenceProvider><Reveal><p>hello</p></Reveal></MotionPreferenceProvider>);
  expect(screen.getByText("hello")).toBeInTheDocument();
});
