import { renderHook } from "@testing-library/react";
import { act } from "react";
import { expect, test } from "vitest";
import { useViewport } from "./useViewport";

test("classifies breakpoints by width", () => {
  window.innerWidth = 1300; window.innerHeight = 800;
  const { result } = renderHook(() => useViewport());
  expect(result.current.bp).toBe("xl");
  act(() => { window.innerWidth = 700; window.dispatchEvent(new Event("resize")); });
  expect(result.current.bp).toBe("sm");
});
