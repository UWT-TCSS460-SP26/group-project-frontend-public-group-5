"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/profile", label: "Profile" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "12px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: active ? "#0f172a" : "#475569",
                  fontWeight: active ? 700 : 500,
                  padding: "10px 14px",
                  borderRadius: 9999,
                  background: active ? "#eef2ff" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ display: "flex", alignItems: "center" }}>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
