import { tokens } from "@/app/theme/tokens";

const { dur, ease: e } = tokens.motion;

export const ease = { standard: e.standard, decel: e.decel } as const;

export const fadeInUp = {
  initial: { opacity: 0, y: 44, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.98, ease: e.decel } },
  exit: { opacity: 0, y: 12, transition: { duration: dur.fast } },
};

export const viewSwitch = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: dur.base, ease: e.standard } },
  exit: { opacity: 0, transition: { duration: dur.fast } },
};

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: dur.base } },
  exit: { opacity: 0, transition: { duration: dur.fast } },
};

export const modalPanel = {
  initial: { opacity: 0, scale: 0.94, y: 18 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: dur.base, ease: e.decel } },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: dur.fast } },
};

export const slidePanel = (dir: 1 | -1) => ({
  initial: { opacity: 0, x: dir * 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.21, ease: e.decel } },
  exit: { opacity: 0, x: dir * -30, transition: { duration: 0.13, ease: e.standard } },
});

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 44, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: dur.slow, ease: e.decel } },
};
