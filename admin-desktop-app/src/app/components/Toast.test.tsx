import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { ToastProvider, useToast } from "./Toast";

function Trigger() {
  const { show } = useToast();
  return <button onClick={() => show({ kind: "success", message: "Event created" })}>go</button>;
}

test("shows a toast and lets the user dismiss it", async () => {
  vi.useRealTimers();
  render(<ToastProvider><Trigger /></ToastProvider>);
  await userEvent.click(screen.getByText("go"));
  const toast = await screen.findByText("Event created");
  expect(toast).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
  await waitForElementToBeRemoved(() => screen.queryByText("Event created"));
});

test("auto-dismisses after its timeout", async () => {
  render(<ToastProvider dismissMs={50}><Trigger /></ToastProvider>);
  await userEvent.click(screen.getByText("go"));
  expect(await screen.findByText("Event created")).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.queryByText("Event created"));
});
