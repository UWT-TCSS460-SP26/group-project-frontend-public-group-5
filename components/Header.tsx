"use client";

import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <AuthButton />
      </div>
    </header>
  );
}
