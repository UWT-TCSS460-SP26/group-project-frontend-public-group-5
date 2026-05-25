"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const btnBase: React.CSSProperties = {
  borderRadius: 9999,
  padding: "12px 20px",
  fontFamily: "system-ui, sans-serif",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
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
          background: "#0f172a",
          color: "#fff",
        }}
      >
        Sign In
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontSize: 14,
          color: "#475569",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {session.user?.email}
      </span>
      <button
        onClick={() => signOut()}
        style={{
          ...btnBase,
          border: "1px solid #e2e8f0",
          background: "#fff",
          color: "#0f172a",
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
