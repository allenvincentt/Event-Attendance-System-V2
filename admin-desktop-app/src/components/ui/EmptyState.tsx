import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { registerStyle, cx } from "../../lib/registerStyle";

registerStyle(
  "empty-state",
  `
.ud-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-8) var(--space-6);
  text-align: center;
}

.ud-empty__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: var(--r-pill);
  background: var(--n-100);
  color: var(--text-faint);
}

.ud-empty__title {
  font-size: var(--fs-14);
  font-weight: var(--fw-semibold);
  color: var(--text-secondary);
}

.ud-empty__body {
  max-width: 42ch;
  font-size: var(--fs-12);
  color: var(--text-muted);
  line-height: var(--lh-normal);
}

.ud-empty__action {
  margin-top: var(--space-2);
}
`,
);

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={cx("ud-empty", className)}>
      <span className="ud-empty__icon">
        <Icon name={icon} size={24} />
      </span>
      <p className="ud-empty__title">{title}</p>
      {description ? <p className="ud-empty__body">{description}</p> : null}
      {action ? <div className="ud-empty__action">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
