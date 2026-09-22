import { useState, type FormEvent } from "react";
import emblem from "../../assets/brand/UDLogo.png";
import { WindowFrame, useWindowChrome } from "../../components/window/WindowFrame";
import { WindowControls } from "../../components/window/WindowControls";
import { FloatingLabelInput, Checkbox } from "../../components/ui/Field";
import { GeneralButton } from "../../components/ui/GeneralButton";
import { IconButton } from "../../components/ui/IconButton";
import { registerStyle } from "../../lib/registerStyle";

registerStyle(
  "signin",
  `
.ud-signin {
  display: grid;
  grid-template-columns: 300px 1fr;
  flex: 1;
  min-height: 0;
  background: var(--surface);
}

.ud-signin__aside {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-7) var(--space-5);
  background: var(--grad-rail);
  color: #fff;
  overflow: hidden;
}

.ud-signin__aside::before,
.ud-signin__aside::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  pointer-events: none;
}

.ud-signin__aside::before {
  width: 320px;
  height: 320px;
  top: -150px;
  right: -140px;
}

.ud-signin__aside::after {
  width: 240px;
  height: 240px;
  bottom: -120px;
  left: -110px;
  background: rgba(245, 207, 40, 0.09);
}

.ud-signin__emblem {
  position: relative;
  width: 128px;
  height: 128px;
  object-fit: contain;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.28));
}

.ud-signin__brand {
  position: relative;
  text-align: center;
}

.ud-signin__brand-name {
  font-size: var(--fs-14);
  font-weight: var(--fw-bold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  line-height: 1.4;
}

.ud-signin__brand-sub {
  margin-top: var(--space-2);
  font-size: var(--fs-12);
  color: rgba(255, 255, 255, 0.78);
}

.ud-signin__main {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ud-signin__bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 34px;
  flex: none;
}

.ud-signin__form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-5);
  padding: 0 var(--space-8) var(--space-8);
  min-height: 0;
}

.ud-signin__heading h1 {
  font-size: var(--fs-24);
  font-weight: var(--fw-bold);
  color: var(--text);
  letter-spacing: -0.02em;
}

.ud-signin__heading p {
  margin-top: var(--space-2);
  font-size: var(--fs-13);
  color: var(--text-muted);
}

.ud-signin__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ud-signin__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.ud-signin__link {
  font-size: var(--fs-12);
  font-weight: var(--fw-semibold);
  color: var(--brand);
  background: none;
  transition: color var(--dur-fast) var(--ease-standard);
}

.ud-signin__link:hover {
  color: var(--brand-press);
  text-decoration: underline;
}

.ud-signin__link:focus-visible {
  box-shadow: var(--focus-ring);
  border-radius: var(--r-xs);
}
`,
);

export interface SignInWindowProps {
  onSignedIn: () => void;
}

function SignInChrome() {
  const { minimize, close } = useWindowChrome();
  return (
    <div className="ud-signin__bar" data-tauri-drag-region>
      <WindowControls
        maximized={false}
        showMaximize={false}
        onMinimize={minimize}
        onToggleMaximize={() => {}}
        onClose={close}
      />
    </div>
  );
}

function SignInForm({ onSignedIn }: SignInWindowProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter both your username and password.");
      return;
    }
    setError(null);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onSignedIn();
    }, 620);
  };

  return (
    <form className="ud-signin__form" onSubmit={submit} noValidate>
      <div className="ud-signin__heading">
        <h1>Welcome back</h1>
        <p>Sign in to manage events and attendance.</p>
      </div>

      <div className="ud-signin__fields">
        <FloatingLabelInput
          label="Username"
          icon="user"
          autoComplete="username"
          value={username}
          error={error ?? undefined}
          onChange={(event) => setUsername(event.target.value)}
        />

        <FloatingLabelInput
          label="Password"
          icon="lock"
          type={revealed ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          trailing={
            <IconButton
              icon={revealed ? "eye-off" : "eye"}
              label={revealed ? "Hide password" : "Show password"}
              size="sm"
              onClick={() => setRevealed((value) => !value)}
            />
          }
        />
      </div>

      <div className="ud-signin__row">
        <Checkbox
          checked={remember}
          onChange={setRemember}
          label="Keep me signed in"
        />
        <button type="button" className="ud-signin__link">
          Forgot password?
        </button>
      </div>

      <GeneralButton type="submit" size="lg" block loading={busy}>
        Log-In
      </GeneralButton>
    </form>
  );
}

export function SignInWindow({ onSignedIn }: SignInWindowProps) {
  return (
    <WindowFrame resizable={false}>
      <div className="ud-signin">
        <aside className="ud-signin__aside" data-tauri-drag-region>
          <img className="ud-signin__emblem" src={emblem} alt="" draggable={false} />
          <div className="ud-signin__brand">
            <p className="ud-signin__brand-name">The University of Davao</p>
            <p className="ud-signin__brand-sub">Event Attendance System</p>
          </div>
        </aside>

        <div className="ud-signin__main">
          <SignInChrome />
          <SignInForm onSignedIn={onSignedIn} />
        </div>
      </div>
    </WindowFrame>
  );
}

export default SignInWindow;
