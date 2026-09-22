import { useCallback, useEffect, useState } from "react";
import { GlobalStyles } from "./styles/GlobalStyles";
import { SignInWindow } from "./app/auth/SignInWindow";
import { AppShellWindow } from "./app/AppShellWindow";
import { EventAttendeesWindow } from "./app/views/EventAttendeesWindow";
import { applyWindowProfile, readWindowKind } from "./lib/tauriWindow";

export function App() {
  const kind = readWindowKind();
  const isAttendees = kind === "attendees";
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (isAttendees) return;
    void applyWindowProfile(signedIn ? "shell" : "signin");
  }, [isAttendees, signedIn]);

  const signIn = useCallback(() => setSignedIn(true), []);
  const signOut = useCallback(() => setSignedIn(false), []);

  if (isAttendees) {
    return (
      <>
        <GlobalStyles />
        <EventAttendeesWindow />
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      {signedIn ? (
        <AppShellWindow onSignOut={signOut} />
      ) : (
        <SignInWindow onSignedIn={signIn} />
      )}
    </>
  );
}

export default App;
