import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Romantic Website",
  description: "A romantic website for your special someone",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-romantic-gradient text-gray-900 antialiased font-english">
        {children}
      </body>
    </html>
  );
}

