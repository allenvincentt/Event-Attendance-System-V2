import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MotionPreferenceProvider } from "@/app/theme/MotionPreference";
import { WindowFrame } from "./WindowFrame";

const wrap = (ui: React.ReactNode) => <MotionPreferenceProvider>{ui}</MotionPreferenceProvider>;

test("renders the title bar and children", () => {
  render(wrap(<WindowFrame title="Sign in"><p>body</p></WindowFrame>));
  expect(screen.getByText("Sign in")).toBeInTheDocument();
  expect(screen.getByText("body")).toBeInTheDocument();
});

test("mounts 8 resize handles when resizable and none when not", () => {
  const { rerender, container } = render(wrap(<WindowFrame title="A" resizable><p>x</p></WindowFrame>));
  expect(container.querySelectorAll("[data-resize-dir]")).toHaveLength(8);
  rerender(wrap(<WindowFrame title="A" resizable={false}><p>x</p></WindowFrame>));
  expect(container.querySelectorAll("[data-resize-dir]")).toHaveLength(0);
});
