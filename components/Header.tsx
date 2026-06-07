"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/featured", label: "Featured" },
  { href: "/search", label: "Search" },
  { href: "/profile", label: "Profile" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "var(--sp-3) var(--sp-4)",
      }}
    >
      <div className={styles.wrapper}>
        <nav className={styles.nav} aria-label="Main navigation">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.right}>
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
