"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./Header.module.css";

const btnBase: React.CSSProperties = {
  borderRadius: "var(--radius-full)",
  padding: "var(--sp-3) var(--sp-5)",
  fontFamily: "system-ui, sans-serif",
  fontWeight: 600,
  fontSize: "var(--fs-sm)",
  cursor: "pointer",
  minHeight: 44,
};

export default function AuthButton() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        onClick={() => signIn("tcss460")}
        style={{
          ...btnBase,
          border: "none",
          background: "var(--btn-dark)",
          color: "var(--btn-dark-text)",
        }}
      >
        Sign In
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
      {/* Hidden on mobile via CSS module */}
      <span className={styles.email}>{session.user?.email}</span>
      <button
        onClick={() => signOut()}
        style={{
          ...btnBase,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
