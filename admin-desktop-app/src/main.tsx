import React from "react";
import ReactDOM from "react-dom/client";
import { MotionPreferenceProvider } from "@/app/theme/MotionPreference";
import { MockDataProvider } from "@/data/MockDataProvider";
import { ToastProvider } from "@/app/components/Toast";
import { parseWindowContext } from "@/app/lib/window";
import { SignInWindow } from "@/app/auth/SignInWindow";
import { AppShellWindow } from "@/app/AppShellWindow";
import { EventAttendeesWindow } from "@/app/views/EventAttendeesWindow";

const ctx = parseWindowContext();
const Root =
  ctx.kind === "signin" ? <SignInWindow />
  : ctx.kind === "attendees" ? <EventAttendeesWindow eventId={ctx.eventId!} deptCode={ctx.deptCode!} session={ctx.session!} />
  : <AppShellWindow />;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MotionPreferenceProvider>
      <MockDataProvider>
        <ToastProvider>{Root}</ToastProvider>
      </MockDataProvider>
    </MotionPreferenceProvider>
  </React.StrictMode>,
);
