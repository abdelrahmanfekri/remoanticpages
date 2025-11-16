import "./globals.css";

export const metadata = {
  title: "Happy Birthday, My Love",
  description: "A small website gift, made with love."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-romantic-gradient text-gray-900 antialiased font-english">
        {children}
      </body>
    </html>
  );
}


