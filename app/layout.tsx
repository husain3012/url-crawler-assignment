import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL Crawler 🕷️",
  description: "Simple URL crawler to check for broken links on a webpage",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="navbar bg-base-300">
          <Link href={'/'} className="btn btn-ghost text-xl">URL Webcrawler 🕷️</Link>
        </div>
        <div className="h-screen flex flex-col px-4 py-4 bg-base-100">{children}</div>
      </body>
    </html>
  );
}
