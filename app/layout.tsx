import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Group Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
