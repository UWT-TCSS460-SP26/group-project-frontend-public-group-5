"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Pick up the theme already applied by the inline <head> script
    const current = document.documentElement.getAttribute("data-theme");
    setTheme((current as "light" | "dark") ?? "light");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch { /* storage blocked */ }
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      title={theme === "light" ? "Dark mode" : "Light mode"}
      style={{
        background: "none",
        border: "1px solid var(--border)",
        borderRadius: 9999,
        padding: "7px 11px",
        cursor: "pointer",
        fontSize: 17,
        lineHeight: 1,
        color: "var(--text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
