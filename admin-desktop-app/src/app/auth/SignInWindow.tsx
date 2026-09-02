import { motion, useAnimationControls } from "framer-motion";
import { useState } from "react";
import mark from "@/assets/brand/UDLogo.png";
import { Button } from "@/app/components/Button";
import { Checkbox } from "@/app/components/Checkbox";
import { FloatingLabelInput } from "@/app/components/FloatingLabelInput";
import { Icon } from "@/app/components/Icon";
import { useToast } from "@/app/components/Toast";
import { WindowFrame } from "@/app/chrome/WindowFrame";
import { tokens } from "@/app/theme/tokens";
import { closeWindow, openMainWindow } from "@/app/lib/window";

export function SignInWindow() {
  const { show } = useToast();
  const shake = useAnimationControls();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [keep, setKeep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    if (!username.trim() || !password.trim()) {
      setError("Enter your username and password to continue.");
      shake.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: tokens.motion.dur.base } });
      return;
    }
    setError(null);
    setBusy(true);
    await new Promise((r) => setTimeout(r, 250));
    await openMainWindow();
    await closeWindow();
  };

  return (
    <WindowFrame title="Sign in" resizable={false} showMaximize={false}>
      <div style={{ display: "grid", gridTemplateColumns: "42% 58%", height: "100%" }}>
        <div style={{ background: tokens.sidebarGradient, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: tokens.space["2xl"], gap: tokens.space.sm }}>
          <img src={mark} alt="" aria-hidden width={72} height={72} />
          <strong style={{ fontSize: tokens.font.size.h3, letterSpacing: 0.5 }}>THE UNIVERSITY OF DAVAO</strong>
          <span style={{ opacity: 0.85 }}>Event Attendance System</span>
        </div>
        <motion.form
          aria-label="Sign in"
          animate={shake}
          onSubmit={(e) => { e.preventDefault(); void submit(); }}
          style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: tokens.space.md, padding: tokens.space["2xl"] }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: tokens.font.size.h2, color: tokens.color.text.strong }}>Welcome back</h1>
            <p style={{ margin: 0, color: tokens.color.text.muted, fontSize: tokens.font.size.bodySm }}>Sign in to manage events and attendance.</p>
          </div>
          <FloatingLabelInput label="Username" value={username} onChange={setUsername} icon="user" autoFocus />
          <FloatingLabelInput
            label="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={setPassword}
            icon="lock"
            error={error ?? undefined}
            trailing={
              <button type="button" aria-label={showPw ? "Hide password" : "Show password"} onClick={() => setShowPw((s) => !s)} style={{ border: "none", background: "transparent", cursor: "pointer", color: tokens.color.text.muted }}>
                <Icon name="eye" size={16} />
              </button>
            }
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: tokens.space["2xs"], fontSize: tokens.font.size.sm }}>
              <Checkbox label="Keep me signed in" checked={keep} onChange={setKeep} /> Keep me signed in
            </label>
            <button type="button" onClick={() => show({ message: "Contact the Events Office admin to reset your password." })} style={{ border: "none", background: "transparent", cursor: "pointer", color: tokens.color.brand.primary, fontSize: tokens.font.size.sm, fontWeight: tokens.font.weight.semibold }}>
              Forgot password?
            </button>
          </div>
          <Button type="submit" variant="primary" loading={busy}>Log-In</Button>
        </motion.form>
      </div>
    </WindowFrame>
  );
}

export default SignInWindow;
