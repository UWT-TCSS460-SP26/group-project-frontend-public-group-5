"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (!session) {
    return <button onClick={() => signIn("tcss460")}>Sign In</button>;
  }

  return (
    <div>
      <span>{session.user?.email}</span>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
