import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ilham Gusnul Romadhon | Fullstack Developer & UI/UX Designer",
  description:
    "Personal portfolio of Ilham Gusnul Romadhon. Fullstack Web Developer & UI/UX Designer based in Bandung, Indonesia. Code by Logic, Design with Passion.",
  keywords: [
    "Ilham Gusnul Romadhon",
    "Fullstack Developer",
    "UI/UX Designer",
    "Web Developer Bandung",
    "React Developer",
    "Next.js Developer",
    "Laravel Developer",
  ],
  authors: [{ name: "Ilham Gusnul Romadhon" }],
  openGraph: {
    title: "Ilham Gusnul Romadhon | Fullstack Developer & UI/UX Designer",
    description: "Code by Logic, Design with Passion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
