import "./globals.css";
import { ReactNode } from "react";
import { NavbarWrapper } from "@/components/NavbarWrapper";

export const metadata = {
  title: "Heartful Pages",
  description: "Create beautiful heartful pages for your special someone",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-romantic-gradient text-gray-900 antialiased font-english">
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}

