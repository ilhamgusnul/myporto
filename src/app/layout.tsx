import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { createClient } from "@supabase/supabase-js";

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

async function getLogoUrl(): Promise<string | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) return null;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data } = await supabase
      .from("About")
      .select("logoUrl")
      .limit(1)
      .single();

    return data?.logoUrl ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const logoUrl = await getLogoUrl();

  return {
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
    icons: logoUrl
      ? {
          icon: logoUrl,
          shortcut: logoUrl,
          apple: logoUrl,
        }
      : undefined,
    openGraph: {
      title: "Ilham Gusnul Romadhon | Fullstack Developer & UI/UX Designer",
      description: "Code by Logic, Design with Passion.",
      type: "website",
      ...(logoUrl ? { images: [{ url: logoUrl }] } : {}),
    },
  };
}

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
