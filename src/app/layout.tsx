import type { Metadata, Viewport } from "next";
import { Grenze_Gotisch, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Variable font (wght 100–900), so no `weight` — the nameplate dials it in CSS.
const grenzeGotisch = Grenze_Gotisch({
  subsets: ["latin"],
  variable: "--font-grenze",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STDOUT — Mihir Jataniya",
  description:
    "A personal engineering newspaper. Backend, real-time systems and infrastructure work by Mihir Jataniya.",
  authors: [{ name: "Mihir Jataniya" }],
  openGraph: {
    title: "STDOUT — Mihir Jataniya",
    description: "A personal engineering newspaper. Published irregularly from Ahmedabad.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f2e9",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plexMono.variable} ${grenzeGotisch.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
