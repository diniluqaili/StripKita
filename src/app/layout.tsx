import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StripKita — Virtual Photobox",
  description: "Jepret, pilih, hias, download!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#0f0f0f] text-white">
        <main className="max-w-md mx-auto min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
