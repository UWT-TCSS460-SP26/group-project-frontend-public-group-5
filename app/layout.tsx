import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Group Project",
};

// Runs synchronously before React hydrates — prevents flash of wrong theme
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', saved || preferred);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
