import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K-Learn Hub",
  description: "Korean class scheduling and student registration, organized in one place.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
