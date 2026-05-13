import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Guna Visuals | Complete Media Solutions for Modern Businesses",
  description: "Guna Visuals offers top-tier digital marketing services including commercial ads, content writing, cinematography, poster designing, video editing, and AI videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#050505] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
