import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";
import { Stepper } from "./Stepper";

function Harness({ onSubmit }: { onSubmit: () => void }) {
  const [step, setStep] = useState(0);
  return (
    <Stepper
      step={step}
      onStepChange={setStep}
      title="Create event"
      canProceed={[true, false, true]}
      submitLabel="Create event"
      onSubmit={onSubmit}
      onCancel={() => {}}
      steps={[
        { key: "a", label: "Event details", content: <p>step a</p> },
        { key: "b", label: "Departments", content: <p>step b</p> },
        { key: "c", label: "Review", content: <p>step c</p> },
      ]}
    />
  );
}

test("advances only when the step allows it", async () => {
  const onSubmit = vi.fn();
  render(<Harness onSubmit={onSubmit} />);
  expect(screen.getByText("step a")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(await screen.findByText("step b")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
});

test("lets you jump back to a completed step via its track tab", async () => {
  const onSubmit = vi.fn();
  render(<Harness onSubmit={onSubmit} />);
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  await screen.findByText("step b");
  await userEvent.click(screen.getByRole("tab", { name: /Event details/ }));
  expect(await screen.findByText("step a")).toBeInTheDocument();
});

test("reaches the last step, shows the submit label, and calls onSubmit", async () => {
  const onSubmit = vi.fn();
  function AllOpen() {
    const [step, setStep] = useState(0);
    return (
      <Stepper
        step={step}
        onStepChange={setStep}
        title="Create event"
        canProceed={[true, true, true]}
        submitLabel="Create event"
        onSubmit={onSubmit}
        onCancel={() => {}}
        steps={[
          { key: "a", label: "Event details", content: <p>step a</p> },
          { key: "b", label: "Departments", content: <p>step b</p> },
          { key: "c", label: "Review", content: <p>step c</p> },
        ]}
      />
    );
  }
  render(<AllOpen />);
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  await screen.findByText("step b");
  await userEvent.click(screen.getByRole("button", { name: "Next" }));
  await screen.findByText("step c");
  const submit = await screen.findByRole("button", { name: "Create event" });
  await userEvent.click(submit);
  expect(onSubmit).toHaveBeenCalledOnce();
});
